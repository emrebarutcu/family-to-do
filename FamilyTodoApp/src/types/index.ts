export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'parent' | 'child';
  avatar_url?: string;
  points?: number;
  family_id: string;
  joined_at: Date;
}

export interface Family {
  id: string;
  family_name: string;
  invite_code: string;
  created_by: string;
  created_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'chore' | 'homework' | 'other';
  assigned_to: string;
  assigned_by: string;
  due_date: Date;
  points: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  created_at: Date;
  completed_at?: Date;
  approved_at?: Date;
  rejected_reason?: string;
}

export interface Reward {
  id: string;
  title: string;
  points_required: number;
  created_by: string;
  created_at: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, surname: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AppContextType {
  family: Family | null;
  familyMembers: User[];
  tasks: Task[];
  rewards: Reward[];
  isLoading: boolean;
  createFamily: (familyName: string) => Promise<void>;
  addChildToFamily: (childData: Partial<User>) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status'], rejectedReason?: string) => Promise<void>;
  markTaskCompleted: (taskId: string) => Promise<void>;
  createReward: (rewardData: Partial<Reward>) => Promise<void>;
  refreshData: () => Promise<void>;
}

export interface NavigationParamList {
  Auth: undefined;
  ParentTabs: undefined;
  ChildTabs: undefined;
  CreateFamily: undefined;
  AddChild: undefined;
  CreateTask: undefined;
  TaskDetails: { taskId: string };
  Profile: undefined;
  Settings: undefined;
}

export interface CreateTaskFormData {
  title: string;
  description: string;
  type: Task['type'];
  assigned_to: string;
  due_date: Date;
  points: number;
}

export interface AddChildFormData {
  name: string;
  surname: string;
  email?: string;
}

export interface CreateFamilyFormData {
  family_name: string;
}