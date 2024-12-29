import { View, Text, FlatList } from "react-native";
import React from "react";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface Session {
  id: number;
  sessionName: string;
  exercises: Exercise[];
}

interface TodaysSessionProps {
  sessions: Session[];
}

const TodaysSession: React.FC<TodaysSessionProps> = ({ sessions }) => {
  return (
    <FlatList
      horizontal
      data={sessions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="p-4">
          <Text className="text-3xl text-white">{item.sessionName}</Text>
          {item.exercises.map((exercise, index) => (
            <Text key={index} className="text-lg text-gray-300">
              {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
            </Text>
          ))}
        </View>
      )}
    />
  );
};

export default TodaysSession;
