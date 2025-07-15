import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const SettingsScreen: React.FC = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [childSurname, setChildSurname] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { user, logout } = useAuth();
  const { family, familyMembers, addChildToFamily } = useApp();

  const isParent = user?.role === 'parent';
  const children = familyMembers.filter(member => member.role === 'child');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleAddChild = async () => {
    if (!childName.trim() || !childSurname.trim()) {
      Alert.alert('Error', 'Please fill in the required fields');
      return;
    }

    setLoading(true);
    try {
      await addChildToFamily({
        name: childName.trim(),
        surname: childSurname.trim(),
        email: childEmail.trim() || undefined,
      });

      Alert.alert('Success', 'Child added successfully!');
      setChildName('');
      setChildSurname('');
      setChildEmail('');
      setShowAddChildModal(false);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    destructive?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, destructive && styles.destructiveItem]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={destructive ? '#FF4444' : '#007AFF'}
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent || (
        <Ionicons name="chevron-forward" size={20} color="#999" />
      )}
    </TouchableOpacity>
  );

  const renderChildItem = (child: any) => (
    <View key={child.id} style={styles.childItem}>
      <View style={styles.childInfo}>
        <View style={styles.childAvatar}>
          <Text style={styles.childAvatarText}>
            {child.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.childDetails}>
          <Text style={styles.childName}>{child.name} {child.surname}</Text>
          <Text style={styles.childPoints}>{child.points || 0} points</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.childEditButton}
        onPress={() => Alert.alert('Info', 'Edit child functionality coming soon!')}
      >
        <Ionicons name="pencil" size={16} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name} {user?.surname}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>
                {isParent ? 'Parent' : 'Child'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Family Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family</Text>
        <View style={styles.familyCard}>
          <View style={styles.familyHeader}>
            <Ionicons name="home" size={24} color="#007AFF" />
            <Text style={styles.familyName}>{family?.family_name}</Text>
          </View>
          <Text style={styles.familyMembers}>
            {familyMembers.length} member{familyMembers.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Children Management (Parents Only) */}
      {isParent && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Children</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddChildModal(true)}
            >
              <Ionicons name="add" size={20} color="#007AFF" />
              <Text style={styles.addButtonText}>Add Child</Text>
            </TouchableOpacity>
          </View>
          
          {children.length > 0 ? (
            <View style={styles.childrenContainer}>
              {children.map(renderChildItem)}
            </View>
          ) : (
            <View style={styles.emptyChildren}>
              <Text style={styles.emptyText}>No children added yet</Text>
            </View>
          )}
        </View>
      )}

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsContainer}>
          {renderSettingItem(
            'notifications',
            'Push Notifications',
            'Get notified about task updates',
            undefined,
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          )}
          
          {renderSettingItem(
            'help-circle',
            'Help & Support',
            'Get help with using the app',
            () => Alert.alert('Help', 'Help functionality coming soon!')
          )}
          
          {renderSettingItem(
            'information-circle',
            'About',
            'App version and information',
            () => Alert.alert('About', 'Family To-Do App v1.0.0\nBuilt with React Native & Expo')
          )}
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsContainer}>
          {renderSettingItem(
            'log-out',
            'Logout',
            'Sign out of your account',
            handleLogout,
            undefined,
            true
          )}
        </View>
      </View>

      {/* Add Child Modal */}
      <Modal
        visible={showAddChildModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddChildModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Child</Text>
            <TouchableOpacity
              onPress={() => setShowAddChildModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={childName}
                onChangeText={setChildName}
                placeholder="Enter child's first name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={childSurname}
                onChangeText={setChildSurname}
                placeholder="Enter child's last name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={styles.input}
                value={childEmail}
                onChangeText={setChildEmail}
                placeholder="Enter child's email (optional)"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAddChild}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="person-add" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Add Child</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  familyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  familyMembers: {
    fontSize: 14,
    color: '#666',
    marginLeft: 34,
  },
  childrenContainer: {
    marginTop: 10,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  childPoints: {
    fontSize: 12,
    color: '#666',
  },
  childEditButton: {
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  emptyChildren: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  settingsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  destructiveItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  destructiveText: {
    color: '#FF4444',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;