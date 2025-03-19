import React from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "../../types/sessionTypes";

interface SessionItemProps {
  session: Session;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
  onPress: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onLongPress: () => void;
  animatedHeight: Animated.Value;
  isDragging?: boolean;
}

export const SessionItem = ({
  session,
  index,
  isExpanded,
  onToggle,
  onPress,
  onDelete,
  onLongPress,
  animatedHeight,
  isDragging = false,
}: SessionItemProps) => {
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={300}
      onPress={() => onToggle(index)}
      style={{
        opacity: isDragging ? 0.7 : 1,
      }}
    >
      <Animated.View
        className={`${
          isDragging ? "bg-gray-700" : "bg-[#1E1E2E]"
        } mb-4 rounded-md overflow-hidden`}
        style={{
          height: animatedHeight,
          borderWidth: isDragging ? 2 : 0,
          borderColor: isDragging ? "#4382FF" : "transparent",
        }}
      >
        <View className="flex-row justify-between items-center px-4 py-3">
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="reorder-three"
              size={22}
              color="#9FA2B4"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-pmedium text-base flex-1">
              {session.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-400 text-xs mr-2">
              {session.numberOfExercises} exercises
            </Text>
            <TouchableOpacity
              onPress={() => onPress(session.id)}
              className="p-1 bg-[#4382FF] rounded-full"
            >
              <Ionicons name="chevron-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {isExpanded && (
          <View className="px-4 py-3 bg-[#161622]">
            <TouchableOpacity
              onPress={() => onDelete(session.id)}
              className="flex-row items-center"
            >
              <Ionicons name="trash-outline" size={18} color="#FF4B55" />
              <Text className="text-[#FF4B55] ml-2">Delete Session</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
