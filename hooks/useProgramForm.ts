import { useState, useCallback } from "react";
import { ProgramFormData } from "../types/programTypes";

export const useProgramForm = () => {
  const [form, setForm] = useState<ProgramFormData>({
    programName: "",
    numberOfWeeks: "",
  });
  const [isMultiWeek, setIsMultiWeek] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [displayTotalQuantity, setDisplayTotalQuantity] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);

  const updateForm = useCallback(
    (field: keyof ProgramFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleWeekChange = (value: number) => {
    console.log("handleWeekChange", value);
    const safeValue = Math.max(1, value);
    setDisplayTotalQuantity(safeValue);
    if (currentWeek > safeValue) {
      setCurrentWeek(safeValue);
    }
  };
  return {
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
  };
};
