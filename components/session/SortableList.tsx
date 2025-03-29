import React from "react";
import { View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

interface ListItem {
  id: string;
}

interface ListState {
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  handleScroll: (event: any) => void;
}

interface SortableListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  listState: ListState;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  itemHeight: number;
}

function SortableList<T extends ListItem>({
  data,
  renderItem,
  listState,
  containerStyle,
  contentContainerStyle,
  itemHeight,
}: SortableListProps<T>) {
  const { scrollViewRef, handleScroll } = listState;

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: "white",
        ...containerStyle,
      }}
      contentContainerStyle={{
        height: data.length * itemHeight,
        ...contentContainerStyle,
      }}
    >
      {data.map((item) => renderItem(item))}
    </Animated.ScrollView>
  );
}

export default SortableList;
