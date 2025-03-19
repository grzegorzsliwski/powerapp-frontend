// Modified SessionList component
import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { Animated, SafeAreaView, View, PanResponder } from "react-native";
import { SessionItem } from "./SessionItem";
import { EmptySessionList } from "./EmptySessionList";
import { useSessionAnimation } from "../../hooks/useSessionAnimation";
import { SessionListProps, SessionListHandle } from "../../types/sessionTypes";

export const SessionList = forwardRef<SessionListHandle, SessionListProps>(
  (
    {
      isMultiWeek,
      currentWeek = 1,
      onAddSession,
      sessions = [],
      setSessions,
      onPress = () => {},
    },
    ref
  ) => {
    const filteredSessions = isMultiWeek
      ? sessions.filter((session) => session.weekNumber === currentWeek)
      : sessions;

    const { expandedIndex, animatedHeightsRef, collapseAllItems, toggleSize } =
      useSessionAnimation(filteredSessions);

    // Dragging state
    const [dragging, setDragging] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [itemLayouts, setItemLayouts] = useState<
      { y: number; height: number }[]
    >([]);
    const panY = useRef(new Animated.Value(0)).current;
    const pointY = useRef(0);

    // Reset when week changes
    useEffect(() => {
      collapseAllItems();
      setDraggingIndex(null);
      setDragging(false);
      setItemLayouts([]);
    }, [currentWeek]);

    useImperativeHandle(ref, () => ({
      collapseAllItems,
    }));

    const handleItemLayout = (index: number, event: any) => {
      const { y, height } = event.nativeEvent.layout;
      setItemLayouts((prev) => {
        const newLayouts = [...prev];
        newLayouts[index] = { y, height };
        return newLayouts;
      });
    };

    const handleLongPress = (index: number) => {
      // Collapse all items before starting drag
      collapseAllItems();
      setDraggingIndex(index);
      setDragging(true);
      panY.setValue(0);
    };

    const handleRelease = () => {
      setDragging(false);
      setDraggingIndex(null);
      panY.setValue(0);
    };

    // Create a pan responder for the entire list
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return dragging && Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: (_, gestureState) => {
        pointY.current = gestureState.y0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (draggingIndex !== null) {
          panY.setValue(gestureState.dy);

          // Find potential new position
          const currentPosition = itemLayouts[draggingIndex]?.y || 0;
          const draggedToPosition = currentPosition + gestureState.dy;

          // Check for intersection with other items
          for (let i = 0; i < filteredSessions.length; i++) {
            if (i !== draggingIndex && itemLayouts[i]) {
              const { y, height } = itemLayouts[i];
              const itemCenter = y + height / 2;

              // If the dragged item is in the middle of another item
              if (draggedToPosition > y && draggedToPosition < y + height) {
                // Move the item in the array
                if (setSessions) {
                  const newSessions = [...sessions];

                  // Map filtered indices to original array indices
                  const draggedSessionId = filteredSessions[draggingIndex].id;
                  const targetSessionId = filteredSessions[i].id;

                  const originalDraggingIndex = newSessions.findIndex(
                    (s) => s.id === draggedSessionId
                  );
                  const originalNewPosition = newSessions.findIndex(
                    (s) => s.id === targetSessionId
                  );

                  if (
                    originalDraggingIndex !== -1 &&
                    originalNewPosition !== -1
                  ) {
                    const itemToMove = newSessions[originalDraggingIndex];
                    newSessions.splice(originalDraggingIndex, 1);
                    newSessions.splice(originalNewPosition, 0, itemToMove);

                    setSessions(newSessions);
                    setDraggingIndex(i);
                    panY.setValue(0);
                    break;
                  }
                }
              }
            }
          }
        }
      },
      onPanResponderRelease: handleRelease,
      onPanResponderTerminate: handleRelease,
    });

    const deleteSession = (sessionId: string) => {
      if (setSessions) {
        setSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );
      }
    };

    return (
      <SafeAreaView
        className="flex-1 bg-transparent px-4 py-2"
        {...panResponder.panHandlers}
      >
        {filteredSessions.length === 0 ? (
          <EmptySessionList />
        ) : (
          <>
            {filteredSessions.map((session, index) => (
              <Animated.View
                key={session.id}
                style={{
                  transform: [
                    { translateY: draggingIndex === index ? panY : 0 },
                  ],
                  zIndex: draggingIndex === index ? 1 : 0,
                  elevation: draggingIndex === index ? 5 : 0,
                  shadowColor: draggingIndex === index ? "#000" : "transparent",
                  shadowOpacity: draggingIndex === index ? 0.3 : 0,
                  shadowRadius: draggingIndex === index ? 3 : 0,
                  shadowOffset: { width: 0, height: 2 },
                }}
                onLayout={(event) => handleItemLayout(index, event)}
              >
                <SessionItem
                  session={session}
                  index={index}
                  isExpanded={expandedIndex === index}
                  onToggle={toggleSize}
                  onPress={onPress}
                  onDelete={deleteSession}
                  onLongPress={() => handleLongPress(index)}
                  animatedHeight={
                    animatedHeightsRef.current[index] || new Animated.Value(50)
                  }
                  isDragging={draggingIndex === index && dragging}
                />
              </Animated.View>
            ))}
          </>
        )}
      </SafeAreaView>
    );
  }
);
export { SessionListHandle };
