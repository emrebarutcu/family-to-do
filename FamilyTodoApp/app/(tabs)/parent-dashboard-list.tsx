import { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CalendarList } from 'react-native-calendars';
import { useRouter } from 'expo-router';

const BG_COLOR = '#f7f8fa';
const CARD_COLOR = '#fff';
const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

const children = [
  { name: 'Ethan', color: '#6C63FF' },
  { name: 'Sophia', color: '#FF6584' },
  { name: 'Caleb', color: '#43D9AD' },
];
const tasks = {
  pending: [
    { title: 'Clean your room', child: 'Ethan', type: 'home', status: 'pending', color: '#6C63FF' },
    { title: 'Finish homework', child: 'Sophia', type: 'book', status: 'pending', color: '#FF6584' },
  ],
  completed: [
    { title: 'Walk the dog', child: 'Caleb', type: 'paw', status: 'completed', color: '#43D9AD' },
  ],
  awaiting: [
    { title: 'Do the dishes', child: 'Ethan', type: 'question', status: 'awaiting', color: '#7C3AED' },
  ],
};
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export default function ParentDashboardScreen() {
  const [mode, setMode] = useState<'list' | 'calendar'>('list');
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(today));
  const calendarTasks = [
    { date: formatDate(today), time: '3:00 PM', title: 'Complete Math Homework', child: 'Sophia', type: 'book', status: 'pending', color: '#FF6584' },
    { date: formatDate(today), time: '4:30 PM', title: 'Practice Piano', child: 'Ethan', type: 'music', status: 'pending', color: '#6C63FF' },
    { date: formatDate(new Date(today.getTime() + 86400000)), time: '6:00 PM', title: 'Help with Dinner', child: 'Caleb', type: 'question', status: 'awaiting', color: '#7C3AED' },
  ];
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}> 
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Pressable style={styles.headerIconBtn} onPress={() => router.push('/(tabs)/add-task')}>
            <FontAwesome name="plus" size={22} color="#222" />
          </Pressable>
        </View>
        {/* Toggle */}
        <View style={styles.toggleWrapper}>
          <View style={styles.toggleContainer}>
            <Pressable
              style={[styles.toggleButton, mode === 'list' && styles.activeButton]}
              onPress={() => setMode('list')}
            >
              <Text style={[styles.toggleText, mode === 'list' && styles.activeText]}>List</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, mode === 'calendar' && styles.activeButton]}
              onPress={() => setMode('calendar')}
            >
              <Text style={[styles.toggleText, mode === 'calendar' && styles.activeText]}>Calendar</Text>
            </Pressable>
          </View>
        </View>
        {/* Child Filter */}
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childScroll} contentContainerStyle={styles.childScrollContent}>
            {children.map(child => (
              <Pressable
                key={child.name}
                style={[styles.childButton, selectedChild === child.name && { backgroundColor: child.color + '22', borderColor: child.color }]}
                onPress={() => setSelectedChild(selectedChild === child.name ? null : child.name)}
              >
                <View style={[styles.avatar, { backgroundColor: child.color }]}> 
                  <Text style={styles.avatarText}>{child.name[0]}</Text>
                </View>
                <Text style={[styles.childButtonText, selectedChild === child.name && { color: child.color, fontWeight: '700' }]}>{child.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        {/* Content */}
        {mode === 'list' ? (
          <ScrollView style={styles.sections} contentContainerStyle={{ paddingBottom: 32 }}>
            <Section title="Pending" data={tasks.pending.filter(t => !selectedChild || t.child === selectedChild)} />
            <Section title="Completed" data={tasks.completed.filter(t => !selectedChild || t.child === selectedChild)} />
            <Section title="Awaiting Approval" data={tasks.awaiting.filter(t => !selectedChild || t.child === selectedChild)} />
          </ScrollView>
        ) : (
          <ScrollView style={styles.calendarContainer} contentContainerStyle={styles.calendarScrollContent}>
            <View style={styles.calendarCard}>
              <CalendarList
                horizontal
                pagingEnabled
                style={styles.calendarList}
                theme={{
                  backgroundColor: CARD_COLOR,
                  calendarBackground: CARD_COLOR,
                  selectedDayBackgroundColor: '#0a80ed',
                  selectedDayTextColor: '#fff',
                  todayTextColor: '#0a80ed',
                  dayTextColor: '#0f1417',
                  textDisabledColor: '#d9e1e8',
                  monthTextColor: '#0f1417',
                  arrowColor: '#0a80ed',
                  textDayFontWeight: '500',
                  textMonthFontWeight: '700',
                  textDayHeaderFontWeight: '700',
                  textDayFontSize: 15,
                  textMonthFontSize: 17,
                  textDayHeaderFontSize: 13,
                }}
                markedDates={{
                  [selectedDate]: { selected: true, marked: true, selectedColor: '#0a80ed' },
                  ...calendarTasks.reduce((acc, t) => {
                    acc[t.date] = acc[t.date] || { marked: true, dotColor: t.color };
                    return acc;
                  }, {} as any),
                }}
                onDayPress={day => setSelectedDate(day.dateString)}
                pastScrollRange={2}
                futureScrollRange={2}
                showScrollIndicator={false}
              />
              <View style={styles.calendarTasksSection}>
                {calendarTasks.filter(t => t.date === selectedDate && (!selectedChild || t.child === selectedChild)).length === 0 ? (
                  <Text style={styles.emptyText}>No tasks for this day</Text>
                ) : (
                  calendarTasks.filter(t => t.date === selectedDate && (!selectedChild || t.child === selectedChild)).map((task, idx) => (
                    <TaskCard key={idx} task={task} />
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

type Task = {
  title: string;
  child: string;
  type: string;
  status: string;
  color: string;
  [key: string]: any;
};

type SectionProps = {
  title: string;
  data: Task[];
};

type TaskCardProps = {
  task: Task;
};

function Section({ title, data }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.emptyText}>No tasks</Text>
      ) : (
        data.map((task, idx) => <TaskCard key={idx} task={task} />)
      )}
    </View>
  );
}

function TaskCard({ task }: TaskCardProps) {
  const statusIcon =
    task.status === 'completed' ? 'check-circle' :
    task.status === 'pending' ? 'clock-o' : 'hourglass-half';
  const statusColor =
    task.status === 'completed' ? '#43D9AD' :
    task.status === 'pending' ? '#FFB200' : '#7C3AED';
  return (
    <View style={[styles.taskCard, SHADOW]}>
      <View style={[styles.taskIconCircle, { backgroundColor: task.color + '22' }]}> 
        <FontAwesome name={task.type as React.ComponentProps<typeof FontAwesome>["name"]} size={20} color={task.color} />
      </View>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskChild}>{task.child}</Text>
      </View>
      <View style={styles.statusDotWrap}>
        <FontAwesome name={statusIcon} size={20} color={statusColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181b',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CARD_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  toggleWrapper: {
    alignItems: 'center',
    marginBottom: 0,
    marginTop: -10,
  },
  chipsContainer: {
    paddingVertical: 10,
    paddingTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: CARD_COLOR,
    ...SHADOW,
  },
  toggleText: {
    fontSize: 17,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  activeText: {
    color: '#18181b',
    fontWeight: 'bold',
  },
  childScroll: {
    marginBottom: 0,
    paddingLeft: 12,
  },
  childScrollContent: {
    alignItems: 'center',
    paddingRight: 8,
  },
  childButton: {
    backgroundColor: '#f1f2f6',
    borderRadius: 16,
    paddingVertical: 0,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  childButtonText: {
    fontSize: 15,
    color: '#18181b',
    fontWeight: '600',
  },
  sections: {
    flex: 1,
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: 18,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 10,
    marginLeft: 2,
  },
  emptyText: {
    color: '#a1a1aa',
    fontStyle: 'italic',
    marginLeft: 8,
    fontSize: 15,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_COLOR,
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
    ...SHADOW,
  },
  taskIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#18181b',
  },
  taskChild: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '600',
    marginTop: 2,
  },
  statusDotWrap: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: BG_COLOR,
    flexGrow: 1,
  },
  calendarScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 32,
  },
  calendarCard: {
    width: '100%',
    marginHorizontal: 0,
    backgroundColor: CARD_COLOR,
    borderRadius: 16,
    paddingVertical: 10,
    ...SHADOW,
  },
  calendarList: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'stretch',
  },
  calendarTasksSection: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
}); 