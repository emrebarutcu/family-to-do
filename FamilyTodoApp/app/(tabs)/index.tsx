import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function TabIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/(tabs)/parent-dashboard-list');
  }, []);
  return null;
} 