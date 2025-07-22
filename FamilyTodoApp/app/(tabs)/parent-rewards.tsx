import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Child {
  id: string;
  name: string;
  stars: number;
  avatar: string;
}

interface Reward {
  id: string;
  starsRequired: number;
  title: string;
  description: string;
  image: string;
}

export default function ParentRewardsScreen() {
  const router = useRouter();

  // Sample children data
  const children: Child[] = [
    {
      id: '1',
      name: 'Ethan',
      stars: 120,
      avatar: 'https://via.placeholder.com/56', // Placeholder image
    },
    {
      id: '2',
      name: 'Sophia',
      stars: 80,
      avatar: 'https://via.placeholder.com/56', // Placeholder image
    },
  ];

  // Sample rewards data
  const rewards: Reward[] = [
    {
      id: '1',
      starsRequired: 20,
      title: 'Movie Night',
      description: 'Enjoy a movie night with the family.',
      image: 'https://via.placeholder.com/130x91', // Placeholder image
    },
    {
      id: '2',
      starsRequired: 50,
      title: 'Theme Park',
      description: 'A day at the theme park.',
      image: 'https://via.placeholder.com/130x70', // Placeholder image
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0d141c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rewards</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Children Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children</Text>
            
            {children.map((child) => (
              <View key={child.id} style={styles.childCard}>
                <Image source={{ uri: child.avatar }} style={styles.childAvatar} />
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childStars}>{child.stars} stars</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Milestone Rewards Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Milestone Rewards</Text>
            
            {rewards.map((reward) => (
              <View key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardStars}>{reward.starsRequired} stars</Text>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>
                </View>
                <Image 
                  source={{ uri: reward.image }} 
                  style={[
                    styles.rewardImage,
                    reward.id === '1' ? styles.rewardImageLarge : styles.rewardImageSmall
                  ]} 
                />
              </View>
            ))}
          </View>
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
    backgroundColor: '#f7fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: '#0d141c',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#0d141c',
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f7fafc',
  },
  childAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e8edf2',
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: '#0d141c',
    marginBottom: 2,
  },
  childStars: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#4d7599',
  },
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardInfo: {
    flex: 1,
    padding: 16,
  },
  rewardStars: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#4d7599',
    marginBottom: 4,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#0d141c',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#4d7599',
    lineHeight: 21,
  },
  rewardImage: {
    backgroundColor: '#e8edf2',
  },
  rewardImageLarge: {
    width: 130,
    height: 91,
  },
  rewardImageSmall: {
    width: 130,
    height: 70,
  },
}); 