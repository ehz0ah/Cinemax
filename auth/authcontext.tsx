import { client } from "@/services/appwrite";
import { Account, ID, Models } from "appwrite";
import React, { createContext, ReactNode, useEffect, useState } from "react";

const account = new Account(client);

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>; // ← added this
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshUser: async () => {}, // ← and here
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // On mount, check if there's an existing session
  useEffect(() => {
    account
      .get()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    try {
      const u = await account.get();
      setUser(u);
    } catch {
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    await refreshUser();
  };

  const signup = async (name: string, email: string, password: string) => {
    // 4th argument is the display name
    await account.create(ID.unique(), email, password, name);
    // then log them in
    await login(email, password);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
