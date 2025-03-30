import React, { useLayoutEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CustomHeaderButton from "@/components/CustomHeaderButton";
import { ProgramForm } from "@/components/program/ProgramForm";
import { WeekSelector } from "@/components/program/WeekSelector";
import { useProgramForm } from "@/hooks/useProgramForm";
import { useFormAnimation } from "@/hooks/useFormAnimation";
import CustomSecondaryButton from "@/components/CustomSecondaryButton";
import MovableSession from "@/components/session/MovableSession";
import { SESSIONS } from "@/data/sessionData";
import { SESSION_HEIGHT } from "@/constants/sessionConstants";
import { usePositions } from "@/hooks/usePosition";

const CreateProgram = () => {
  const navigation = useNavigation();

  const { positions, scrollY, scrollViewRef, handleScroll } =
    usePositions(SESSIONS);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create Program",
      headerStyle: {
        backgroundColor: "#161622",
      },
      headerTitleStyle: {
        color: "#FFFFFF",
        fontFamily: "Poppins-Medium",
        fontSize: 20,
      },
      headerTintColor: "#FFFFFF",
      headerRight: () => (
        <CustomHeaderButton
          title="Save"
          handlePress={() => {}}
          containerStyle="mr-4 py-1"
        />
      ),
    });
  }, []);

  // const addSession = () => {
  //   const newSession = {
  //     id: SESSIONS.length + 1,
  //     name: `Session ${SESSIONS.length + 1}`,
  //     numberOfExercises: 0,
  //     weekNumber: currentWeek ?? 1,
  //     image: "https://example.com/image.png",
  //   };
  //   SESSIONS.push(newSession);
  //   setSessions([...SESSIONS]);
  // };

  // const saveProgram = () => {
  //   console.log("Saving program:", {
  //     programDetails: form,
  //     sessions,
  //   });
  // };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className="flex-1 bg-[#161622]"
        edges={["left", "right", "bottom"]}
      >
        <StatusBar barStyle="light-content" />

        {/* Sessions Container */}
        <View style={{ flex: 1, backgroundColor: "#161622" }}>
          <Animated.ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1, position: "relative" }}
            contentContainerStyle={{
              height: SESSIONS.length * SESSION_HEIGHT,
              paddingTop: 10,
              borderColor: "red",
              borderWidth: 1,
            }}
          >
            {SESSIONS.map((session) => (
              <MovableSession
                key={session.id}
                id={session.id}
                name={session.name}
                numberOfExercises={session.numberOfExercises}
                weekNumber={session.weekNumber}
                image={session.image}
                positions={positions}
                scrollY={scrollY}
                sessionCount={SESSIONS.length}
                scrollViewRef={scrollViewRef}
              />
            ))}
          </Animated.ScrollView>
        </View>

        {/* Add Session Button */}
        <View className="px-4 py-4 bg-[#161622]">
          <CustomSecondaryButton
            title="Add Session"
            icon="add"
            handlePress={() => {}}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default CreateProgram;
