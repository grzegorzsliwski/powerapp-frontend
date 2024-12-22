import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import "../../global.css";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validation";

const SignUp = () => {
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveTokens = async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
  };
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

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://192.168.0.25:3000/users/signup",
        {
          email: form.email.trim(),
          password: form.password.trim(),
          username: form.username.trim(),
        }
      );

      if (response.data.status === "SUCCESS") {
        await saveTokens(response.data.accessToken, response.data.refreshToken);

        console.log("Access Token:", response.data.accessToken);
        console.log("Refresh Token:", response.data.refreshToken);
        router.push("/training");
      } else {
        setErrors((prev) => ({
          ...prev,
          password: response.data.message || "An error occurred.",
        }));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrors((prev) => ({
          ...prev,
          password:
            error.response?.data?.message || "An unexpected error occurred.",
        }));
        console.error("API Error:", error.response);
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "An unexpected error occurred.",
        }));
        console.error("Unexpected Error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            {" "}
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
            title="Sign In"
            handlePress={submit}
            containerStyle="mt-7"
            isLoading={isSubmitting}
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
