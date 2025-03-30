import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";

interface ExerciseProps {
  id: string;
  programName: string;
  numberOfWeeks: number;
  onPress: (id: string) => void;
  onPressMore: (id: string) => void;
}

const TrainingProgram: React.FC<ExerciseProps> = ({
  id,
  programName,
  numberOfWeeks,
  onPress,
  onPressMore,
}) => {
  return (
    <TouchableOpacity
      className="p-2 bg-primary w-full"
      onPress={() => onPress(id)}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#CDCDE0",
      }}
    >
      <View className="flex-row items-center p-2">
        <View className="bg-black-200 p-2 rounded-xl">
          <Image
            source={require("@/assets/images/exerciseimg.png")}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 ml-4">
          <Text className="font-pmedium text-l text-white line-clamp-1 mb-2">
            {programName}
          </Text>
          <Text className="font-pmedium text-xs text-gray-100">
            {`${numberOfWeeks} week program`}
          </Text>
        </View>
        <TouchableOpacity
          className="py-4 rounded-xl"
          onPress={() => onPressMore(id)}
        >
          <Image
            source={require("@/assets/icons/more.png")}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default TrainingProgram;
