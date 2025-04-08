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
  withSpring,
  withTiming,
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

// Enable layout animation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
}: MovableSessionProps & {
  expandedSessionId: string | null;
  setExpandedSessionId: (id: string | null) => void;
}): React.ReactElement {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [moving, setMoving] = useState<boolean>(false);
  const top = useSharedValue(0);

  const itemPosition = useSharedValue({ x: 0, y: 0 });
  const scrollViewPosition = useSharedValue({ x: 0, y: 0 });
  const initialTouchOffset = useSharedValue({ x: 0, y: 0 });

  const isExpanded = expandedSessionId === id;

  useEffect(() => {
    top.value = positions.value[id] * SESSION_HEIGHT;
  }, []);

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
          top.value = withSpring(currentPosition * SESSION_HEIGHT);
        }
      }
    },
    [moving]
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

      top.value = relativeY;

      if (relativeY <= SCROLL_HEIGHT_THRESHOLD) {
        scrollY.value = withTiming(Math.max(0, scrollY.value - 200), {
          duration: 1000,
        });
      } else if (
        relativeY >=
        dimensions.height - SCROLL_HEIGHT_THRESHOLD - insets.bottom
      ) {
        const contentHeight = sessionCount * SESSION_HEIGHT;
        const containerHeight = dimensions.height - insets.top - insets.bottom;
        const maxScroll = Math.max(0, contentHeight - containerHeight);
        scrollY.value = withTiming(Math.min(maxScroll, scrollY.value + 200), {
          duration: 1000,
        });
      } else {
        cancelAnimation(scrollY);
      }

      const newPosition = clamp(
        Math.round(relativeY / SESSION_HEIGHT),
        0,
        sessionCount - 1
      );

      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition
        );

        if (Platform.OS === "ios") {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    })
    .onFinalize(() => {
      if (expandedSessionId === null) {
        top.value = withSpring(positions.value[id] * SESSION_HEIGHT);
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
            />
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

export default MovableSession;
