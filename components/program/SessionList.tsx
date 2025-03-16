import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from "react-native";
import CustomSecondaryButton from "@/components/CustomSecondaryButton";

interface SessionListProps {
  isMultiWeek: boolean;
  currentWeek: number;
  onAddSession: () => void;
  sessions?: Array<{
    id: string;
    name: string;
    img?: string;
    numberOfExercises?: number;
    description?: string;
    duration?: string;
    difficulty?: string;
  }>;
  onPress: (id: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  isMultiWeek,
  currentWeek,
  onAddSession,
  sessions = [],
  onPress,
}) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    null
  );
  const animatedHeights = useRef<{ [key: string]: Animated.Value }>({});

  React.useEffect(() => {
    sessions.forEach((session) => {
      if (!animatedHeights.current[session.id]) {
        animatedHeights.current[session.id] = new Animated.Value(0);
      } else {
        animatedHeights.current[session.id].setValue(0); // Ensure sessions remain collapsed
      }
    });

    setExpandedSessionId(null); // Ensure no session is expanded by default
  }, [sessions]);

  const toggleExpand = (sessionId: string) => {
    if (expandedSessionId === sessionId) {
      Animated.timing(animatedHeights.current[sessionId], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedSessionId(null));
    } else {
      if (expandedSessionId && animatedHeights.current[expandedSessionId]) {
        Animated.timing(animatedHeights.current[expandedSessionId], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setExpandedSessionId(sessionId);
          Animated.timing(animatedHeights.current[sessionId], {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();
        });
      } else {
        setExpandedSessionId(sessionId);
        Animated.timing(animatedHeights.current[sessionId], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  return (
    <View className="flex-1 px-4 py-2">
      <Text className="text-white font-pmedium text-xl mb-4">
        {isMultiWeek ? `Week ${currentWeek} Sessions` : "Sessions"}
      </Text>

      {sessions.length > 0 ? (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-2 overflow-hidden">
              <TouchableOpacity
                className="p-2 bg-primary w-full"
                onPress={() => toggleExpand(item.id)}
                style={{
                  borderBottomWidth: expandedSessionId === item.id ? 0 : 0.5,
                  borderBottomColor: "#CDCDE0",
                }}
              >
                <View className="flex-row items-center p-2">
                  <View className="bg-black-200 p-2 rounded-xl">
                    <Image
                      source={
                        item.img
                          ? { uri: item.img }
                          : require("@/assets/images/exerciseimg.png")
                      }
                      className="w-14 h-14"
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="font-pmedium text-l text-white line-clamp-1 mb-2">
                      {item.name}
                    </Text>
                    <Text className="font-pmedium text-xs text-gray-100">
                      {item.numberOfExercises
                        ? `${item.numberOfExercises} exercises`
                        : "No exercises"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="py-4 rounded-xl"
                    onPress={() => onPress(item.id)}
                  >
                    <Image
                      source={require("@/assets/icons/more.png")}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <Animated.View
                style={{
                  maxHeight: animatedHeights.current[item.id]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                  overflow: "hidden",
                  backgroundColor: "#1E1E2D",
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#CDCDE0",
                }}
              >
                <View className="p-4">
                  <View className="mb-3">
                    <Text className="text-white font-pmedium text-sm mb-1">
                      Description:
                    </Text>
                    <Text className="text-gray-200 text-sm">
                      {item.description || "No description available"}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Text className="text-white font-pmedium text-sm mb-1">
                        Duration:
                      </Text>
                      <Text className="text-gray-200 text-sm">
                        {item.duration || "Not specified"}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-pmedium text-sm mb-1">
                        Difficulty:
                      </Text>
                      <Text className="text-gray-200 text-sm">
                        {item.difficulty || "Not specified"}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="bg-blue-600 py-2 px-4 rounded-lg self-start mt-2"
                    onPress={() => onPress(item.id)}
                  >
                    <Text className="text-white font-pmedium text-sm">
                      Edit Session
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          )}
        />
      ) : null}

      <CustomSecondaryButton
        title="Add Session"
        handlePress={onAddSession}
        containerStyle="my-4"
        icon="add"
      />
    </View>
  );
};
