import { useState } from "react";
import Constants from "expo-constants";
import useApi from "@/hooks/useApi";
import { Program } from "@/components/ProgramList";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);

  const {
    isLoading,
    error,
    callApi: fetchPrograms,
  } = useApi<Program[]>(`${BASE_URL}program/list`, "GET", {
    onSuccess: (data) => setPrograms(data),
    onError: (error) => console.error("Failed to fetch programs:", error),
  });

  const { callApi: duplicateProgram } = useApi<Program>(
    `${BASE_URL}program/{id}/duplicate`,
    "POST",
    {
      onSuccess: fetchPrograms,
      onError: (error) => console.error("Failed to duplicate program:", error),
    }
  );

  const { callApi: deleteProgram } = useApi<{ message: string }>(
    `${BASE_URL}program/{id}/delete`,
    "DELETE",
    {
      onSuccess: fetchPrograms,
      onError: (error) => console.error("Failed to delete program:", error),
    }
  );

  return {
    programs,
    isLoading,
    error,
    fetchPrograms,
    duplicateProgram,
    deleteProgram,
  };
};

export default usePrograms;
