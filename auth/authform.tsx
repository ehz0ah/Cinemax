// src/components/AuthForms.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

type AuthFormsProps = {
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
};

export const AuthForms: React.FC<AuthFormsProps> = ({
  onLogin,
  onSignup,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = () => {
    setBusy(true);
    if (isLogin) {
      onLogin(email.trim(), password);
    } else {
      onSignup(name.trim(), email.trim(), password);
    }
    // clear busy when promise settles
    setBusy(false);
  };

  return (
    <View className="bg-gray-900/90 p-8 rounded-2xl shadow-lg
                     w-full max-w-sm mx-auto">
      <Text className="text-3xl font-semibold text-white text-center mb-6">
        {isLogin ? 'Welcome Back!' : 'Create Account'}
      </Text>

      {!isLogin && (
        <TextInput
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          className="bg-gray-800 border border-gray-700 rounded-lg
                     px-4 py-3 mb-4 text-white"
        />
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-gray-800 border border-gray-700 rounded-lg
                   px-4 py-3 mb-4 text-white"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-gray-800 border border-gray-700 rounded-lg
                   px-4 py-3 mb-6 text-white"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={busy}
        className="bg-purple-600 rounded-lg py-3 mb-4 items-center
                   shadow-md"
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            {isLogin ? 'Log In' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setIsLogin(!isLogin);
          setName('');
          setEmail('');
          setPassword('');
        }}
        className="items-center"
      >
        <Text className="text-sm text-white">
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Log In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
