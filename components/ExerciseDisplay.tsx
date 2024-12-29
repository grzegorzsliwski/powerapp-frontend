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
      className="p-4 my-2 border border-gray-300 rounded-lg bg-gray-100"
      onPress={() => onPress(id)}
    >
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center shadow-md mr-4">
          <Image
            source={{ uri: muscleGroupImage }}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="text-lg font-bold mb-1">{exerciseName}</Text>
          <Text className="text-base text-gray-600">
            {exercisePrimaryMuscleGroup}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseDisplay;
