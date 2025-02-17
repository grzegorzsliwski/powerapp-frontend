import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";

interface Group {
  id: string;
  groupName: string;
  groupImage: string;
}

interface GroupsProps {
  groups: Group[];
  onPress: (id: string) => void;
  selectedGroupId: string | null;
}

const SearchByGroup: React.FC<GroupsProps> = ({
  groups,
  onPress,
  selectedGroupId,
}) => {
  useEffect(() => {
    console.log("Groups received in SearchByGroup:", groups);
  }, [groups]);

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
            <View className="w-16 h-16 rounded-xl bg-gray-200 justify-center items-center shadow-md">
              <Image
                source={
                  item.groupImage
                    ? { uri: item.groupImage }
                    : require("@/assets/images/exerciseimg.png")
                }
                className="w-10 h-10"
                resizeMode="contain"
              />
            </View>
            <Text
              className={`mt-2 text-xs text-center font-pmedium text-gray-300 ${
                selectedGroupId === item.id
                  ? "text-gray-300 font-pbold"
                  : "text-gray-300"
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
