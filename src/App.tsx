import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { RootNavigator } from './navigation/RootNavigator';
import { theme } from './utils/theme';

const App: React.FC = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          <FamilyProvider>
            <RootNavigator />
          </FamilyProvider>
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;