import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import "../../global.css";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import useApi from "../../hooks/useApi";
import { validateEmail } from "../../utils/validation";
import useAuthApi from "@/hooks/useAuthApi";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const saveTokens = async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  };

  const { isLoading, error, callApi } = useAuthApi(
    `${Constants.expoConfig?.extra?.BASE_URL}users/signin`,
    "POST",
    {
      onSuccess: async (data) => {
        await saveTokens(data.accessToken, data.refreshToken);
        router.push("/training");
      },
      onError: (err) => {
        setErrors((prev) => ({
          ...prev,
          password:
            err.response?.data?.message || "An unexpected error occurred.",
        }));
      },
    }
  );

  const handleValidation = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submit = async () => {
    if (!handleValidation()) return;

    try {
      await callApi({
        email: form.email.trim(),
        password: form.password.trim(),
      });
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to PowerApp
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => {
              setForm({ ...form, email: e });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
            hasError={!!errors.email}
            errorMessage={errors.email}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => {
              setForm({ ...form, password: e });
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            otherStyles="mt-7"
            hasError={!!errors.password}
            errorMessage={errors.password}
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyle="mt-7"
            isLoading={isLoading}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-base-100 font-plight text-white">
              Don't have account?
            </Text>
            <Link
              href="/sign-up"
              className="text-base-100 font-plight text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
