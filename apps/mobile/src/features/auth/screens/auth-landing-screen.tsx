import { isClerkAPIResponseError } from "@clerk/expo";
import { useSignIn, useSignUp } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
import { ArrowRight, Check, Flame } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { Screen } from "../../../shared/ui/screen";

type AuthMode = "sign-in" | "sign-up";

function getClerkError(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.errors[0]?.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function GoogleMark() {
  return (
    <Svg height={18} viewBox="0 0 24 24" width={18}>
      <Path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="#ffffff"
      />
    </Svg>
  );
}

function AuthPreview() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141414] px-4 pb-4 pt-5">
      <View className="absolute inset-x-10 top-4 h-28 opacity-80">
        {Array.from({ length: 9 }).map((_, index) => (
          <View
            className="absolute bottom-0 top-0 bg-white"
            key={`v-${index}`}
            style={{ left: `${(index / 8) * 100}%`, opacity: 0.05, width: 1 }}
          />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            className="absolute left-0 right-0 bg-white"
            key={`h-${index}`}
            style={{ height: 1, opacity: 0.05, top: `${(index / 4) * 100}%` }}
          />
        ))}
        <View className="absolute left-[18%] top-[28%] h-7 w-8 bg-emerald-200/10" />
        <View className="absolute left-[38%] top-[50%] h-7 w-8 bg-emerald-400/15" />
        <View className="absolute left-[62%] top-[22%] h-7 w-8 bg-emerald-200/10" />
        <View className="absolute left-[74%] top-[56%] h-7 w-8 bg-emerald-300/10" />
      </View>

      <View className="items-center">
        <View className="h-20 w-20 items-center justify-center">
          <Flame color="#ff7a2b" fill="#ff7a2b" size={72} strokeWidth={1.5} />
          <Text className="absolute translate-y-5 text-3xl font-black text-[#ff7a2b]">
            8
          </Text>
        </View>
        <Text className="mt-1 text-xl font-extrabold text-white">day streak!</Text>
        <Text className="mt-2 max-w-[240px] text-center text-sm font-medium leading-5 text-zinc-500">
          Build the quiet chain. Keep your habits synced everywhere.
        </Text>
      </View>

      <View className="mt-5 flex-row justify-between">
        {days.map((day, index) => {
          const done = index < 5;

          return (
            <View className="items-center" key={day}>
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: done ? "#34d399" : "#27272a" }}
              >
                {done ? <Check color="#111111" size={18} strokeWidth={3.5} /> : null}
              </View>
              <Text className="mt-1 text-[10px] font-semibold text-zinc-500">
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function AuthLandingScreen() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInHook = useSignIn();
  const signUpHook = useSignUp();
  const { startSSOFlow } = useSSO();
  const isSignUp = mode === "sign-up";

  async function handleSignIn() {
    if (!signInHook.isLoaded) {
      return;
    }

    const result = await signInHook.signIn.create({
      identifier: emailAddress.trim(),
      password,
    });

    if (result.status === "complete") {
      await signInHook.setActive({ session: result.createdSessionId });
      return;
    }

    setError("This sign-in needs another verification step.");
  }

  async function handleSignUp() {
    if (!signUpHook.isLoaded) {
      return;
    }

    await signUpHook.signUp.create({
      emailAddress: emailAddress.trim(),
      password,
    });
    await signUpHook.signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });
    setPendingVerification(true);
  }

  async function handleVerification() {
    if (!signUpHook.isLoaded) {
      return;
    }

    const result = await signUpHook.signUp.attemptEmailAddressVerification({
      code: verificationCode.trim(),
    });

    if (result.status === "complete") {
      await signUpHook.setActive({ session: result.createdSessionId });
      return;
    }

    setError("We need a little more information to finish sign up.");
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      if (pendingVerification) {
        await handleVerification();
      } else if (isSignUp) {
        await handleSignUp();
      } else {
        await handleSignIn();
      }
    } catch (submitError) {
      setError(getClerkError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsSubmitting(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
    } catch (submitError) {
      setError(getClerkError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setPendingVerification(false);
    setVerificationCode("");
  }

  const title = pendingVerification
    ? "Check your inbox"
    : isSignUp
      ? "Start your streak"
      : "Welcome back";
  const subtitle = pendingVerification
    ? "Enter the verification code sent to your email."
    : "Track progress, protect streaks, and keep every log in sync.";
  const submitLabel = pendingVerification
    ? "Verify email"
    : isSignUp
      ? "Sign up"
      : "Sign in";

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-between"
      >
        <View className="gap-5">
          <View className="flex-row items-center gap-2">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
              <Flame color="#ff7a2b" fill="#ff7a2b" size={20} />
            </View>
            <Text className="text-lg font-extrabold text-white">Habitoo</Text>
          </View>

          <AuthPreview />

          <View className="gap-2">
            <Text className="text-[34px] font-extrabold leading-[38px] text-white">
              {title}
            </Text>
            <Text className="text-base leading-6 text-zinc-500">{subtitle}</Text>
          </View>

          {!pendingVerification ? (
            <View className="flex-row rounded-2xl border border-zinc-800 bg-[#141414] p-1">
              <Pressable
                accessibilityRole="button"
                className={`flex-1 rounded-xl px-4 py-3 ${
                  !isSignUp ? "bg-emerald-400" : ""
                }`}
                onPress={() => switchMode("sign-in")}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    !isSignUp ? "text-zinc-950" : "text-zinc-500"
                  }`}
                >
                  Sign in
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className={`flex-1 rounded-xl px-4 py-3 ${
                  isSignUp ? "bg-emerald-400" : ""
                }`}
                onPress={() => switchMode("sign-up")}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    isSignUp ? "text-zinc-950" : "text-zinc-500"
                  }`}
                >
                  Sign up
                </Text>
              </Pressable>
            </View>
          ) : null}
          
          <View className="gap-4">
            {!pendingVerification ? (
              <>
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-zinc-300">
                    Email
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    className="rounded-2xl border border-zinc-800 bg-[#141414] px-4 py-4 text-base font-semibold text-white"
                    keyboardType="email-address"
                    onChangeText={setEmailAddress}
                    placeholder="you@example.com"
                    placeholderTextColor="#71717a"
                    textContentType="emailAddress"
                    value={emailAddress}
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-zinc-300">
                    Password
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    className="rounded-2xl border border-zinc-800 bg-[#141414] px-4 py-4 text-base font-semibold text-white"
                    onChangeText={setPassword}
                    placeholder="Your password"
                    placeholderTextColor="#71717a"
                    secureTextEntry
                    textContentType={isSignUp ? "newPassword" : "password"}
                    value={password}
                  />
                </View>
              </>
            ) : (
              <View className="gap-2">
                <Text className="text-sm font-semibold text-zinc-300">
                  Verification code
                </Text>
                <TextInput
                  autoCapitalize="none"
                  className="rounded-2xl border border-zinc-800 bg-[#141414] px-4 py-4 text-base font-semibold text-white"
                  keyboardType="number-pad"
                  onChangeText={setVerificationCode}
                  placeholder="123456"
                  placeholderTextColor="#71717a"
                  textContentType="oneTimeCode"
                  value={verificationCode}
                />
              </View>
            )}

            {error ? (
              <Text className="rounded-lg bg-red-950/70 px-4 py-3 text-sm font-semibold text-red-200">
                {error}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="gap-3 pb-4">
          {!pendingVerification ? (
            <>
              <Pressable
                accessibilityRole="button"
                className="h-14 flex-row items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-[#141414]"
                disabled={isSubmitting}
                onPress={handleGoogleSignIn}
              >
                <GoogleMark />
                <Text className="text-base font-extrabold text-white">
                  Continue with Google
                </Text>
              </Pressable>
              <View className="flex-row items-center gap-3">
                <View className="h-px flex-1 bg-zinc-800" />
                <Text className="text-xs font-bold uppercase tracking-normal text-zinc-500">
                  or
                </Text>
                <View className="h-px flex-1 bg-zinc-800" />
              </View>
            </>
          ) : null}

          <Pressable
            accessibilityRole="button"
            className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-400"
            disabled={isSubmitting}
            onPress={handleSubmit}
            >
            {isSubmitting ? (
              <ActivityIndicator color="#18181b" />
            ) : (
              <>
                <Text className="text-base font-extrabold text-zinc-950">
                  {submitLabel}
                </Text>
                <ArrowRight color="#18181b" size={18} strokeWidth={3} />
              </>
            )}
          </Pressable>

          {pendingVerification ? (
            <Pressable
              accessibilityRole="button"
              className="items-center py-3"
              onPress={() => switchMode("sign-up")}
              >
              <Text className="text-sm font-bold text-zinc-400">
                Use a different email
              </Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
        
    </Screen>
  );
}
