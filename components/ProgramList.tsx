import { FlatList, View, Text } from "react-native";
import TrainingProgram from "@/components/TrainingProgram";
import React from "react";
import { router } from "expo-router";
import { Session } from "@/types/sessionTypes";

export interface Program {
  _id: string;
  sessions: Session[];
  name: string;
  length: number;
  description: string;
  isMultiWeek: boolean;
  isRepeated: boolean;
}

interface ProgramListProps {
  programs: Program[];
  isLoading: boolean;
  onSelect: (id: string) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  isLoading,
  onSelect,
}) => {
  return isLoading ? (
    <View className="flex items-center justify-center h-40">
      <Text>Loading programs...</Text>
    </View>
  ) : (
    <FlatList
      className="my-4"
      data={programs}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => (
        <View className="mx-4">
          <TrainingProgram
            id={item._id}
            programName={item.name}
            numberOfWeeks={item.length}
            onPress={() =>
              router.push(`/program/program-details?id=${item._id}`)
            }
            onPressMore={() => onSelect(item._id)}
          />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
};

export default ProgramList;
