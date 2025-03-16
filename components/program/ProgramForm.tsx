import React from "react";
import { View, Text, Animated } from "react-native";
import Checkbox from "expo-checkbox";
import Slider from "@react-native-community/slider";
import FormField from "@/components/FormField";
import { ProgramFormData } from "../../types/programTypes";

interface ProgramFormProps {
  form: ProgramFormData;
  updateForm: (field: keyof ProgramFormData, value: string) => void;
  isMultiWeek: boolean;
  setIsMultiWeek: (value: boolean) => void;
  totalQuantity: number;
  setTotalQuantity: (value: number) => void;
  displayTotalQuantity: number;
  handleWeekChange: (value: number) => void;
  formAnimation: Animated.AnimatedInterpolation<number>;
  formOpacity: Animated.AnimatedInterpolation<number>;
}

export const ProgramForm: React.FC<ProgramFormProps> = ({
  form,
  updateForm,
  isMultiWeek,
  setIsMultiWeek,
  totalQuantity,
  setTotalQuantity,
  displayTotalQuantity,
  handleWeekChange,
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
          <Checkbox
            value={isMultiWeek}
            onValueChange={setIsMultiWeek}
            color={isMultiWeek ? "#FF9C01" : undefined}
          />
          <Text className="font-pmedium text-white ml-2">
            Create multi-week program
          </Text>
        </View>

        {isMultiWeek && (
          <View className="py-4">
            <Text className="font-pmedium text-l text-white line-clamp-1 mb-2">
              Select Program Length: {displayTotalQuantity}{" "}
              {displayTotalQuantity === 1 ? "Week" : "Weeks"}
            </Text>
            <Slider
              step={1}
              value={totalQuantity}
              minimumValue={1}
              maximumValue={16}
              onSlidingComplete={(value: number) => setTotalQuantity(value)}
              onValueChange={handleWeekChange}
              minimumTrackTintColor="#FF9C01"
              maximumTrackTintColor="#7b7b8b"
              thumbTintColor="#FF9C01"
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};
