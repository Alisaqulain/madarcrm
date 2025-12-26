"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: null,

      login: (username: string, password: string) => {
        // Simple authentication with hardcoded credentials
        if (username === "Admin1" && password === "pass1234") {
          set({ isAuthenticated: true, username });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, username: null });
      },

      checkAuth: () => {
        return get().isAuthenticated;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);


