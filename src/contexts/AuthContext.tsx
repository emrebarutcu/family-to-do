import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthContextType, User } from '../types';
import { authService, familyService, COLLECTIONS } from '../services/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser.uid);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      // Get user document
      const userDoc = await firestore().collection(COLLECTIONS.USERS).doc(uid).get();
      
      if (userDoc.exists) {
        const userData = userDoc.data()!;
        const familyId = userData.familyId;
        
        if (familyId) {
          // Get member data from family
          const memberDoc = await firestore()
            .collection(COLLECTIONS.FAMILIES)
            .doc(familyId)
            .collection(COLLECTIONS.MEMBERS)
            .doc(uid)
            .get();
          
          if (memberDoc.exists) {
            const memberData = memberDoc.data()!;
            setUser({
              id: uid,
              name: memberData.name,
              surname: memberData.surname,
              email: memberData.email,
              role: memberData.role,
              points: memberData.points,
              avatarUrl: memberData.avatarUrl,
              joinedAt: memberData.joinedAt?.toDate() || new Date(),
              familyId,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, surname: string) => {
    try {
      await authService.signUp(email, password, name, surname);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      throw error;
    }
  };

  const createFamily = async (familyName: string) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('No authenticated user');

      const userInfo = {
        name: user?.name || '',
        surname: user?.surname || '',
        email: currentUser.email || '',
      };

      const familyId = await familyService.createFamily(familyName, currentUser.uid, userInfo);
      
      // Reload user data
      await loadUserData(currentUser.uid);
    } catch (error) {
      throw error;
    }
  };

  const addChild = async (name: string, surname: string, email?: string) => {
    try {
      if (!user?.familyId) throw new Error('No family found');
      
      await familyService.addChild(user.familyId, { name, surname, email });
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    createFamily,
    addChild,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};