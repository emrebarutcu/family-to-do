import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Animated,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

const { width } = Dimensions.get('window');

interface FormErrors {
  title?: string;
  description?: string;
  assignedTo?: string;
  points?: string;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

const CreateTaskScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'chore' as Task['type'],
    assignedTo: '',
    dueDate: new Date(),
    points: '10',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'info', visible: false });
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { familyMembers, createTask } = useApp();
  const children = familyMembers.filter(member => member.role === 'child');

  // Refs for form inputs
  const titleRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const pointsRef = useRef<TextInput>(null);

  // Animated values
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    setToast({ message, type, visible: true });
    
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      hideToast();
    }, 3000);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast({ message: '', type: 'info', visible: false });
    });
  };

  const validateField = (field: keyof FormErrors, value: string): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Task title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        if (value.trim().length > 50) return 'Title must be less than 50 characters';
        return undefined;
      
      case 'description':
        if (!value.trim()) return 'Task description is required';
        if (value.trim().length < 10) return 'Description must be at least 10 characters';
        if (value.trim().length > 200) return 'Description must be less than 200 characters';
        return undefined;
      
      case 'assignedTo':
        if (!value) return 'Please select a child to assign this task to';
        return undefined;
      
      case 'points':
        const pointsNumber = parseInt(value);
        if (!value) return 'Points reward is required';
        if (isNaN(pointsNumber)) return 'Points must be a number';
        if (pointsNumber <= 0) return 'Points must be greater than 0';
        if (pointsNumber > 100) return 'Points must be 100 or less';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.title = validateField('title', formData.title);
    newErrors.description = validateField('description', formData.description);
    newErrors.assignedTo = validateField('assignedTo', formData.assignedTo);
    newErrors.points = validateField('points', formData.points);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        assigned_to: formData.assignedTo,
        due_date: formData.dueDate,
        points: parseInt(formData.points),
      });

      showToast('Task created successfully!', 'success');
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to create task. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'chore',
      assignedTo: '',
      dueDate: new Date(),
      points: '10',
    });
    setErrors({});
    titleRef.current?.focus();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dueDate: selectedDate }));
    }
  };

  const getChildName = (childId: string) => {
    const child = familyMembers.find(member => member.id === childId);
    return child ? `${child.name} ${child.surname}` : 'Unknown Child';
  };

  const getTaskTypeIcon = (taskType: Task['type']) => {
    switch (taskType) {
      case 'chore':
        return 'home-outline';
      case 'homework':
        return 'school-outline';
      default:
        return 'checkmark-circle-outline';
    }
  };

  const getTaskTypeColor = (taskType: Task['type']) => {
    switch (taskType) {
      case 'chore':
        return '#FF6B6B';
      case 'homework':
        return '#4ECDC4';
      default:
        return '#45B7D1';
    }
  };

  const getToastColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error?: string,
    options?: {
      placeholder?: string;
      multiline?: boolean;
      keyboardType?: 'default' | 'numeric';
      maxLength?: number;
      ref?: React.RefObject<TextInput>;
      onSubmitEditing?: () => void;
      returnKeyType?: 'default' | 'next' | 'done';
    }
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={options?.ref}
        style={[
          styles.input,
          options?.multiline && styles.textArea,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={options?.placeholder}
        placeholderTextColor="#A0A0A0"
        multiline={options?.multiline}
        keyboardType={options?.keyboardType || 'default'}
        maxLength={options?.maxLength}
        onSubmitEditing={options?.onSubmitEditing}
        returnKeyType={options?.returnKeyType || 'default'}
        blurOnSubmit={!options?.multiline}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  if (children.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={80} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No Children Added</Text>
            <Text style={styles.emptyText}>
              You need to add children to your family before creating tasks.
            </Text>
            <TouchableOpacity style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Add Children</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: keyboardHeight > 0 ? 20 : 80 }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create New Task</Text>
          <Text style={styles.subtitle}>Assign a task to one of your children</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Task Title */}
          {renderInputField(
            'Task Title *',
            formData.title,
            (text) => handleFieldChange('title', text),
            errors.title,
            {
              placeholder: 'e.g., Clean your room',
              maxLength: 50,
              ref: titleRef,
              onSubmitEditing: () => descriptionRef.current?.focus(),
              returnKeyType: 'next',
            }
          )}

          {/* Description */}
          {renderInputField(
            'Description *',
            formData.description,
            (text) => handleFieldChange('description', text),
            errors.description,
            {
              placeholder: 'Describe what needs to be done in detail...',
              multiline: true,
              maxLength: 200,
              ref: descriptionRef,
            }
          )}

          {/* Task Type */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Task Type</Text>
            <View style={styles.typeContainer}>
              {(['chore', 'homework', 'other'] as Task['type'][]).map((taskType) => (
                <TouchableOpacity
                  key={taskType}
                  style={[
                    styles.typeButton,
                    formData.type === taskType && [
                      styles.typeButtonActive,
                      { backgroundColor: getTaskTypeColor(taskType) }
                    ]
                  ]}
                  onPress={() => handleFieldChange('type', taskType)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={getTaskTypeIcon(taskType)}
                    size={24}
                    color={formData.type === taskType ? '#fff' : getTaskTypeColor(taskType)}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === taskType && styles.typeButtonTextActive,
                      { color: formData.type === taskType ? '#fff' : getTaskTypeColor(taskType) }
                    ]}
                  >
                    {taskType.charAt(0).toUpperCase() + taskType.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Assign To */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Assign To *</Text>
            <View style={[styles.pickerContainer, errors.assignedTo && styles.inputError]}>
              <Picker
                selectedValue={formData.assignedTo}
                onValueChange={(value) => handleFieldChange('assignedTo', value)}
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
            {errors.assignedTo && <Text style={styles.errorText}>{errors.assignedTo}</Text>}
          </View>

          {/* Due Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <View style={styles.dateButtonContent}>
                <Ionicons name="calendar-outline" size={24} color="#45B7D1" />
                <Text style={styles.dateText}>
                  {formData.dueDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Points */}
          {renderInputField(
            'Points Reward *',
            formData.points,
            (text) => handleFieldChange('points', text),
            errors.points,
            {
              placeholder: '10',
              keyboardType: 'numeric',
              maxLength: 3,
              ref: pointsRef,
              returnKeyType: 'done',
            }
          )}

          {/* Task Preview */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View style={styles.previewTitleContainer}>
                  <Ionicons
                    name={getTaskTypeIcon(formData.type)}
                    size={20}
                    color={getTaskTypeColor(formData.type)}
                  />
                  <Text style={styles.previewTaskTitle}>
                    {formData.title || 'Task Title'}
                  </Text>
                </View>
                <View style={[styles.previewPoints, { backgroundColor: `${getTaskTypeColor(formData.type)}20` }]}>
                  <Text style={[styles.previewPointsText, { color: getTaskTypeColor(formData.type) }]}>
                    {formData.points} pts
                  </Text>
                </View>
              </View>
              <Text style={styles.previewDescription}>
                {formData.description || 'Task description will appear here...'}
              </Text>
              <View style={styles.previewFooter}>
                <Text style={styles.previewAssignee}>
                  <Ionicons name="person-outline" size={14} color="#666" />
                  {' '}{formData.assignedTo ? getChildName(formData.assignedTo) : 'Select a child'}
                </Text>
                <Text style={styles.previewDate}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  {' '}{formData.dueDate.toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                  <Text style={styles.submitButtonText}>Create Task</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetForm}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={20} color="#666" />
              <Text style={styles.resetButtonText}>Reset Form</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
        />
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor: getToastColor(toast.type),
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }],
            },
          ]}
        >
          <Ionicons
            name={toast.type === 'success' ? 'checkmark-circle' : toast.type === 'error' ? 'alert-circle' : 'information-circle'}
            size={20}
            color="#fff"
          />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#2C3E50',
    minHeight: 50,
  },
  inputError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FEF5F5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  errorText: {
    fontSize: 14,
    color: '#E74C3C',
    marginTop: 6,
    marginLeft: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#E1E8ED',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    minHeight: 60,
  },
  typeButtonActive: {
    borderColor: 'transparent',
    backgroundColor: '#45B7D1',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2C3E50',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  previewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  previewTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
  },
  previewPoints: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
  },
  previewPointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
  },
  previewDescription: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 20,
    marginBottom: 12,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewAssignee: {
    fontSize: 13,
    color: '#7F8C8D',
    flex: 1,
  },
  previewDate: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B7D1',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#45B7D1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
    elevation: 0,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  resetButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#45B7D1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
});

export default CreateTaskScreen;