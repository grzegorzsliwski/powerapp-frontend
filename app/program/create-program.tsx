import FormField from "@/components/FormField";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateProgram = () => {
  const [form, setForm] = useState({ programName: "", numberOfWeeks: "" });
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="mx-4">
        <FormField
          title="Name Your Program"
          value=""
          handleChangeText={() => {}}
        ></FormField>
      </View>
    </SafeAreaView>
  );
};

export default CreateProgram;
