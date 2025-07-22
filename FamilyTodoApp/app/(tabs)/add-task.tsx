import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG_COLOR = '#f7f8fa';
const CARD_COLOR = '#fff';
const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

const CATEGORIES = [
  { key: 'homework', label: 'Homework', icon: 'pencil' },
  { key: 'chores', label: 'Chores', icon: 'home' },
  { key: 'reading', label: 'Reading', icon: 'book' },
  { key: 'other', label: 'Other', icon: 'asterisk' },
];

export default function AddTaskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [starReward, setStarReward] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  // Placeholder avatars (replace with real data)
  const avatars = [
    { id: '1', name: 'Ethan', color: '#6C63FF' },
    { id: '2', name: 'Sophia', color: '#FF6584' },
    { id: '3', name: 'Caleb', color: '#43D9AD' },
  ];

  const handleAssign = (id: string) => {
    setAssignedTo((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddTask = () => {
    // TODO: Implement task creation logic
    // Reset form or navigate away
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header OUTSIDE ScrollView */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Task</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Card: Task Details */}
        <View style={styles.card}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={taskName}
            onChangeText={setTaskName}
            placeholderTextColor="#4d7399"
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#4d7399"
          />
        </View>
        {/* Card: Category (Bottom Sheet Picker) */}
        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.categoryField}
            onPress={() => setShowCategorySheet(true)}
            activeOpacity={0.85}
          >
            <FontAwesome name={CATEGORIES.find(c => c.key === category)?.icon as any} size={18} color="#1282eb" style={{ marginRight: 10 }} />
            <Text style={styles.categoryFieldText}>{CATEGORIES.find(c => c.key === category)?.label}</Text>
            <FontAwesome name="chevron-down" size={16} color="#1282eb" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          {/* Bottom Sheet Modal */}
          <Modal
            visible={showCategorySheet}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCategorySheet(false)}
          >
            <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setShowCategorySheet(false)} />
            <View style={styles.sheetContainer}>
              <Text style={styles.sheetTitle}>Select Category</Text>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.sheetOption, category === cat.key && styles.sheetOptionSelected]}
                  onPress={() => {
                    setCategory(cat.key);
                    setShowCategorySheet(false);
                  }}
                  activeOpacity={0.85}
                >
                  <FontAwesome name={cat.icon as any} size={22} color={category === cat.key ? '#1282eb' : '#4d7399'} style={{ marginRight: 16 }} />
                  <Text style={[styles.sheetOptionText, category === cat.key && styles.sheetOptionTextSelected]}>{cat.label}</Text>
                  {category === cat.key && (
                    <FontAwesome name="check" size={18} color="#1282eb" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
        </View>
        {/* Card: Reward, Due Date, Repeat */}
        <View style={styles.card}>
          <Text style={styles.label}>Star Reward</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter star reward"
            value={starReward}
            onChangeText={setStarReward}
            keyboardType="numeric"
            placeholderTextColor="#4d7399"
          />
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <FontAwesome name="calendar" size={18} color="#1282eb" style={{ marginRight: 8 }} />
            <Text style={{ color: dueDate ? '#0d141c' : '#4d7399', fontSize: 16 }}>
              {dueDate ? dueDate : 'Select due date'}
            </Text>
          </TouchableOpacity>
          {/* Native iOS Action Sheet Date Picker */}
          {Platform.OS === 'ios' && showDatePicker && (
            <DateTimePicker
              value={dueDate ? new Date(dueDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const yyyy = selectedDate.getFullYear();
                  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const dd = String(selectedDate.getDate()).padStart(2, '0');
                  setDueDate(`${yyyy}-${mm}-${dd}`);
                }
              }}
              minimumDate={new Date()}
            />
          )}
          {/* Android Inline Picker */}
          {Platform.OS === 'android' && showDatePicker && (
            <DateTimePicker
              value={dueDate ? new Date(dueDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const yyyy = selectedDate.getFullYear();
                  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const dd = String(selectedDate.getDate()).padStart(2, '0');
                  setDueDate(`${yyyy}-${mm}-${dd}`);
                }
              }}
              minimumDate={new Date()}
            />
          )}
          <Text style={styles.label}>Repeat</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Daily, Weekly"
            value={repeat}
            onChangeText={setRepeat}
            placeholderTextColor="#4d7399"
          />
        </View>
        {/* Card: Assign To */}
        <View style={styles.card}>
          <Text style={styles.label}>Assign to</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarScrollContent}>
            {avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[styles.avatarChip, assignedTo.includes(avatar.id) && { backgroundColor: avatar.color + '22', borderColor: avatar.color }]}
                onPress={() => handleAssign(avatar.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.avatarCircle, { backgroundColor: avatar.color }]}>
                  <Text style={styles.avatarInitial}>{avatar.name[0]}</Text>
                </View>
                <Text style={[styles.avatarName, assignedTo.includes(avatar.id) && { color: avatar.color, fontWeight: '700' }]}>{avatar.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Add Button at the end of the form */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask} activeOpacity={0.9}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  scrollContainer: {
    padding: 0,
    paddingBottom: 32,
    backgroundColor: BG_COLOR,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: BG_COLOR,
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
  card: {
    backgroundColor: CARD_COLOR,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    ...SHADOW,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0d141c',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#e8edf2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0d141c',
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8edf2',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipText: {
    fontSize: 15,
    color: '#1282eb',
    fontWeight: '600',
  },
  categoryScrollContent: {
    alignItems: 'center',
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
  },
  avatarScrollContent: {
    alignItems: 'center',
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
  },
  avatarChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8edf2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarInitial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  avatarName: {
    fontSize: 15,
    color: '#18181b',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#1282eb',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    ...SHADOW,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  categoryField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8edf2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  categoryFieldText: {
    fontSize: 16,
    color: '#0d141c',
    fontWeight: '600',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 18,
    paddingBottom: 32,
    paddingHorizontal: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 18,
    textAlign: 'center',
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#f1f2f6',
  },
  sheetOptionSelected: {
    backgroundColor: '#e8f1fb',
    borderRadius: 10,
  },
  sheetOptionText: {
    fontSize: 16,
    color: '#0d141c',
    fontWeight: '600',
  },
  sheetOptionTextSelected: {
    color: '#1282eb',
    fontWeight: 'bold',
  },
}); 