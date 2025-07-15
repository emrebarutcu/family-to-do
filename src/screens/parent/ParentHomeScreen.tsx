import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  List, 
  Chip, 
  Avatar,
  Badge,
  FAB
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';
import { Task } from '../../types';

export const ParentHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { family, members, tasks, isLoading, refreshData, updateTaskStatus } = useFamily();

  const children = members.filter(member => member.role === 'child');
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const submittedTasks = tasks.filter(task => task.status === 'submitted');
  const completedTasks = tasks.filter(task => task.status === 'approved');

  const handleTaskApproval = async (taskId: string, approved: boolean) => {
    try {
      if (approved) {
        await updateTaskStatus(taskId, 'approved');
      } else {
        await updateTaskStatus(taskId, 'rejected', 'Task needs to be redone');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getChildName = (childId: string) => {
    const child = members.find(member => member.id === childId);
    return child ? `${child.name} ${child.surname}` : 'Unknown';
  };

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return '#FFA726';
      case 'submitted': return '#42A5F5';
      case 'approved': return '#66BB6A';
      case 'rejected': return '#EF5350';
      default: return '#9E9E9E';
    }
  };

  const getTaskStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'submitted': return 'Submitted';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
      }
    >
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title>Welcome back, {user?.name}!</Title>
          <Paragraph>Family: {family?.name}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Family Overview</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{children.length}</Title>
              <Paragraph>Children</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{pendingTasks.length}</Title>
              <Paragraph>Pending Tasks</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{submittedTasks.length}</Title>
              <Paragraph>Need Review</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{completedTasks.length}</Title>
              <Paragraph>Completed</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.childrenCard}>
        <Card.Content>
          <Title>Children</Title>
          {children.map(child => (
            <List.Item
              key={child.id}
              title={`${child.name} ${child.surname}`}
              description={`${child.points} points`}
              left={() => (
                <Avatar.Text 
                  size={40} 
                  label={`${child.name[0]}${child.surname[0]}`}
                />
              )}
              right={() => (
                <Badge size={24}>{child.points}</Badge>
              )}
            />
          ))}
          {children.length === 0 && (
            <Paragraph style={styles.emptyText}>
              No children added yet. Add your first child to get started!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {submittedTasks.length > 0 && (
        <Card style={styles.reviewCard}>
          <Card.Content>
            <Title>Tasks Awaiting Review</Title>
            {submittedTasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Title style={styles.taskTitle}>{task.title}</Title>
                  <Chip 
                    style={[styles.statusChip, { backgroundColor: getTaskStatusColor(task.status) }]}
                    textStyle={{ color: 'white' }}
                  >
                    {getTaskStatusText(task.status)}
                  </Chip>
                </View>
                <Paragraph>Assigned to: {getChildName(task.assignedTo)}</Paragraph>
                <Paragraph>Points: {task.points}</Paragraph>
                <Paragraph style={styles.taskDescription}>{task.description}</Paragraph>
                <View style={styles.taskActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => handleTaskApproval(task.id, false)}
                    style={styles.rejectButton}
                  >
                    Reject
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={() => handleTaskApproval(task.id, true)}
                    style={styles.approveButton}
                  >
                    Approve
                  </Button>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.recentTasksCard}>
        <Card.Content>
          <Title>Recent Tasks</Title>
          {tasks.slice(0, 5).map(task => (
            <List.Item
              key={task.id}
              title={task.title}
              description={`${getChildName(task.assignedTo)} • ${task.points} points`}
              left={() => (
                <Avatar.Icon 
                  size={40} 
                  icon="assignment"
                  style={{ backgroundColor: getTaskStatusColor(task.status) }}
                />
              )}
              right={() => (
                <Chip 
                  style={[styles.statusChip, { backgroundColor: getTaskStatusColor(task.status) }]}
                  textStyle={{ color: 'white' }}
                >
                  {getTaskStatusText(task.status)}
                </Chip>
              )}
            />
          ))}
          {tasks.length === 0 && (
            <Paragraph style={styles.emptyText}>
              No tasks created yet. Create your first task to get started!
            </Paragraph>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFBFF',
  },
  welcomeCard: {
    margin: 16,
    marginBottom: 8,
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  childrenCard: {
    margin: 16,
    marginBottom: 8,
  },
  reviewCard: {
    margin: 16,
    marginBottom: 8,
  },
  recentTasksCard: {
    margin: 16,
    marginBottom: 8,
  },
  taskItem: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
  },
  taskDescription: {
    marginTop: 8,
    marginBottom: 12,
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#66BB6A',
  },
  rejectButton: {
    borderColor: '#EF5350',
  },
  statusChip: {
    height: 28,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
});