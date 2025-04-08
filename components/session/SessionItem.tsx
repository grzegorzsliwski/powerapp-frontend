import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SessionProps } from "../../types/sessionTypes";
import { SESSION_HEIGHT } from "../../constants/sessionConstants";

// Height per exercise when expanded
const EXERCISE_HEIGHT = 50;

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
}

export const SessionItem = ({
  name,
  numberOfExercises,
  weekNumber,
  image,
  isExpanded,
  onToggleExpand,
  exercises = [],
}: SessionProps & {
  isExpanded: boolean;
  onToggleExpand: () => void;
  exercises?: Exercise[];
}) => {
  // Calculate the height based on base height + (number of exercises × exercise height)
  const baseHeight = SESSION_HEIGHT;
  const expandedContentHeight = numberOfExercises * EXERCISE_HEIGHT;

  const height = useSharedValue(baseHeight);

  useEffect(() => {
    height.value = withTiming(
      isExpanded ? baseHeight + expandedContentHeight : baseHeight,
      {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }
    );
  }, [isExpanded, numberOfExercises]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={onToggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.headerRow}>
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/exerciseimg.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.titleText}>{name}</Text>
            <Text style={styles.subtitleText}>
              {`${numberOfExercises} exercises`}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton} onPress={() => {}}>
            <Image
              source={require("@/assets/icons/more.png")}
              style={styles.moreIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.weekText}>Week {weekNumber}</Text>
            {exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                {exercise.sets && exercise.reps && (
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    borderRadius: 16,
    overflow: "hidden",
    margin: 8,
  },
  mainContent: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    height: SESSION_HEIGHT - 24, // Account for padding
  },
  imageContainer: {
    backgroundColor: "#222230",
    padding: 8,
    borderRadius: 12,
  },
  image: {
    width: 56,
    height: 56,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  titleText: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitleText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#9999AA",
  },
  moreButton: {
    padding: 8,
    borderRadius: 12,
  },
  moreIcon: {
    width: 24,
    height: 24,
  },
  expandedContent: {
    backgroundColor: "#222230",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  weekText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#9999AA",
    marginBottom: 12,
  },
  exerciseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333340",
  },
  exerciseName: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
  exerciseDetails: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#9999AA",
    marginTop: 4,
  },
});
