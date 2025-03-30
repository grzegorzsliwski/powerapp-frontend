import React from "react";
import { View, Text, Switch } from "react-native";
import FormField from "@/components/FormField";
import ProgramLengthDropdown from "../program/ProgramLengthDropdown";
import CustomButton from "../CustomButton";

interface ProgramFormProps {
  programName: string;
  setProgramName: (name: string) => void;
  programLength: number | null;
  setProgramLength: (length: number | null) => void;
  programDescription: string;
  setProgramDescription: (name: string) => void;
  isMultiWeek: boolean;
  setIsMultiWeek: (value: boolean) => void;
  isRepeated: boolean;
  setIsRepeated: (value: boolean) => void;
  handleCreateProgram: () => void;
}

export const ProgramForm: React.FC<ProgramFormProps> = ({
  programName,
  setProgramName,
  programLength,
  setProgramLength,
  programDescription,
  setProgramDescription,
  isMultiWeek,
  setIsMultiWeek,
  isRepeated,
  setIsRepeated,
  handleCreateProgram,
}) => {
  return (
    <View className="bg-primary">
      <View className="px-4">
        <FormField
          otherStyles="mb-4"
          title="Name Your Program*"
          value={programName}
          handleChangeText={(text: string) => setProgramName(text)}
        />
        <FormField
          otherStyles="mb-4"
          title="Program Description"
          value={programDescription}
          handleChangeText={(text: string) => setProgramDescription(text)}
        />
        <View className="flex-row items-center">
          <Switch
            value={isRepeated}
            onValueChange={(value) => setIsRepeated(value)}
            thumbColor={isRepeated ? "#CDCDE0" : "#CDCDE0"}
            trackColor={{ false: "#1E1E2D", true: "#FF9C01" }}
          />
          <Text className="font-pmedium text-white ml-2">
            Repeat program after completion
          </Text>
        </View>

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
          <View>
            <ProgramLengthDropdown
              value={programLength ? programLength.toString() : null}
              setValue={(value) => setProgramLength(Number(value))}
            />
          </View>
        )}
        <CustomButton
          title="Create Program"
          handlePress={() => {
            handleCreateProgram();
          }}
          containerStyle="mt-8 mb-4"
        />
      </View>
    </View>
  );
};
