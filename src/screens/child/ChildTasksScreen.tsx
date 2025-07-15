import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  List, 
  Chip, 
  Avatar,
  Badge,
  Divider
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';
import { Task } from '../../types';

export const ChildTasksScreen: React.FC = () => {
  const { user } = useAuth();
  const { members, tasks, isLoading, refreshData, updateTaskStatus } = useFamily();

  const myTasks = tasks.filter(task => task.assignedTo === user?.id);
  const pendingTasks = myTasks.filter(task => task.status === 'pending');
  const submittedTasks = myTasks.filter(task => task.status === 'submitted');
  const completedTasks = myTasks.filter(task => task.status === 'approved');
  const rejectedTasks = myTasks.filter(task => task.status === 'rejected');

  const handleCompleteTask = async (taskId: string) => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: async () => {
            try {
              await updateTaskStatus(taskId, 'submitted');
              Alert.alert('Success', 'Task submitted for approval!');
            } catch (error) {
              Alert.alert('Error', 'Failed to submit task');
            }
          }
        },
      ]
    );
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
      case 'pending': return 'To Do';
      case 'submitted': return 'Submitted';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const isTaskOverdue = (dueDate: Date) => {
    return new Date() > dueDate;
  };

  const getParentName = (parentId: string) => {
    const parent = members.find(member => member.id === parentId);
    return parent ? `${parent.name} ${parent.surname}` : 'Unknown';
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
          <Title>Hi {user?.name}!</Title>
          <Paragraph>You have {pendingTasks.length} tasks to complete</Paragraph>
          <View style={styles.pointsContainer}>
            <Avatar.Icon size={40} icon="stars" style={styles.pointsIcon} />
            <Title style={styles.pointsText}>{user?.points} points</Title>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Task Overview</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{pendingTasks.length}</Title>
              <Paragraph>To Do</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{submittedTasks.length}</Title>
              <Paragraph>Submitted</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{completedTasks.length}</Title>
              <Paragraph>Completed</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{rejectedTasks.length}</Title>
              <Paragraph>Rejected</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {pendingTasks.length > 0 && (
        <Card style={styles.taskCard}>
          <Card.Content>
            <Title>Tasks To Do</Title>
            {pendingTasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Title style={styles.taskTitle}>{task.title}</Title>
                  <View style={styles.taskMeta}>
                    <Chip 
                      style={[styles.statusChip, { backgroundColor: getTaskStatusColor(task.status) }]}
                      textStyle={{ color: 'white' }}
                    >
                      {getTaskStatusText(task.status)}
                    </Chip>
                    {isTaskOverdue(task.dueDate) && (
                      <Chip 
                        style={styles.overdueChip}
                        textStyle={{ color: 'white' }}
                      >
                        Overdue
                      </Chip>
                    )}
                  </View>
                </View>
                <Paragraph style={styles.taskDescription}>{task.description}</Paragraph>
                <View style={styles.taskDetails}>
                  <Paragraph>Type: {task.type}</Paragraph>
                  <Paragraph>Due: {task.dueDate.toLocaleDateString()}</Paragraph>
                  <Paragraph>Points: {task.points}</Paragraph>
                  <Paragraph>Assigned by: {getParentName(task.assignedBy)}</Paragraph>
                </View>
                <Button
                  mode="contained"
                  onPress={() => handleCompleteTask(task.id)}
                  style={styles.completeButton}
                >
                  Mark as Complete
                </Button>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {submittedTasks.length > 0 && (
        <Card style={styles.taskCard}>
          <Card.Content>
            <Title>Submitted Tasks</Title>
            <Paragraph style={styles.sectionDescription}>
              These tasks are waiting for parent approval
            </Paragraph>
            {submittedTasks.map(task => (
              <List.Item
                key={task.id}
                title={task.title}
                description={`${task.points} points • Due: ${task.dueDate.toLocaleDateString()}`}
                left={() => (
                  <Avatar.Icon 
                    size={40} 
                    icon="hourglass-empty"
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
          </Card.Content>
        </Card>
      )}

      {completedTasks.length > 0 && (
        <Card style={styles.taskCard}>
          <Card.Content>
            <Title>Completed Tasks</Title>
            <Paragraph style={styles.sectionDescription}>
              Great job! These tasks have been approved
            </Paragraph>
            {completedTasks.slice(0, 5).map(task => (
              <List.Item
                key={task.id}
                title={task.title}
                description={`${task.points} points earned • Completed: ${task.approvedAt?.toLocaleDateString()}`}
                left={() => (
                  <Avatar.Icon 
                    size={40} 
                    icon="check-circle"
                    style={{ backgroundColor: getTaskStatusColor(task.status) }}
                  />
                )}
                right={() => (
                  <Badge style={styles.pointsBadge}>+{task.points}</Badge>
                )}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {rejectedTasks.length > 0 && (
        <Card style={styles.taskCard}>
          <Card.Content>
            <Title>Rejected Tasks</Title>
            <Paragraph style={styles.sectionDescription}>
              These tasks need to be redone
            </Paragraph>
            {rejectedTasks.map(task => (
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
                <Paragraph style={styles.taskDescription}>{task.description}</Paragraph>
                {task.rejectedReason && (
                  <View style={styles.rejectionReason}>
                    <Paragraph style={styles.rejectionLabel}>Reason for rejection:</Paragraph>
                    <Paragraph style={styles.rejectionText}>{task.rejectedReason}</Paragraph>
                  </View>
                )}
                <Button
                  mode="contained"
                  onPress={() => handleCompleteTask(task.id)}
                  style={styles.completeButton}
                >
                  Try Again
                </Button>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {myTasks.length === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Avatar.Icon size={80} icon="assignment" style={styles.emptyIcon} />
            <Title style={styles.emptyTitle}>No Tasks Yet</Title>
            <Paragraph style={styles.emptyDescription}>
              Your parents haven't assigned any tasks yet. Check back later!
            </Paragraph>
          </Card.Content>
        </Card>
      )}
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
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pointsIcon: {
    backgroundColor: '#6200EE',
    marginRight: 8,
  },
  pointsText: {
    color: '#6200EE',
    fontSize: 20,
    fontWeight: 'bold',
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
  taskCard: {
    margin: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#666',
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
  taskMeta: {
    flexDirection: 'row',
    gap: 4,
  },
  taskDescription: {
    marginBottom: 12,
    color: '#666',
  },
  taskDetails: {
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#66BB6A',
  },
  statusChip: {
    height: 28,
  },
  overdueChip: {
    height: 28,
    backgroundColor: '#EF5350',
  },
  pointsBadge: {
    backgroundColor: '#66BB6A',
  },
  rejectionReason: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rejectionLabel: {
    fontWeight: 'bold',
    color: '#EF5350',
    marginBottom: 4,
  },
  rejectionText: {
    color: '#EF5350',
  },
  emptyCard: {
    margin: 16,
    alignItems: 'center',
  },
  emptyIcon: {
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#666',
  },
});