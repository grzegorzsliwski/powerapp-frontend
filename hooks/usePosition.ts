import {
  useAnimatedRef,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Animated, { scrollTo } from "react-native-reanimated";
import { Positions, Session } from "../types/sessionTypes";
import { listToObject } from "../utils/arrayUtils";

export function usePositions(session: Session[]) {
  const positions = useSharedValue<Positions>(listToObject(session));
  const scrollY = useSharedValue<number>(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return {
    positions,
    scrollY,
    scrollViewRef,
    handleScroll,
  };
}
