import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

const CreateTaskScreen: React.FC = () => {
  const { familyMembers, createTask } = useApp();
  const children = familyMembers.filter(member => member.role === 'child');

  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [points, setPoints] = useState('10');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; assignedTo?: string; points?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Task title is required.';
    if (!assignedTo) newErrors.assignedTo = 'Please select a child.';
    if (!points || isNaN(Number(points)) || Number(points) <= 0) newErrors.points = 'Enter a valid point value.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: '',
        type: 'chore',
        assigned_to: assignedTo,
        due_date: dueDate,
        points: Number(points),
      });
      setTitle('');
      setAssignedTo('');
      setDueDate(new Date());
      setPoints('10');
      setErrors({});
      Alert.alert('Success', 'Task created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Task</Text>
      <Text style={styles.subheader}>Assign a new task to your child</Text>
      <View style={styles.form}>
        {/* Task Title */}
        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="e.g., Clean your room"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
          returnKeyType="done"
        />
        {errors.title && <Text style={styles.error}>{errors.title}</Text>}

        {/* Assign To */}
        <Text style={styles.label}>Assign To *</Text>
        <View style={[styles.pickerContainer, errors.assignedTo && styles.inputError]}>
          <Picker
            selectedValue={assignedTo}
            onValueChange={setAssignedTo}
            style={styles.picker}
          >
            <Picker.Item label="Select a child..." value="" />
            {children.map(child => (
              <Picker.Item key={child.id} label={`${child.name} ${child.surname}`} value={child.id} />
            ))}
          </Picker>
        </View>
        {errors.assignedTo && <Text style={styles.error}>{errors.assignedTo}</Text>}

        {/* Due Date */}
        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={20} color="#45B7D1" />
          <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
          />
        )}

        {/* Points */}
        <Text style={styles.label}>Points *</Text>
        <TextInput
          style={[styles.input, errors.points && styles.inputError]}
          placeholder="10"
          value={points}
          onChangeText={setPoints}
          keyboardType="numeric"
          maxLength={3}
          returnKeyType="done"
        />
        {errors.points && <Text style={styles.error}>{errors.points}</Text>}

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.buttonText}>Create Task</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 24,
    marginBottom: 4,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#2C3E50',
    minHeight: 44,
  },
  inputError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FEF5F5',
  },
  error: {
    color: '#E74C3C',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    marginBottom: 2,
  },
  picker: {
    height: 44,
    color: '#2C3E50',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B7D1',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CreateTaskScreen;