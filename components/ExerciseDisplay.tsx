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
        <View className="my-2 w-14 h-14  rounded-xl bg-gray-200 justify-center items-center shadow-md mr-4">
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
        <View className="flex-1">
          <Text className="font-pmedium text-m text-white line-clamp-1">
            {[equipmentName, exerciseName].filter(Boolean).join(" ")}{" "}
            {variantName ? `(${variantName})` : ""}
          </Text>
          <Text className="font-pmedium text-xs text-gray-300">
            {exercisePrimaryMuscleGroup}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseDisplay;
