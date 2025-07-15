import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

const RewardsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [loading, setLoading] = useState(false);

  const { rewards, createReward, refreshData } = useApp();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleCreateReward = async () => {
    if (!rewardTitle.trim()) {
      Alert.alert('Error', 'Please enter a reward title');
      return;
    }

    const pointsNumber = parseInt(rewardPoints);
    if (isNaN(pointsNumber) || pointsNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid number of points');
      return;
    }

    setLoading(true);
    try {
      await createReward({
        title: rewardTitle.trim(),
        points_required: pointsNumber,
      });

      Alert.alert('Success', 'Reward created successfully!');
      setRewardTitle('');
      setRewardPoints('');
      setShowCreateModal(false);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create reward');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRewardTitle('');
    setRewardPoints('');
  };

  const renderRewardItem = (reward: any) => (
    <View key={reward.id} style={styles.rewardItem}>
      <View style={styles.rewardHeader}>
        <View style={styles.rewardTitleContainer}>
          <Ionicons name="gift" size={24} color="#4CAF50" />
          <Text style={styles.rewardTitle}>{reward.title}</Text>
        </View>
        <View style={styles.rewardCost}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rewardCostText}>{reward.points_required} pts</Text>
        </View>
      </View>
      
      <View style={styles.rewardFooter}>
        <Text style={styles.rewardDate}>
          Created: {new Date(reward.created_at).toLocaleDateString()}
        </Text>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Info', 'Edit functionality coming soon!')}
        >
          <Ionicons name="pencil" size={16} color="#007AFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards Management</Text>
        <Text style={styles.subtitle}>Create rewards for your children to earn</Text>
        
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create New Reward</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {rewards.length > 0 ? (
          <View style={styles.rewardsContainer}>
            {rewards.map(renderRewardItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="gift-outline" size={64} color="#999" />
            <Text style={styles.emptyTitle}>No Rewards Yet</Text>
            <Text style={styles.emptyText}>
              Create your first reward to motivate your children!
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={20} color="#007AFF" />
              <Text style={styles.emptyActionText}>Create Reward</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for Creating Rewards</Text>
          <Text style={styles.tipText}>
            • Start with small, achievable rewards (10-50 points)
          </Text>
          <Text style={styles.tipText}>
            • Include both material and activity-based rewards
          </Text>
          <Text style={styles.tipText}>
            • Make sure rewards are age-appropriate
          </Text>
          <Text style={styles.tipText}>
            • Consider rewards that encourage family time
          </Text>
        </View>
      </ScrollView>

      {/* Create Reward Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Reward</Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reward Title *</Text>
              <TextInput
                style={styles.input}
                value={rewardTitle}
                onChangeText={setRewardTitle}
                placeholder="e.g., Extra 30 minutes of screen time"
                placeholderTextColor="#999"
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Points Required *</Text>
              <TextInput
                style={styles.input}
                value={rewardPoints}
                onChangeText={setRewardPoints}
                placeholder="e.g., 50"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Reward Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewTitleContainer}>
                    <Ionicons name="gift" size={20} color="#4CAF50" />
                    <Text style={styles.previewRewardTitle}>
                      {rewardTitle || 'Reward Title'}
                    </Text>
                  </View>
                  <View style={styles.previewCost}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.previewCostText}>
                      {rewardPoints || '0'} pts
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCreateReward}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Create Reward</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                <Text style={styles.resetButtonText}>Reset Form</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>💡 Reward Ideas</Text>
              <View style={styles.suggestionsList}>
                <Text style={styles.suggestion}>• Extra screen time (30-60 mins)</Text>
                <Text style={styles.suggestion}>• Choose tonight's dinner</Text>
                <Text style={styles.suggestion}>• Stay up 15 minutes later</Text>
                <Text style={styles.suggestion}>• Pick the family movie</Text>
                <Text style={styles.suggestion}>• Special one-on-one time</Text>
                <Text style={styles.suggestion}>• Small toy or treat</Text>
                <Text style={styles.suggestion}>• Friend sleepover</Text>
                <Text style={styles.suggestion}>• Skip one chore</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6F3FF',
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  rewardsContainer: {
    marginBottom: 20,
  },
  rewardItem: {
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
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  rewardCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  rewardCostText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8F00',
    marginLeft: 4,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardDate: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyActionText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
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
  previewContainer: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  previewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  previewRewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  previewCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewCostText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF8F00',
    marginLeft: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
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
  resetButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  suggestionsList: {
    marginTop: 5,
  },
  suggestion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default RewardsScreen;