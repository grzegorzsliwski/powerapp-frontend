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
import { router } from "expo-router";

interface Exercise {
  _id: string;
  exerciseName: string;
  primaryMuscleGroup: {
    muscleGroupName: string;
    imageUrl: string;
  };
  secondaryMuscleGroups?: { muscleGroupName: string }[];
  equipmentType?: { equipmentName: string };
  variantType?: { variantName: string };
  description?: string;
  imageUrl?: string;
  instructions?: string[];
}

interface MuscleGroup {
  _id: string;
  muscleGroupName: string;
  imageUrl: string;
}

interface Accessory {
  _id: string;
  mainLiftName: string;
  imageUrl: string;
}

interface Equipment {
  _id: string;
  equipmentName: string;
  imageUrl: string;
}

interface Variant {
  _id: string;
  variantName: string;
  imageUrl: string;
}

interface FiltersResponse {
  variantType: Variant[];
  muscleGroups: MuscleGroup[];
  accessories: Accessory[];
  equipment: Equipment[];
  variant: Variant[];
}

const Exercises = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [variant, setVariant] = useState<Variant[]>([]);

  const handleGroupPress = (id: string) => {
    if (selectedGroupId === id) {
      setSelectedGroupId(null);
    } else {
      setSelectedGroupId(id);
      console.log("Selected group ID:", id);
    }
  };

  const handleExercisePress = (id: string) => {
    router.push(`/exercise/exercise-details?id=${id}`);
  };

  const tabs = ["Body Part", "Accessory", "Equipment"];

  const handleTabChange = async (index: number) => {
    setActiveTab(index);
    setSelectedGroupId(null);
    console.log(`Selected tab: ${tabs[index]}`);
    await fetchExercises();
  };

  const getTabData = () => {
    switch (activeTab) {
      case 0:
        return muscleGroups.map((item) => ({
          id: item._id,
          groupName: item.muscleGroupName,
          groupImage: item.imageUrl,
        }));
      case 1:
        return accessories.map((item) => ({
          id: item._id,
          groupName: item.mainLiftName,
          groupImage: item.imageUrl,
        }));
      case 2:
        return equipment.map((item) => ({
          id: item._id,
          groupName: item.equipmentName,
          groupImage: item.imageUrl,
        }));
      default:
        return [];
    }
  };

  const {
    isLoading: isLoadingExercises,
    error: errorExercises,
    callApi: fetchExercises,
  } = useApi<Exercise[]>(
    `${Constants.expoConfig?.extra?.BASE_URL}exercises/list`,
    "GET",
    {
      onSuccess: (data) => {
        console.log(data);
        setExercises(data);
      },
      onError: (err) => {
        console.error("Error fetching exercises:", err);
      },
    }
  );

  const {
    isLoading: isLoadingFilters,
    error: errorFilters,
    callApi: fetchFilters,
  } = useApi<FiltersResponse>(
    `${Constants.expoConfig?.extra?.BASE_URL}filters`,
    "GET",
    {
      onSuccess: (data) => {
        if (data) {
          setMuscleGroups(data.muscleGroups || []);
          setAccessories(data.accessories || []);
          setEquipment(data.equipment || []);
          setVariant(data.variantType || []);
          console.log(data.variantType);
        }
      },
      onError: (err) => {
        console.error("Error fetching filters:", err);
      },
    }
  );

  useEffect(() => {
    fetchExercises();
    fetchFilters();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <FlatList
        data={exercises.filter((exercise) => exercise && exercise._id)}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <ExerciseDisplay
            id={item._id}
            exerciseName={item.exerciseName || "Unnamed Exercise"}
            equipmentName={item.equipmentType?.equipmentName || ""}
            exercisePrimaryMuscleGroup={
              item.primaryMuscleGroup?.muscleGroupName || "Unknown"
            }
            variantName={item.variantType?.variantName || "asd"}
            muscleGroupImage={item.primaryMuscleGroup.imageUrl || "image"}
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
