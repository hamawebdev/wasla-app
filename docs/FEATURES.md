# Wasla — App Features

Wasla is a two-sided mobile marketplace built with Expo + React Native that connects **customers** with local **service providers**. The app ships with a customer experience and a provider experience under the same binary, switched via a role-select flow at sign-up.

Stack: Expo Router (typed routes), React Query, Zustand, Gluestack UI + NativeWind, i18n (Arabic + English), Zod-validated data models, MMKV storage. Currency defaults to DZD and the primary UI language is Arabic.

---

## 1. Onboarding & Authentication

- **3-screen onboarding carousel** introducing search, chat, and ratings ([onboarding.tsx](src/app/onboarding.tsx)).
- **Location capture** — permission prompt with a manual fallback ([location-permission.tsx](src/app/location-permission.tsx), [location-manual.tsx](src/app/location-manual.tsx)).
- **Phone-based login + OTP verification** ([login.tsx](src/app/login.tsx), [otp.tsx](src/app/(auth)/otp.tsx)).
- **Account registration** with profile basics ([register.tsx](src/app/(auth)/register.tsx)).
- **Role selection** — pick Customer or Provider ([role-select.tsx](src/app/role-select.tsx)).
- **Provider setup wizard** for new providers (bio, services, verification) ([provider-setup.tsx](src/app/(auth)/provider-setup.tsx)).
- Persistent auth state via Zustand store ([use-auth-store.tsx](src/features/auth/use-auth-store.tsx)).

---

## 2. Customer Experience

Tab bar: **Home · Search · Bookings · Chat · Profile** ([_layout.tsx](src/app/(customer)/_layout.tsx)).

### Home
- Time-aware greeting, search bar, category segmented control.
- Featured services carousel + full service list, filtered live by category ([index.tsx](src/app/(customer)/index.tsx)).
- Quick access to notifications and current address.

### Discovery
- **Search** with text query, category filters, price/distance/rating filters, and sort (distance, rating, price asc/desc) ([search.tsx](src/app/(customer)/search.tsx), [filter-sheet.tsx](src/components/wasla/filter-sheet.tsx)).
- **Category browse** dedicated screen per category ([category/[id].tsx](src/app/(customer)/category/[id].tsx)).
- **Map view** of nearby services with count badge ([map.tsx](src/app/(customer)/map.tsx)).
- **Favorites** — heart any service to save it ([favorites.tsx](src/app/(customer)/favorites.tsx), [use-favorites.ts](src/api/services/use-favorites.ts)).

### Service & Provider details
- **Service detail page** with images, description, price, duration, rating, reviews ([service/[id].tsx](src/app/(customer)/service/[id].tsx)).
- **Provider public profile** with Services / Reviews / About tabs, verified + online badges, response rate ([provider/[id].tsx](src/app/(customer)/provider/[id].tsx), [provider-public-profile.tsx](src/components/wasla/provider-public-profile.tsx)).

### Booking flow
- **Multi-step booking wizard** for date, time, address, details, payment ([booking/[serviceId]](src/app/(customer)/booking/), [booking-stepper.tsx](src/components/wasla/booking-stepper.tsx)).
- **Bookings list** with statuses: pending, confirmed, completed, cancelled ([bookings.tsx](src/app/(customer)/bookings.tsx)).
- **Live tracking** of an active booking through `accepted → on_the_way → arrived` ([track/[bookingId].tsx](src/app/(customer)/track/[bookingId].tsx)).
- **Cancellation sheet** with reason capture ([cancel-booking-sheet.tsx](src/components/wasla/cancel-booking-sheet.tsx)).
- **Post-service review** with star rating, comment, and photos ([review/[bookingId].tsx](src/app/(customer)/review/[bookingId].tsx)).

### Loyalty
- Points balance, badges (locked/unlocked), redeemable rewards, points transaction history ([loyalty.tsx](src/app/(customer)/loyalty.tsx), [loyalty.ts](src/api/fixtures/loyalty.ts)).

### Profile
- Personal profile hub with quick links to settings and shared sections ([profile/index.tsx](src/app/(customer)/profile/index.tsx)).

---

## 3. Provider Experience

Tab bar: **Dashboard · Services · (+) Add · Chat · Profile** — the `(+)` tab opens an action sheet rather than a route ([_layout.tsx](src/app/(provider)/_layout.tsx), [provider-action-sheet.tsx](src/components/wasla/provider-action-sheet.tsx)).

