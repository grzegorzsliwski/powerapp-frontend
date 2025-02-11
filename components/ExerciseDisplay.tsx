import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";

interface ExerciseProps {
  id: string;
  exerciseName: string;
  equipmentName: string;
  exercisePrimaryMuscleGroup: string;
  muscleGroupImage: string;
  variantName: string;
  onPress: (id: string) => void;
}

const ExerciseDisplay: React.FC<ExerciseProps> = ({
  id,
  exerciseName,
  equipmentName,
  exercisePrimaryMuscleGroup,
  muscleGroupImage,
  variantName,
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
            source={
              muscleGroupImage
                ? { uri: muscleGroupImage }
                : require("@/assets/images/exerciseimg.png")
            }
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="text-md font-bold mb-1 text-white">
            {`${equipmentName} ${variantName} ${exerciseName}`}
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
