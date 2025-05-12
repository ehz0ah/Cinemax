import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SavedMovie } from '@/services/appwrite';

export const SavedMovieCard = ({ movie }: { movie: SavedMovie }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/movies/${movie.movie_id}`)}
      className="flex-1 mr-2 mb-6"
      style={{ maxWidth: '30%' }}
    >
      <Image
        source={{ uri: movie.poster_url }}
        className="w-full h-48 rounded-lg"
      />
      <Text className="text-white text-sm mt-2" numberOfLines={1}>
        {movie.title}
      </Text>
    </TouchableOpacity>
  );
};
