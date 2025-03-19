import React, { useLayoutEffect, useState, useRef } from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import CustomHeaderButton from "@/components/CustomHeaderButton";
import { ProgramForm } from "@/components/program/ProgramForm";
import { WeekSelector } from "@/components/program/WeekSelector";
import {
  SessionList,
  SessionListHandle,
} from "@/components/session/SessionList";
import { useProgramForm } from "@/hooks/useProgramForm";
import { useFormAnimation } from "@/hooks/useFormAnimation";
import CustomSecondaryButton from "@/components/CustomSecondaryButton";

const CreateProgram = () => {
  const {
    form,
    updateForm,
    isMultiWeek,
    setIsMultiWeek,
    currentWeek,
    setCurrentWeek,
  } = useProgramForm();

  const { formAnimation, formOpacity, handleScroll, formHeight } =
    useFormAnimation(isMultiWeek);

  const navigation = useNavigation();

  const sessionListRef = useRef<SessionListHandle>(null);

  const [sessions, setSessions] = useState<
    {
      id: string;
      name: string;
      numberOfExercises: number;
      weekNumber: number;
    }[]
  >([]);

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
          handlePress={() => saveProgram()}
          containerStyle="mr-4 py-1"
        />
      ),
    });
  }, [navigation, sessions, form]);

  const addSession = () => {
    if (sessionListRef.current) {
      sessionListRef.current.collapseAllItems();
    }

    const week = currentWeek ?? 1;
    const existingSessionsForWeek = sessions.filter(
      (s) => s.weekNumber === week
    ).length;

    setSessions((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name: `Session ${existingSessionsForWeek + 1}`,
        numberOfExercises: 0,
        weekNumber: week,
      },
    ]);
  };

  const navigateToSession = (sessionId: string) => {
    console.log("Navigate to edit session:", sessionId);
  };

  const saveProgram = () => {
    console.log("Saving program:", {
      programDetails: form,
      sessions,
    });
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#161622]"
      edges={["left", "right", "bottom"]}
    >
      <ProgramForm
        form={form}
        updateForm={updateForm}
        isMultiWeek={isMultiWeek}
        setIsMultiWeek={setIsMultiWeek}
        formAnimation={formAnimation}
        formOpacity={formOpacity}
      />

      <FlatList
        data={[{ id: 1 }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={() => (
          <View className="flex-1">
            {isMultiWeek && (
              <WeekSelector
                programLength={form.programLength}
                currentWeek={currentWeek ?? 1}
                setCurrentWeek={(week: number) => setCurrentWeek(week)}
              />
            )}
            <Text className="font-pmedium text-white px-4 py-2">
              {isMultiWeek ? `Week ${currentWeek ?? 1} sessions` : "Sessions"}
            </Text>

            <SessionList
              ref={sessionListRef}
              sessions={sessions}
              setSessions={setSessions}
              currentWeek={currentWeek ?? 1}
              isMultiWeek={isMultiWeek}
              onPress={navigateToSession}
            />

            <View className="px-4 py-4">
              <CustomSecondaryButton
                title="Add Session"
                icon="add"
                handlePress={addSession}
              />
            </View>
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: formHeight,
          backgroundColor: "#161622",
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default CreateProgram;
