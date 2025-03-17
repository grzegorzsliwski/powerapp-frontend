import React, { useLayoutEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import CustomHeaderButton from "@/components/CustomHeaderButton";
import { ProgramForm } from "@/components/program/ProgramForm";
import { WeekSelector } from "@/components/program/WeekSelector";
import { SessionList } from "@/components/program/SessionList";
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
          handlePress={() => {}}
          containerStyle="mr-4 py-1"
        />
      ),
    });
  }, [navigation]);

  const addSession = () => {
    setSessions((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name: "Session",
        numberOfExercises: 0,
        weekNumber: currentWeek ?? 1,
      },
    ]);
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
        renderItem={({ item }) => (
          <SessionList
            sessions={sessions}
            setSessions={setSessions}
            currentWeek={currentWeek}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: formHeight,
          backgroundColor: "#161622",
        }}
        ListHeaderComponent={() => (
          <>
            {isMultiWeek && (
              <WeekSelector
                programLength={form.programLength}
                currentWeek={currentWeek ?? 1}
                setCurrentWeek={(week: number) => setCurrentWeek(week)}
              ></WeekSelector>
            )}
            {isMultiWeek ? (
              <Text className="font-pmedium text-white px-4 py-2">
                Week {currentWeek ?? 1} sessions
              </Text>
            ) : (
              <Text className="font-pmedium text-white px-4 py-2">
                Sessions
              </Text>
            )}
          </>
        )}
        ListFooterComponent={() => (
          <View className="px-4 py-2">
            <CustomSecondaryButton
              title="Add Session"
              icon="add"
              handlePress={addSession}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default CreateProgram;
