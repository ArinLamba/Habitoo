import { isClerkAPIResponseError } from "@clerk/expo";
import { useSignIn, useSignUp } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
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
      ? "Create your account"
      : "Welcome back";
  const subtitle = pendingVerification
    ? "Enter the verification code Clerk sent to your email."
    : "Sign in to keep your habits synced and private.";
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
        <View className="gap-8">
          <View className="gap-3">
            <Text className="text-xs font-bold uppercase tracking-normal text-orange-400">
              Habitoo
            </Text>
            <Text className="text-[38px] font-extrabold leading-[44px] text-white">
              {title}
            </Text>
            <Text className="text-base leading-6 text-zinc-400">{subtitle}</Text>
          </View>

          {!pendingVerification ? (
            <View className="flex-row rounded-lg bg-zinc-900 p-1">
              <Pressable
                accessibilityRole="button"
                className={`flex-1 rounded-md px-4 py-3 ${
                  !isSignUp ? "bg-white" : ""
                }`}
                onPress={() => switchMode("sign-in")}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    !isSignUp ? "text-zinc-950" : "text-zinc-400"
                  }`}
                >
                  Sign in
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className={`flex-1 rounded-md px-4 py-3 ${
                  isSignUp ? "bg-white" : ""
                }`}
                onPress={() => switchMode("sign-up")}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    isSignUp ? "text-zinc-950" : "text-zinc-400"
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
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-4 text-base text-white"
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
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-4 text-base text-white"
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
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-4 text-base text-white"
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
                className="h-14 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950"
                disabled={isSubmitting}
                onPress={handleGoogleSignIn}
              >
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
            className="h-14 items-center justify-center rounded-lg bg-orange-400"
            disabled={isSubmitting}
            onPress={handleSubmit}
            >
            {isSubmitting ? (
              <ActivityIndicator color="#18181b" />
            ) : (
              <Text className="text-base font-extrabold text-zinc-950">
                {submitLabel}
              </Text>
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
