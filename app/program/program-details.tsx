import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CustomHeaderButton from "@/components/CustomHeaderButton";
import { WeekSelector } from "@/components/program/WeekSelector";
import CustomSecondaryButton from "@/components/CustomSecondaryButton";
import MovableSession from "@/components/session/MovableSession";
import { SESSIONS } from "@/data/sessionData";
import { SESSION_HEIGHT } from "@/constants/sessionConstants";
import { usePositions } from "@/hooks/usePosition";
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";
import { Program } from "@/types/programTypes";

// Height per exercise when expanded
const EXERCISE_HEIGHT = 50;

const CreateProgram = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [program, setProgram] = useState<Program | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    null
  );

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

  const handleOutsidePress = () => {
    if (expandedSessionId) {
      setExpandedSessionId(null);
    }
  };

  const BUTTON_HEIGHT = 60;
  const MARGIN_VERTICAL = 4;

  // Calculate extra height needed for expanded session
  const getExpandedExtraHeight = () => {
    if (!expandedSessionId) return 0;

    const expandedSession = SESSIONS.find((s) => s.id === expandedSessionId);
    if (!expandedSession) return 0;

    return expandedSession.numberOfExercises * EXERCISE_HEIGHT;
  };

  const totalHeight =
    SESSIONS.length * SESSION_HEIGHT +
    getExpandedExtraHeight() +
    BUTTON_HEIGHT +
    MARGIN_VERTICAL * 2;

  // Generate some mock exercises for each session
  const sessionsWithExercises = SESSIONS.map((session) => {
    const exerciseCount = session.numberOfExercises;
    const exercises = Array.from({ length: exerciseCount }, (_, i) => ({
      id: `exercise-${session.id}-${i}`,
      name: `Exercise ${i + 1}`,
      sets: 3 + Math.floor(Math.random() * 3), // Random between 3-5 sets
      reps: 8 + Math.floor(Math.random() * 8), // Random between 8-15 reps
    }));

    return { ...session, exercises };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className="flex-1 bg-[#161622]"
        edges={["left", "right", "bottom"]}
      >
        <StatusBar barStyle="light-content" />

        <TouchableWithoutFeedback onPress={handleOutsidePress}>
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
                height: totalHeight,
                paddingBottom: BUTTON_HEIGHT + MARGIN_VERTICAL * 2,
              }}
            >
              {sessionsWithExercises.map((session) => (
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
                  expandedSessionId={expandedSessionId}
                  setExpandedSessionId={setExpandedSessionId}
                  exercises={session.exercises}
                />
              ))}

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: BUTTON_HEIGHT,
                  paddingHorizontal: 8,
                  paddingBottom: 16,
                  backgroundColor: "#161622",
                  marginVertical: 4,
                }}
              >
                <CustomSecondaryButton
                  title="Add Session"
                  icon="add"
                  handlePress={() => {}}
                />
              </View>
            </Animated.ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default CreateProgram;
