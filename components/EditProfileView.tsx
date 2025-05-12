import { icons } from "@/constants/icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EditProfileViewProps = {
  initialName?: string;
  email: string;
  onSave: (
    name: string,
    currentPassword: string,
    newPassword: string,
    avatarUri?: string
  ) => void;
  onLogout: () => void;
};

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  initialName,
  email,
  onSave,
  onLogout,
}) => {
  const [name, setName] = useState(initialName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarUri, setAvatarUri] = useState<string>();

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Allow photo access to change avatar"
        );
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 pt-12">
      {/* Avatar */}
      <View className="items-center mb-12">
        <TouchableOpacity
          onPress={pickImage}
          className="rounded-full p-1 bg-gray-800 shadow"
        >
          <Image
            source={avatarUri ? { uri: avatarUri } : icons.person}
            className="w-32 h-32 rounded-full"
          />
        </TouchableOpacity>
        <Text className="text-gray-400 text-sm mt-2">Tap to change</Text>
      </View>

      {/* Form */}
      <View className="mb-10">
        <Text className="text-gray-400 mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#666"
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
        />
      </View>

      <View className="mb-10">
        <Text className="text-gray-400 mb-2">Email (Read-Only)</Text>
        <TextInput
          value={email}
          editable={false}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-500"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-400 mb-2">Current Password</Text>
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#666"
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-400 mb-2">New Password</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#666"
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
        />
      </View>

      {/* Buttons */}
      <View className="mt-4">
        <TouchableOpacity
          onPress={() =>
            onSave(name, currentPassword, newPassword, avatarUri)
          }
          className="bg-purple-600 rounded-lg py-3 items-center shadow mb-4"
        >
          <Text className="text-white font-semibold text-lg">
            Save Changes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogout}
          className="bg-red-500 rounded-lg py-3 items-center"
        >
          <Text className="text-white font-medium text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
