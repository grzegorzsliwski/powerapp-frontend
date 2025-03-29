import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { scrollTo, useAnimatedReaction } from "react-native-reanimated";
import { listToObject } from "../utils/arrayUtils";

interface ListItem {
  id: string;
}

interface UseSortableListReturn {
  positions: ReturnType<typeof useSharedValue<Record<string, number>>>;
  scrollY: ReturnType<typeof useSharedValue<number>>;
  scrollViewRef: ReturnType<typeof useAnimatedRef>;
  handleScroll: ReturnType<
    typeof useAnimatedScrollHandler<Record<string, unknown>>
  >;
}

export default function useSortableList(
  items: ListItem[]
): UseSortableListReturn {
  const positions = useSharedValue<Record<string, number>>(listToObject(items));
  const scrollY = useSharedValue<number>(0);
  const scrollViewRef = useAnimatedRef<any>();

  // Sync scrollY with ScrollView
  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );

  const handleScroll = useAnimatedScrollHandler<Record<string, unknown>>(
    (event) => {
      if (typeof event.contentOffset?.y === "number") {
        scrollY.value = event.contentOffset.y;
      }
    }
  );

  return {
    positions,
    scrollY,
    scrollViewRef,
    handleScroll,
  };
}
