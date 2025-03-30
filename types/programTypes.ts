export interface ProgramFormData {
  programName: string;
  programLength: number | null;
}

export interface Program {
  id: string;
  sessions: Session[];
  name: string;
  length: number;
  description: string;
  isMultiWeek: boolean;
  isRepeated: boolean;
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
