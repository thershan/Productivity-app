
export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  focusLevel: number;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  tasks: Task[];
  journal: string;
  aiReflection: string;
}

export enum View {
  Daily = 'daily',
  Scoreboard = 'scoreboard',
  Insights = 'insights',
}
