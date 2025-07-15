import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface AddChildFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const CreateFamilyScreen: React.FC = () => {
  const [familyName, setFamilyName] = useState('');
  const [children, setChildren] = useState<AddChildFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { createFamily, addChildToFamily } = useApp();
  const { user } = useAuth();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      Alert.alert('Error', 'Please enter a family name');
      return;
    }

    setLoading(true);
    try {
      await createFamily(familyName.trim());
      setCurrentStep(2);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create family');
    } finally {
      setLoading(false);
    }
  };

  const addChild = () => {
    setChildren([...children, { name: '', surname: '', email: '', password: '' }]);
  };

  const updateChild = (index: number, field: keyof AddChildFormData, value: string) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);
  };

  const removeChild = (index: number) => {
    const updatedChildren = children.filter((_, i) => i !== index);
    setChildren(updatedChildren);
  };

  const validateChildData = (child: AddChildFormData) => {
    if (!child.name.trim() || !child.surname.trim()) {
      return 'Name and surname are required';
    }
    if (!child.email.trim()) {
      return 'Email is required for each child';
    }
    if (!child.password.trim()) {
      return 'Password is required for each child';
    }
    if (child.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(child.email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleAddChildren = async () => {
    if (children.length === 0) {
      Alert.alert('Info', 'You can add children later from the settings screen');
      return;
    }

    // Validate all children data
    for (let i = 0; i < children.length; i++) {
      const error = validateChildData(children[i]);
      if (error) {
        Alert.alert('Error', `Child ${i + 1}: ${error}`);
        return;
      }
    }

    // Check for duplicate emails
    const emails = children.map(child => child.email.toLowerCase());
    const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
    if (duplicateEmails.length > 0) {
      Alert.alert('Error', 'Each child must have a unique email address');
      return;
    }

    setLoading(true);
    try {
      // Add all children to the family with authentication
      for (const child of children) {
        await addChildToFamily(child);
      }
      Alert.alert('Success', 'Family created successfully! Your children can now log in with their credentials.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add children');
    } finally {
      setLoading(false);
    }
  };

  const skipAddingChildren = () => {
    Alert.alert('Success', 'Family created successfully! You can add children later from the settings screen.');
  };

  const generatePassword = (index: number) => {
    const passwords = ['Family123!', 'Kids2024!', 'MyChild123!', 'FunTime123!', 'Happy123!'];
    const randomPassword = passwords[Math.floor(Math.random() * passwords.length)] + Math.floor(Math.random() * 100);
    updateChild(index, 'password', randomPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <Ionicons name="home" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>Welcome, {user?.name}!</Text>
            <Text style={styles.subtitle}>
              {currentStep === 1 ? "Let's create your family" : "Add your children"}
            </Text>
          </Animated.View>

          {currentStep === 1 ? (
            <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
              <View style={styles.stepIndicator}>
                <View style={[styles.step, styles.activeStep]}>
                  <Text style={styles.stepText}>1</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.step}>
                  <Text style={styles.stepText}>2</Text>
                </View>
              </View>

              <Text style={styles.stepLabel}>
                <Ionicons name="people" size={20} color="#667eea" /> Step 1: Create Family
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  <Ionicons name="home" size={16} color="#667eea" /> Family Name
                </Text>
                <TextInput
                  style={styles.input}
                  value={familyName}
                  onChangeText={setFamilyName}
                  placeholder="Enter your family name (e.g., The Smiths)"
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCreateFamily}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#B0B0B0', '#999'] : ['#667eea', '#764ba2']}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Ionicons name="add-circle" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Create Family</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
              <View style={styles.stepIndicator}>
                <View style={[styles.step, styles.completedStep]}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
                <View style={styles.stepLine} />
                <View style={[styles.step, styles.activeStep]}>
                  <Text style={styles.stepText}>2</Text>
                </View>
              </View>

              <Text style={styles.stepLabel}>
                <Ionicons name="person-add" size={20} color="#667eea" /> Step 2: Add Children
              </Text>
              
              <View style={styles.infoContainer}>
                <Ionicons name="information-circle" size={20} color="#667eea" />
                <Text style={styles.infoText}>
                  Set up login credentials for each child. They will use these to access their tasks.
                </Text>
              </View>

              {children.map((child, index) => (
                <View key={index} style={styles.childContainer}>
                  <View style={styles.childHeader}>
                    <Text style={styles.childTitle}>
                      <Ionicons name="person" size={16} color="#667eea" /> Child {index + 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeChild(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <Text style={styles.label}>First Name *</Text>
                      <TextInput
                        style={styles.input}
                        value={child.name}
                        onChangeText={(value) => updateChild(index, 'name', value)}
                        placeholder="First name"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <Text style={styles.label}>Last Name *</Text>
                      <TextInput
                        style={styles.input}
                        value={child.surname}
                        onChangeText={(value) => updateChild(index, 'surname', value)}
                        placeholder="Last name"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="mail" size={16} color="#667eea" /> Email *
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={child.email}
                      onChangeText={(value) => updateChild(index, 'email', value)}
                      placeholder="Enter email for child login"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="lock-closed" size={16} color="#667eea" /> Password *
                    </Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={child.password}
                        onChangeText={(value) => updateChild(index, 'password', value)}
                        placeholder="Enter password (min 6 characters)"
                        placeholderTextColor="#999"
                        secureTextEntry
                      />
                      <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => generatePassword(index)}
                      >
                        <Ionicons name="refresh" size={20} color="#667eea" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addChildButton} onPress={addChild}>
                <LinearGradient
                  colors={['rgba(102, 126, 234, 0.1)', 'rgba(102, 126, 234, 0.05)']}
                  style={styles.addChildGradient}
                >
                  <Ionicons name="add" size={24} color="#667eea" />
                  <Text style={styles.addChildText}>Add Child</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleAddChildren}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#B0B0B0', '#999'] : ['#667eea', '#764ba2']}
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Add Children</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={skipAddingChildren}
                >
                  <Text style={styles.skipText}>
                    <Ionicons name="arrow-forward" size={16} color="#667eea" /> Skip for Now
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  activeStep: {
    backgroundColor: '#667eea',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  stepLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  childContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  childTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  addChildButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  addChildGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
  },
  addChildText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 10,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 10,
    flex: 1,
  },
});

export default CreateFamilyScreen;