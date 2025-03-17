import React from "react";
import DropdownComponent from "../CustomDropdownComponent";

interface ProgramLengthDropdownProps {
  value: string | null;
  setValue: (value: string) => void;
  maxWeeks?: number;
}

const ProgramLengthDropdown: React.FC<ProgramLengthDropdownProps> = ({
  value,
  setValue,
  maxWeeks = 16,
}) => {
  const generateProgramLengthData = () => {
    return Array.from({ length: maxWeeks }, (_, index) => {
      const weekNumber = index + 1;
      return {
        label: `${weekNumber} ${weekNumber === 1 ? "Week" : "Weeks"}`,
        value: weekNumber.toString(),
      };
    });
  };

  return (
    <DropdownComponent
      label="Select Program Length"
      placeholder="Select Program Length"
      value={value}
      setValue={setValue}
      generateData={generateProgramLengthData}
      iconSource={require("@/assets/icons/more-time.png")}
    />
  );
};

export default ProgramLengthDropdown;
