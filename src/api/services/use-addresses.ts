import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Address } from '../types';
import { MOCK_ADDRESSES } from '../fixtures/addresses';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const QUERY_KEY = ['addresses'];

export function useAddresses() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      await delay(300);
      return [...MOCK_ADDRESSES];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Omit<Address, 'id'>) => {
      await delay(400);
      return { ...address, id: `a${Date.now()}` } as Address;
    },
    onSuccess: (newAddress) => {
      queryClient.setQueryData<Address[]>(QUERY_KEY, (old = []) => {
        if (newAddress.isDefault) {
          return [newAddress, ...old.map((a) => ({ ...a, isDefault: false }))];
        }
        return [...old, newAddress];
      });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Address[]>(QUERY_KEY, (old = []) =>
        old.map((a) => ({ ...a, isDefault: a.id === id })),
      );
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Address[]>(QUERY_KEY, (old = []) =>
        old.filter((a) => a.id !== id),
      );
    },
  });
}
