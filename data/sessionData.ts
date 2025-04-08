import { SESSION_IMAGES } from "../constants/sessionConstants";
import { Session } from "../types/sessionTypes";
import { Exercise } from "@/types/programTypes";

export const SESSIONS: Session[] = [
  {
    id: "session-1",
    name: "Session 1",
    numberOfExercises: 2,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
    exercises: [
      {
        id: "exercise-1",
        name: "Exercise 1",
        sets: 3,
        reps: 10,
      },
      {
        id: "exercise-2",
        name: "Exercise 2",
        sets: 3,
        reps: 12,
      },
    ],
  },
  {
    id: "session-2",
    name: "Session 2",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-3",
    name: "Session 3",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-4",
    name: "Session 4",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-5",
    name: "Session 5",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-6",
    name: "Session 6",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-7",
    name: "Session 7",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-8",
    name: "Session 8",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-9",
    name: "Session 9",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
  {
    id: "session-10",
    name: "Session 10",
    numberOfExercises: 0,
    weekNumber: 1,
    image: SESSION_IMAGES.SESSION,
  },
];
