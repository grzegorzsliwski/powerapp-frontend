import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import SearchByGroup from "@/components/SearchByGroup";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import { icons } from "../../constants";
import TabSelect from "@/components/TabSelect";

const Exercises = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const handleGroupPress = (id: number) => {
    if (selectedGroupId === id) {
      setSelectedGroupId(null);
    } else {
      setSelectedGroupId(id);
      console.log("Selected group ID:", id);
    }
  };

  const handleExercisePress = (id: number) => {
    console.log("Selected exercise ID:", id);
  };

  const muscleGroups = [
    {
      id: 1,
      groupName: "Chest",
      groupImage: "https://example.com/chest.png",
    },
    {
      id: 2,
      groupName: "Back",
      groupImage: "https://example.com/back.png",
    },
    {
      id: 3,
      groupName: "Legs",
      groupImage: "https://example.com/legs.png",
    },
  ];

  const accessories = [
    { id: 1, groupName: "Squat", groupImage: "asd" },
    { id: 2, groupName: "Bench Press", groupImage: "asd" },
    { id: 3, groupName: "Deadlift", groupImage: "asd" },
  ];

  const category = [
    { id: 1, groupName: "Barbell", groupImage: "asd" },
    { id: 2, groupName: "Dumbbell", groupImage: "asd" },
    { id: 3, groupName: "Cable", groupImage: "asd" },
    { id: 4, groupName: "Body Weight", groupImage: "asd" },
  ];

  const exercises = [
    {
      id: 1,
      exerciseName: "Bench Press",
      exercisePrimaryMuscleGroup: "Chest",
      muscleGroupImage: "https://example.com/chest.png",
    },
    {
      id: 2,
      exerciseName: "Deadlift",
      exercisePrimaryMuscleGroup: "Back",
      muscleGroupImage: "https://example.com/back.png",
    },
    {
      id: 3,
      exerciseName: "Squat",
      exercisePrimaryMuscleGroup: "Legs",
      muscleGroupImage: "https://example.com/legs.png",
    },
  ];

  const tabs = ["Body Part", "Accessory", "Category"];

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSelectedGroupId(null);
    console.log(`Selected tab: ${tabs[index]}`);
  };

  const getTabData = () => {
    switch (activeTab) {
      case 0:
        return muscleGroups;
      case 1:
        return accessories;
      case 2:
        return category;
      default:
        return [];
    }
  };

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
            <View>
              <View className="mt-4 px-4 space-y-6">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <SearchInput
                      value=""
                      handleChangeText={() => {}}
                      placeholder="Search Exercise"
                    />
                  </View>
                  <TouchableOpacity className="w-7 h-7 justify-center items-center">
                    <Image
                      source={icons.plus}
                      className="w-7 h-7"
                      resizeMode="contain"
                      tintColor={"white"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TabSelect
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={handleTabChange}
              />
            </View>
            <SearchByGroup
              groups={getTabData()}
              onPress={handleGroupPress}
              selectedGroupId={selectedGroupId}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Exercises;
