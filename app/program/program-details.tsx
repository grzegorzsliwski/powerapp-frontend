import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";

interface Session {
  _id: string;
  id: string;
  weekNumber: number;
  dayNumber: number;
  sessionName: string;
  exercises: { exerciseName: string; duration: number }[];
}

interface Program {
  id: string;
  programName: string;
  numberOfWeeks: number;
  sessions: Session[];
}

const ProgramDetails = () => {
  const { id } = useLocalSearchParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [expandedSessions, setExpandedSessions] = useState<{
    [key: string]: boolean;
  }>({});

  const { isLoading, error, callApi } = useApi(
    `${Constants.expoConfig?.extra?.BASE_URL}program/${id}`,
    "GET",
    {
      onSuccess: (data) => {
        setProgram(data);
        console.log(data);
      },
      onError: (err) => console.error("Error fetching program details:", err),
    }
  );

  useEffect(() => {
    callApi();
  }, [id]);

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

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
    <SafeAreaView className="flex-1 bg-primary p-4">
      <Text className="text-md text-gray-100">ID: {id}</Text>
      <Text className="text-2xl font-bold text-white mb-4">
        {program.programName}
      </Text>
      <Text className="text-md text-gray-100 mb-4">
        Number of weeks: {program.numberOfWeeks}
      </Text>

      <FlatList
        data={program.sessions}
        keyExtractor={(session) => session._id}
        renderItem={({ item: session }) => (
          <View className="mb-4 bg-secondary p-3 rounded-lg">
            <TouchableOpacity onPress={() => toggleSession(session._id)}>
              <Text className="text-lg text-white font-semibold">
                {session.sessionName}
              </Text>
            </TouchableOpacity>
            {expandedSessions[session._id] && (
              <View className="mt-2">
                <Text className="text-sm text-gray-300">
                  Week {session.weekNumber}, Day {session.dayNumber}
                </Text>
                <Text className="text-md text-gray-200 mt-2">Exercises:</Text>
                {session.exercises.length > 0 ? (
                  session.exercises.map((exercise, index) => (
                    <Text key={index} className="text-sm text-gray-300">
                      - {exercise.exerciseName} ({exercise.duration} min)
                    </Text>
                  ))
                ) : (
                  <Text className="text-sm text-gray-400">
                    No exercises available
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ProgramDetails;
