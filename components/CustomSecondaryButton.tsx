import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomButton {
  title?: string;
  handlePress?: (event: GestureResponderEvent) => void;
  containerStyle?: string;
  textStyles?: string;
  isLoading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

const CustomButton: React.FC<CustomButton> = ({
  title,
  handlePress,
  containerStyle,
  textStyles,
  isLoading,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`border-2 border-black-200 bg-black-100 rounded-xl h-16 justify-center items-center flex-row ${containerStyle} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {icon && (
        <Ionicons name={icon} size={24} color="#FF9C01" className="mr-2" />
      )}
      <Text className={`text-secondary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
