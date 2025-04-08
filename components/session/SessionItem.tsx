import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { SessionProps } from "../../types/sessionTypes";
import { SESSION_HEIGHT } from "../../constants/sessionConstants";

export const SessionItem = ({
  name,
  numberOfExercises,
  weekNumber,
  image,
  isExpanded,
  onToggleExpand,
}: SessionProps & { isExpanded: boolean; onToggleExpand: () => void }) => {
  const heightAnim = new Animated.Value(
    isExpanded ? SESSION_HEIGHT * 2 : SESSION_HEIGHT
  );

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? SESSION_HEIGHT * 2 : SESSION_HEIGHT,
      duration: 200,
      useNativeDriver: false,
    }).start();

    return () => {
      heightAnim.stopAnimation();
    };
  }, [isExpanded]);

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: heightAnim,
        padding: 10,
      }}
    >
      <TouchableOpacity
        className="bg-black-100 w-full rounded-2xl p-1 border-2 border-black-200"
        onPress={onToggleExpand}
        activeOpacity={0.8}
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
              {name}
            </Text>
            <Text className="font-pmedium text-xs text-gray-100">
              {`${numberOfExercises} exercises`}
            </Text>
          </View>
          <TouchableOpacity className="py-4 rounded-xl" onPress={() => {}}>
            <Image
              source={require("@/assets/icons/more.png")}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View className="p-2 mt-2 bg-black-300 rounded-xl">
            <Text className="text-gray-200">Week {weekNumber}</Text>
            <Text className="text-gray-200">
              More details about this session...
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
