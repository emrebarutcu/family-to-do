import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

const CreateTaskScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Task['type']>('chore');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [points, setPoints] = useState('10');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { familyMembers, createTask } = useApp();
  const children = familyMembers.filter(member => member.role === 'child');

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    if (!assignedTo) {
      Alert.alert('Error', 'Please select a child to assign this task to');
      return;
    }

    const pointsNumber = parseInt(points);
    if (isNaN(pointsNumber) || pointsNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid number of points');
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        type,
        assigned_to: assignedTo,
        due_date: dueDate,
        points: pointsNumber,
      });

      Alert.alert('Success', 'Task created successfully!');
      resetForm();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('chore');
    setAssignedTo('');
    setDueDate(new Date());
    setPoints('10');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const getChildName = (childId: string) => {
    const child = familyMembers.find(member => member.id === childId);
    return child ? `${child.name} ${child.surname}` : 'Unknown Child';
  };

  const getTaskTypeIcon = (taskType: Task['type']) => {
    switch (taskType) {
      case 'chore':
        return 'home';
      case 'homework':
        return 'school';
      default:
        return 'checkmark-circle';
    }
  };

  const getTaskTypeColor = (taskType: Task['type']) => {
    switch (taskType) {
      case 'chore':
        return '#FF6B6B';
      case 'homework':
        return '#4ECDC4';
      default:
        return '#007AFF';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Task</Text>
          <Text style={styles.subtitle}>Assign a task to one of your children</Text>
        </View>

        {children.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#999" />
            <Text style={styles.emptyTitle}>No Children Added</Text>
            <Text style={styles.emptyText}>
              You need to add children to your family before creating tasks.
            </Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Task Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Clean your room"
                placeholderTextColor="#999"
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what needs to be done..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                maxLength={200}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Task Type</Text>
              <View style={styles.typeContainer}>
                {(['chore', 'homework', 'other'] as Task['type'][]).map((taskType) => (
                  <TouchableOpacity
                    key={taskType}
                    style={[
                      styles.typeButton,
                      type === taskType && styles.typeButtonActive,
                      { borderColor: getTaskTypeColor(taskType) },
                      type === taskType && { backgroundColor: getTaskTypeColor(taskType) }
                    ]}
                    onPress={() => setType(taskType)}
                  >
                    <Ionicons
                      name={getTaskTypeIcon(taskType)}
                      size={20}
                      color={type === taskType ? '#fff' : getTaskTypeColor(taskType)}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        type === taskType && styles.typeButtonTextActive,
                        { color: type === taskType ? '#fff' : getTaskTypeColor(taskType) }
                      ]}
                    >
                      {taskType.charAt(0).toUpperCase() + taskType.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Assign To *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={assignedTo}
                  onValueChange={(itemValue) => setAssignedTo(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a child..." value="" />
                  {children.map((child) => (
                    <Picker.Item
                      key={child.id}
                      label={`${child.name} ${child.surname}`}
                      value={child.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Due Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#007AFF" />
                <Text style={styles.dateText}>
                  {dueDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Points Reward</Text>
              <TextInput
                style={styles.input}
                value={points}
                onChangeText={setPoints}
                placeholder="10"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Task Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewTitleContainer}>
                    <Ionicons
                      name={getTaskTypeIcon(type)}
                      size={20}
                      color={getTaskTypeColor(type)}
                    />
                    <Text style={styles.previewTaskTitle}>{title || 'Task Title'}</Text>
                  </View>
                  <View style={styles.previewPoints}>
                    <Text style={styles.previewPointsText}>{points} pts</Text>
                  </View>
                </View>
                <Text style={styles.previewDescription}>
                  {description || 'Task description...'}
                </Text>
                <Text style={styles.previewAssignee}>
                  Assigned to: {assignedTo ? getChildName(assignedTo) : 'Select a child'}
                </Text>
                <Text style={styles.previewDate}>
                  Due: {dueDate.toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Create Task</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                <Text style={styles.resetButtonText}>Reset Form</Text>
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
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  previewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  previewTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  previewPoints: {
    backgroundColor: '#E6F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewPointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  previewAssignee: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default CreateTaskScreen;