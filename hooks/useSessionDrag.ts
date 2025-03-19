import { useState, useRef, useEffect } from "react";
import { PanResponder, Animated, LayoutChangeEvent } from "react-native";
import { Session } from "../types/sessionTypes";

export const useSessionDrag = (
  sessions: Session[],
  filteredSessions: Session[],
  currentWeek: number | null | undefined,
  isMultiWeek?: boolean,
  setSessions?: React.Dispatch<React.SetStateAction<Session[]>>
) => {
  const [dragging, setDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [itemLayouts, setItemLayouts] = useState<
    { y: number; height: number }[]
  >([]);

  const panY = useRef(new Animated.Value(0)).current;
  const dragPositionRef = useRef(0);
  const draggedItemHeight = useRef(0);

  // Reset layouts when the filtered sessions change
  useEffect(() => {
    setItemLayouts([]);
  }, [filteredSessions.length]);

  const handleItemLayout = (index: number, event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    setItemLayouts((prevLayouts) => {
      const newLayouts = [...prevLayouts];
      newLayouts[index] = { y, height };
      return newLayouts;
    });
  };

  const handleLongPress = (index: number) => {
    if (index >= 0 && index < filteredSessions.length) {
      setDraggingIndex(index);
      panY.setValue(0);
      setDragging(true);

      // Set initial drag position
      if (itemLayouts[index]) {
        dragPositionRef.current = itemLayouts[index].y;
        draggedItemHeight.current = itemLayouts[index].height;
      }
    }
  };

  const moveItemsIfNeeded = () => {
    if (draggingIndex === null || !setSessions) return;

    const draggedItemPosition = dragPositionRef.current;
    let newPosition = draggingIndex;
    let found = false;

    // Check if we need to move the dragged item
    for (let i = 0; i < itemLayouts.length; i++) {
      if (i !== draggingIndex && itemLayouts[i]) {
        const { y, height } = itemLayouts[i];
        const itemCenter = y + height / 2;

        if (
          draggedItemPosition > y &&
          draggedItemPosition < y + height &&
          Math.abs(draggedItemPosition - itemCenter) < height / 2
        ) {
          newPosition = i;
          found = true;
          break;
        }
      }
    }

    if (found && newPosition !== draggingIndex) {
      // Map the filtered indices to the original array indices
      const sessionIdsInFilteredOrder = filteredSessions.map(
        (session) => session.id
      );

      const draggedSessionId = filteredSessions[draggingIndex].id;
      const targetSessionId = filteredSessions[newPosition].id;

      const originalDraggingIndex = sessions.findIndex(
        (s) => s.id === draggedSessionId
      );
      const originalNewPosition = sessions.findIndex(
        (s) => s.id === targetSessionId
      );

      if (originalDraggingIndex !== -1 && originalNewPosition !== -1) {
        // Create a new array and move the item
        const newSessions = [...sessions];
        const itemToMove = newSessions[originalDraggingIndex];

        newSessions.splice(originalDraggingIndex, 1);
        newSessions.splice(originalNewPosition, 0, itemToMove);

        setSessions(newSessions);
        setDraggingIndex(newPosition);

        // Update the drag position ref after moving
        if (itemLayouts[newPosition]) {
          dragPositionRef.current = itemLayouts[newPosition].y;
        }
      }
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => dragging,
    onPanResponderGrant: () => {
      // Already handled in handleLongPress
    },
    onPanResponderMove: (_, gestureState) => {
      if (draggingIndex !== null) {
        panY.setValue(gestureState.dy);
        dragPositionRef.current += gestureState.dy;
        moveItemsIfNeeded();
      }
    },
    onPanResponderRelease: () => {
      setDragging(false);
      panY.setValue(0);
      setDraggingIndex(null);
    },
    onPanResponderTerminate: () => {
      setDragging(false);
      panY.setValue(0);
      setDraggingIndex(null);
    },
  });

  return {
    dragging,
    draggingIndex,
    panY,
    panResponder,
    handleItemLayout,
    handleLongPress,
  };
};
