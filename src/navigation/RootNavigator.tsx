import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';
import { LoadingScreen } from '../screens/LoadingScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { CreateFamilyScreen } from '../screens/CreateFamilyScreen';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {user.familyId ? (
            <Stack.Screen name="Main" component={MainNavigator} />
          ) : (
            <Stack.Screen name="CreateFamily" component={CreateFamilyScreen} />
          )}
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};