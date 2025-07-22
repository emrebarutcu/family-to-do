import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PendingTask {
  id: string;
  title: string;
  notes: string;
  completedBy: string;
  icon: string;
}

export default function TaskApprovalsScreen() {
  const router = useRouter();

  // Sample pending tasks data
  const pendingTasks: PendingTask[] = [
    {
      id: '1',
      title: 'Cleaned the Room',
      notes: 'I finished all my chores!',
      completedBy: 'Alex',
      icon: 'home',
    },
    {
      id: '2',
      title: 'Watered the Plants',
      notes: 'I did it!',
      completedBy: 'Sophia',
      icon: 'leaf',
    },
    {
      id: '3',
      title: 'Took Out the Trash',
      notes: 'All done!',
      completedBy: 'Ethan',
      icon: 'trash',
    },
  ];

  const handleApprove = (taskId: string) => {
    // Handle approve action
    console.log('Approving task:', taskId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#121417" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Approvals</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>

          {pendingTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskContent}>
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <Ionicons name={task.icon as any} size={24} color="#5c738a" />
                </View>

                {/* Task Details */}
                <View style={styles.taskDetails}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskNotes}>Notes: {task.notes}</Text>
                  <Text style={styles.taskCompletedBy}>Completed by {task.completedBy}</Text>
                </View>
              </View>

              {/* Approve Button */}
              <TouchableOpacity 
                style={styles.approveButton}
                onPress={() => handleApprove(task.id)}
              >
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ebedf2',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#121417',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#121417',
    marginTop: 20,
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#fafafa',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ebedf2',
    paddingBottom: 12,
  },
  taskContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#ebedf2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: '#121417',
    marginBottom: 4,
  },
  taskNotes: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#5c738a',
    marginBottom: 4,
  },
  taskCompletedBy: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#5c738a',
  },
  approveButton: {
    width: 89,
    height: 32,
    backgroundColor: '#ebedf2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  approveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: '#121417',
  },
}); 