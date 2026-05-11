import { useQuery } from '@tanstack/react-query';
import type { SearchFilters } from '../types';
import { MOCK_PROVIDERS } from '../fixtures/providers';
import { MOCK_SERVICES } from '../fixtures/services';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      await delay(400);
      return MOCK_SERVICES;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: ['services', 'featured'],
    queryFn: async () => {
      await delay(400);
      return MOCK_SERVICES.filter((s) => s.featured);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: async () => {
      await delay(300);
      const service = MOCK_SERVICES.find((s) => s.id === id);
      if (!service) throw new Error('Service not found');
      const provider = MOCK_PROVIDERS.find((p) => p.id === service.providerId);
      return { service, provider };
    },
    enabled: !!id,
  });
}

export function useSearchServices(filters: SearchFilters) {
  return useQuery({
    queryKey: ['services', 'search', filters],
    queryFn: async () => {
      await delay(350);
      let results = [...MOCK_SERVICES];

      if (filters.query) {
        const q = filters.query.toLowerCase();
        results = results.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q),
        );
      }
      if (filters.categoryId) {
        results = results.filter((s) => s.categoryId === filters.categoryId);
      }
      if (filters.minPrice !== undefined) {
        results = results.filter((s) => s.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter((s) => s.price <= filters.maxPrice!);
      }
      if (filters.maxDistance !== undefined) {
        results = results.filter((s) => s.distance <= filters.maxDistance!);
      }
      if (filters.minRating !== undefined) {
        results = results.filter((s) => s.rating >= filters.minRating!);
      }

      if (filters.sortBy === 'distance') {
        results.sort((a, b) => a.distance - b.distance);
      } else if (filters.sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'price_asc') {
        results.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price_desc') {
        results.sort((a, b) => b.price - a.price);
      } else {
        results.sort((a, b) => a.distance - b.distance);
      }

      return results;
    },
    staleTime: 0,
  });
}

export function useProviderById(id: string) {
  return useQuery({
    queryKey: ['providers', id],
    queryFn: async () => {
      await delay(200);
      return MOCK_PROVIDERS.find((p) => p.id === id) ?? null;
    },
    enabled: !!id,
  });
}

export function useServiceReviews(serviceId: string) {
  return useQuery({
    queryKey: ['reviews', serviceId],
    queryFn: async () => {
      await delay(300);
      const { MOCK_REVIEWS } = await import('../fixtures/reviews');
      return MOCK_REVIEWS.filter((r) => r.serviceId === serviceId);
    },
    enabled: !!serviceId,
  });
}
