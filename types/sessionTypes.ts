import { Animated, GestureResponderEvent } from "react-native";

export type Session = {
  id: string;
  name: string;
  numberOfExercises: number;
  weekNumber: number;
};

export type SessionListProps = {
  sessions: Session[];
  setSessions?: React.Dispatch<React.SetStateAction<Session[]>>;
  currentWeek?: number | null;
  isMultiWeek?: boolean;
  onAddSession?: () => void;
  onPress?: (sessionId: string) => void;
};

export type SessionItemProps = {
  session: Session;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
  onPress: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  animatedHeight: Animated.Value;
  isDragging: boolean;
  panHandlers?: any;
  panY?: Animated.Value;
};

export type SessionListHandle = {
  collapseAllItems: () => void;
};
