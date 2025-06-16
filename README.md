**Cinemax**

A React Native mobile application built with Expo Router for browsing, searching, and saving movies using the TMDB API and Appwrite for authentication and data storage.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture & Directory Structure](#architecture--directory-structure)
4. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Environment Variables](#environment-variables)
   * [Running the App](#running-the-app)
5. [Usage](#usage)

---

## Features

* **Home**: Discover trending and latest movies.
* **Search**: Debounced movie search powered by TMDB.
* **Saved**: Save your favorite movies to view later (requires login).
* **Profile**: Sign up, log in, edit profile (name, password, avatar), and log out.
* **Appwrite Integration**: User authentication and database for saving favorites & search analytics.

---

## Tech Stack

* **Framework**: Expo Router (React Native)
* **Styling**: Tailwind CSS via NativeWind
* **State & Data Fetching**: React Context, custom `useFetch` hook
* **Backend**: Appwrite (Authentication & Databases)
* **API**: TMDB (The Movie Database)

---

## Architecture & Directory Structure

```
├── app
│   ├── (tabs)           # Bottom tab navigator
│   │   ├── _layout.tsx  # Tabs layout
│   │   ├── index.tsx    # Home screen
│   │   ├── profile.tsx  # Profile screen
│   │   ├── saved.tsx    # Saved movies screen
│   │   └── search.tsx   # Search screen
│   ├── movies          # Movie detail route
│   │   └── [id].tsx     # Movie details screen
│   ├── _layout.tsx      # Root layout (Stack navigator)
│   └── globals.css      # Global Tailwind imports
├── auth                 # Authentication context & forms
│   ├── authcontext.tsx
│   └── authform.tsx
├── components           # Reusable UI components
├── constants            # Icons & images references
├── services             # API & Appwrite service modules
├── interfaces           # TypeScript interfaces
├── types                # Asset type declarations
├── tailwind.config.js   # Tailwind CSS config
├── babel.config.js      # Expo & NativeWind Babel config
└── metro.config.js      # Metro bundler config
```

---

## Getting Started

### Prerequisites

* Node.js >= 14
* Yarn or npm
* Expo CLI (`npm install -g expo-cli`)
* An Appwrite account and project
* A TMDB API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/Cinemax.git
   cd Cinemax
   ```
2. Install dependencies:

   ```bash
   yarn install
   # or npm install
   ```

### Environment Variables

Create a `.env` file in the root and add:

```env
# TMDB API
EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_bearer_token

# Appwrite
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_search_collection_id
EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID=your_favorites_collection_id
```

### Running the App

```bash
expo start
```

* Scan the QR code with the Expo Go app on your device or run on an emulator.

---

## Usage

1. **Explore** the Home tab for trending and latest movies.
2. **Search** by tapping the search bar to navigate to the Search tab.
3. **Save Favorites**:

   * Sign up or log in via the Profile tab.
   * Tap the save icon on a movie detail to add or remove from your favorites.
4. **Edit Profile**:

   * Update your name, password, or avatar image.
   * Log out when finished.

---
