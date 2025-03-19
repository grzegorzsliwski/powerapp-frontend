import { useRef, useState, useEffect } from "react";
import { Animated } from "react-native";
import { Session } from "../types/sessionTypes";

export const useSessionAnimation = (filteredSessions: Session[]) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const animatedHeightsRef = useRef<Animated.Value[]>([]);
  const prevSessionsLengthRef = useRef<number>(filteredSessions.length);

  useEffect(() => {
    if (animatedHeightsRef.current.length !== filteredSessions.length) {
      animatedHeightsRef.current = filteredSessions.map(
        () => new Animated.Value(50)
      );
    }
  }, [filteredSessions.length]);

  useEffect(() => {
    if (
      prevSessionsLengthRef.current !== filteredSessions.length &&
      prevSessionsLengthRef.current !== 0
    ) {
      collapseAllItems();
    }

    prevSessionsLengthRef.current = filteredSessions.length;
  }, [filteredSessions.length]);

  const collapseAllItems = () => {
    setExpandedIndex(null);

    filteredSessions.forEach((_, i) => {
      if (animatedHeightsRef.current[i]) {
        Animated.spring(animatedHeightsRef.current[i], {
          toValue: 50,
          tension: 100,
          friction: 12,
          useNativeDriver: false,
        }).start();
      }
    });
  };

  const toggleSize = (index: number) => {
    if (
      animatedHeightsRef.current.length === 0 ||
      !animatedHeightsRef.current[index]
    ) {
      return;
    }

    const newExpandedIndex = expandedIndex === index ? null : index;
    setExpandedIndex(newExpandedIndex);

    filteredSessions.forEach((_, i) => {
      if (animatedHeightsRef.current[i]) {
        const targetHeight = newExpandedIndex === i ? 100 : 50;
        Animated.spring(animatedHeightsRef.current[i], {
          toValue: targetHeight,
          tension: 100,
          friction: 12,
          useNativeDriver: false,
        }).start();
      }
    });
  };

  return {
    expandedIndex,
    animatedHeightsRef,
    collapseAllItems,
    toggleSize,
  };
};
