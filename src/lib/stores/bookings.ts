import { create } from 'zustand';

import { CUSTOMER_NAMES, MOCK_BOOKINGS } from '@/api/fixtures/bookings';
import { MOCK_MESSAGES, MOCK_THREADS } from '@/api/fixtures/chats';
import type { Booking, ChatThread, Message } from '@/api/types';

type BookingsState = {
  bookings: Booking[];
  threads: ChatThread[];
  messages: Record<string, Message[]>;
  acceptBooking: (bookingId: string) => string | null;
  rejectBooking: (bookingId: string) => void;
};

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: MOCK_BOOKINGS,
  threads: MOCK_THREADS,
  messages: MOCK_MESSAGES,

  acceptBooking: (bookingId) => {
    const booking = get().bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const existing = get().threads.find((th) => th.bookingId === bookingId);
    const threadId = existing?.id ?? `t-${bookingId}`;

    set((state) => {
      const bookings = state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'confirmed' as const } : b,
      );

      if (existing) {
        const threads = state.threads.map((th) =>
          th.id === existing.id ? { ...th, bookingStatus: 'confirmed' as const } : th,
        );
        return { bookings, threads, messages: state.messages };
      }

      const customerName = CUSTOMER_NAMES[booking.customerId] ?? 'عميلة';
      const newThread: ChatThread = {
        id: threadId,
        providerId: booking.providerId,
        providerName: customerName,
        providerOnline: false,
        lastMessage: '',
        lastMessageTime: '',
        unreadCount: 0,
        bookingId,
        bookingStatus: 'confirmed',
      };

      return {
        bookings,
        threads: [newThread, ...state.threads],
        messages: { ...state.messages, [threadId]: [] },
      };
    });

    return threadId;
  },

  rejectBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b,
      ),
      threads: state.threads.map((th) =>
        th.bookingId === bookingId ? { ...th, bookingStatus: 'cancelled' as const } : th,
      ),
      messages: state.messages,
    }));
  },
}));
