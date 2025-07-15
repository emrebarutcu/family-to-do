import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  HelperText 
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export const CreateFamilyScreen: React.FC = () => {
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createFamily, user } = useAuth();

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      setError('Family name is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await createFamily(familyName.trim());
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to create family'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Create Your Family</Title>
          <Paragraph style={styles.subtitle}>
            Welcome, {user?.name}! Let's set up your family group to start managing tasks and rewards.
          </Paragraph>

          <TextInput
            label="Family Name"
            value={familyName}
            onChangeText={(text) => {
              setFamilyName(text);
              setError('');
            }}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., The Smith Family"
            error={!!error}
          />
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleCreateFamily}
            loading={loading}
            disabled={loading || !familyName.trim()}
            style={styles.button}
          >
            Create Family
          </Button>

          <Paragraph style={styles.note}>
            After creating your family, you can add your children and start assigning tasks.
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFBFF',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    margin: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  note: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    fontSize: 12,
  },
});