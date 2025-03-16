import React, { useLayoutEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import CustomHeaderButton from "@/components/CustomHeaderButton";
import { ProgramForm } from "@/components/program/ProgramForm";
import { WeekSelector } from "@/components/program/WeekSelector";
import { SessionList } from "@/components/program/SessionList";
import { useProgramForm } from "@/hooks/useProgramForm";
import { useFormAnimation } from "@/hooks/useFormAnimation";

const CreateProgram = () => {
  const {
    form,
    updateForm,
    isMultiWeek,
    setIsMultiWeek,
    totalQuantity,
    setTotalQuantity,
    displayTotalQuantity,
    currentWeek,
    setCurrentWeek,
    handleWeekChange,
  } = useProgramForm();

  const { formAnimation, formOpacity, handleScroll, formHeight } =
    useFormAnimation(isMultiWeek);

  const navigation = useNavigation();

  // Updated sessions state to include weekNumber
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

  const handleAddSession = () => {
    const newSession = {
      id: String(Date.now()),
      name: `Session ${getWeekSessionCount(currentWeek) + 1}`,
      numberOfExercises: 0,
      weekNumber: currentWeek,
    };

    setSessions([...sessions, newSession]);
  };

  const getWeekSessionCount = (weekNum: number) => {
    return sessions.filter((session) => session.weekNumber === weekNum).length;
  };

  const currentWeekSessions = sessions.filter(
    (session) => session.weekNumber === currentWeek
  );
  const handleSessionPress = (id: string) => {
    console.log("Session pressed:", id);
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
        totalQuantity={totalQuantity}
        setTotalQuantity={setTotalQuantity}
        displayTotalQuantity={displayTotalQuantity}
        handleWeekChange={handleWeekChange}
        formAnimation={formAnimation}
        formOpacity={formOpacity}
      />

      <FlatList
        data={[{ id: 1 }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={() => <View />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: formHeight,
          backgroundColor: "#161622",
        }}
        ListHeaderComponent={() => (
          <View style={{ display: isMultiWeek ? "flex" : "none" }}>
            {isMultiWeek ? (
              <WeekSelector
                displayTotalQuantity={displayTotalQuantity}
                currentWeek={currentWeek}
                setCurrentWeek={setCurrentWeek}
              />
            ) : null}
          </View>
        )}
        ListFooterComponent={() => (
          <SessionList
            isMultiWeek={isMultiWeek}
            currentWeek={currentWeek}
            onAddSession={handleAddSession}
            sessions={currentWeekSessions}
            onPress={handleSessionPress}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default CreateProgram;
