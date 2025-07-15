import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  List, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  Avatar,
  Divider 
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';

export const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { family } = useFamily();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={`${user?.name?.[0]}${user?.surname?.[0]}`}
            style={styles.avatar}
          />
          <Title style={styles.name}>
            {user?.name} {user?.surname}
          </Title>
          <Paragraph style={styles.role}>
            {user?.role === 'parent' ? 'Parent' : 'Child'}
          </Paragraph>
          {user?.role === 'child' && (
            <Paragraph style={styles.points}>
              {user?.points} points
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Family Information</Title>
          <List.Item
            title="Family Name"
            description={family?.name}
            left={() => <List.Icon icon="home" />}
          />
          <List.Item
            title="Email"
            description={user?.email}
            left={() => <List.Icon icon="email" />}
          />
          <List.Item
            title="Member Since"
            description={user?.joinedAt?.toLocaleDateString()}
            left={() => <List.Icon icon="calendar" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Actions</Title>
          <List.Item
            title="About"
            description="App version and information"
            left={() => <List.Icon icon="information" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {/* Handle about */}}
          />
          <List.Item
            title="Help & Support"
            description="Get help with the app"
            left={() => <List.Icon icon="help-circle" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {/* Handle help */}}
          />
          <Divider />
          <List.Item
            title="Sign Out"
            description="Sign out of your account"
            left={() => <List.Icon icon="logout" color="#FF6B6B" />}
            titleStyle={{ color: '#FF6B6B' }}
            onPress={handleSignOut}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFBFF',
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
    fontSize: 20,
  },
  role: {
    marginBottom: 4,
    color: '#666',
  },
  points: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  infoCard: {
    marginBottom: 16,
  },
  actionsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
  },
});