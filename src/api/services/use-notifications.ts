import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../fixtures/notifications';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const QUERY_KEY = ['notifications'];

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      await delay(300);
      return [...MOCK_NOTIFICATIONS];
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(200);
    },
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(QUERY_KEY, (old = []) =>
        old.map((n) => ({ ...n, read: true })),
      );
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(150);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Notification[]>(QUERY_KEY, (old = []) =>
        old.filter((n) => n.id !== id),
      );
    },
  });
}
