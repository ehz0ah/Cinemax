// src/screens/Profile.tsx
import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Account } from 'appwrite';
import { client } from '@/services/appwrite';
import { AuthContext } from '@/auth/authcontext';
import { AuthForms } from '@/auth/authform';
import { EditProfileView } from '@/components/EditProfileView';

const account = new Account(client);

const Profile: React.FC = () => {
  const { user, loading, login, signup, logout, refreshUser } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);

  const handleSave = async (
    name: string,
    currentPassword: string,
    newPassword: string,
    avatarUri?: string
  ) => {
    setSaving(true);
    try {
      // 1) Update display name if changed
      if (name !== user?.name) {
        await account.updateName(name);
      }

      // 2) Update password if provided (requires current password)
      if (newPassword) {
        if (!currentPassword) {
          Alert.alert('Error', 'Please enter your current password to change it.');
          setSaving(false);
          return;
        }
        await account.updatePassword(newPassword, currentPassword);
        Alert.alert('Success', 'Password changed successfully.');
      }

      // 3) (Optional) Upload avatarUri to Storage & save to user preferences
      //    TODO: implement avatar upload logic here

      // 4) Refresh the context user so the UI shows updated name/avatar
      await refreshUser();

      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (err: any) {
      Alert.alert('Update failed', err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) {
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
          onLogout={logout}
        />
      ) : (
        <View style={styles.container}>
          <AuthForms onLogin={login} onSignup={signup} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
