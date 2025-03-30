import Constants from "expo-constants";
import { useState } from "react";
import useApi from "./useApi";
import { Program } from "@/types/programTypes";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

export const useProgramForm = () => {
  const [programName, setProgramName] = useState<string>("New Program");
  const [programLength, setProgramLength] = useState<number | null>(1);
  const [programDescription, setProgramDescription] = useState<string>("");
  const [isMultiWeek, setIsMultiWeek] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);

  const { callApi } = useApi<Program>(`${BASE_URL}program/create`, "POST", {
    onSuccess: () => {
      console.log("Program created successfully");
    },
    onError: (error) => console.error("Failed to create program:", error),
  });

  const handleCreateProgram = () => {
    console.log("Program Data:");
    const programData = {
      name: programName,
      length: programLength,
      description: programDescription,
      isMultiWeek,
      isRepeated,
    };
    callApi(programData);
    console.log("Program Data:", programData);
  };

  return {
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
  };
};
