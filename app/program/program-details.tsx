import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";

interface Program {
  id: string;
  programName: string;
  numberOfWeeks: number;
}

const ProgramDetails = () => {
  const { id } = useLocalSearchParams();
  const [program, setProgram] = useState<Program | null>(null);
  const { isLoading, error, callApi } = useApi(
    `${Constants.expoConfig?.extra?.BASE_URL}program/${id}`,
    "GET",
    {
      onSuccess: (data) => setProgram(data),
      onError: (err) => console.error("Error fetching program details:", err),
    }
  );

  useEffect(() => {
    console.log(id);
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
        <Text className="text-red-500">Failed to load program details.</Text>
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-white">No program data available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4">
        <Text className="text-md text-gray-100 mt-2">id: {id}</Text>
        <Text className="text-2xl font-bold text-white mb-4">
          {program.programName}
        </Text>
        <Text className="text-md text-gray-100 mt-4">
          Number of weeks: {program.numberOfWeeks}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProgramDetails;
