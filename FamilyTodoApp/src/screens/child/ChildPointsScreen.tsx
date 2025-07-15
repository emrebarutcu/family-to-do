import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Task, Reward } from '../../types';

const ChildPointsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const { familyMembers, tasks, rewards, refreshData } = useApp();
  const { user } = useAuth();

  const myProfile = familyMembers.find(member => member.id === user?.id);
  const myTasks = tasks.filter(task => task.assigned_to === user?.id);
  const completedTasks = myTasks.filter(task => task.status === 'approved');
  const currentPoints = myProfile?.points || 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleRewardPress = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRewardModal(true);
  };

  const handleClaimReward = () => {
    if (selectedReward && currentPoints >= selectedReward.points_required) {
      Alert.alert(
        'Claim Reward',
        `Are you sure you want to claim "${selectedReward.title}" for ${selectedReward.points_required} points?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Claim',
            onPress: () => {
              Alert.alert(
                'Reward Claimed!',
                'Please ask your parent to give you your reward!',
                [{ text: 'OK', onPress: () => setShowRewardModal(false) }]
              );
            },
          },
        ]
      );
    }
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

  const renderRewardItem = (reward: Reward) => {
    const canClaim = currentPoints >= reward.points_required;
    const progress = Math.min((currentPoints / reward.points_required) * 100, 100);

    return (
      <TouchableOpacity
        key={reward.id}
        style={[styles.rewardItem, !canClaim && styles.lockedReward]}
        onPress={() => handleRewardPress(reward)}
      >
        <View style={styles.rewardHeader}>
          <View style={styles.rewardTitleContainer}>
            <Ionicons
              name={canClaim ? 'gift' : 'lock-closed'}
              size={24}
              color={canClaim ? '#4CAF50' : '#999'}
            />
            <Text style={[styles.rewardTitle, !canClaim && styles.lockedText]}>
              {reward.title}
            </Text>
          </View>
          <View style={[styles.rewardCost, canClaim && styles.affordableReward]}>
            <Ionicons name="star" size={16} color={canClaim ? '#4CAF50' : '#999'} />
            <Text style={[styles.rewardCostText, canClaim && styles.affordableText]}>
              {reward.points_required} pts
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentPoints}/{reward.points_required} pts
          </Text>
        </View>

        {canClaim && (
          <View style={styles.canClaimBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.canClaimText}>Ready to claim!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTaskHistoryItem = (task: Task) => (
    <View key={task.id} style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View style={styles.historyTitleContainer}>
          <Ionicons
            name={getTaskIcon(task.type)}
            size={20}
            color={getTaskTypeColor(task.type)}
          />
          <Text style={styles.historyTitle}>{task.title}</Text>
        </View>
        <View style={styles.historyPoints}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.historyPointsText}>+{task.points}</Text>
        </View>
      </View>
      <Text style={styles.historyDate}>
        Completed: {task.approved_at ? new Date(task.approved_at).toLocaleDateString() : 'N/A'}
      </Text>
    </View>
  );

  const totalPointsEarned = completedTasks.reduce((sum, task) => sum + task.points, 0);
  const averagePointsPerTask = completedTasks.length > 0 ? Math.round(totalPointsEarned / completedTasks.length) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>My Points</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={32} color="#FFD700" />
          <Text style={styles.pointsText}>{currentPoints}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPointsEarned}</Text>
            <Text style={styles.statLabel}>Total Points Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{averagePointsPerTask}</Text>
            <Text style={styles.statLabel}>Avg Points/Task</Text>
          </View>
        </View>

        {/* Available Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          {rewards.length > 0 ? (
            rewards.map(renderRewardItem)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No rewards available yet</Text>
            </View>
          )}
        </View>

        {/* Task History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Completed Tasks</Text>
          {completedTasks.length > 0 ? (
            completedTasks.slice(0, 5).map(renderTaskHistoryItem)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No completed tasks yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Reward Detail Modal */}
      <Modal
        visible={showRewardModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRewardModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reward Details</Text>
            <TouchableOpacity
              onPress={() => setShowRewardModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {selectedReward && (
            <View style={styles.modalContent}>
              <View style={styles.modalRewardContainer}>
                <Ionicons
                  name="gift"
                  size={64}
                  color={currentPoints >= selectedReward.points_required ? '#4CAF50' : '#999'}
                />
                <Text style={styles.modalRewardTitle}>{selectedReward.title}</Text>
                <Text style={styles.modalRewardCost}>
                  {selectedReward.points_required} points
                </Text>
              </View>

              <View style={styles.modalProgressContainer}>
                <Text style={styles.modalProgressLabel}>Your Progress</Text>
                <View style={styles.modalProgressBar}>
                  <View
                    style={[
                      styles.modalProgressFill,
                      {
                        width: `${Math.min((currentPoints / selectedReward.points_required) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.modalProgressText}>
                  {currentPoints} / {selectedReward.points_required} points
                </Text>
              </View>

              {currentPoints >= selectedReward.points_required ? (
                <TouchableOpacity
                  style={styles.claimButton}
                  onPress={handleClaimReward}
                >
                  <Ionicons name="gift" size={20} color="#fff" />
                  <Text style={styles.claimButtonText}>Claim Reward</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.needMoreContainer}>
                  <Text style={styles.needMoreText}>
                    You need {selectedReward.points_required - currentPoints} more points
                  </Text>
                  <Text style={styles.encouragementText}>
                    Keep completing tasks to earn more points!
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
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
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  pointsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  rewardItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  lockedReward: {
    opacity: 0.6,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  lockedText: {
    color: '#999',
  },
  rewardCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  affordableReward: {
    backgroundColor: '#E8F5E8',
  },
  rewardCostText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginLeft: 4,
  },
  affordableText: {
    color: '#4CAF50',
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  canClaimBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    paddingVertical: 8,
    borderRadius: 8,
  },
  canClaimText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 5,
  },
  historyItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  historyPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  historyPointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF8F00',
    marginLeft: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
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
  modalRewardContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalRewardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  modalRewardCost: {
    fontSize: 18,
    color: '#666',
  },
  modalProgressContainer: {
    marginBottom: 30,
  },
  modalProgressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  modalProgressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  modalProgressText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  needMoreContainer: {
    alignItems: 'center',
    padding: 20,
  },
  needMoreText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  encouragementText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ChildPointsScreen;