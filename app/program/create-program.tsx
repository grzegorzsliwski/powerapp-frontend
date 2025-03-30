import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import CustomHeaderButton from "@/components/CustomHeaderButton";
import { useProgramForm } from "@/hooks/useProgramForm";
import Program from "../(tabs)/program";
import { ProgramForm } from "@/components/program/ProgramForm";
import { ProgramFormData } from "@/types/programTypes";

const CreateProgram = () => {
  const navigation = useNavigation();

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
    });
  }, []);

  const {
    programName,
    setProgramName,
    programLength,
    setProgramLength,
    programDescription,
    setProgramDescription,
    isMultiWeek,
    setIsMultiWeek,
    isRepeated,
    setIsRepeated,
    handleCreateProgram,
  } = useProgramForm();
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ProgramForm
        programName={programName}
        setProgramName={setProgramName}
        programLength={programLength}
        setProgramLength={setProgramLength}
        programDescription={programDescription}
        setProgramDescription={setProgramDescription}
        isMultiWeek={isMultiWeek}
        setIsMultiWeek={setIsMultiWeek}
        isRepeated={isRepeated}
        setIsRepeated={setIsRepeated}
        handleCreateProgram={() => {
          handleCreateProgram();
          router.push("/program");
        }}
      />
    </SafeAreaView>
  );
};

export default CreateProgram;
