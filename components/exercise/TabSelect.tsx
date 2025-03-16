import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TabSelectProps {
  tabs: string[];
  activeTab: number;
  onTabPress?: (index: number) => void;
}

const TabSelect: React.FC<TabSelectProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  const handleTabPress = (index: number) => {
    if (onTabPress) {
      onTabPress(index);
    }
  };

  return (
    <View
      className="bg-primary flex-row mb-4"
      style={{
        borderBottomWidth: 0.4,
        borderBottomColor: "#CDCDE0",
      }}
    >
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          className="flex-1 py-4 rounded items-center justify-center bg-primary"
          onPress={() => handleTabPress(index)}
        >
          <Text
            className={`${
              activeTab === index
                ? "text-base-100 font-pregular text-secondary font-psemibold"
                : "text-base-100 font-pregular text-white"
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabSelect;
