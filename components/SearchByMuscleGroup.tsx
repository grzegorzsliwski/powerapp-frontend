import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";

interface MuscleGroup {
  id: number;
  muscleGroupName: string;
  muscleGroupImage: string;
}

interface MuscleGroupsProps {
  muscleGroups: MuscleGroup[];
  onPress: (id: number) => void;
}

const SearchByMuscleGroup: React.FC<MuscleGroupsProps> = ({
  muscleGroups,
  onPress,
}) => {
  return (
    <View
      className="pb-4"
      style={{
        borderBottomWidth: 0.5,
        borderBottomColor: "#CDCDE0",
      }}
    >
      <FlatList
        horizontal
        data={muscleGroups}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="items-center mx-2"
            onPress={() => onPress(item.id)}
          >
            <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center shadow-md">
              <Image
                source={{ uri: item.muscleGroupImage }}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </View>
            <Text className="mt-2 text-xs text-center text-gray-100">
              {item.muscleGroupName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchByMuscleGroup;
