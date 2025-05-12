import { Client, Account, Databases, ID, Query } from "appwrite";

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!; // Good use of ! to assert that these environment variables are defined
export const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
export const FAVORITES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveFavoriteMovie = async (movie: MovieDetails) => {
  const user = await account.get();

  return database.createDocument(
    DATABASE_ID,
    FAVORITES_COLLECTION_ID,
    ID.unique(),
    {
      user_id:   user.$id,
      movie_id:  movie.id,
      title:     movie.title,
      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://placehold.co/600x400/1a1a1a/FFFFFF.png',
    }
  );
};

export interface SavedMovie {
  $id: string;
  user_id: string;
  movie_id: number;
  title: string;
  poster_url: string;
}

export const getSavedMovies = async (userId: string): Promise<SavedMovie[]> => {
  const res = await database.listDocuments(DATABASE_ID, FAVORITES_COLLECTION_ID, [
    Query.equal('user_id', userId),
    Query.orderDesc('$createdAt'),
  ]);
  return res.documents as unknown as SavedMovie[];
};

export const deleteFavoriteMovie = async (docId: string) => {
  return database.deleteDocument(
    DATABASE_ID,
    FAVORITES_COLLECTION_ID,
    docId
  );
};
