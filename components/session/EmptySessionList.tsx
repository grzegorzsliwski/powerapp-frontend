import React from "react";
import { View, Text } from "react-native";

export const EmptySessionList: React.FC = () => {
  return (
    <View className="py-6 items-center">
      <Text className="text-gray-400 text-center mb-2">
        No sessions added yet
      </Text>
    </View>
  );
};
