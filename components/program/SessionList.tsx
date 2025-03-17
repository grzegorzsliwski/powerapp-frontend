import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  SafeAreaView,
} from "react-native";
import CustomSecondaryButton from "@/components/CustomSecondaryButton";

type SessionListProps = {
  sessions: {
    id: string;
    name: string;
    numberOfExercises: number;
    weekNumber: number;
  }[];
  setSessions?: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        numberOfExercises: number;
        weekNumber: number;
      }[]
    >
  >;
  currentWeek?: number | null;
  isMultiWeek?: boolean;
  onAddSession?: () => void;
  onPress?: (sessionId: string) => void;
};

export const SessionList: React.FC<SessionListProps> = ({
  isMultiWeek,
  currentWeek,
  onAddSession,
  sessions = [],
  onPress,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const animatedHeightsRef = useRef<Animated.Value[]>([]);

  useEffect(() => {
    animatedHeightsRef.current = sessions.map(() => new Animated.Value(50));
  }, [sessions.length]);

  const toggleSize = (index: number) => {
    if (
      animatedHeightsRef.current.length === 0 ||
      !animatedHeightsRef.current[index]
    ) {
      return;
    }

    const newExpandedIndex = expandedIndex === index ? null : index;
    setExpandedIndex(newExpandedIndex);

    sessions.forEach((_, i) => {
      if (animatedHeightsRef.current[i]) {
        const targetHeight = newExpandedIndex === i ? 100 : 50;
        Animated.spring(animatedHeightsRef.current[i], {
          toValue: targetHeight,
          tension: 100,
          friction: 100,
          useNativeDriver: false,
        }).start();
      }
    });
  };

  const handleSessionPress = (index: number, sessionId: string) => {
    toggleSize(index);
    if (expandedIndex === index && onPress) {
      onPress(sessionId);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-4 py-2">
      {sessions.map((session, index) => (
        <TouchableOpacity
          key={session.id}
          onPress={() => handleSessionPress(index, session.id)}
        >
          <Animated.View
            style={{
              borderWidth: 1,
              borderColor: "#1E1E2D",
              backgroundColor: "#161622",
              width: "100%",
              height: animatedHeightsRef.current[index] || 50,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              padding: 10,
            }}
          >
            <Text className="text-white font-medium">{session.name}</Text>
            {expandedIndex === index && (
              <View className="mt-2">
                <Text className="text-gray-300 text-sm">
                  Exercises: {session.numberOfExercises}
                </Text>
                {isMultiWeek && (
                  <Text className="text-gray-300 text-sm">
                    Week: {session.weekNumber}
                  </Text>
                )}
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      ))}

      {onAddSession && (
        <CustomSecondaryButton
          title="Add Session"
          onPress={onAddSession}
          className="mt-4"
        />
      )}
    </SafeAreaView>
  );
};
