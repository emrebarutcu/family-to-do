import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Task } from '../../types';

const ChildTasksScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'submitted' | 'completed'>('all');
  
  const { tasks, markTaskCompleted, refreshData } = useApp();
  const { user } = useAuth();

  const myTasks = tasks.filter(task => task.assigned_to === user?.id);
  
  const filteredTasks = myTasks.filter(task => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return task.status === 'pending';
    if (selectedFilter === 'submitted') return task.status === 'submitted';
    if (selectedFilter === 'completed') return task.status === 'approved';
    return true;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleMarkCompleted = async (taskId: string) => {
    Alert.alert(
      'Mark as Completed',
      'Are you sure you want to mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Complete!',
          onPress: async () => {
            try {
              await markTaskCompleted(taskId);
              Alert.alert('Success', 'Task marked as completed! Your parent will review it soon.');
            } catch (error) {
              Alert.alert('Error', 'Failed to mark task as completed');
            }
          },
        },
      ]
    );
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'chore':
        return 'home';
      case 'homework':
        return 'school';
      default:
        return 'checkmark-circle';
    }
  };

  const getTaskTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'chore':
        return '#FF6B6B';
      case 'homework':
        return '#4ECDC4';
      default:
        return '#FF6B6B';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'submitted':
        return '#007AFF';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#FF4444';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'TO DO';
      case 'submitted':
        return 'SUBMITTED';
      case 'approved':
        return 'COMPLETED';
      case 'rejected':
        return 'REJECTED';
      default:
        return status.toUpperCase();
    }
  };

  const isTaskOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const renderTaskItem = (task: Task) => {
    const isOverdue = isTaskOverdue(task.due_date);
    
    return (
      <View key={task.id} style={[styles.taskItem, isOverdue && styles.overdueTask]}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <Ionicons
              name={getTaskIcon(task.type)}
              size={24}
              color={getTaskTypeColor(task.type)}
            />
            <Text style={styles.taskTitle}>{task.title}</Text>
          </View>
          <View style={styles.taskPoints}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.pointsText}>{task.points} pts</Text>
          </View>
        </View>

        <Text style={styles.taskDescription}>{task.description}</Text>

        <View style={styles.taskFooter}>
          <View style={styles.taskDateContainer}>
            <Ionicons
              name="calendar"
              size={16}
              color={isOverdue ? '#FF4444' : '#666'}
            />
            <Text style={[styles.taskDate, isOverdue && styles.overdueText]}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>{getStatusText(task.status)}</Text>
          </View>
        </View>

        {task.status === 'rejected' && task.rejected_reason && (
          <View style={styles.rejectionReason}>
            <Ionicons name="information-circle" size={16} color="#FF4444" />
            <Text style={styles.rejectionText}>
              Reason: {task.rejected_reason}
            </Text>
          </View>
        )}

        {task.status === 'pending' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleMarkCompleted(task.id)}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}

        {task.status === 'submitted' && (
          <View style={styles.submittedNotice}>
            <Ionicons name="time" size={16} color="#007AFF" />
            <Text style={styles.submittedText}>
              Waiting for parent approval...
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFilterButton = (filter: typeof selectedFilter, label: string, count: number) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.activeFilter]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
        {label}
      </Text>
      <View style={[styles.countBadge, selectedFilter === filter && styles.activeCountBadge]}>
        <Text style={[styles.countText, selectedFilter === filter && styles.activeCountText]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const pendingCount = myTasks.filter(task => task.status === 'pending').length;
  const submittedCount = myTasks.filter(task => task.status === 'submitted').length;
  const completedCount = myTasks.filter(task => task.status === 'approved').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello, {user?.name}!</Text>
        <Text style={styles.subtitle}>
          You have {pendingCount} task{pendingCount !== 1 ? 's' : ''} to complete
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All', myTasks.length)}
        {renderFilterButton('pending', 'To Do', pendingCount)}
        {renderFilterButton('submitted', 'Submitted', submittedCount)}
        {renderFilterButton('completed', 'Completed', completedCount)}
      </View>

      <ScrollView
        style={styles.tasksContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map(renderTaskItem)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color="#999" />
            <Text style={styles.emptyTitle}>No Tasks Found</Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'all' 
                ? "You don't have any tasks assigned yet!"
                : `You don't have any ${selectedFilter} tasks.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFE6E6',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilter: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 6,
  },
  activeFilterText: {
    color: '#fff',
  },
  countBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: '#fff',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeCountText: {
    color: '#FF6B6B',
  },
  tasksContainer: {
    flex: 1,
    padding: 15,
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overdueTask: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  taskPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8F00',
    marginLeft: 4,
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 22,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  taskDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  overdueText: {
    color: '#FF4444',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  rejectionReason: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rejectionText: {
    fontSize: 14,
    color: '#FF4444',
    marginLeft: 8,
    flex: 1,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submittedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    borderRadius: 8,
  },
  submittedText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 50,
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

export default ChildTasksScreen;