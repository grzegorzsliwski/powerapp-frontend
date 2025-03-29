import React, { useState } from "react";
import { View, Text, Platform } from "react-native";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Constants
export const SESSION_HEIGHT = 70;
export const SCROLL_HEIGHT_THRESHOLD = SESSION_HEIGHT;

// Helper functions
function clamp(value, lowerBound, upperBound) {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function objectMove(object, from, to) {
  "worklet";
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

const Session = ({ name, numberOfExercises, onPress }) => {
  return (
    <View
      className="flex-row items-center justify-between p-4 bg-[#212134] rounded-lg my-1 mx-4"
      style={{ height: SESSION_HEIGHT }}
    >
      <View className="flex-row items-center">
        <View className="mr-3">
          <FontAwesome name="bars" size={18} color="#9797B9" />
        </View>
        <View>
          <Text className="text-white font-pmedium">{name}</Text>
          <Text className="text-[#9797B9] text-sm font-pregular">
            {numberOfExercises}{" "}
            {numberOfExercises === 1 ? "exercise" : "exercises"}
          </Text>
        </View>
      </View>
      <FontAwesome name="angle-right" size={20} color="#9797B9" />
    </View>
  );
};

function MovableSession({
  id,
  name,
  numberOfExercises,
  positions,
  scrollY,
  sessionsCount,
  onPress,
  setSessions,
  currentWeek,
}) {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(positions.value[id] * SESSION_HEIGHT);

  // Update position when the order changes
  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          top.value = withSpring(currentPosition * SESSION_HEIGHT);
        }
      }
    },
    [moving]
  );

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(style);
    }
  };

  // Update the actual sessions array when positions change
  const updateSessionsOrder = (newPositions) => {
    setSessions((prev) => {
      // Create a new array based on the position values
      const weekSessions = prev.filter((s) => s.weekNumber === currentWeek);
      const otherSessions = prev.filter((s) => s.weekNumber !== currentWeek);

      // Sort the current week's sessions based on new positions
      const sortedWeekSessions = [...weekSessions].sort(
        (a, b) => newPositions[a.id] - newPositions[b.id]
      );

      // Combine with sessions from other weeks
      return [...sortedWeekSessions, ...otherSessions];
    });
  };

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setMoving)(true);
      runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Medium);
    })
    .onUpdate((event) => {
      const positionY = event.absoluteY + scrollY.value;

      // Direct manipulation for smoother dragging
      top.value = positionY - SESSION_HEIGHT;

      // Handle scrolling
      if (positionY <= scrollY.value + SCROLL_HEIGHT_THRESHOLD) {
        // Scroll up
        scrollY.value = withTiming(0, { duration: 2000 });
      } else if (
        positionY >=
        scrollY.value + dimensions.height - SCROLL_HEIGHT_THRESHOLD
      ) {
        // Scroll down
        const contentHeight = sessionsCount * SESSION_HEIGHT;
        const containerHeight = dimensions.height - insets.top - insets.bottom;
        const maxScroll = contentHeight - containerHeight + 200; // Extra space for bottom buttons
        scrollY.value = withTiming(maxScroll, { duration: 2000 });
      } else {
        cancelAnimation(scrollY);
      }

      const newPosition = clamp(
        Math.floor(positionY / SESSION_HEIGHT),
        0,
        sessionsCount - 1
      );

      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition
        );
        runOnJS(triggerHaptic)();
      }
    })
    .onFinalize(() => {
      top.value = withSpring(positions.value[id] * SESSION_HEIGHT);
      runOnJS(setMoving)(false);
      runOnJS(updateSessionsOrder)(positions.value);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: top.value,
      zIndex: moving ? 1 : 0,
      shadowColor: "#000",
      shadowOpacity: moving ? 0.3 : 0,
      shadowRadius: 10,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      elevation: moving ? 5 : 0,
    };
  }, [moving]);

  return (
    <Animated.View style={animatedStyle}>
      {moving ? (
        <BlurView intensity={80} tint="dark">
          <GestureDetector gesture={dragGesture}>
            <View>
              <Session
                name={name}
                numberOfExercises={numberOfExercises}
                onPress={onPress}
              />
            </View>
          </GestureDetector>
        </BlurView>
      ) : (
        <GestureDetector gesture={dragGesture}>
          <View>
            <Session
              name={name}
              numberOfExercises={numberOfExercises}
              onPress={onPress}
            />
          </View>
        </GestureDetector>
      )}
    </Animated.View>
  );
}

export default MovableSession;
