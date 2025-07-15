import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  Menu, 
  Provider,
  HelperText,
  Chip
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';
import { Task } from '../../types';

export const AddTaskScreen: React.FC = () => {
  const { user } = useAuth();
  const { members, createTask } = useFamily();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Task['type']>('chore');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [points, setPoints] = useState('10');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const children = members.filter(member => member.role === 'child');
  const taskTypes = [
    { label: 'Chore', value: 'chore' },
    { label: 'Homework', value: 'homework' },
    { label: 'Other', value: 'other' },
  ];

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Task description is required';
    }

    if (!assignedTo) {
      newErrors.assignedTo = 'Please select a child to assign this task to';
    }

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum) || pointsNum < 1 || pointsNum > 100) {
      newErrors.points = 'Points must be between 1 and 100';
    }

    if (dueDate <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTask = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        type,
        assignedTo,
        assignedBy: user!.id,
        dueDate,
        points: parseInt(points),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setType('chore');
      setAssignedTo('');
      setDueDate(new Date());
      setPoints('10');
      setErrors({});

      Alert.alert('Success', 'Task created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const getChildName = (childId: string) => {
    const child = children.find(c => c.id === childId);
    return child ? `${child.name} ${child.surname}` : 'Select Child';
  };

  const getTypeLabel = (typeValue: Task['type']) => {
    const type = taskTypes.find(t => t.value === typeValue);
    return type ? type.label : 'Select Type';
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Create New Task</Title>
            <Paragraph style={styles.subtitle}>
              Assign a task to one of your children and set up the reward points.
            </Paragraph>

            <TextInput
              label="Task Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              mode="outlined"
              style={styles.input}
              error={!!errors.title}
            />
            <HelperText type="error" visible={!!errors.title}>
              {errors.title}
            </HelperText>

            <TextInput
              label="Description"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              error={!!errors.description}
            />
            <HelperText type="error" visible={!!errors.description}>
              {errors.description}
            </HelperText>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Menu
                  visible={showTypeMenu}
                  onDismiss={() => setShowTypeMenu(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setShowTypeMenu(true)}
                      style={styles.menuButton}
                    >
                      {getTypeLabel(type)}
                    </Button>
                  }
                >
                  {taskTypes.map(taskType => (
                    <Menu.Item
                      key={taskType.value}
                      title={taskType.label}
                      onPress={() => {
                        setType(taskType.value);
                        setShowTypeMenu(false);
                      }}
                    />
                  ))}
                </Menu>
              </View>

              <View style={styles.halfWidth}>
                <TextInput
                  label="Points"
                  value={points}
                  onChangeText={(text) => {
                    setPoints(text);
                    if (errors.points) setErrors({ ...errors, points: '' });
                  }}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  error={!!errors.points}
                />
                <HelperText type="error" visible={!!errors.points}>
                  {errors.points}
                </HelperText>
              </View>
            </View>

            <Menu
              visible={showAssigneeMenu}
              onDismiss={() => setShowAssigneeMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowAssigneeMenu(true)}
                  style={[styles.menuButton, { marginBottom: 8 }]}
                  contentStyle={styles.menuButtonContent}
                >
                  {getChildName(assignedTo)}
                </Button>
              }
            >
              {children.map(child => (
                <Menu.Item
                  key={child.id}
                  title={`${child.name} ${child.surname}`}
                  onPress={() => {
                    setAssignedTo(child.id);
                    setShowAssigneeMenu(false);
                    if (errors.assignedTo) setErrors({ ...errors, assignedTo: '' });
                  }}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.assignedTo}>
              {errors.assignedTo}
            </HelperText>

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.menuButton}
            >
              Due: {dueDate.toLocaleDateString()}
            </Button>
            <HelperText type="error" visible={!!errors.dueDate}>
              {errors.dueDate}
            </HelperText>

            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              onConfirm={(date) => {
                setDueDate(date);
                setShowDatePicker(false);
                if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
              }}
              onCancel={() => setShowDatePicker(false)}
              minimumDate={new Date()}
            />

            <View style={styles.previewCard}>
              <Title style={styles.previewTitle}>Task Preview</Title>
              <Paragraph><strong>Title:</strong> {title || 'Enter task title'}</Paragraph>
              <Paragraph><strong>Assigned to:</strong> {getChildName(assignedTo)}</Paragraph>
              <Paragraph><strong>Type:</strong> {getTypeLabel(type)}</Paragraph>
              <Paragraph><strong>Points:</strong> {points}</Paragraph>
              <Paragraph><strong>Due:</strong> {dueDate.toLocaleDateString()}</Paragraph>
              <Paragraph><strong>Description:</strong> {description || 'Enter description'}</Paragraph>
            </View>

            <Button
              mode="contained"
              onPress={handleCreateTask}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Create Task
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFBFF',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  halfWidth: {
    flex: 0.48,
  },
  menuButton: {
    marginBottom: 8,
  },
  menuButtonContent: {
    height: 48,
  },
  previewCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});