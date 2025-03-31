import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
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
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";
import { Program } from "@/types/programTypes";

const CreateProgram = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [program, setProgram] = useState<Program | null>(null);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className="flex-1 bg-[#161622]"
        edges={["left", "right", "bottom"]}
      >
        <StatusBar barStyle="light-content" />

        <View style={{ flex: 1, backgroundColor: "#161622" }}>
          <WeekSelector
            programLength={program?.length ?? 1}
            currentWeek={1}
            setCurrentWeek={() => {}}
          />
          <Animated.ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            contentContainerStyle={{
              height: SESSIONS.length * SESSION_HEIGHT,
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
