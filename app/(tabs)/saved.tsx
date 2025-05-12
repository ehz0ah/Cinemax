// src/screens/Save.tsx
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthContext } from "@/auth/authcontext";
import { SavedMovieCard } from "@/components/SavedMovieCard";
import { icons } from "@/constants/icons";
import { getSavedMovies, SavedMovie } from "@/services/appwrite";

import { useIsFocused } from "@react-navigation/native";

const Save = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [movies, setMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setMovies([]);
    }
  }, [user]);

  const isFocused = useIsFocused();

  // 🚀 Fetch or clear whenever the screen is focused OR user changes
  useEffect(() => {
    // only run when this screen is front-and-center
    if (!isFocused) return;
    // if no user → clear out stale movies
    if (!user) {
      setMovies([]);
      setLoading(false);
      return;
    }

    // user is logged in → fetch their saved movies
    setLoading(true);
    getSavedMovies(user.$id)
      .then((saved) => setMovies(saved))
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "Could not load saved movies.");
      })
      .finally(() => setLoading(false));
  }, [isFocused, user]);

  // 1️⃣ Still checking auth?
  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // 2️⃣ Not logged in → prompt (no grid, no delete)
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center px-8">
        <Image source={icons.save} className="size-16 mb-6" tintColor="#fff" />
        <Text className="text-white text-center mb-4">
          Please log in to view your saved movies.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="bg-accent px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Go to Profile</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }


  if (movies.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center px-8">
        <Text className="text-white text-center">
          You haven’t saved any movies yet.
        </Text>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
        paddingHorizontal: 16,
        paddingTop: 20,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        Saved Movies
      </Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        renderItem={({ item }) => <SavedMovieCard movie={item} />}
        columnWrapperStyle={{ justifyContent: "flex-start", marginBottom: 12 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
};

export default Save;
