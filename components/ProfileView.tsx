// src/components/ProfileView.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";

type ProfileViewProps = {
  user: { name?: string; email: string };
  onLogout: () => void;
};

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => (
  <View className="bg-white/70 p-8 rounded-3xl items-center shadow-lg w-full max-w-md">
    {/* avatar container */}
    <View className="bg-white p-1 rounded-full shadow-xl mb-6">
      <Image
        source={icons.person}
        className="w-32 h-32 rounded-full"
        tintColor="#7c3aed"
      />
    </View>

    <Text className="text-3xl font-bold text-gray-900 mb-1">
      {user.name || user.email.split("@")[0]}
    </Text>
    <Text className="text-gray-600 text-lg mb-6">{user.email}</Text>

    <TouchableOpacity
      onPress={onLogout}
      className="px-8 py-3 rounded-full bg-red-500 shadow-md"
    >
      <Text className="text-white font-semibold text-lg">Log Out</Text>
    </TouchableOpacity>
  </View>
);
