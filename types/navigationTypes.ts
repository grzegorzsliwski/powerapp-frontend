import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  exercises: {
    screen: "exercise/exercise-details";
    params: { id: string };
  };
  "exercise/exercise-details": { id: string };
};

export type ExerciseDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  "exercise/exercise-details"
>;
