
export enum SessionRole {
  LEARNER = "LEARNER",
  COACH = "COACH",
  SYSTEM = "SYSTEM",
}

// Stored in session storage to keep track of their sessions
export type Session = {
  sessionId: string;
  role: SessionRole;
};

