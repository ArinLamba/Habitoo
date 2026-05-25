import { isClerkAPIResponseError, useSSO } from "@clerk/expo";
import { useSignIn, useSignUp } from "@clerk/expo/legacy";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { APP_ACCENT_COLOR } from "../../../shared/constants";

type AuthMode = "signIn" | "signUp" | "forgotPassword";

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
    <Svg height={20} viewBox="0 0 24 24" width={20}>
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function AuthLandingScreen() {
  const signInHook = useSignIn();
  const signUpHook = useSignUp();
  const { startSSOFlow } = useSSO();

  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetFlow = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    setPassword("");
    setVerificationCode("");
    setPendingVerification(false);
  };

  const completeSession = async (sessionId: string | null) => {
    if (!sessionId) {
      setError("Could not create a session. Please try again.");
      return;
    }

    if (mode === "signUp" || mode === "forgotPassword") {
      await signUpHook.setActive?.({ session: sessionId });
    } else {
      await signInHook.setActive?.({ session: sessionId });
    }
  };

  const submitSignIn = async () => {
    if (!signInHook.isLoaded) return;

    const result = await signInHook.signIn.create({
      identifier: email.trim(),
      password,
      strategy: "password",
    });

    if (result.status === "complete") {
      await completeSession(result.createdSessionId);
      return;
    }

    setError("This account needs another verification step.");
  };

  const submitSignUp = async () => {
    if (!signUpHook.isLoaded) return;

    if (pendingVerification) {
      const result = await signUpHook.signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (result.status === "complete") {
        await signUpHook.setActive({ session: result.createdSessionId });
        return;
      }

      setError("Could not verify that code. Please try again.");
      return;
    }

    await signUpHook.signUp.create({
      emailAddress: email.trim(),
      password,
    });
    await signUpHook.signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });
    setPendingVerification(true);
  };

  const submitForgotPassword = async () => {
    if (!signInHook.isLoaded) return;

    if (pendingVerification) {
      const result = await signInHook.signIn.attemptFirstFactor({
        code: verificationCode.trim(),
        password,
        strategy: "reset_password_email_code",
      });

      if (result.status === "complete") {
        await signInHook.setActive({ session: result.createdSessionId });
        return;
      }

      setError("Could not reset your password. Please try again.");
      return;
    }

    await signInHook.signIn.create({
      identifier: email.trim(),
      strategy: "reset_password_email_code",
    });
    setPendingVerification(true);
  };

  const submitGoogle = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
    } catch (authError) {
      setError(getClerkError(authError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submit = async () => {
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "signIn") {
        await submitSignIn();
      } else if (mode === "signUp") {
        await submitSignUp();
      } else {
        await submitForgotPassword();
      }
    } catch (authError) {
      setError(getClerkError(authError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const needsCode = pendingVerification;
  const needsPassword = mode !== "forgotPassword" || pendingVerification;
  const title =
    mode === "forgotPassword"
      ? pendingVerification
        ? "Reset password"
        : "Forgot password"
      : mode === "signUp"
        ? pendingVerification
          ? "Check your email"
          : "Create account"
        : "Welcome back";
  const subtitle =
    mode === "forgotPassword"
      ? pendingVerification
        ? "Enter the code from your email and choose a new password."
        : "Enter your email and we will send a reset code."
      : mode === "signUp"
        ? pendingVerification
          ? "Enter the verification code sent to your email."
          : "Start tracking habits with your Habitoo account."
        : "Sign in to keep your habits and streaks synced.";
  const submitLabel =
    mode === "forgotPassword"
      ? pendingVerification
        ? "Reset password"
        : "Send reset code"
      : mode === "signUp"
        ? pendingVerification
          ? "Verify email"
          : "Create account"
        : "Sign in";
  const disabled =
    isSubmitting ||
    email.trim().length < 3 ||
    (needsPassword && password.length < 8) ||
    (needsCode && verificationCode.trim().length < 6);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerClassName="flex-grow justify-center px-6 py-8"
        >
          <View className="items-center">
            <Image
              accessibilityIgnoresInvertColors
              className="h-24 w-24"
              resizeMode="contain"
              source={require("../../../../assets/logo.png")}
            />
            <Text className="mt-3 text-4xl font-extrabold text-white">Habitoo</Text>
            <Text className="mt-2 text-center text-base font-semibold leading-6 text-zinc-500">
              Small habits, visible progress.
            </Text>
          </View>

          <View className="mt-9 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
            {mode !== "forgotPassword" && !pendingVerification ? (
              <View className="mb-5 flex-row rounded-2xl bg-zinc-950 p-1">
                {(["signIn", "signUp"] as const).map((item) => {
                  const selected = mode === item;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      className="h-11 flex-1 items-center justify-center rounded-xl"
                      key={item}
                      onPress={() => resetFlow(item)}
                      style={{
                        backgroundColor: selected
                          ? APP_ACCENT_COLOR
                          : "transparent",
                      }}
                    >
                      <Text
                        className={`font-extrabold ${
                          selected ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {item === "signIn" ? "Sign in" : "Sign up"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <Text className="text-2xl font-extrabold text-white">{title}</Text>
            <Text className="mt-2 text-sm font-semibold leading-5 text-zinc-500">
              {subtitle}
            </Text>

            <View className="mt-5 gap-4">
              <View>
                <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                  Email
                </Text>
                <View className="h-14 flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-950 px-4">
                  <Mail color="#71717a" size={18} />
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="ml-3 flex-1 text-base font-bold text-white"
                    editable={!pendingVerification}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#71717a"
                    textContentType="emailAddress"
                    value={email}
                  />
                </View>
              </View>

              {needsCode ? (
                <View>
                  <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                    Verification code
                  </Text>
                  <TextInput
                    className="h-14 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 text-lg font-extrabold tracking-normal text-white"
                    keyboardType="number-pad"
                    onChangeText={setVerificationCode}
                    placeholder="123456"
                    placeholderTextColor="#71717a"
                    textContentType="oneTimeCode"
                    value={verificationCode}
                  />
                </View>
              ) : null}

              {needsPassword ? (
                <View>
                  <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                    {mode === "forgotPassword" ? "New password" : "Password"}
                  </Text>
                  <View className="h-14 flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-950 px-4">
                    <Lock color="#71717a" size={18} />
                    <TextInput
                      className="ml-3 flex-1 text-base font-bold text-white"
                      onChangeText={setPassword}
                      placeholder="At least 8 characters"
                      placeholderTextColor="#71717a"
                      secureTextEntry={!passwordVisible}
                      textContentType={mode === "signUp" ? "newPassword" : "password"}
                      value={password}
                    />
                    <Pressable
                      accessibilityRole="button"
                      hitSlop={8}
                      onPress={() => setPasswordVisible((current) => !current)}
                    >
                      {passwordVisible ? (
                        <EyeOff color="#a1a1aa" size={18} />
                      ) : (
                        <Eye color="#a1a1aa" size={18} />
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>

            {error ? (
              <Text className="mt-5 rounded-2xl bg-red-950/70 px-4 py-3 text-sm font-bold text-red-200">
                {error}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              className="mt-6 h-12 flex-row items-center justify-center gap-2 rounded-2xl"
              disabled={disabled}
              onPress={submit}
              style={{
                backgroundColor: disabled ? "#3f3f46" : APP_ACCENT_COLOR,
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-base font-extrabold text-white">
                    {submitLabel}
                  </Text>
                  <ArrowRight color="#fff" size={18} strokeWidth={3} />
                </>
              )}
            </Pressable>

            {mode !== "forgotPassword" && !pendingVerification ? (
              <>
                <View className="my-5 flex-row items-center gap-3">
                  <View className="h-px flex-1 bg-zinc-800" />
                  <Text className="text-xs font-bold uppercase text-zinc-500">or</Text>
                  <View className="h-px flex-1 bg-zinc-800" />
                </View>

                <Pressable
                  accessibilityRole="button"
                  className="h-12 flex-row items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950"
                  disabled={isSubmitting}
                  onPress={submitGoogle}
                >
                  <GoogleMark />
                  <Text className="text-base font-extrabold text-white">
                    Continue with Google
                  </Text>
                </Pressable>
              </>
            ) : null}

            <View className="mt-5 items-center gap-3">
              {mode === "signIn" && !pendingVerification ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => resetFlow("forgotPassword")}
                >
                  <Text
                    className="text-sm font-extrabold"
                    style={{ color: APP_ACCENT_COLOR }}
                  >
                    Forgot password?
                  </Text>
                </Pressable>
              ) : null}

              {mode === "forgotPassword" || pendingVerification ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => resetFlow("signIn")}
                >
                  <Text className="text-sm font-extrabold text-zinc-400">
                    Back to sign in
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
