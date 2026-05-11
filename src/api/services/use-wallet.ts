import { useQuery } from '@tanstack/react-query';
import { MOCK_WALLET_BALANCE, MOCK_TRANSACTIONS } from '../fixtures/wallet';
import { MOCK_PAYMENT_METHODS } from '../fixtures/payment-methods';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      await delay(300);
      return MOCK_WALLET_BALANCE;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: async () => {
      await delay(350);
      return [...MOCK_TRANSACTIONS];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['wallet', 'payment-methods'],
    queryFn: async () => {
      await delay(250);
      return [...MOCK_PAYMENT_METHODS];
    },
    staleTime: 1000 * 60 * 10,
  });
}
