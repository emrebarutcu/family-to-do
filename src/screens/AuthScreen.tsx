import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
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

export const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signIn, signUp } = useAuth();

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!name) {
        newErrors.name = 'Name is required';
      }
      if (!surname) {
        newErrors.surname = 'Surname is required';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name, surname);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      Alert.alert(
        'Authentication Error',
        error.message || 'An error occurred during authentication'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              {isSignUp ? 'Create Family Account' : 'Welcome Back'}
            </Title>
            <Paragraph style={styles.subtitle}>
              {isSignUp 
                ? 'Only parents can create accounts. Sign up to start managing your family tasks.'
                : 'Sign in to your family account'
              }
            </Paragraph>

            {isSignUp && (
              <>
                <TextInput
                  label="First Name"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.name}
                />
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name}
                </HelperText>

                <TextInput
                  label="Last Name"
                  value={surname}
                  onChangeText={setSurname}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.surname}
                />
                <HelperText type="error" visible={!!errors.surname}>
                  {errors.surname}
                </HelperText>
              </>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              error={!!errors.password}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            {isSignUp && (
              <>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry
                  error={!!errors.confirmPassword}
                />
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword}
                </HelperText>
              </>
            )}

            <Button
              mode="contained"
              onPress={handleAuth}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <Button
              mode="text"
              onPress={toggleMode}
              style={styles.switchButton}
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : 'Need an account? Sign Up'
              }
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFBFF',
  },
  content: {
    flex: 1,
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
  switchButton: {
    marginTop: 16,
  },
});