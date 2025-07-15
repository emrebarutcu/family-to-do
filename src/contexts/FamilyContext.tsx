import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FamilyContextType, Family, User, Task, Reward } from '../types';
import { familyService, taskService, rewardService } from '../services/firebase';
import { useAuth } from './AuthContext';

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const useFamily = (): FamilyContextType => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

interface FamilyProviderProps {
  children: ReactNode;
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.familyId) {
      loadFamilyData();
    }
  }, [user?.familyId]);

  const loadFamilyData = async () => {
    if (!user?.familyId) return;
    
    setIsLoading(true);
    try {
      const [familyData, membersData, tasksData, rewardsData] = await Promise.all([
        familyService.getFamily(user.familyId),
        familyService.getMembers(user.familyId),
        taskService.getTasks(user.familyId),
        rewardService.getRewards(user.familyId),
      ]);

      setFamily(familyData);
      setMembers(membersData);
      setTasks(tasksData);
      setRewards(rewardsData);
    } catch (error) {
      console.error('Error loading family data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    try {
      if (!user?.familyId) throw new Error('No family found');
      
      await taskService.createTask(user.familyId, taskData);
      await loadFamilyData(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status'], rejectedReason?: string) => {
    try {
      if (!user?.familyId) throw new Error('No family found');
      
      await taskService.updateTaskStatus(user.familyId, taskId, status, rejectedReason);
      await loadFamilyData(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  const createReward = async (rewardData: Omit<Reward, 'id' | 'createdAt'>) => {
    try {
      if (!user?.familyId) throw new Error('No family found');
      
      await rewardService.createReward(user.familyId, rewardData);
      await loadFamilyData(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  const refreshData = async () => {
    await loadFamilyData();
  };

  const value: FamilyContextType = {
    family,
    members,
    tasks,
    rewards,
    isLoading,
    createTask,
    updateTaskStatus,
    createReward,
    refreshData,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};