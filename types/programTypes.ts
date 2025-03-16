export interface ProgramFormData {
  programName: string;
  numberOfWeeks: string;
}

export interface Program {
  id: string;
  name: string;
  weeks: number;
  sessions: Session[];
}

export interface Session {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}
