import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import SearchByMuscleGroup from "@/components/SearchByMuscleGroup";
import ExerciseDisplay from "@/components/ExerciseDisplay";

const Exercises = () => {
  const handleMuscleGroupPress = (id: number) => {
    console.log("Selected muscle group ID:", id);
  };

  const handleExercisePress = (id: number) => {
    console.log("Selected exercise ID:", id);
  };

  const muscleGroups = [
    {
      id: 1,
      muscleGroupName: "Chest",
      muscleGroupImage: "https://example.com/chest.png",
    },
    {
      id: 2,
      muscleGroupName: "Back",
      muscleGroupImage: "https://example.com/back.png",
    },
    {
      id: 3,
      muscleGroupName: "Legs",
      muscleGroupImage: "https://example.com/legs.png",
    },
    {
      id: 4,
      muscleGroupName: "Legs",
      muscleGroupImage: "https://example.com/legs.png",
    },
    {
      id: 5,
      muscleGroupName: "Legs",
      muscleGroupImage: "https://example.com/legs.png",
    },
    {
      id: 6,
      muscleGroupName: "Legs",
      muscleGroupImage: "https://example.com/legs.png",
    },
  ];

  const exercises = [
    {
      id: 1,
      exerciseName: "Bench Press",
      exercisePrimaryMuscleGroup: "Chest",
      muscleGroupImage: "asda",
    },
    {
      id: 2,
      exerciseName: "Deadlift",
      exercisePrimaryMuscleGroup: "Back",
      muscleGroupImage: "asda",
    },
    {
      id: 3,
      exerciseName: "Squat",
      exercisePrimaryMuscleGroup: "Legs",
      muscleGroupImage: "asdasd",
    },
    {
      id: 4,
      exerciseName: "Squat",
      exercisePrimaryMuscleGroup: "Legs",
      muscleGroupImage: "asdasd",
    },
    {
      id: 5,
      exerciseName: "Squat",
      exercisePrimaryMuscleGroup: "Legs",
      muscleGroupImage: "asdasd",
    },
    {
      id: 6,
      exerciseName: "Squat",
      exercisePrimaryMuscleGroup: "Legs",
      muscleGroupImage: "asdasd",
    },
    {
      id: 7,
      exerciseName: "Squat",
      exercisePrimaryMuscleGroup: "Legs",
      muscleGroupImage: "asdasd",
    },
    {
      id: 8,
      exerciseName: "Squat",
      exercisePrimaryMuscleGroup: "Legs",
      muscleGroupImage: "asdasd",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExerciseDisplay
            id={item.id}
            exerciseName={item.exerciseName}
            exercisePrimaryMuscleGroup={item.exercisePrimaryMuscleGroup}
            muscleGroupImage={item.muscleGroupImage}
            onPress={handleExercisePress}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            <View className="mt-6 px-4 space-y-6">
              <View className="flex-row justify-between items-center mb-5">
                <SearchInput
                  value=""
                  handleChangeText={() => {}}
                  placeholder="Search Exercise"
                />
              </View>
            </View>
            <SearchByMuscleGroup
              muscleGroups={muscleGroups}
              onPress={handleMuscleGroupPress}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Exercises;
