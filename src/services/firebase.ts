import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User, Family, Task, Reward } from '../types';

// Firebase Collections
export const COLLECTIONS = {
  FAMILIES: 'families',
  USERS: 'users',
  MEMBERS: 'members',
  TASKS: 'tasks',
  REWARDS: 'rewards',
};

// Generate random invite code
export const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Auth Services
export const authService = {
  signIn: async (email: string, password: string) => {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  },

  signUp: async (email: string, password: string, name: string, surname: string) => {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    
    // Create user document
    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userCredential.user.uid)
      .set({
        email,
        userType: 'parent',
        uid: userCredential.user.uid,
        familyId: '',
      });

    return userCredential.user;
  },

  signOut: async () => {
    await auth().signOut();
  },

  getCurrentUser: () => {
    return auth().currentUser;
  },
};

// Family Services
export const familyService = {
  createFamily: async (familyName: string, userId: string, userInfo: { name: string; surname: string; email: string }) => {
    const familyRef = firestore().collection(COLLECTIONS.FAMILIES).doc();
    const inviteCode = generateInviteCode();
    
    await familyRef.set({
      familyName,
      inviteCode,
      createdBy: userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // Add parent as first member
    await familyRef.collection(COLLECTIONS.MEMBERS).doc(userId).set({
      name: userInfo.name,
      surname: userInfo.surname,
      email: userInfo.email,
      role: 'parent',
      points: 0,
      joinedAt: firestore.FieldValue.serverTimestamp(),
    });

    // Update user's family ID
    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .update({
        familyId: familyRef.id,
      });

    return familyRef.id;
  },

  addChild: async (familyId: string, childInfo: { name: string; surname: string; email?: string }) => {
    const childRef = firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .collection(COLLECTIONS.MEMBERS)
      .doc();

    await childRef.set({
      name: childInfo.name,
      surname: childInfo.surname,
      email: childInfo.email || '',
      role: 'child',
      points: 0,
      joinedAt: firestore.FieldValue.serverTimestamp(),
    });

    return childRef.id;
  },

  getFamily: async (familyId: string): Promise<Family | null> => {
    const familyDoc = await firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .get();

    if (!familyDoc.exists) return null;

    const data = familyDoc.data()!;
    return {
      id: familyDoc.id,
      name: data.familyName,
      inviteCode: data.inviteCode,
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  },

  getMembers: async (familyId: string): Promise<User[]> => {
    const membersSnapshot = await firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .collection(COLLECTIONS.MEMBERS)
      .get();

    return membersSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      surname: doc.data().surname,
      email: doc.data().email,
      role: doc.data().role,
      points: doc.data().points,
      avatarUrl: doc.data().avatarUrl,
      joinedAt: doc.data().joinedAt?.toDate() || new Date(),
      familyId,
    }));
  },
};

// Task Services
export const taskService = {
  createTask: async (familyId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const taskRef = firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .collection(COLLECTIONS.TASKS)
      .doc();

    await taskRef.set({
      ...taskData,
      status: 'pending',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return taskRef.id;
  },

  updateTaskStatus: async (familyId: string, taskId: string, status: Task['status'], rejectedReason?: string) => {
    const updateData: any = { status };
    
    if (status === 'submitted') {
      updateData.completedAt = firestore.FieldValue.serverTimestamp();
    } else if (status === 'approved') {
      updateData.approvedAt = firestore.FieldValue.serverTimestamp();
    } else if (status === 'rejected' && rejectedReason) {
      updateData.rejectedReason = rejectedReason;
    }

    await firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .collection(COLLECTIONS.TASKS)
      .doc(taskId)
      .update(updateData);

    // If approved, add points to child
    if (status === 'approved') {
      const taskDoc = await firestore()
        .collection(COLLECTIONS.FAMILIES)
        .doc(familyId)
        .collection(COLLECTIONS.TASKS)
        .doc(taskId)
        .get();

      if (taskDoc.exists) {
        const task = taskDoc.data()!;
        await firestore()
          .collection(COLLECTIONS.FAMILIES)
          .doc(familyId)
          .collection(COLLECTIONS.MEMBERS)
          .doc(task.assignedTo)
          .update({
            points: firestore.FieldValue.increment(task.points),
          });
      }
    }
  },

  getTasks: async (familyId: string): Promise<Task[]> => {
    const tasksSnapshot = await firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .collection(COLLECTIONS.TASKS)
      .orderBy('createdAt', 'desc')
      .get();

    return tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      type: doc.data().type,
      assignedTo: doc.data().assignedTo,
      assignedBy: doc.data().assignedBy,
      dueDate: doc.data().dueDate?.toDate() || new Date(),
      points: doc.data().points,
      status: doc.data().status,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      completedAt: doc.data().completedAt?.toDate(),
      approvedAt: doc.data().approvedAt?.toDate(),
      rejectedReason: doc.data().rejectedReason,
    }));
  },
};

// Reward Services
export const rewardService = {
  createReward: async (familyId: string, rewardData: Omit<Reward, 'id' | 'createdAt'>) => {
    const rewardRef = firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .collection(COLLECTIONS.REWARDS)
      .doc();

    await rewardRef.set({
      ...rewardData,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return rewardRef.id;
  },

  getRewards: async (familyId: string): Promise<Reward[]> => {
    const rewardsSnapshot = await firestore()
      .collection(COLLECTIONS.FAMILIES)
      .doc(familyId)
      .collection(COLLECTIONS.REWARDS)
      .orderBy('pointsRequired', 'asc')
      .get();

    return rewardsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      pointsRequired: doc.data().pointsRequired,
      createdBy: doc.data().createdBy,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  },
};