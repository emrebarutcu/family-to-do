import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, Family, Task, Reward } from '../types';

// Authentication Services
export const authService = {
  async register(email: string, password: string, name: string, surname: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email,
        name,
        surname,
        role: 'parent',
        family_id: '', // Will be set when family is created
        joined_at: new Date(),
        points: 0
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      return {
        id: firebaseUser.uid,
        ...userData
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error}`);
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      const userData = userDoc.data() as Omit<User, 'id'>;
      return {
        id: firebaseUser.uid,
        ...userData
      };
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Logout failed: ${error}`);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) return null;
      
      const userData = userDoc.data() as Omit<User, 'id'>;
      return {
        id: firebaseUser.uid,
        ...userData
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};

// Family Services
export const familyService = {
  async createFamily(familyName: string, userId: string): Promise<Family> {
    try {
      const inviteCode = Math.random().toString(36).substring(2, 10);
      
      const familyData: Omit<Family, 'id'> = {
        family_name: familyName,
        invite_code: inviteCode,
        created_by: userId,
        created_at: new Date()
      };
      
      const familyRef = await addDoc(collection(db, 'families'), familyData);
      
      // Update user's family_id
      await updateDoc(doc(db, 'users', userId), {
        family_id: familyRef.id
      });
      
      // Add user to family members
      await setDoc(doc(db, 'families', familyRef.id, 'members', userId), {
        name: '',
        surname: '',
        email: '',
        role: 'parent',
        points: 0,
        joined_at: new Date()
      });
      
      return {
        id: familyRef.id,
        ...familyData
      };
    } catch (error) {
      throw new Error(`Failed to create family: ${error}`);
    }
  },

  async getFamily(familyId: string): Promise<Family | null> {
    try {
      const familyDoc = await getDoc(doc(db, 'families', familyId));
      if (!familyDoc.exists()) return null;
      
      const familyData = familyDoc.data() as Omit<Family, 'id'>;
      return {
        id: familyDoc.id,
        ...familyData
      };
    } catch (error) {
      console.error('Error getting family:', error);
      return null;
    }
  },

  async getFamilyMembers(familyId: string): Promise<User[]> {
    try {
      const membersQuery = query(
        collection(db, 'families', familyId, 'members'),
        orderBy('joined_at', 'asc')
      );
      
      const snapshot = await getDocs(membersQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting family members:', error);
      return [];
    }
  },

  async addChildToFamily(familyId: string, childData: { name: string; surname: string; email: string; password: string }): Promise<void> {
    try {
      // Create Firebase Auth user for the child
      const userCredential = await createUserWithEmailAndPassword(auth, childData.email, childData.password);
      const firebaseUser = userCredential.user;
      
      // Create user document in the main users collection
      const childUserData: Omit<User, 'id'> = {
        name: childData.name,
        surname: childData.surname,
        email: childData.email,
        role: 'child',
        family_id: familyId,
        points: 0,
        joined_at: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), childUserData);
      
      // Also add the child to the family members subcollection for easier querying
      await setDoc(doc(db, 'families', familyId, 'members', firebaseUser.uid), {
        ...childUserData,
        id: firebaseUser.uid
      });
    } catch (error) {
      throw new Error(`Failed to add child to family: ${error}`);
    }
  }
};

// Task Services
export const taskService = {
  async createTask(familyId: string, taskData: Partial<Task>): Promise<void> {
    try {
      const newTask: Omit<Task, 'id'> = {
        title: taskData.title || '',
        description: taskData.description || '',
        type: taskData.type || 'chore',
        assigned_to: taskData.assigned_to || '',
        assigned_by: taskData.assigned_by || '',
        due_date: taskData.due_date || new Date(),
        points: taskData.points || 0,
        status: 'pending',
        created_at: new Date()
      };
      
      await addDoc(collection(db, 'families', familyId, 'tasks'), newTask);
    } catch (error) {
      throw new Error(`Failed to create task: ${error}`);
    }
  },

  async getTasks(familyId: string): Promise<Task[]> {
    try {
      const tasksQuery = query(
        collection(db, 'families', familyId, 'tasks'),
        orderBy('created_at', 'desc')
      );
      
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  async getTasksForChild(familyId: string, childId: string): Promise<Task[]> {
    try {
      const tasksQuery = query(
        collection(db, 'families', familyId, 'tasks'),
        where('assigned_to', '==', childId),
        orderBy('created_at', 'desc')
      );
      
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
    } catch (error) {
      console.error('Error getting tasks for child:', error);
      return [];
    }
  },

  async updateTaskStatus(familyId: string, taskId: string, status: Task['status'], rejectedReason?: string): Promise<void> {
    try {
      const updateData: any = {
        status,
        ...(status === 'approved' && { approved_at: new Date() }),
        ...(status === 'rejected' && { rejected_reason: rejectedReason })
      };
      
      await updateDoc(doc(db, 'families', familyId, 'tasks', taskId), updateData);
      
      // If task is approved, update child's points
      if (status === 'approved') {
        const taskDoc = await getDoc(doc(db, 'families', familyId, 'tasks', taskId));
        if (taskDoc.exists()) {
          const task = taskDoc.data() as Task;
          const childRef = doc(db, 'families', familyId, 'members', task.assigned_to);
          const childDoc = await getDoc(childRef);
          if (childDoc.exists()) {
            const currentPoints = childDoc.data().points || 0;
            await updateDoc(childRef, {
              points: currentPoints + task.points
            });
          }
        }
      }
    } catch (error) {
      throw new Error(`Failed to update task status: ${error}`);
    }
  },

  async markTaskCompleted(familyId: string, taskId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'families', familyId, 'tasks', taskId), {
        status: 'submitted',
        completed_at: new Date()
      });
    } catch (error) {
      throw new Error(`Failed to mark task as completed: ${error}`);
    }
  }
};

// Reward Services
export const rewardService = {
  async createReward(familyId: string, rewardData: Partial<Reward>): Promise<void> {
    try {
      const newReward: Omit<Reward, 'id'> = {
        title: rewardData.title || '',
        points_required: rewardData.points_required || 0,
        created_by: rewardData.created_by || '',
        created_at: new Date()
      };
      
      await addDoc(collection(db, 'families', familyId, 'rewards'), newReward);
    } catch (error) {
      throw new Error(`Failed to create reward: ${error}`);
    }
  },

  async getRewards(familyId: string): Promise<Reward[]> {
    try {
      const rewardsQuery = query(
        collection(db, 'families', familyId, 'rewards'),
        orderBy('points_required', 'asc')
      );
      
      const snapshot = await getDocs(rewardsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reward[];
    } catch (error) {
      console.error('Error getting rewards:', error);
      return [];
    }
  }
};