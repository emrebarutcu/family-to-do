import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import CreateFamilyScreen from '../screens/CreateFamilyScreen';
import ParentTabNavigator from './ParentTabNavigator';
import ChildTabNavigator from './ChildTabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { family, isLoading: appLoading } = useApp();

  if (authLoading || appLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f5f5f5' }
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : !family ? (
          <Stack.Screen name="CreateFamily" component={CreateFamilyScreen} />
        ) : (
          <>
            {user?.role === 'parent' ? (
              <Stack.Screen name="ParentTabs" component={ParentTabNavigator} />
            ) : (
              <Stack.Screen name="ChildTabs" component={ChildTabNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;