import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";

interface Group {
  id: number;
  groupName: string;
  groupImage: string;
}

interface GroupsProps {
  groups: Group[];
  onPress: (id: number) => void;
  selectedGroupId: number | null;
}

const SearchByGroup: React.FC<GroupsProps> = ({
  groups,
  onPress,
  selectedGroupId,
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
        data={groups}
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
                source={{ uri: item.groupImage }}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </View>
            <Text
              className={`mt-2 text-xs text-center ${
                selectedGroupId === item.id
                  ? "text-gray-100 font-bold"
                  : "text-gray-100"
              }`}
            >
              {item.groupName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchByGroup;
