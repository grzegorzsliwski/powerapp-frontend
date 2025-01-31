import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";

interface Equipment {
  _id: string;
  equipmentName: string;
}

interface MuscleGroup {
  _id: string;
  muscleGroupName: string;
}

interface Exercise {
  _id: string;
  exerciseName: string;
  description: string;
  imageUrl?: string;
  instructions?: string[];
  equipmentType: Equipment;
  primaryMuscleGroup: MuscleGroup;
}

const ExerciseDetails = () => {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const { isLoading, error, callApi } = useApi(
    `${Constants.expoConfig?.extra?.BASE_URL}exercises/${id}`,
    "GET",
    {
      onSuccess: (data) => setExercise(data),
      onError: (err) => console.error("Error fetching exercise details:", err),
    }
  );

  useEffect(() => {
    callApi();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load exercise details.</Text>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-white">No exercise data available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4">
        <Text className="text-2xl font-bold text-white mb-4">
          {exercise.exerciseName}
        </Text>

        {exercise.imageUrl && (
          <Image
            source={{ uri: exercise.imageUrl }}
            className="w-full h-64"
            resizeMode="contain"
          />
        )}

        <Text className="text-md text-gray-100 mt-4">
          Primary Muscle Group: {exercise.primaryMuscleGroup.muscleGroupName}
        </Text>

        <Text className="text-md text-gray-100 mt-2">
          Equipment: {exercise.equipmentType.equipmentName}
        </Text>

        <Text className="text-md text-gray-100 mt-2">
          Description: {exercise.description}
        </Text>

        {exercise.instructions && exercise.instructions.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-bold text-white">Instructions:</Text>
            {exercise.instructions.map((step: string, index: number) => (
              <Text key={index} className="text-gray-100 mt-1">
                {index + 1}. {step}
              </Text>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExerciseDetails;
