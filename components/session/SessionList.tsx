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

    // Animation values for each item position
    const itemPositions = useRef<Animated.Value[]>([]);

    // Keep track of original positions
    const originalPositions = useRef<number[]>([]);

    // Add debounce mechanism for position changes
    const lastSwapTime = useRef(0);
    const activeSwap = useRef(false);

    // Store actual order of items in the list
    const currentOrder = useRef<number[]>([]);

    // Track the ID of the session being dragged to maintain consistent reference
    const draggingSessionId = useRef<string | null>(null);

    // Update animation refs when sessions change
    useEffect(() => {
      // Initialize or update animation values for each item
      if (filteredSessions.length !== itemPositions.current.length) {
        itemPositions.current = filteredSessions.map(
          (_, i) => itemPositions.current[i] || new Animated.Value(0)
        );

        // Reset original positions when sessions change
        originalPositions.current = filteredSessions.map((_, i) => i);

        // Initialize current order
        currentOrder.current = filteredSessions.map((_, i) => i);
      }
    }, [filteredSessions]);

    // Reset when week changes
    useEffect(() => {
      collapseAllItems();
      setDraggingIndex(null);
      setDragging(false);
      setItemLayouts([]);
      draggingSessionId.current = null;

      // Reset all position animations
      itemPositions.current.forEach((pos) => pos.setValue(0));
      originalPositions.current = filteredSessions.map((_, i) => i);
      currentOrder.current = filteredSessions.map((_, i) => i);
      activeSwap.current = false;
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

      // Store original positions after layout
      if (originalPositions.current[index] === undefined) {
        originalPositions.current[index] = y;
      }
    };

    const handleLongPress = (index: number) => {
      // Collapse all items before starting drag
      collapseAllItems();
      setDraggingIndex(index);
      setDragging(true);
      panY.setValue(0);
      // Store the ID of the session being dragged
      draggingSessionId.current = filteredSessions[index].id;
    };

    // Reset positions of all items
    const resetItemPositions = () => {
      itemPositions.current.forEach((position) => {
        Animated.spring(position, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    };

    const handleRelease = () => {
      if (draggingIndex !== null) {
        // First reset the drag position
        Animated.spring(panY, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start(() => {
          // Reset all item positions visually
          resetItemPositions();

          // Now update the sessions array if needed
          if (setSessions) {
            const newSessions = [...sessions];
            const draggedSessionId = filteredSessions[draggingIndex].id;

            // Find the original index of the dragged session in the full sessions array
            const originalDraggingIndex = newSessions.findIndex(
              (s) => s.id === draggedSessionId
            );

            // Determine the new target position for this session
            // This gets the new position from our currentOrder tracking array
            let newPositionInFilteredList = -1;
            for (let i = 0; i < currentOrder.current.length; i++) {
              if (currentOrder.current[i] === draggingIndex) {
                newPositionInFilteredList = i;
                break;
              }
            }

            if (
              originalDraggingIndex !== -1 &&
              newPositionInFilteredList !== -1
            ) {
              // Calculate the actual position in the full sessions array
              // First, find all the sessions that belong to the current week
              const sessionsInCurrentWeek = isMultiWeek
                ? newSessions.filter((s) => s.weekNumber === currentWeek)
                : newSessions;

              // Find the session that should be at the new position
              const targetSessionId =
                sessionsInCurrentWeek[newPositionInFilteredList]?.id;

              // Find the index of that session in the full array
              const targetIndex = targetSessionId
                ? newSessions.findIndex((s) => s.id === targetSessionId)
                : originalDraggingIndex;

              // Move the session
              const itemToMove = newSessions[originalDraggingIndex];
              newSessions.splice(originalDraggingIndex, 1);

              // If the original position was before the target, we need to adjust
              const adjustedTargetIndex =
                originalDraggingIndex < targetIndex
                  ? targetIndex - 1
                  : targetIndex;

              newSessions.splice(adjustedTargetIndex, 0, itemToMove);

              // Update sessions
              setSessions(newSessions);
            }
          }

          // Reset state
          setDragging(false);
          setDraggingIndex(null);
          panY.setValue(0);
          activeSwap.current = false;
          draggingSessionId.current = null;
        });
      }
    };

    // Update logical order without changing visual dragging position
    const updateInternalOrder = (fromIndex: number, toIndex: number) => {
      const now = Date.now();
      if (!activeSwap.current && now - lastSwapTime.current > 300) {
        activeSwap.current = true;

        // Update the currentOrder array to reflect the new item order
        const newOrder = [...currentOrder.current];
        const movingItem = newOrder[fromIndex];

        // Remove the item from its current position
        newOrder.splice(fromIndex, 1);

        // Insert it at the new position
        newOrder.splice(toIndex, 0, movingItem);

        // Update the ref
        currentOrder.current = newOrder;

        // Animate items that need to move
        for (let j = 0; j < filteredSessions.length; j++) {
          if (j !== fromIndex) {
            const movingDown = fromIndex < toIndex;
            const targetHeight = itemLayouts[j]?.height || 0;
            const targetY = movingDown ? -targetHeight : targetHeight;
            if (
              (movingDown && j > fromIndex && j <= toIndex) ||
              (!movingDown && j < fromIndex && j >= toIndex)
            ) {
              Animated.spring(itemPositions.current[j], {
                toValue: targetY,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
              }).start();
            } else {
              Animated.spring(itemPositions.current[j], {
                toValue: 0,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
              }).start();
            }
          }
        }

        lastSwapTime.current = now;
        setTimeout(() => {
          activeSwap.current = false;
        }, 250);
      }
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

          // Only process if we're not in the middle of a swap
          if (!activeSwap.current) {
            // Find potential new position
            const currentPosition = itemLayouts[draggingIndex]?.y || 0;
            const draggedToPosition = currentPosition + gestureState.dy;

            // Minimum movement threshold before considering a swap
            const SWAP_THRESHOLD = 10;

            // Check for intersection with other items
            for (let i = 0; i < filteredSessions.length; i++) {
              if (i !== draggingIndex && itemLayouts[i]) {
                const { y, height } = itemLayouts[i];
                const itemCenter = y + height / 2;

                // If the dragged item has moved significantly into another item's space
                const isMovingDown = draggingIndex < i;
                const isMovingUp = draggingIndex > i;

                const hasPassedThreshold = isMovingDown
                  ? draggedToPosition > y + SWAP_THRESHOLD
                  : draggedToPosition < y + height - SWAP_THRESHOLD;

                if (
                  ((isMovingDown && draggedToPosition > itemCenter) ||
                    (isMovingUp && draggedToPosition < itemCenter)) &&
                  hasPassedThreshold
                ) {
                  // Use update function that doesn't change visual dragging position
                  updateInternalOrder(draggingIndex, i);
                  break;
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

    // Return the current index of the dragged session, no matter where it has moved in the list
    const getCurrentDraggingIndex = () => {
      if (!draggingSessionId.current) return null;

      const currentIndex = filteredSessions.findIndex(
        (session) => session.id === draggingSessionId.current
      );

      return currentIndex >= 0 ? currentIndex : null;
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
            {filteredSessions.map((session, index) => {
              // Check if this is the dragged item by ID rather than index
              const isDragging =
                dragging && draggingSessionId.current === session.id;

              return (
                <Animated.View
                  key={session.id}
                  style={[
                    {
                      transform: [
                        {
                          translateY: isDragging
                            ? panY
                            : itemPositions.current[index] ||
                              new Animated.Value(0),
                        },
                      ],
                      zIndex: isDragging ? 10 : 1,
                      elevation: isDragging ? 5 : 0,
                      shadowColor: isDragging ? "#000" : "transparent",
                      shadowOpacity: isDragging ? 0.3 : 0,
                      shadowRadius: isDragging ? 3 : 0,
                      shadowOffset: { width: 0, height: 2 },
                    },
                  ]}
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
                      animatedHeightsRef.current[index] ||
                      new Animated.Value(50)
                    }
                    isDragging={isDragging}
                  />
                </Animated.View>
              );
            })}
          </>
        )}
      </SafeAreaView>
    );
  }
);
export { SessionListHandle };
