import { Link, RelativePathString } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";


/**
 * Component for displaying a movie card with poster, title, rating, and release year.
 *
 * @param {number} id - The unique identifier of the movie.
 * @param {string} poster_path - The path to the movie's poster image.
 * @param {string} title - The title of the movie.
 * @param {number} vote_average - The average vote rating of the movie.
 * @param {string} release_date - The release date of the movie in YYYY-MM-DD format.
 * 
 * @returns {JSX.Element} A clickable movie card containing the movie's poster image, title, 
 *          star rating (converted to a 5-star scale), and release year.
 */

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  return (
    <Link href={`/movie/${id}` as RelativePathString} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">
            {Math.round(vote_average / 2)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1">
            {release_date?.split("-")[0]}
          </Text>
          <Text className="text-xs font-medium text-light-300 uppercase">
            Movie
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;