### Dashboard
- Weekly calendar strip, pending-reservation count, KPI cards (clients, rating, trends) ([index.tsx](src/app/(provider)/index.tsx)).
- Latest pending reservations with one-tap navigation to the client profile.

### Service management
- **Services list** with per-service active/inactive toggle persisted in the provider store ([services/index.tsx](src/app/(provider)/services/index.tsx), [use-provider-store.ts](src/features/provider/use-provider-store.ts)).
- **Add new service** form ([services/new.tsx](src/app/(provider)/services/new.tsx)).
- **Quick-add entry point** ([add.tsx](src/app/(provider)/add.tsx)).

### Clients & communication
- **Clients list** and per-client detail view ([clients.tsx](src/app/(provider)/clients.tsx), [client/[id].tsx](src/app/(provider)/client/[id].tsx)).
- **Provider chat inbox** and threads ([chat/](src/app/(provider)/chat/)).

### Profile & promotion
- **Provider profile** with a **Customer Preview** mode showing the store as customers see it ([profile/index.tsx](src/app/(provider)/profile/index.tsx), [profile/preview.tsx](src/app/(provider)/profile/preview.tsx)).
- **Promote** screen for boosting visibility ([promote.tsx](src/app/(provider)/promote.tsx)).

---

## 4. Messaging

- **1:1 chat threads** between customer and provider with online status, unread counts, and optional booking context ([chat/index.tsx](src/app/(customer)/chat/index.tsx), [chat/[threadId].tsx](src/app/(customer)/chat/[threadId].tsx)).
- Mirrored inbox on the provider side ([chat/](src/app/(provider)/chat/)).
- Message model includes sender role, timestamp, and thread linkage ([types.ts](src/api/types.ts)).

---

## 5. Shared Sections (both roles)

Routed under `(shared)` ([_layout.tsx](src/app/(shared)/_layout.tsx)):

- **Addresses** — list, add, set default, delete; labels Home / Work / Other ([addresses/](src/app/(shared)/addresses/), [use-addresses.ts](src/api/services/use-addresses.ts)).
- **Notifications** — grouped by Today / Yesterday / This Week with mark-all-as-read; types: booking, message, promo, system ([notifications.tsx](src/app/(shared)/notifications.tsx), [use-notifications.ts](src/api/services/use-notifications.ts)).
- **Wallet** — balance, top-up, withdraw earnings, transaction history (income / expense / topup / withdrawal), payment methods (cash, BaridiMob, CCP, card) ([wallet.tsx](src/app/(shared)/wallet.tsx), [use-wallet.ts](src/api/services/use-wallet.ts)).
- **Edit profile** — name, phone (read-only with support note), email, bio, photo, verification badge ([profile/edit.tsx](src/app/(shared)/profile/edit.tsx)).
- **Help Center** — searchable articles, categories (Bookings, Payment, Account, Complaints), popular articles, live chat + call fallback ([help/](src/app/(shared)/help/), [use-help.ts](src/api/services/use-help.ts)).

---

## 6. Settings

[settings.tsx](src/app/(app)/settings.tsx) covers:

- **Theme** — Light / Dark / System.
- **Language** — Arabic / English (i18n via `i18next` + `expo-localization`).
- **Links** — GitHub, website, share, rate, support, privacy, terms.
- App name and version, logout.

---

## 7. Cross-cutting capabilities

- **Internationalization** — full Arabic + English translation files ([ar.json](src/translations/ar.json), [en.json](src/translations/en.json)).
- **Typed schemas** — all domain models validated with Zod ([types.ts](src/api/types.ts)): Category, Provider, Service, Review, Booking (+ tracking), Message, ChatThread, Badge, Reward, PointsTransaction, City, Address, Notification, WalletTransaction, PaymentMethod, HelpArticle.
- **Data layer** — React Query hooks under [src/api/services/](src/api/services/) backed by fixtures in [src/api/fixtures/](src/api/fixtures/) (ready to swap for a real backend).
- **State** — Zustand stores for auth, provider, and bookings.
- **UI kit** — Gluestack components + a Wasla design layer (service cards, search bar, segmented control, sheets, empty states, illustrations).
- **Multi-env builds** — development / preview / production profiles wired through EAS ([package.json](package.json), [eas.json](eas.json)).
- **404 / catch-all** route ([[...messing].tsx](src/app/[...messing].tsx)).
