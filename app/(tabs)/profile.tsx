// src/screens/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Account, ID } from 'appwrite';
import { client } from '@/services/appwrite';

import { AuthForms } from '@/auth/authform';
import { EditProfileView } from '@/components/EditProfileView';

const account = new Account(client);

type User = { name?: string; email: string };

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // ① On mount, check session
  useEffect(() => {
    account
      .get()
      .then(u => setUser({ email: u.email, name: u.name }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ② Handlers for AuthForms
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const u = await account.get();
      setUser({ email: u.email, name: u.name });
    } catch (err: any) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      // create with a display name
      await account.create(ID.unique(), email, password, name);
      // then immediately log them in
      await handleLogin(email, password);
    } catch (err: any) {
      Alert.alert('Sign up failed', err.message);
      setLoading(false);
    }
  };

  // ③ Handlers for EditProfileView
  const handleSave = async (
    name: string,
    newPassword: string,
    avatarUri?: string
  ) => {
    setLoading(true);
    try {
      await account.updateName(name);
      if (newPassword) {
        await account.updatePassword(newPassword, newPassword);
      }
      // TODO: upload avatarUri to Storage & save to preferences
      Alert.alert('Saved', 'Your profile has been updated.');
      setUser(prev => prev && { ...prev, name });
    } catch (err: any) {
      Alert.alert('Update failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (err: any) {
      Alert.alert('Logout failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ④ Render
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {user ? (
        <EditProfileView
          initialName={user.name}
          email={user.email}
          onSave={handleSave}
          onLogout={handleLogout}
        />
      ) : (
        <View style={styles.container}>
          <AuthForms onLogin={handleLogin} onSignup={handleSignup} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',      // dark canvas
  },
  container: {
    flex: 1,
    justifyContent: 'center',     // center the AuthForms card
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default Profile;
