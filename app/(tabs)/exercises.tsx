import React, { useState, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import SearchByGroup from "@/components/SearchByGroup";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import { icons } from "../../constants";
import TabSelect from "@/components/TabSelect";
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router } from "expo-router";

interface Exercise {
  _id: string;
  exerciseName: string;
  primaryMuscleGroup?: {
    muscleGroupName: string;
    image?: string;
  };
  secondaryMuscleGroups?: { muscleGroupName: string }[];
  equipmentType?: string;
  description?: string;
  imageUrl?: string;
  instructions?: string[];
}

const Exercises = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGroupPress = (id: number) => {
    if (selectedGroupId === id) {
      setSelectedGroupId(null);
    } else {
      setSelectedGroupId(id);
      console.log("Selected group ID:", id);
    }
  };

  // const handleExercisePress = (id: string) => {
  //   console.log(id);
  //   navigation.navigate("exercises", {
  //     screen: "exercise/exercise-details",
  //     params: { id: id },
  //   });
  // };

  const handleExercisePress = (id: string) => {
    router.push(`/exercise/exercise-details?id=${id}`);
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

  const tabs = ["Body Part", "Accessory", "Category"];

  const handleTabChange = async (index: number) => {
    setActiveTab(index);
    setSelectedGroupId(null);
    console.log(`Selected tab: ${tabs[index]}`);
    await fetchExercises();
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

  const { isLoading, error, callApi } = useApi(
    `${Constants.expoConfig?.extra?.BASE_URL}exercises/list`,
    "GET",
    {
      onSuccess: (data) => {
        setExercises(data);
      },
      onError: (err) => {
        console.error("Error fetching exercises:", err);
      },
    }
  );

  const fetchExercises = async () => {
    try {
      await callApi();
    } catch (err) {
      console.error("Failed to fetch exercises:", err);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <FlatList
        data={exercises}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <ExerciseDisplay
            id={item._id}
            exerciseName={item.exerciseName}
            exercisePrimaryMuscleGroup={
              item.primaryMuscleGroup?.muscleGroupName || "Unknown"
            }
            muscleGroupImage={item.primaryMuscleGroup?.image || ""}
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
