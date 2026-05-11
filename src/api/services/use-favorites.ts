import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { createSelectors } from '@/lib/utils';

const FAVORITES_KEY = 'wasla_favorites';

type FavoritesState = {
  serviceIds: string[];
  toggle: (id: string) => void;
  hydrate: () => void;
};

const _useFavoritesStore = create<FavoritesState>((set, get) => ({
  serviceIds: [],

  toggle: (id) => {
    const current = get().serviceIds;
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    storage.set(FAVORITES_KEY, JSON.stringify(next));
    set({ serviceIds: next });
  },

  hydrate: () => {
    try {
      const raw = storage.getString(FAVORITES_KEY);
      if (raw) {
        set({ serviceIds: JSON.parse(raw) as string[] });
      }
    } catch {
      // ignore parse errors
    }
  },
}));

export const useFavoritesStore = createSelectors(_useFavoritesStore);

export function useFavorites() {
  return useFavoritesStore.use.serviceIds();
}

export function useIsFavorite(serviceId: string) {
  const ids = useFavoritesStore.use.serviceIds();
  return ids.includes(serviceId);
}

export function useToggleFavorite() {
  return useFavoritesStore.use.toggle();
}

export const hydrateFavorites = () => _useFavoritesStore.getState().hydrate();
