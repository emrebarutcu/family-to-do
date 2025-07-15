import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  TextInput, 
  List, 
  FAB,
  Modal,
  Portal,
  HelperText,
  Divider,
  Badge,
  Avatar
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';

export const RewardsScreen: React.FC = () => {
  const { user } = useAuth();
  const { members, rewards, createReward } = useFamily();
  
  const [showModal, setShowModal] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardPoints, setRewardPoints] = useState('50');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const children = members.filter(member => member.role === 'child');

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!rewardTitle.trim()) {
      newErrors.title = 'Reward title is required';
    }

    const pointsNum = parseInt(rewardPoints);
    if (isNaN(pointsNum) || pointsNum < 1 || pointsNum > 1000) {
      newErrors.points = 'Points must be between 1 and 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateReward = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      await createReward({
        title: rewardTitle.trim(),
        pointsRequired: parseInt(rewardPoints),
        createdBy: user!.id,
      });

      setRewardTitle('');
      setRewardPoints('50');
      setErrors({});
      setShowModal(false);
      Alert.alert('Success', 'Reward created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create reward');
    } finally {
      setLoading(false);
    }
  };

  const canChildClaimReward = (childPoints: number, rewardPoints: number) => {
    return childPoints >= rewardPoints;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Title>Rewards Overview</Title>
            <Paragraph>
              Create rewards that your children can claim using their earned points.
            </Paragraph>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{rewards.length}</Title>
                <Paragraph>Total Rewards</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{children.length}</Title>
                <Paragraph>Children</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>
                  {children.reduce((sum, child) => sum + child.points, 0)}
                </Title>
                <Paragraph>Total Points</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.childrenCard}>
          <Card.Content>
            <Title>Children's Points</Title>
            {children.map(child => (
              <View key={child.id} style={styles.childItem}>
                <Avatar.Text 
                  size={48} 
                  label={`${child.name[0]}${child.surname[0]}`}
                />
                <View style={styles.childInfo}>
                  <Title style={styles.childName}>{child.name} {child.surname}</Title>
                  <Paragraph>{child.points} points</Paragraph>
                </View>
                <Badge style={styles.pointsBadge}>{child.points}</Badge>
              </View>
            ))}
            {children.length === 0 && (
              <Paragraph style={styles.emptyText}>
                No children added yet.
              </Paragraph>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.rewardsCard}>
          <Card.Content>
            <Title>Available Rewards</Title>
            {rewards.map(reward => (
              <View key={reward.id} style={styles.rewardItem}>
                <View style={styles.rewardInfo}>
                  <Title style={styles.rewardTitle}>{reward.title}</Title>
                  <Paragraph style={styles.rewardPoints}>
                    {reward.pointsRequired} points required
                  </Paragraph>
                </View>
                <View style={styles.rewardStatus}>
                  <Badge style={styles.rewardBadge}>{reward.pointsRequired}</Badge>
                </View>
              </View>
            ))}
            {rewards.length === 0 && (
              <Paragraph style={styles.emptyText}>
                No rewards created yet. Create your first reward to motivate your children!
              </Paragraph>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.claimStatusCard}>
          <Card.Content>
            <Title>Reward Claim Status</Title>
            {rewards.length > 0 && children.length > 0 ? (
              rewards.map(reward => (
                <View key={reward.id} style={styles.claimItem}>
                  <Title style={styles.claimRewardTitle}>{reward.title}</Title>
                  <Paragraph style={styles.claimRewardPoints}>
                    {reward.pointsRequired} points needed
                  </Paragraph>
                  {children.map(child => (
                    <View key={child.id} style={styles.claimChildItem}>
                      <Avatar.Text 
                        size={32} 
                        label={`${child.name[0]}${child.surname[0]}`}
                      />
                      <Paragraph style={styles.claimChildName}>
                        {child.name} {child.surname}
                      </Paragraph>
                      <View style={styles.claimStatus}>
                        {canChildClaimReward(child.points, reward.pointsRequired) ? (
                          <Badge style={styles.canClaimBadge}>Can Claim</Badge>
                        ) : (
                          <Badge style={styles.cannotClaimBadge}>
                            Need {reward.pointsRequired - child.points} more
                          </Badge>
                        )}
                      </View>
                    </View>
                  ))}
                  <Divider style={styles.divider} />
                </View>
              ))
            ) : (
              <Paragraph style={styles.emptyText}>
                Create rewards and add children to see claim status.
              </Paragraph>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowModal(true)}
        label="Add Reward"
      />

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Create New Reward</Title>
          <Paragraph style={styles.modalSubtitle}>
            Set up a reward that children can claim with their points.
          </Paragraph>

          <TextInput
            label="Reward Title"
            value={rewardTitle}
            onChangeText={(text) => {
              setRewardTitle(text);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            mode="outlined"
            style={styles.input}
            error={!!errors.title}
          />
          <HelperText type="error" visible={!!errors.title}>
            {errors.title}
          </HelperText>

          <TextInput
            label="Points Required"
            value={rewardPoints}
            onChangeText={(text) => {
              setRewardPoints(text);
              if (errors.points) setErrors({ ...errors, points: '' });
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            error={!!errors.points}
          />
          <HelperText type="error" visible={!!errors.points}>
            {errors.points}
          </HelperText>

          <View style={styles.modalActions}>
            <Button
              mode="text"
              onPress={() => setShowModal(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateReward}
              loading={loading}
              disabled={loading}
              style={styles.createButton}
            >
              Create Reward
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFBFF',
  },
  overviewCard: {
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
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childName: {
    fontSize: 16,
  },
  pointsBadge: {
    backgroundColor: '#6200EE',
  },
  rewardsCard: {
    margin: 16,
    marginBottom: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  rewardBadge: {
    backgroundColor: '#03DAC6',
  },
  claimStatusCard: {
    margin: 16,
    marginBottom: 100,
  },
  claimItem: {
    marginBottom: 16,
  },
  claimRewardTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  claimRewardPoints: {
    color: '#666',
    marginBottom: 8,
  },
  claimChildItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  claimChildName: {
    flex: 1,
    marginLeft: 8,
  },
  claimStatus: {
    alignItems: 'center',
  },
  canClaimBadge: {
    backgroundColor: '#66BB6A',
  },
  cannotClaimBadge: {
    backgroundColor: '#FFA726',
  },
  divider: {
    marginTop: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 16,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  input: {
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 8,
  },
  createButton: {
    marginLeft: 8,
  },
});