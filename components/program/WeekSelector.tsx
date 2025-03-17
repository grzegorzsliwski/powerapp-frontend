import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

interface WeekSelectorProps {
  programLength: number | null;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  programLength,
  currentWeek,
  setCurrentWeek,
}) => {
  const getWeeksArray = () => {
    if (programLength === null) return [];
    return Array.from({ length: programLength }, (_, i) => ({
      week: i + 1,
      id: i.toString(),
    }));
  };

  return (
    <View className="py-4">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={getWeeksArray()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCurrentWeek(item.week)}
            className={`px-6 py-3 mx-2 rounded-full ${
              currentWeek === item.week ? "bg-[#FF9C01]" : "bg-[#272732]"
            }`}
          >
            <Text
              className={`font-pmedium ${
                currentWeek === item.week ? "text-black" : "text-white"
              }`}
            >
              Week {item.week}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};
