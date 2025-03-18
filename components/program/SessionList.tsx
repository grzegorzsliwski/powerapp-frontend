import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from "react-native";

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

export type SessionListHandle = {
  collapseAllItems: () => void;
};

export const SessionList = forwardRef<SessionListHandle, SessionListProps>(
  (
    {
      isMultiWeek,
      currentWeek = 1,
      onAddSession,
      sessions = [],
      setSessions,
      onPress,
    },
    ref
  ) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const animatedHeightsRef = useRef<Animated.Value[]>([]);
    const prevSessionsLengthRef = useRef<number>(sessions.length);

    const filteredSessions = isMultiWeek
      ? sessions.filter((session) => session.weekNumber === currentWeek)
      : sessions;

    useEffect(() => {
      if (animatedHeightsRef.current.length !== filteredSessions.length) {
        animatedHeightsRef.current = filteredSessions.map(
          () => new Animated.Value(50)
        );
      }
    }, [filteredSessions.length]);

    useEffect(() => {
      if (
        prevSessionsLengthRef.current !== sessions.length &&
        prevSessionsLengthRef.current !== 0
      ) {
        collapseAllItems();
      }

      prevSessionsLengthRef.current = sessions.length;
    }, [sessions.length]);

    useEffect(() => {
      collapseAllItems();
    }, [currentWeek]);

    const collapseAllItems = () => {
      setExpandedIndex(null);

      filteredSessions.forEach((_, i) => {
        if (animatedHeightsRef.current[i]) {
          Animated.spring(animatedHeightsRef.current[i], {
            toValue: 50,
            tension: 100,
            friction: 12,
            useNativeDriver: false,
          }).start();
        }
      });
    };
    useImperativeHandle(ref, () => ({
      collapseAllItems,
    }));

    const toggleSize = (index: number) => {
      if (
        animatedHeightsRef.current.length === 0 ||
        !animatedHeightsRef.current[index]
      ) {
        return;
      }

      const newExpandedIndex = expandedIndex === index ? null : index;
      setExpandedIndex(newExpandedIndex);

      filteredSessions.forEach((_, i) => {
        if (animatedHeightsRef.current[i]) {
          const targetHeight = newExpandedIndex === i ? 100 : 50;
          Animated.spring(animatedHeightsRef.current[i], {
            toValue: targetHeight,
            tension: 100,
            friction: 12,
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

    const deleteSession = (sessionId: string) => {
      if (setSessions) {
        setSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );
      }
    };
    return (
      <SafeAreaView className="flex-1 bg-transparent px-4 py-2">
        {filteredSessions.length === 0 ? (
          <View className="py-6 items-center">
            <Text className="text-gray-400 text-center mb-2">
              No sessions added yet
            </Text>
          </View>
        ) : (
          <>
            {filteredSessions.map((session, index) => (
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
                    <View className="mt-2 w-full">
                      <Text className="text-gray-300 text-sm">
                        Exercises: {session.numberOfExercises}
                      </Text>
                      <View className="flex-row justify-between mt-2 w-full px-4">
                        <TouchableOpacity
                          onPress={() => onPress && onPress(session.id)}
                        >
                          <Text className="text-[#FF9C01]">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteSession(session.id)}
                        >
                          <Text className="text-red-500">Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </SafeAreaView>
    );
  }
);
