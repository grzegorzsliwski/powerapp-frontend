import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";

interface ExerciseProps {
  id: number;
  exerciseName: string;
  exercisePrimaryMuscleGroup: string;
  muscleGroupImage: string;
  onPress: (id: number) => void;
}

const ExerciseDisplay: React.FC<ExerciseProps> = ({
  id,
  exerciseName,
  exercisePrimaryMuscleGroup,
  muscleGroupImage,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="p-2 bg-primary"
      onPress={() => onPress(id)}
      style={{
        borderBottomWidth: 0.5,
        borderBottomColor: "#CDCDE0",
      }}
    >
      <View className="flex-row items-center">
        <View className="w-14 h-14 rounded-full bg-gray-200 justify-center items-center shadow-md mr-4">
          <Image
            source={{ uri: muscleGroupImage }}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="text-md font-bold mb-1 text-white">
            {exerciseName}
          </Text>
          <Text className="text-xs text-gray-100">
            {exercisePrimaryMuscleGroup}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseDisplay;
