import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  View,
  ViewStyle,
  useWindowDimensions,
  TouchableWithoutFeedback,
  UIManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  SharedValue,
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

import { MovableSessionProps } from "../../types/sessionTypes";
import {
  SESSION_HEIGHT,
  SCROLL_HEIGHT_THRESHOLD,
} from "../../constants/sessionConstants";
import { clamp, objectMove } from "../../utils/arrayUtils";
import { SessionItem } from "./SessionItem";
import { SESSIONS } from "../../data/sessionData";

// Enable layout animation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Height per exercise when expanded
const EXERCISE_HEIGHT = 50;

function MovableSession({
  id,
  name,
  numberOfExercises,
  weekNumber,
  image,
  positions,
  scrollY,
  sessionCount,
  scrollViewRef,
  expandedSessionId,
  setExpandedSessionId,
  exercises = [], // Added exercises array
}: MovableSessionProps & {
  expandedSessionId: string | null;
  setExpandedSessionId: (id: string | null) => void;
  exercises?: Array<{ id: string; name: string; sets?: number; reps?: number }>;
}): React.ReactElement {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [moving, setMoving] = useState<boolean>(false);
  const top = useSharedValue(0);

  const itemPosition = useSharedValue({ x: 0, y: 0 });
  const scrollViewPosition = useSharedValue({ x: 0, y: 0 });
  const initialTouchOffset = useSharedValue({ x: 0, y: 0 });

  const isExpanded = expandedSessionId === id;

  // Calculate session height based on number of exercises
  const baseHeight = SESSION_HEIGHT;
  const expandedHeight = numberOfExercises * EXERCISE_HEIGHT;

  // Animation configuration for smoother movement
  const animConfig = {
    duration: 250,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  };

  useEffect(() => {
    // Initial position setup
    updatePosition();
  }, []);

  // Update position whenever expandedSessionId changes
  useEffect(() => {
    updatePosition();
  }, [expandedSessionId]);

  const getExtraHeightBefore = (index: number) => {
    // If there's an expanded session before this one, add its extra height
    if (
      expandedSessionId !== null &&
      positions.value[expandedSessionId] < index
    ) {
      const expandedSessionExerciseCount =
        (typeof expandedSessionId === "string" &&
          SESSIONS.find((s) => s.id === expandedSessionId)
            ?.numberOfExercises) ||
        0;
      return expandedSessionExerciseCount * EXERCISE_HEIGHT;
    }
    return 0;
  };

  const updatePosition = () => {
    // Get the base position from position value
    const currentIndex = positions.value[id];
    const basePosition = currentIndex * baseHeight;

    // If any session is expanded, we need to adjust positions
    if (expandedSessionId !== null) {
      // Find the current position of the expanded session by looking at positions
      const expandedSessionCurrentIndex = positions.value[expandedSessionId];

      // Get the number of exercises in the expanded session
      const expandedSessionExerciseCount =
        (typeof expandedSessionId === "string" &&
          SESSIONS.find((s) => s.id === expandedSessionId)
            ?.numberOfExercises) ||
        0;

      const extraHeight = expandedSessionExerciseCount * EXERCISE_HEIGHT;

      // Only adjust position if this session is below the expanded one
      if (currentIndex > expandedSessionCurrentIndex) {
        // Add the expanded height to push this item down
        top.value = withTiming(basePosition + extraHeight, animConfig);
      } else {
        top.value = withTiming(basePosition, animConfig);
      }
    } else {
      // No session is expanded, use normal positioning
      top.value = withTiming(basePosition, animConfig);
    }
  };

  const itemRef = useRef<View>(null);

  const measurePositions = () => {
    if (!scrollViewRef.current || !itemRef.current) return;

    scrollViewRef.current.measure?.(
      (
        scrollX: number,
        scrollY: number,
        scrollWidth: number,
        scrollHeight: number,
        pageX: number,
        pageY: number
      ) => {
        scrollViewPosition.value = { x: pageX, y: pageY };

        itemRef.current?.measure?.(
          (
            itemX: number,
            itemY: number,
            itemWidth: number,
            itemHeight: number,
            itemPageX: number,
            itemPageY: number
          ) => {
            itemPosition.value = { x: itemPageX, y: itemPageY };
          }
        );
      }
    );
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(id);
    }
  };

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          // When positions change but we're not actively moving,
          // we need to call updatePosition through runOnJS
          runOnJS(updatePosition)();
        }
      }
    },
    [moving, expandedSessionId]
  );

  // This reaction monitors changes to any position, not just this component's position
  useAnimatedReaction(
    () => {
      // Return a string representing all positions to detect any change
      return JSON.stringify(positions.value);
    },
    (currentPositions, previousPositions) => {
      if (currentPositions !== previousPositions && !moving) {
        // When any position changes and we're not actively moving this item,
        // update the position to reflect the new order
        runOnJS(updatePosition)();
      }
    },
    [moving, expandedSessionId]
  );

  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      // Only allow long press if no session is expanded
      if (expandedSessionId === null) {
        runOnJS(measurePositions)();
        runOnJS(setMoving)(true);

        if (Platform.OS === "ios") {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    });

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((event) => {
      // Only allow pan if no session is expanded
      if (expandedSessionId !== null) return;

      initialTouchOffset.value = {
        x: event.x,
        y: event.y,
      };
    })
    .onUpdate((event) => {
      if (!moving || expandedSessionId !== null) return;

      const relativeY =
        event.absoluteY -
        scrollViewPosition.value.y -
        initialTouchOffset.value.y +
        scrollY.value;

      // Direct assignment for dragging (no animation)
      top.value = relativeY;

      if (relativeY <= SCROLL_HEIGHT_THRESHOLD) {
        scrollY.value = withTiming(Math.max(0, scrollY.value - 200), {
          duration: 1000,
        });
      } else if (
        relativeY >=
        dimensions.height - SCROLL_HEIGHT_THRESHOLD - insets.bottom
      ) {
        const contentHeight = sessionCount * baseHeight;
        const containerHeight = dimensions.height - insets.top - insets.bottom;
        const maxScroll = Math.max(0, contentHeight - containerHeight);
        scrollY.value = withTiming(Math.min(maxScroll, scrollY.value + 200), {
          duration: 1000,
        });
      } else {
        cancelAnimation(scrollY);
      }

      const newPosition = clamp(
        Math.round(relativeY / baseHeight),
        0,
        sessionCount - 1
      );

      if (newPosition !== positions.value[id]) {
        // Update positions - this creates a new positions object
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition
        );

        // All items will need to update their positions due to this change
        if (Platform.OS === "ios") {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    })
    .onFinalize(() => {
      if (expandedSessionId === null) {
        // Update position after drag finishes
        runOnJS(updatePosition)();
        runOnJS(setMoving)(false);
      }
    });

  const combinedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const baseStyle: ViewStyle = {
      position: "absolute",
      left: 0,
      right: 0,
      top: top.value,
      zIndex: moving ? 1 : 0,
    };

    if (Platform.OS === "ios" && moving) {
      return {
        ...baseStyle,
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
      };
    } else if (Platform.OS === "android" && moving) {
      return {
        ...baseStyle,
        elevation: 5,
      };
    }

    return baseStyle;
  }, [moving]);

  // Generate mock exercises if none are provided
  const sessionExercises =
    exercises.length > 0
      ? exercises
      : Array.from({ length: numberOfExercises }, (_, i) => ({
          id: `exercise-${id}-${i}`,
          name: `Exercise ${i + 1}`,
          sets: 3,
          reps: 12,
        }));

  return (
    <Animated.View ref={itemRef} style={animatedStyle}>
      <GestureDetector gesture={combinedGesture}>
        <View style={{ maxWidth: "100%" }}>
          <View
            style={{
              backgroundColor: "transparent",
              borderRadius: 8,
            }}
          >
            <SessionItem
              name={name}
              numberOfExercises={numberOfExercises}
              weekNumber={weekNumber}
              image={image}
              isExpanded={isExpanded}
              onToggleExpand={handleToggleExpand}
              exercises={sessionExercises}
            />
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

export default MovableSession;
