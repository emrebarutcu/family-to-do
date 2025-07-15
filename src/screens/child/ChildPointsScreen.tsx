import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  List, 
  Avatar,
  Badge,
  ProgressBar,
  Divider
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';
import { Task } from '../../types';

export const ChildPointsScreen: React.FC = () => {
  const { user } = useAuth();
  const { members, tasks, rewards, isLoading, refreshData } = useFamily();

  const myTasks = tasks.filter(task => task.assignedTo === user?.id);
  const approvedTasks = myTasks.filter(task => task.status === 'approved');
  const totalPointsEarned = approvedTasks.reduce((sum, task) => sum + task.points, 0);

  const getRewardProgress = (rewardPoints: number) => {
    return Math.min((user?.points || 0) / rewardPoints, 1);
  };

  const canClaimReward = (rewardPoints: number) => {
    return (user?.points || 0) >= rewardPoints;
  };

  const getTaskTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'chore': return 'home';
      case 'homework': return 'school';
      case 'other': return 'star';
      default: return 'check';
    }
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
      <Card style={styles.pointsCard}>
        <Card.Content>
          <View style={styles.pointsHeader}>
            <Avatar.Icon size={80} icon="stars" style={styles.pointsIcon} />
            <View style={styles.pointsInfo}>
              <Title style={styles.pointsTitle}>{user?.points || 0}</Title>
              <Paragraph style={styles.pointsLabel}>Total Points</Paragraph>
            </View>
          </View>
          <View style={styles.pointsStats}>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{approvedTasks.length}</Title>
              <Paragraph>Tasks Completed</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{totalPointsEarned}</Title>
              <Paragraph>Points Earned</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{rewards.length}</Title>
              <Paragraph>Rewards Available</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.rewardsCard}>
        <Card.Content>
          <Title>Available Rewards</Title>
          <Paragraph style={styles.sectionDescription}>
            Earn points by completing tasks to unlock these rewards!
          </Paragraph>
          {rewards.map(reward => (
            <View key={reward.id} style={styles.rewardItem}>
              <View style={styles.rewardHeader}>
                <Avatar.Icon 
                  size={48} 
                  icon="gift" 
                  style={[
                    styles.rewardIcon, 
                    { backgroundColor: canClaimReward(reward.pointsRequired) ? '#66BB6A' : '#9E9E9E' }
                  ]}
                />
                <View style={styles.rewardInfo}>
                  <Title style={styles.rewardTitle}>{reward.title}</Title>
                  <Paragraph style={styles.rewardPoints}>
                    {reward.pointsRequired} points required
                  </Paragraph>
                </View>
                <View style={styles.rewardStatus}>
                  {canClaimReward(reward.pointsRequired) ? (
                    <Badge style={styles.canClaimBadge}>Can Claim!</Badge>
                  ) : (
                    <Badge style={styles.cannotClaimBadge}>
                      {reward.pointsRequired - (user?.points || 0)} more needed
                    </Badge>
                  )}
                </View>
              </View>
              <ProgressBar 
                progress={getRewardProgress(reward.pointsRequired)} 
                color={canClaimReward(reward.pointsRequired) ? '#66BB6A' : '#6200EE'}
                style={styles.progressBar}
              />
              <Paragraph style={styles.progressText}>
                {user?.points || 0} / {reward.pointsRequired} points
              </Paragraph>
            </View>
          ))}
          {rewards.length === 0 && (
            <Paragraph style={styles.emptyText}>
              No rewards available yet. Ask your parents to create some rewards!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.historyCard}>
        <Card.Content>
          <Title>Recent Point History</Title>
          <Paragraph style={styles.sectionDescription}>
            Points earned from completed tasks
          </Paragraph>
          {approvedTasks.slice(0, 10).map(task => (
            <List.Item
              key={task.id}
              title={task.title}
              description={`${task.type} • Completed: ${task.approvedAt?.toLocaleDateString()}`}
              left={() => (
                <Avatar.Icon 
                  size={40} 
                  icon={getTaskTypeIcon(task.type)}
                  style={styles.taskIcon}
                />
              )}
              right={() => (
                <Badge style={styles.pointsBadge}>+{task.points}</Badge>
              )}
            />
          ))}
          {approvedTasks.length === 0 && (
            <Paragraph style={styles.emptyText}>
              No completed tasks yet. Complete some tasks to earn points!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.motivationCard}>
        <Card.Content>
          <Title>Keep Going!</Title>
          <Paragraph style={styles.motivationText}>
            {user?.points === 0 
              ? "Complete your first task to start earning points!"
              : `You've earned ${user?.points} points! Keep completing tasks to unlock more rewards.`
            }
          </Paragraph>
          {rewards.length > 0 && (
            <View style={styles.nextReward}>
              <Paragraph style={styles.nextRewardLabel}>Next reward to unlock:</Paragraph>
              {(() => {
                const nextReward = rewards
                  .filter(reward => !canClaimReward(reward.pointsRequired))
                  .sort((a, b) => a.pointsRequired - b.pointsRequired)[0];
                
                if (nextReward) {
                  return (
                    <View style={styles.nextRewardInfo}>
                      <Title style={styles.nextRewardTitle}>{nextReward.title}</Title>
                      <Paragraph>
                        {nextReward.pointsRequired - (user?.points || 0)} more points needed
                      </Paragraph>
                    </View>
                  );
                } else {
                  return (
                    <Paragraph style={styles.allUnlockedText}>
                      🎉 You can claim all available rewards!
                    </Paragraph>
                  );
                }
              })()}
            </View>
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
  pointsCard: {
    margin: 16,
    marginBottom: 8,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsIcon: {
    backgroundColor: '#6200EE',
    marginRight: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
  },
  pointsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  rewardsCard: {
    margin: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 16,
  },
  rewardItem: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardIcon: {
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
  },
  rewardPoints: {
    color: '#666',
  },
  rewardStatus: {
    alignItems: 'center',
  },
  canClaimBadge: {
    backgroundColor: '#66BB6A',
  },
  cannotClaimBadge: {
    backgroundColor: '#FFA726',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  historyCard: {
    margin: 16,
    marginBottom: 8,
  },
  taskIcon: {
    backgroundColor: '#6200EE',
  },
  pointsBadge: {
    backgroundColor: '#66BB6A',
  },
  motivationCard: {
    margin: 16,
    marginBottom: 8,
  },
  motivationText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  nextReward: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 8,
  },
  nextRewardLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nextRewardInfo: {
    alignItems: 'center',
  },
  nextRewardTitle: {
    fontSize: 18,
    color: '#6200EE',
  },
  allUnlockedText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#66BB6A',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
});