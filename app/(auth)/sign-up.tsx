import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import "../../global.css";
import * as SecureStore from "expo-secure-store";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validation";
import Constants from "expo-constants";
import useApi from "../../hooks/useApi";

const SignUp = () => {
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
  });

  const saveTokens = async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
  };

  const { isLoading, callApi } = useApi(
    `${Constants.expoConfig?.extra?.BASE_URL}users/signup`,
    "POST",
    {
      onSuccess: async (data) => {
        await saveTokens(data.accessToken, data.refreshToken);
        router.push("/training");
      },
      onError: (error) => {
        setErrors((prev) => ({
          ...prev,
          password:
            error.response?.data?.message || "An unexpected error occurred.",
        }));
      },
    }
  );

  const handleValidation = () => {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "" };

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
      isValid = false;
    } else if (!validateUsername(form.username.trim())) {
      newErrors.username = "Only alphabetic characters (a-z, A-Z) are allowed.";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!validatePassword(form.password.trim())) {
      newErrors.password =
        "Password must be 8 characters long, contain at least one uppercase letter, lowercase letter, number, and a special character. It also cannot contain spaces.";
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
        username: form.username.trim(),
      });
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up to PowerApp
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: string) => {
              setForm({ ...form, username: e });
              if (errors.username) setErrors({ ...errors, username: "" });
            }}
            otherStyles="mt-7"
            hasError={!!errors.username}
            errorMessage={errors.username}
          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyle="mt-7"
            isLoading={isLoading}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-base-100 font-plight text-white">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-base-100 font-plight text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
