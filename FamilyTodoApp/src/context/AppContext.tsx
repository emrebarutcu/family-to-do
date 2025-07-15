import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { familyService, taskService, rewardService } from '../services/firebase';
import { Family, User, Task, Reward, AppContextType, AddChildFormData } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [familyMembers, setFamilyMembers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load family data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.family_id) {
      loadFamilyData();
    } else {
      // Reset state when user is not authenticated
      setFamily(null);
      setFamilyMembers([]);
      setTasks([]);
      setRewards([]);
    }
  }, [isAuthenticated, user]);

  const loadFamilyData = async () => {
    if (!user?.family_id) return;
    
    try {
      setIsLoading(true);
      const [familyData, members, tasksData, rewardsData] = await Promise.all([
        familyService.getFamily(user.family_id),
        familyService.getFamilyMembers(user.family_id),
        taskService.getTasks(user.family_id),
        rewardService.getRewards(user.family_id)
      ]);
      
      setFamily(familyData);
      setFamilyMembers(members);
      setTasks(tasksData);
      setRewards(rewardsData);
    } catch (error) {
      console.error('Error loading family data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFamily = async (familyName: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setIsLoading(true);
      const newFamily = await familyService.createFamily(familyName, user.id);
      setFamily(newFamily);
      
      // Refresh family members after creating family
      const members = await familyService.getFamilyMembers(newFamily.id);
      setFamilyMembers(members);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addChildToFamily = async (childData: AddChildFormData): Promise<void> => {
    if (!family) throw new Error('No family found');
    
    try {
      setIsLoading(true);
      await familyService.addChildToFamily(family.id, childData);
      
      // Refresh family members
      const members = await familyService.getFamilyMembers(family.id);
      setFamilyMembers(members);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>): Promise<void> => {
    if (!family || !user) throw new Error('No family or user found');
    
    try {
      setIsLoading(true);
      const taskWithAssignedBy = {
        ...taskData,
        assigned_by: user.id
      };
      
      await taskService.createTask(family.id, taskWithAssignedBy);
      
      // Refresh tasks
      const updatedTasks = await taskService.getTasks(family.id);
      setTasks(updatedTasks);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status'], rejectedReason?: string): Promise<void> => {
    if (!family) throw new Error('No family found');
    
    try {
      setIsLoading(true);
      await taskService.updateTaskStatus(family.id, taskId, status, rejectedReason);
      
      // Refresh tasks and members (for points update)
      const [updatedTasks, updatedMembers] = await Promise.all([
        taskService.getTasks(family.id),
        familyService.getFamilyMembers(family.id)
      ]);
      
      setTasks(updatedTasks);
      setFamilyMembers(updatedMembers);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const markTaskCompleted = async (taskId: string): Promise<void> => {
    if (!family) throw new Error('No family found');
    
    try {
      setIsLoading(true);
      await taskService.markTaskCompleted(family.id, taskId);
      
      // Refresh tasks
      const updatedTasks = await taskService.getTasks(family.id);
      setTasks(updatedTasks);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createReward = async (rewardData: Partial<Reward>): Promise<void> => {
    if (!family || !user) throw new Error('No family or user found');
    
    try {
      setIsLoading(true);
      const rewardWithCreatedBy = {
        ...rewardData,
        created_by: user.id
      };
      
      await rewardService.createReward(family.id, rewardWithCreatedBy);
      
      // Refresh rewards
      const updatedRewards = await rewardService.getRewards(family.id);
      setRewards(updatedRewards);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async (): Promise<void> => {
    if (user?.family_id) {
      await loadFamilyData();
    }
  };

  const value: AppContextType = {
    family,
    familyMembers,
    tasks,
    rewards,
    isLoading,
    createFamily,
    addChildToFamily,
    createTask,
    updateTaskStatus,
    markTaskCompleted,
    createReward,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};