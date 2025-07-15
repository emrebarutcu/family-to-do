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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const SettingsScreen: React.FC = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [childSurname, setChildSurname] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [childPassword, setChildPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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

  const validateChildData = () => {
    if (!childName.trim() || !childSurname.trim()) {
      return 'Name and surname are required';
    }
    if (!childEmail.trim()) {
      return 'Email is required for child login';
    }
    if (!childPassword.trim()) {
      return 'Password is required for child login';
    }
    if (childPassword.length < 6) {
      return 'Password must be at least 6 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(childEmail)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleAddChild = async () => {
    const error = validateChildData();
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    setLoading(true);
    try {
      await addChildToFamily({
        name: childName.trim(),
        surname: childSurname.trim(),
        email: childEmail.trim(),
        password: childPassword.trim(),
      });

      Alert.alert('Success', 'Child added successfully! They can now log in with their credentials.');
      setChildName('');
      setChildSurname('');
      setChildEmail('');
      setChildPassword('');
      setShowAddChildModal(false);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const passwords = ['Family123!', 'Kids2024!', 'MyChild123!', 'FunTime123!', 'Happy123!'];
    const randomPassword = passwords[Math.floor(Math.random() * passwords.length)] + Math.floor(Math.random() * 100);
    setChildPassword(randomPassword);
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
          color={destructive ? '#FF6B6B' : '#667eea'}
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
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.childAvatar}
        >
          <Text style={styles.childAvatarText}>
            {child.name.charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>
        <View style={styles.childDetails}>
          <Text style={styles.childName}>{child.name} {child.surname}</Text>
          <Text style={styles.childEmail}>{child.email}</Text>
          <Text style={styles.childPoints}>{child.points || 0} points</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.childEditButton}
        onPress={() => Alert.alert('Info', 'Edit child functionality coming soon!')}
      >
        <Ionicons name="pencil" size={16} color="#667eea" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="person" size={20} color="#667eea" /> Profile
          </Text>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.profileAvatar}
            >
              <Text style={styles.profileAvatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
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
          <Text style={styles.sectionTitle}>
            <Ionicons name="home" size={20} color="#667eea" /> Family
          </Text>
          <View style={styles.familyCard}>
            <View style={styles.familyHeader}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.familyIcon}
              >
                <Ionicons name="home" size={20} color="#fff" />
              </LinearGradient>
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
              <Text style={styles.sectionTitle}>
                <Ionicons name="people" size={20} color="#667eea" /> Children
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddChildModal(true)}
              >
                <LinearGradient
                  colors={['rgba(102, 126, 234, 0.1)', 'rgba(102, 126, 234, 0.05)']}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add" size={20} color="#667eea" />
                  <Text style={styles.addButtonText}>Add Child</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {children.length > 0 ? (
              <View style={styles.childrenContainer}>
                {children.map(renderChildItem)}
              </View>
            ) : (
              <View style={styles.emptyChildren}>
                <Ionicons name="people" size={48} color="#999" />
                <Text style={styles.emptyText}>No children added yet</Text>
                <Text style={styles.emptySubtext}>Add your first child to get started</Text>
              </View>
            )}
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="settings" size={20} color="#667eea" /> Settings
          </Text>
          <View style={styles.settingsContainer}>
            {renderSettingItem(
              'notifications',
              'Push Notifications',
              'Get notified about task updates',
              undefined,
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E0E0E0', true: '#667eea' }}
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
          <Text style={styles.sectionTitle}>
            <Ionicons name="key" size={20} color="#667eea" /> Account
          </Text>
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
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={styles.modalGradient}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Child</Text>
                <TouchableOpacity
                  onPress={() => setShowAddChildModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.modalForm}>
                  <View style={styles.infoContainer}>
                    <Ionicons name="information-circle" size={20} color="#667eea" />
                    <Text style={styles.infoText}>
                      Set up login credentials for your child. They will use these to access their tasks.
                    </Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="person" size={16} color="#667eea" /> First Name *
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={childName}
                      onChangeText={setChildName}
                      placeholder="Enter child's first name"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="person" size={16} color="#667eea" /> Last Name *
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={childSurname}
                      onChangeText={setChildSurname}
                      placeholder="Enter child's last name"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="mail" size={16} color="#667eea" /> Email *
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={childEmail}
                      onChangeText={setChildEmail}
                      placeholder="Enter email for child login"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="lock-closed" size={16} color="#667eea" /> Password *
                    </Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={childPassword}
                        onChangeText={setChildPassword}
                        placeholder="Enter password (min 6 characters)"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off" : "eye"} 
                          size={20} 
                          color="#667eea" 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.generateButton}
                        onPress={generatePassword}
                      >
                        <Ionicons name="refresh" size={20} color="#667eea" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleAddChild}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={loading ? ['#B0B0B0', '#999'] : ['#667eea', '#764ba2']}
                      style={styles.buttonGradient}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <View style={styles.buttonContent}>
                          <Ionicons name="person-add" size={20} color="#fff" />
                          <Text style={styles.buttonText}>Add Child</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </LinearGradient>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 15,
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 12,
  },
  addButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  familyCard: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  familyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  familyMembers: {
    fontSize: 14,
    color: '#666',
    marginLeft: 42,
  },
  childrenContainer: {
    gap: 10,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  childEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  childPoints: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  childEditButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  emptyChildren: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  settingsContainer: {
    gap: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  destructiveItem: {
    borderBottomColor: '#FFE5E5',
  },
  destructiveText: {
    color: '#FF6B6B',
  },
  modalGradient: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 10,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  generateButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;