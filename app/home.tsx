import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';

export default function UserHomeScreen() {
  const { user, userData, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome!
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          You are successfully logged in
        </ThemedText>

        <View style={styles.userInfo}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            User Information:
          </ThemedText>
          
          <ThemedText style={styles.infoText}>
            Phone: {userData?.phoneNumber || user?.phoneNumber || 'N/A'}
          </ThemedText>
          
          <ThemedText style={styles.infoText}>
            User ID: {user?.uid || 'N/A'}
          </ThemedText>
          
          {userData?.createdAt && (
            <ThemedText style={styles.infoText}>
              Joined: {new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}
            </ThemedText>
          )}
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <ThemedText style={styles.signOutText}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.7,
  },
  userInfo: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 40,
    width: '100%',
    maxWidth: 300,
  },
  infoTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    marginBottom: 8,
    fontSize: 14,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
