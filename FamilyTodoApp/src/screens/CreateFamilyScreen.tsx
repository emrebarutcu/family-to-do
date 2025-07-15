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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AddChildFormData } from '../types';

const CreateFamilyScreen: React.FC = () => {
  const [familyName, setFamilyName] = useState('');
  const [children, setChildren] = useState<AddChildFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { createFamily, addChildToFamily } = useApp();
  const { user } = useAuth();

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
    setChildren([...children, { name: '', surname: '', email: '' }]);
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

  const handleAddChildren = async () => {
    // Validate children data
    for (const child of children) {
      if (!child.name.trim() || !child.surname.trim()) {
        Alert.alert('Error', 'Please fill in all required fields for each child');
        return;
      }
    }

    if (children.length === 0) {
      Alert.alert('Info', 'You can add children later from the settings screen');
      return;
    }

    setLoading(true);
    try {
      // Add all children to the family
      for (const child of children) {
        await addChildToFamily(child);
      }
      Alert.alert('Success', 'Family created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add children');
    } finally {
      setLoading(false);
    }
  };

  const skipAddingChildren = () => {
    Alert.alert('Success', 'Family created successfully! You can add children later from the settings screen.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {user?.name}!</Text>
          <Text style={styles.subtitle}>
            {currentStep === 1 ? "Let's create your family" : "Add your children"}
          </Text>
        </View>

        {currentStep === 1 ? (
          <View style={styles.formContainer}>
            <View style={styles.stepIndicator}>
              <View style={[styles.step, styles.activeStep]}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.step}>
                <Text style={styles.stepText}>2</Text>
              </View>
            </View>

            <Text style={styles.stepLabel}>Step 1: Create Family</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Family Name</Text>
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
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Family</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.stepIndicator}>
              <View style={[styles.step, styles.completedStep]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
              <View style={styles.stepLine} />
              <View style={[styles.step, styles.activeStep]}>
                <Text style={styles.stepText}>2</Text>
              </View>
            </View>

            <Text style={styles.stepLabel}>Step 2: Add Children (Optional)</Text>
            
            {children.map((child, index) => (
              <View key={index} style={styles.childContainer}>
                <View style={styles.childHeader}>
                  <Text style={styles.childTitle}>Child {index + 1}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeChild(index)}
                  >
                    <Ionicons name="close" size={20} color="#FF4444" />
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
                  <Text style={styles.label}>Email (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={child.email}
                    onChangeText={(value) => updateChild(index, 'email', value)}
                    placeholder="Email address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addChildButton} onPress={addChild}>
              <Ionicons name="add" size={20} color="#007AFF" />
              <Text style={styles.addChildText}>Add Child</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleAddChildren}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Children</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={skipAddingChildren}
              >
                <Text style={styles.skipText}>Skip for Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6F3FF',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#007AFF',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  stepLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  childContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#F0F8FF',
  },
  addChildText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 10,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateFamilyScreen;