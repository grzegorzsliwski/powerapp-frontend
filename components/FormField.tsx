import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

interface FormFieldProps {
  title: string;
  value: string | undefined;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  errorMessage?: string;
  hasError?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder = "",
  handleChangeText,
  otherStyles = "",
  errorMessage,
  hasError = false,
  keyboardType = "default",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base-100 font-pmedium text-white">{title}</Text>
      <View
        className={`border-2 ${
          hasError ? "border-red-500" : "border-black-200"
        } w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className={"w-6 h-6"}
              resizeMode="contain"
              tintColor={hasError ? "#EF4444" : "grey"}
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <Text className="text-red-500 text-sm font-plight">{errorMessage}</Text>
      )}
    </View>
  );
};

export default FormField;
