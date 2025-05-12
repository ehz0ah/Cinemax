import { AuthContext } from "@/auth/authcontext";
import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import {
  client,
  deleteFavoriteMovie,
  saveFavoriteMovie,
} from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { AppwriteException, Databases, Query } from "appwrite";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const FAVORITES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

const database = new Databases(client);

const MovieInfo = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <View className="mt-5 px-5">
    <Text className="text-light-200 text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-1">
      {value ?? "N/A"}
    </Text>
  </View>
);

export default function Details() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id));

  const promptLogin = () =>
    Alert.alert("Please Log In", "You need an account to save favorites.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log In", onPress: () => router.push("/profile") },
    ]);

  const handleSave = async () => {
    // 1) Guard: must be logged in
    if (!user) {
      promptLogin();
      return;
    }

    try {
      // 2) Check if already saved
      const existing = await database.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        [Query.equal("user_id", user.$id), Query.equal("movie_id", movie!.id)]
      );

      if (existing.documents.length > 0) {
        // ✅ Already saved → confirm removal
        return Alert.alert(
          "Remove Favorite?",
          "Remove this movie from your saved list?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Yes, remove it",
              onPress: async () => {
                try {
                  await deleteFavoriteMovie(existing.documents[0].$id);
                  Alert.alert("Removed", "Movie removed from saved list.");
                } catch (e: any) {
                  // Treat missing‐scope as “not logged in”
                  if (
                    e instanceof AppwriteException &&
                    e.message.includes("missing scope")
                  ) {
                    promptLogin();
                  } else {
                    console.error(e);
                    Alert.alert("Error", "Could not remove — try again later.");
                  }
                }
              },
            },
          ]
        );
      }

      // 3) Otherwise, save new favorite
      await saveFavoriteMovie(movie as MovieDetails);
      Alert.alert("Saved!", "This movie has been added to your favorites.");
    } catch (err: any) {
      // Session expired / no scope → treat as “not logged in”
      if (
        err instanceof AppwriteException &&
        err.message.includes("missing scope")
      ) {
        promptLogin();
      } else {
        console.error(err);
        Alert.alert("Error", err.message || "Could not save — try again.");
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Poster + Save/Unsave */}
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
          <TouchableOpacity
            onPress={handleSave}
            className="absolute bottom-5 right-5 size-14 rounded-full bg-white flex items-center justify-center"
          >
            <Image source={icons.save} className="w-6 h-7" />
          </TouchableOpacity>
        </View>

        {/* Movie Details */}
        <Text className="text-white font-bold text-xl px-5 mt-5">
          {movie?.title}
        </Text>
        <View className="flex-row items-center gap-x-2 px-5 mt-2">
          <Text className="text-light-200 text-sm">
            {movie?.release_date?.split("-")[0]}
          </Text>
          <Text className="text-light-200 text-sm">•</Text>
          <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
        </View>

        <View className="flex-row items-center bg-dark-100 px-3 py-1 rounded-md gap-x-1 mt-3 mx-5">
          <Image source={icons.star} className="size-4" />
          <Text className="text-white font-bold text-sm">
            {Math.round(movie?.vote_average ?? 0)}/10
          </Text>
          <Text className="text-light-200 text-sm">
            ({movie?.vote_count} votes)
          </Text>
        </View>

        <MovieInfo label="Overview" value={movie?.overview} />
        <MovieInfo
          label="Genres"
          value={movie?.genres?.map((g) => g.name).join(" • ")}
        />

        {/* Budget & Revenue as two flex columns */}
        <View className="flex-row px-5 mt-5">
          {/* Budget column */}
          <View className="flex-1 mr-2">
            <Text className="text-light-200 text-sm">Budget</Text>
            <Text className="text-light-100 font-bold text-sm mt-1">
              ${((movie?.budget ?? 0) / 1_000_000).toFixed(1)}M
            </Text>
          </View>

          {/* Revenue column */}
          <View className="flex-1 ml-2">
            <Text className="text-light-200 text-sm">Revenue</Text>
            <Text className="text-light-100 font-bold text-sm mt-1">
              ${((movie?.revenue ?? 0) / 1_000_000).toFixed(1)}M
            </Text>
          </View>
        </View>

        <MovieInfo
          label="Production Companies"
          value={movie?.production_companies?.map((c) => c.name).join(" • ")}
        />
      </ScrollView>

      {/* Go Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute bottom-5 left-5 right-5 mx-5 bg-accent rounded-lg py-3.5 flex-row items-center justify-center"
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
