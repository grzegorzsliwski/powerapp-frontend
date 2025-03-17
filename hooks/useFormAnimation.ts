import { useRef } from "react";
import { Animated } from "react-native";

export const useFormAnimation = (isMultiWeek: boolean) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const formHeight = isMultiWeek ? 270 : 170;

  const formAnimation = scrollY.interpolate({
    inputRange: [0, formHeight],
    outputRange: [formHeight, 0],
    extrapolate: "clamp",
  });

  const formOpacity = scrollY.interpolate({
    inputRange: [0, formHeight / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return {
    formAnimation,
    formOpacity,
    handleScroll,
    formHeight,
  };
};
