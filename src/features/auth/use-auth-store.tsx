import type { TokenType } from '@/lib/auth/utils';

import { create } from 'zustand';
import { getToken, removeToken, setToken } from '@/lib/auth/utils';
import { createSelectors } from '@/lib/utils';
import { storage } from '@/lib/storage';

export type UserRole = 'customer' | 'provider';

export type UserProfile = {
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
};

type AuthState = {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  role: UserRole | null;
  profile: UserProfile | null;
  setupComplete: boolean;
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
  setRole: (role: UserRole) => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setSetupComplete: (complete: boolean) => void;
};

const ROLE_KEY = 'wasla_role';
const PROFILE_KEY = 'wasla_profile';
const SETUP_KEY = 'wasla_setup';

const _useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  role: null,
  profile: null,
  setupComplete: false,

  signIn: (token) => {
    setToken(token);
    set({ status: 'signIn', token });
  },

  signOut: () => {
    removeToken();
    storage.remove(ROLE_KEY);
    storage.remove(PROFILE_KEY);
    storage.remove(SETUP_KEY);
    set({ status: 'signOut', token: null, role: null, profile: null, setupComplete: false });
  },

  setRole: (role) => {
    storage.set(ROLE_KEY, role);
    set({ role });
  },

  setProfile: (profile) => {
    storage.set(PROFILE_KEY, JSON.stringify(profile));
    set({ profile });
  },

  updateProfile: (partial) => {
    const current = get().profile;
    if (!current) return;
    const updated = { ...current, ...partial };
    storage.set(PROFILE_KEY, JSON.stringify(updated));
    set({ profile: updated });
  },

  setSetupComplete: (complete) => {
    storage.set(SETUP_KEY, complete ? '1' : '0');
    set({ setupComplete: complete });
  },

  hydrate: () => {
    try {
      const userToken = getToken();
      const savedRole = storage.getString(ROLE_KEY) as UserRole | undefined;
      const savedProfileRaw = storage.getString(PROFILE_KEY);
      const savedSetup = storage.getString(SETUP_KEY);

      const profile = savedProfileRaw ? (JSON.parse(savedProfileRaw) as UserProfile) : null;
      const setupComplete = savedSetup === '1';

      if (userToken !== null) {
        get().signIn(userToken);
        set({ role: savedRole ?? null, profile, setupComplete });
      } else {
        get().signOut();
      }
    } catch (e) {
      console.error(e);
    }
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);

export const signOut = () => _useAuthStore.getState().signOut();
export const signIn = (token: TokenType) => _useAuthStore.getState().signIn(token);
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
export const setRole = (role: UserRole) => _useAuthStore.getState().setRole(role);
export const setProfile = (profile: UserProfile) => _useAuthStore.getState().setProfile(profile);
export const updateProfile = (partial: Partial<UserProfile>) => _useAuthStore.getState().updateProfile(partial);
export const setSetupComplete = () => _useAuthStore.getState().setSetupComplete(true);
