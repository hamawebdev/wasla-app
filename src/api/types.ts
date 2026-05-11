import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  icon: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  verified: z.boolean(),
  online: z.boolean(),
  rating: z.number(),
  reviewCount: z.number(),
  city: z.string(),
  bio: z.string().optional(),
  setupComplete: z.boolean().optional(),
});
export type Provider = z.infer<typeof ProviderSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  providerId: z.string(),
  images: z.array(z.string()),
  price: z.number(),
  priceFrom: z.boolean().default(false),
  currency: z.string().default('DZD'),
  duration: z.string(),
  type: z.string(),
  paymentMethod: z.string(),
  rating: z.number(),
  reviewCount: z.number(),
  distance: z.number(),
  city: z.string(),
  featured: z.boolean().default(false),
});
export type Service = z.infer<typeof ServiceSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  authorName: z.string(),
  authorAvatar: z.string().optional(),
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  photos: z.array(z.string()).optional(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const BookingStatusSchema = z.enum(['pending', 'confirmed', 'completed', 'cancelled']);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const BookingSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  providerId: z.string(),
  customerId: z.string(),
  date: z.string(),
  time: z.string(),
  details: z.string().optional(),
  address: z.string().optional(),
  price: z.number(),
  status: BookingStatusSchema,
  createdAt: z.string(),
});
export type Booking = z.infer<typeof BookingSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  senderId: z.string(),
  text: z.string(),
  timestamp: z.string(),
  isCustomer: z.boolean(),
});
export type Message = z.infer<typeof MessageSchema>;

export const ChatThreadSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  providerAvatar: z.string().optional(),
  providerOnline: z.boolean(),
  lastMessage: z.string(),
  lastMessageTime: z.string(),
  unreadCount: z.number(),
  bookingId: z.string().optional(),
  bookingStatus: BookingStatusSchema.optional(),
});
export type ChatThread = z.infer<typeof ChatThreadSchema>;

export const BadgeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  unlocked: z.boolean(),
});
export type Badge = z.infer<typeof BadgeSchema>;

export const RewardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  pointsCost: z.number(),
});
export type Reward = z.infer<typeof RewardSchema>;

export const PointsTransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['earned', 'spent']),
  amount: z.number(),
  description: z.string(),
  date: z.string(),
});
export type PointsTransaction = z.infer<typeof PointsTransactionSchema>;

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  wilaya: z.number(),
});
export type City = z.infer<typeof CitySchema>;

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  maxDistance?: number;
  minRating?: number;
  sortBy?: 'distance' | 'rating' | 'price_asc' | 'price_desc';
}

export const AddressSchema = z.object({
  id: z.string(),
  label: z.enum(['home', 'work', 'other']),
  labelText: z.string(),
  fullAddress: z.string(),
  city: z.string(),
  lat: z.number(),
  lng: z.number(),
  isDefault: z.boolean().default(false),
  notes: z.string().optional(),
});
export type Address = z.infer<typeof AddressSchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(['booking', 'message', 'promo', 'system']),
  title: z.string(),
  description: z.string(),
  timestamp: z.string(),
  read: z.boolean().default(false),
  link: z.string().optional(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const WalletTransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['income', 'expense', 'topup', 'withdrawal']),
  amount: z.number(),
  description: z.string(),
  date: z.string(),
  status: z.enum(['pending', 'completed', 'failed']),
});
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;

export const PaymentMethodSchema = z.object({
  id: z.string(),
  kind: z.enum(['cash', 'baridimob', 'ccp', 'card']),
  label: z.string(),
  last4: z.string().optional(),
  isDefault: z.boolean().default(false),
});
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const HelpArticleSchema = z.object({
  id: z.string(),
  categoryId: z.enum(['bookings', 'payment', 'account', 'complaints']),
  title: z.string(),
  body: z.string(),
});
export type HelpArticle = z.infer<typeof HelpArticleSchema>;
