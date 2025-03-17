import React from "react";
import { View, Text, Animated, Switch } from "react-native";
import FormField from "@/components/FormField";
import { ProgramFormData } from "../../types/programTypes";
import ProgramLengthDropdown from "../program/ProgramLengthDropdown";

interface ProgramFormProps {
  form: ProgramFormData;
  updateForm: (field: keyof ProgramFormData, value: string) => void;
  isMultiWeek: boolean;
  setIsMultiWeek: (value: boolean) => void;
  formAnimation: Animated.AnimatedInterpolation<number>;
  formOpacity: Animated.AnimatedInterpolation<number>;
}

export const ProgramForm: React.FC<ProgramFormProps> = ({
  form,
  updateForm,
  isMultiWeek,
  setIsMultiWeek,
  formAnimation,
  formOpacity,
}) => {
  return (
    <Animated.View
      style={{
        height: formAnimation,
        opacity: formOpacity,
        overflow: "hidden",
        zIndex: 10,
      }}
      className="absolute top-0 left-0 right-0 bg-primary"
    >
      <View className="px-4">
        <FormField
          otherStyles="mb-4"
          title="Name Your Program"
          value={form.programName}
          handleChangeText={(text: string) => updateForm("programName", text)}
        />

        <View className="flex-row items-center">
          <Switch
            value={isMultiWeek}
            onValueChange={(value) => setIsMultiWeek(value)}
            thumbColor={isMultiWeek ? "#CDCDE0" : "#CDCDE0"}
            trackColor={{ false: "#1E1E2D", true: "#FF9C01" }}
          />
          <Text className="font-pmedium text-white ml-2">
            Create multi-week program
          </Text>
        </View>

        {isMultiWeek && (
          <View className="mt-4">
            <ProgramLengthDropdown
              value={form.programLength ? form.programLength.toString() : null}
              setValue={(value) => updateForm("programLength", value)}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};
