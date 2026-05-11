import { create } from 'zustand';

import { storage } from '@/lib/storage';

interface ProviderServiceToggle {
  serviceId: string;
  active: boolean;
}

interface ProviderStore {
  activeToggles: Record<string, boolean>;
  toggleService: (serviceId: string) => void;
  isActive: (serviceId: string) => boolean;
}

const STORAGE_KEY = 'wasla_provider_toggles';

function loadToggles(): Record<string, boolean> {
  try {
    const raw = storage.getString(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const useProviderStore = create<ProviderStore>((set, get) => ({
  activeToggles: loadToggles(),

  toggleService: (serviceId: string) => {
    const current = get().activeToggles;
    const next = { ...current, [serviceId]: !current[serviceId] };
    set({ activeToggles: next });
    storage.set(STORAGE_KEY, JSON.stringify(next));
  },

  isActive: (serviceId: string) => {
    const { activeToggles } = get();
    return serviceId in activeToggles ? activeToggles[serviceId] : true;
  },
}));
