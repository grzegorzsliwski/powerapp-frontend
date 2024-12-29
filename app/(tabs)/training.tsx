import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import TodaysSession from "@/components/TodaysSession";

const Training = () => {
  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        className="h-full"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text className="text-3xl text-white">{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Sliwa
                </Text>
              </View>
            </View>
            <View>
              <Text className="font-psmall text-sm text-gray-100">
                Quick Start
              </Text>
              <CustomButton
                title="Start An Empty Workout"
                handlePress={() => {}}
                containerStyle="mt-2 mb-2"
                isLoading={undefined}
              />
            </View>
            <View>
              <Text className="font-psmall text-sm text-gray-100">
                Today's Session
              </Text>
              <TodaysSession
                sessions={[
                  {
                    id: 1,
                    sessionName: "Leg Day",
                    exercises: [
                      { name: "Squats", sets: 4, reps: 10 },
                      { name: "Lunges", sets: 3, reps: 12 },
                    ],
                  },
                  {
                    id: 2,
                    sessionName: "Push Day",
                    exercises: [
                      { name: "Bench Press", sets: 4, reps: 8 },
                      { name: "Overhead Press", sets: 3, reps: 10 },
                    ],
                  },
                  {
                    id: 3,
                    sessionName: "Pull Day",
                    exercises: [
                      { name: "Pull Up", sets: 4, reps: 8 },
                      { name: "Row", sets: 3, reps: 10 },
                    ],
                  },
                ]}
                // ?? []
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Training;

const styles = StyleSheet.create({});
