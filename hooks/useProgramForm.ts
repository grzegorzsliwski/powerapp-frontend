import { useState, useCallback, useEffect } from "react";
import { ProgramFormData } from "../types/programTypes";

export const useProgramForm = () => {
  const [form, setForm] = useState<ProgramFormData>({
    programName: "",
    programLength: null,
  });
  const [isMultiWeek, setIsMultiWeek] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);

  const updateForm = useCallback(
    (field: keyof ProgramFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    form,
    updateForm,
    isMultiWeek,
    setIsMultiWeek,
    currentWeek,
    setCurrentWeek,
  };
};
