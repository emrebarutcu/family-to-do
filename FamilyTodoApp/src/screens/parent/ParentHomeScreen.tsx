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
import { Task, User } from '../../types';

const ParentHomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { 
    family, 
    familyMembers, 
    tasks, 
    updateTaskStatus, 
    refreshData, 
    isLoading 
  } = useApp();
  const { user } = useAuth();

  const children = familyMembers.filter(member => member.role === 'child');
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const submittedTasks = tasks.filter(task => task.status === 'submitted');
  const completedTasks = tasks.filter(task => task.status === 'approved');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleApproveTask = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, 'approved');
      Alert.alert('Success', 'Task approved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to approve task');
    }
  };

  const handleRejectTask = async (taskId: string) => {
    Alert.prompt(
      'Reject Task',
      'Please provide a reason for rejection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason) => {
            if (reason) {
              try {
                await updateTaskStatus(taskId, 'rejected', reason);
                Alert.alert('Success', 'Task rejected');
              } catch (error) {
                Alert.alert('Error', 'Failed to reject task');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const getChildName = (childId: string): string => {
    const child = familyMembers.find(member => member.id === childId);
    return child ? `${child.name} ${child.surname}` : 'Unknown Child';
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

  const renderTaskItem = (task: Task, showActions: boolean = false) => (
    <View key={task.id} style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <Ionicons 
            name={getTaskIcon(task.type)} 
            size={20} 
            color={getStatusColor(task.status)} 
          />
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
        <View style={styles.taskPoints}>
          <Text style={styles.pointsText}>{task.points} pts</Text>
        </View>
      </View>
      
      <Text style={styles.taskDescription}>{task.description}</Text>
      <Text style={styles.taskAssignee}>Assigned to: {getChildName(task.assigned_to)}</Text>
      
      <View style={styles.taskFooter}>
        <Text style={styles.taskDate}>
          Due: {new Date(task.due_date).toLocaleDateString()}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
          <Text style={styles.statusText}>{task.status.toUpperCase()}</Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleRejectTask(task.id)}
          >
            <Ionicons name="close" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApproveTask(task.id)}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderChildCard = (child: User) => {
    const childTasks = tasks.filter(task => task.assigned_to === child.id);
    const completedCount = childTasks.filter(task => task.status === 'approved').length;
    
    return (
      <View key={child.id} style={styles.childCard}>
        <View style={styles.childHeader}>
          <Text style={styles.childName}>{child.name} {child.surname}</Text>
          <Text style={styles.childPoints}>{child.points || 0} pts</Text>
        </View>
        
        <View style={styles.childStats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{childTasks.length}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {childTasks.filter(task => task.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user?.name}!</Text>
        <Text style={styles.familyName}>{family?.family_name}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{children.length}</Text>
          <Text style={styles.statLabel}>Children</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingTasks.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{submittedTasks.length}</Text>
          <Text style={styles.statLabel}>To Review</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedTasks.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Family Members */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family Members</Text>
        {children.length > 0 ? (
          children.map(renderChildCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>No children added yet</Text>
          </View>
        )}
      </View>

      {/* Tasks Awaiting Review */}
      {submittedTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks Awaiting Review</Text>
          {submittedTasks.map(task => renderTaskItem(task, true))}
        </View>
      )}

      {/* Recent Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Tasks</Text>
        {tasks.length > 0 ? (
          tasks.slice(0, 5).map(task => renderTaskItem(task))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>No tasks created yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  familyName: {
    fontSize: 16,
    color: '#E6F3FF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  childCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  childPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  childStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  taskItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  taskPoints: {
    backgroundColor: '#E6F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskAssignee: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default ParentHomeScreen;