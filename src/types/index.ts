export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: 'parent' | 'child';
  points: number;
  avatarUrl?: string;
  joinedAt: Date;
  familyId: string;
}

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'chore' | 'homework' | 'other';
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  points: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
  completedAt?: Date;
  approvedAt?: Date;
  rejectedReason?: string;
}

export interface Reward {
  id: string;
  title: string;
  pointsRequired: number;
  createdBy: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, surname: string) => Promise<void>;
  signOut: () => Promise<void>;
  createFamily: (familyName: string) => Promise<void>;
  addChild: (name: string, surname: string, email?: string) => Promise<void>;
}

export interface FamilyContextType {
  family: Family | null;
  members: User[];
  tasks: Task[];
  rewards: Reward[];
  isLoading: boolean;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status'], rejectedReason?: string) => Promise<void>;
  createReward: (reward: Omit<Reward, 'id' | 'createdAt'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CreateFamily: undefined;
  AddChild: undefined;
  CreateTask: undefined;
  TaskDetail: { taskId: string };
  CreateReward: undefined;
};

export type ParentTabParamList = {
  Home: undefined;
  AddTask: undefined;
  Rewards: undefined;
  Settings: undefined;
};

export type ChildTabParamList = {
  MyTasks: undefined;
  Points: undefined;
  Settings: undefined;
};