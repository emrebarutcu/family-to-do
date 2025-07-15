import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { ParentTabParamList, ChildTabParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Parent Screens
import { ParentHomeScreen } from '../screens/parent/ParentHomeScreen';
import { AddTaskScreen } from '../screens/parent/AddTaskScreen';
import { RewardsScreen } from '../screens/parent/RewardsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

// Child Screens
import { ChildTasksScreen } from '../screens/child/ChildTasksScreen';
import { ChildPointsScreen } from '../screens/child/ChildPointsScreen';

const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const ChildTab = createBottomTabNavigator<ChildTabParamList>();

const ParentNavigator: React.FC = () => {
  return (
    <ParentTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'AddTask':
              iconName = 'add-task';
              break;
            case 'Rewards':
              iconName = 'card-giftcard';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <ParentTab.Screen 
        name="Home" 
        component={ParentHomeScreen} 
        options={{ title: 'Family Dashboard' }}
      />
      <ParentTab.Screen 
        name="AddTask" 
        component={AddTaskScreen} 
        options={{ title: 'Create Task' }}
      />
      <ParentTab.Screen 
        name="Rewards" 
        component={RewardsScreen} 
        options={{ title: 'Rewards' }}
      />
      <ParentTab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </ParentTab.Navigator>
  );
};

const ChildNavigator: React.FC = () => {
  return (
    <ChildTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'MyTasks':
              iconName = 'assignment';
              break;
            case 'Points':
              iconName = 'stars';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <ChildTab.Screen 
        name="MyTasks" 
        component={ChildTasksScreen} 
        options={{ title: 'My Tasks' }}
      />
      <ChildTab.Screen 
        name="Points" 
        component={ChildPointsScreen} 
        options={{ title: 'My Points' }}
      />
      <ChildTab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </ChildTab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'parent') {
    return <ParentNavigator />;
  } else {
    return <ChildNavigator />;
  }
};