# Wasla — Features Guide

A complete catalogue of every feature available in the Wasla app, grouped by area. Each entry describes what the feature does, what users can do with it, typical use cases, related features, and its business value.

> **Conventions used in this guide**
> - **Customer** and **Provider** indicate which role sees the feature.
> - **Shared** features are available to both roles.
> - Where a step is demonstrated with sample data or simulated in the current build, it is called out as a note.

---

## Table of contents

1. [Onboarding & Account](#1-onboarding--account)
2. [Location](#2-location)
3. [Discovery (Customer)](#3-discovery-customer)
4. [Service & Provider Details (Customer)](#4-service--provider-details-customer)
5. [Booking (Customer)](#5-booking-customer)
6. [Booking Tracking & Management (Customer)](#6-booking-tracking--management-customer)
7. [Reviews & Ratings](#7-reviews--ratings)
8. [Messaging (Shared)](#8-messaging-shared)
9. [Loyalty & Rewards (Customer)](#9-loyalty--rewards-customer)
10. [Wallet & Payments](#10-wallet--payments)
11. [Provider Store & Services](#11-provider-store--services)
12. [Provider Client Management](#12-provider-client-management)
13. [Provider Promotion](#13-provider-promotion)
14. [Profile & Account Settings (Shared)](#14-profile--account-settings-shared)
15. [Addresses (Shared)](#15-addresses-shared)
16. [Notifications (Shared)](#16-notifications-shared)
17. [Help Center (Shared)](#17-help-center-shared)
18. [App Settings (Shared)](#18-app-settings-shared)

---

## 1. Onboarding & Account

### 1.1 Welcome Onboarding
**Role:** New users
**Description:** A three-screen introduction shown the first time the app is opened, explaining Wasla's core promise: discovering trusted nearby services, connecting safely in-app, and earning points and ratings.
**User actions:** Swipe through slides, skip, tap "Start now," or choose "I already have an account."
**Typical use cases:** First-time orientation for a new customer or provider.
**Related features:** Account selection, Role selection.
**Business value:** Communicates the value proposition immediately and improves first-session conversion.

### 1.2 Account Selection / Role Selection
**Role:** All new users
**Description:** Entry point to the app where a user identifies whether they are a **customer** ("I'm looking for a service") or a **service provider** ("I provide services"). The role chosen shapes the entire app experience.
**User actions:** Pick a role and continue; or, in demo mode, choose a ready-made demo account (customer or provider).
**Typical use cases:** A new user deciding how they'll use Wasla; a returning user signing back in.
**Related features:** Registration, Provider store setup.
**Business value:** Routes each user to the right experience and tailors features to their needs.
> *Note: In the current build, an account picker offers pre-set demo accounts for instant access.*

### 1.3 Registration
**Role:** All new users
**Description:** Collects a full name, an Algerian phone number (with the +213 prefix), and an optional email. Also offers "Continue with Google" and "Continue with Facebook" as alternatives.
**User actions:** Enter name and phone, optionally email, and request a verification code; or choose a social sign-in option.
**Typical use cases:** Creating a new account.
**Related features:** OTP verification.
**Business value:** Low-friction, phone-first signup suited to the local market.

### 1.4 Phone Verification (OTP)
**Role:** All new users
**Description:** A six-digit one-time code confirms ownership of the phone number, with a resend timer.
**User actions:** Enter the code, resend it after the countdown, and continue.
**Typical use cases:** Securing an account at signup.
**Related features:** Registration, Provider store setup (providers continue to setup after verifying).
**Business value:** Verifies real users and reduces fake accounts.
> *Note: In the current build, any six-digit code is accepted for demonstration.*

---

## 2. Location

### 2.1 Location Permission
**Role:** Customer
**Description:** Asks permission to use the device location so Wasla can show the closest services, with the option to set a location manually instead.
**User actions:** Allow location access or choose to set it manually.
**Typical use cases:** Personalizing the home feed and map to the user's area.
**Related features:** Manual city selection, Map, Nearby services.
**Business value:** Powers distance-based discovery, a core differentiator.

### 2.2 Manual City Selection
**Role:** Customer
**Description:** Lets a user pick their location from a list of Algerian cities/wilayas, or search for a neighborhood or city, when they prefer not to share device location.
**User actions:** Search and select a city/wilaya, then confirm.
**Typical use cases:** Users who decline location access or want to browse another area.
**Related features:** Location permission, Map.
**Business value:** Ensures every user can still get localized results.

---

## 3. Discovery (Customer)

### 3.1 Home Feed
**Role:** Customer
**Description:** The customer landing screen featuring a time-based greeting, a search bar, category filters, a "Featured for you" carousel, and a "Services near you" list. A toggle switches between list and map views, and a bell opens notifications.
**User actions:** Search, filter by category, scroll featured and nearby services, switch to map, open a service, open notifications.
**Typical use cases:** Casual browsing; quickly finding a popular or nearby service.
**Related features:** Search, Map, Service detail, Notifications.
**Business value:** The primary engagement surface that drives discovery and bookings.

### 3.2 Search & Filters
**Role:** Customer
**Description:** A dedicated search experience with a query field, category picker, and filters for price range, rating, distance, and availability. Results can be sorted by nearest, price (low/high), or highest rated. Active filters are shown and can be cleared.
**User actions:** Type a query, choose a category, set filters, sort results, clear filters, open a result.
**Typical use cases:** Finding a specific service ("bridal makeup near me under a budget, highly rated").
**Related features:** Category browse, Service detail, Map.
**Business value:** Helps customers find the right provider fast, improving conversion and satisfaction.

### 3.3 Category Browse
**Role:** Customer
**Description:** Lists all services within a chosen category (e.g. Sewing & Tailoring, Beauty & Makeup), with a result count and an empty state when none are available. Wasla covers twelve categories: Sewing & Tailoring, Sweets & Cakes, Home Maintenance, Phone Repair, Event Planning, Digital Marketing, Home Cleaning, Beauty & Makeup, Cooking & Meal Prep, Private Tuition, Photography, and Delivery & Errands.
**User actions:** Browse services in a category, open a service, return to home.
**Typical use cases:** Exploring everything offered in one category.
**Related features:** Search, Home feed.
**Business value:** Organizes the catalogue and supports browse-driven discovery.

### 3.4 Map Discovery
**Role:** Customer
**Description:** Shows nearby services on an interactive map with a count of results and a search field. Handles the case where location access is denied.
**User actions:** Pan/zoom the map, search, and view nearby services geographically.
**Typical use cases:** Customers who think spatially ("what's available right around me?").
**Related features:** Location, Home feed (map toggle), Search.
**Business value:** Reinforces the locality promise and surfaces nearby supply.

### 3.5 Favorites
**Role:** Customer
**Description:** A saved list of services the customer has hearted, with an empty state guiding first use.
**User actions:** Save/unsave a service via the heart icon; view all saved services.
**Typical use cases:** Shortlisting services to compare or book later.
**Related features:** Service detail, Home feed.
**Business value:** Encourages return visits and supports considered purchases.

---

## 4. Service & Provider Details (Customer)

### 4.1 Service Detail
**Role:** Customer
**Description:** A rich service page with an image gallery, title, rating and review count, distance and city, provider summary, an expandable description, service attributes (duration, service type, payment method), and price. Includes actions to save, share, chat, view the provider's store, and book.
**User actions:** Browse photos, read the description and reviews, save or share, chat, view the store, write a review, or book now.
**Typical use cases:** Evaluating a specific service before booking.
**Related features:** Provider store, Booking, Messaging, Reviews, Favorites.
**Business value:** The decision-making screen that converts interest into bookings.

### 4.2 Provider Store / Public Profile
**Role:** Customer (also previewable by Providers)
**Description:** A provider's storefront with tabs for **About**, **Services**, and **Reviews**, plus rating, response rate, an "in demand" indicator, service count, and actions to book or contact.
**User actions:** Switch tabs, read the bio and reviews, view all of a provider's services, book, or contact.
**Typical use cases:** Assessing a provider's overall reputation and full offering.
**Related features:** Service detail, Messaging, Booking, Reviews.
**Business value:** Builds provider trust and cross-sells their other services.

---

## 5. Booking (Customer)

### 5.1 Booking — Step 1: Date & Time
**Role:** Customer
**Description:** A guided first booking step with a mini calendar (past dates disabled) and a set of time slots. A stepper shows progress through the flow.
**User actions:** Select a date and a time, then continue.
**Typical use cases:** Scheduling an appointment.
**Related features:** Booking step 2, Confirmation.
**Business value:** Makes scheduling simple and unambiguous.

### 5.2 Booking — Step 2: Details, Address & Payment
**Role:** Customer
**Description:** Captures the service address (choose a saved address or add a new one), additional notes, and a payment method (Cash, Gold Card, or BaridiMob). Supports a promo code (e.g. a welcome discount) and shows a transparent price breakdown: service cost, platform fee, discount, and grand total.
**User actions:** Choose an address, add notes, pick a payment method, apply a promo code, review the price, and confirm.
**Typical use cases:** Finalizing the where, how, and how-much of a booking.
**Related features:** Addresses, Wallet/Payments, Confirmation, Loyalty.
**Business value:** Transparent pricing and local payment options reduce drop-off at checkout.

### 5.3 Booking Confirmation
**Role:** Customer
**Description:** A success screen confirming the request was sent and is awaiting the provider's confirmation, with next-step actions.
**User actions:** Track the provider, explore more services, message the provider, or return home.
**Typical use cases:** The moment right after submitting a booking.
**Related features:** Booking tracking, Messaging, Bookings list.
**Business value:** Sets clear expectations and keeps the customer engaged after checkout.

---

## 6. Booking Tracking & Management (Customer)

### 6.1 Bookings List
**Role:** Customer
**Description:** All of a customer's bookings, organized into **Current**, **Completed**, and **Cancelled** tabs, each with its own empty state. Bookings carry a status: pending confirmation, confirmed, completed, or cancelled.
**User actions:** Switch tabs, open a booking, take follow-up actions (track, message, review, cancel).
**Typical use cases:** Keeping track of upcoming and past bookings.
**Related features:** Tracking, Cancellation, Reviews, Messaging.
**Business value:** A central record that builds trust and repeat usage.

### 6.2 Live Booking Tracking
**Role:** Customer
**Description:** A real-time-style tracker showing the provider's progress through stages — accepted, on the way, and arrived — with a map and quick actions.
**User actions:** Follow the status timeline, call or chat with the provider, and see the rating.
**Typical use cases:** Knowing when a provider is en route or has arrived.
**Related features:** Messaging, Bookings list, Reviews.
**Business value:** Reduces uncertainty and "where are they?" support contacts.

### 6.3 Booking Cancellation
**Role:** Customer
**Description:** A cancellation flow that asks for a reason (plans changed, found an alternative, price too high, provider unavailable, or other) plus optional notes.
**User actions:** Choose a reason, add notes, and confirm cancellation.
**Typical use cases:** Calling off a booking that's no longer needed.
**Related features:** Bookings list, Tracking.
**Business value:** Structured cancellation reasons provide insight into demand and pricing.

---

## 7. Reviews & Ratings

### 7.1 Write a Review
**Role:** Customer
**Description:** After a service, customers rate the provider with stars, add optional photos and written details, and get encouraging feedback based on the rating.
**User actions:** Select a star rating, add photos, write details, and submit.
**Typical use cases:** Sharing an experience to help other customers.
**Related features:** Service detail (reviews), Provider store (reviews), Loyalty (points for reviewing).
**Business value:** Generates trust signals and rewards engagement; reviews drive future bookings.

### 7.2 Ratings & Reviews Display
**Role:** Customer
**Description:** Service and provider pages show average ratings, review counts, and individual reviews; an empty state appears when there are none yet.
**User actions:** Read ratings and reviews to inform a decision.
**Typical use cases:** Comparing providers by reputation.
**Related features:** Service detail, Provider store.
**Business value:** Social proof that increases conversion.

---

## 8. Messaging (Shared)

### 8.1 Chat List
**Role:** Customer & Provider
**Description:** A list of conversations, filterable (e.g. All / Bookings), showing online/offline status, the linked booking, last message, and unread counts.
**User actions:** Filter conversations, open a thread.
**Typical use cases:** Returning to an ongoing conversation about a booking.
**Related features:** Chat thread, Bookings.
**Business value:** Keeps negotiation and coordination inside the platform.

### 8.2 Chat Thread
**Role:** Customer & Provider
**Description:** A one-to-one conversation with message input, a linked booking reference, and helpers to send the user's location and an appointment reminder. A safety banner advises against sharing a phone number before a booking is confirmed, and a report option is available.
**User actions:** Send messages, share location, send an appointment reminder, report, and view the linked booking.
**Typical use cases:** Agreeing on details, directions, and timing safely.
**Related features:** Booking, Tracking, Safety guidance.
**Business value:** Safe in-app communication that protects personal numbers and retains conversations on-platform.

---

## 9. Loyalty & Rewards (Customer)

### 9.1 Points & Tiers
**Role:** Customer
**Description:** A loyalty program where customers accumulate points and progress through tiers (e.g. Silver → Gold), with a progress indicator toward the next tier.
**User actions:** View point balance, current tier, and progress to the next tier.
**Typical use cases:** Tracking loyalty status and motivation to book more.
**Related features:** Rewards, Badges, Points history, Booking, Reviews.
**Business value:** Drives repeat usage and engagement.

### 9.2 Achievements / Badges
**Role:** Customer
**Description:** A set of unlockable badges for milestones such as completing a first booking, sending five reviews, booking the same provider repeatedly, daily streaks, referrals, and trying multiple categories. Locked badges show what's required.
**User actions:** View earned and locked badges.
**Typical use cases:** Gamified motivation to explore the app.
**Related features:** Points & tiers.
**Business value:** Increases breadth and frequency of engagement.

### 9.3 Rewards Catalogue
**Role:** Customer
**Description:** A catalogue of rewards redeemable with points — for example a discount on the next booking, featuring a favorite provider, a mobile-wallet top-up, or a free service. Rewards the customer can't yet afford are clearly indicated.
**User actions:** Browse rewards and redeem with points.
**Typical use cases:** Spending earned points on a tangible benefit.
**Related features:** Points & tiers, Wallet.
**Business value:** Closes the loyalty loop and reinforces retention.

### 9.4 Points History
**Role:** Customer
**Description:** A chronological log of points earned and spent, with descriptions and dates.
**User actions:** Review past point activity.
**Typical use cases:** Understanding how a balance was built or spent.
**Related features:** Points & tiers, Rewards.
**Business value:** Transparency that builds trust in the program.

---

## 10. Wallet & Payments

### 10.1 Wallet
**Role:** Provider (primary)
**Description:** An in-app wallet showing available balance, with options to top up and to withdraw earnings, plus a full transaction history categorized as income, expense, top-up, or withdrawal, each with a status (e.g. completed, processing).
**User actions:** View balance, top up, withdraw earnings, and review transactions.
**Typical use cases:** A provider tracking income from completed services and cashing out.
**Related features:** Booking payments, Promotion, Payment methods.
**Business value:** Centralizes provider finances and reinforces platform stickiness.
> *Note: In the current build, top-up and withdrawal are demonstrated with sample data.*

### 10.2 Payment Methods
**Role:** Customer & Provider
**Description:** Local payment options used at checkout and in the wallet — Cash, Gold Card (bank card), and BaridiMob (mobile wallet); providers may also withdraw to accounts such as CCP.
**User actions:** Select a payment method during booking; manage methods in the wallet.
**Typical use cases:** Paying for a service the way the local market expects.
**Related features:** Booking step 2, Wallet.
**Business value:** Familiar, trusted payment methods lower friction and increase completion.

---

## 11. Provider Store & Services

### 11.1 Provider Store Setup
**Role:** Provider
**Description:** A one-time, three-step setup that creates the provider's store: project/business name and category, work photos (up to five), and a service area defined by a radius around the provider's location.
**User actions:** Enter a business name, pick a category, add work photos, set a service radius, and finish.
**Typical use cases:** A new provider getting their storefront live.
**Related features:** Services, Provider store, Dashboard.
**Business value:** Fast onboarding gets supply online quickly.

### 11.2 Provider Dashboard
**Role:** Provider
**Description:** The provider home screen with key stats (new bookings, overall rating, monthly earnings), a weekly availability strip, a shortcut to new requests, and a list of the latest reservations.
**User actions:** Review stats and availability, open new requests, view latest reservations, and jump to a client.
**Typical use cases:** A daily check-in on business activity.
**Related features:** Client management, Services, Wallet.
**Business value:** Gives providers an at-a-glance command center.

### 11.3 My Services
**Role:** Provider
**Description:** A list of the provider's services, each marked active or inactive, with an option to add a new service and an empty state for first-time providers.
**User actions:** View services, mark active/inactive, add a new service.
**Typical use cases:** Maintaining the service catalogue.
**Related features:** New service, Provider store.
**Business value:** Lets providers control what they offer and when.

### 11.4 Create a Service
**Role:** Provider
**Description:** A four-step builder: name and category; description and price (fixed or "starting from"); work photos (up to five); and availability hours. A success confirmation indicates the service will appear to customers.
**User actions:** Enter details across the steps and publish.
**Typical use cases:** Adding a new offering to attract requests.
**Related features:** My services, Provider store.
**Business value:** Grows catalogue depth and provider revenue potential.

### 11.5 Store Customer Preview
**Role:** Provider
**Description:** Lets a provider view their own store exactly as customers see it, with a banner indicating preview mode.
**User actions:** Preview the store layout, services, and reviews.
**Typical use cases:** Checking how the storefront looks before going live or after edits.
**Related features:** Provider store, Services.
**Business value:** Helps providers present themselves well, improving conversion.

---

## 12. Provider Client Management

### 12.1 Requests & Clients
**Role:** Provider
**Description:** Incoming and existing bookings organized into **New**, **Current**, and **Completed**. New requests can be accepted or rejected. Accepting confirms the booking and opens a chat thread with the client; rejecting cancels the booking.
**User actions:** Review requests, accept or reject, and open a conversation with a client.
**Typical use cases:** Triaging incoming booking requests.
**Related features:** Messaging, Dashboard, Client profile.
**Business value:** Streamlines the core provider workflow of winning and managing work.

### 12.2 Client Profile
**Role:** Provider
**Description:** A profile for an individual client showing total and completed bookings, booking history, and a way to contact them.
**User actions:** View a client's history and stats; contact the client.
**Typical use cases:** Understanding a repeat client before a job.
**Related features:** Requests & clients, Messaging.
**Business value:** Supports relationship-building and repeat business.

---

## 13. Provider Promotion

### 13.1 Promote Services
**Role:** Provider
**Description:** A paid boost that features a provider's services at the top of search results, adds a "Featured" badge, notifies nearby customers, and lasts seven days. It can be paid for with loyalty points (e.g. 500 points) or purchased directly via a payment gateway.
**User actions:** Review benefits, then redeem points or pay directly to activate promotion.
**Typical use cases:** A provider wanting more visibility and requests.
**Related features:** Loyalty points, Search ranking, Wallet.
**Business value:** A direct monetization lever and a growth tool for providers.
> *Note: In the current build, activation is confirmed via an on-screen message and the direct-payment path is simulated.*

---

## 14. Profile & Account Settings (Shared)

### 14.1 Profile Hub
**Role:** Customer & Provider
**Description:** The account screen with the user's name, role, and (for engaged customers) a premium indicator, plus shortcuts to personal info, addresses, bookings, payments, notifications toggle, language, dark mode, help, and logout.
**User actions:** Navigate to sub-areas, toggle notifications and dark mode, change language, and log out.
**Typical use cases:** Managing personal settings and finding account-related areas.
**Related features:** Edit profile, Addresses, Notifications, Help, Settings.
**Business value:** A predictable home for account management.

### 14.2 Edit Profile
**Role:** Customer & Provider
**Description:** Edit the display name, email, and bio, and change the profile photo. The phone number is shown as verified and changed via support.
**User actions:** Update name, email, and bio; change the photo; save.
**Typical use cases:** Keeping profile information current.
**Related features:** Profile hub.
**Business value:** Accurate profiles improve trust and communication.
> *Note: Profile-photo upload is marked "coming in an upcoming update" in the current build.*

---

## 15. Addresses (Shared)

### 15.1 Saved Addresses
**Role:** Customer (used at booking) & Shared
**Description:** A list of saved addresses with labels (Home, Work, Other), a default address, and an empty state for first use.
**User actions:** View, add, set default, and delete addresses.
**Typical use cases:** Reusing addresses to speed up booking.
**Related features:** Add address, Booking step 2.
**Business value:** Faster checkout and fewer errors.

### 15.2 Add Address
**Role:** Customer & Shared
**Description:** Create an address with a type (Home/Work/Other), city, detailed address, and optional notes (e.g. floor, apartment), with the option to use current location.
**User actions:** Enter address details, optionally use current location, and save.
**Typical use cases:** Adding a new service location.
**Related features:** Saved addresses, Booking.
**Business value:** Reduces friction in the booking flow.

---

## 16. Notifications (Shared)

### 16.1 Notifications Center
**Role:** Customer & Provider
**Description:** Booking and message notifications grouped by time (Today, Yesterday, This Week), with relative timestamps and a "Mark all as read" action. Includes an empty state.
**User actions:** Read notifications, mark all as read, and tap through to related content.
**Typical use cases:** Catching up on booking updates and messages.
**Related features:** Bookings, Messaging.
**Business value:** Re-engages users and keeps them informed of time-sensitive events.

---

## 17. Help Center (Shared)

### 17.1 Help Center
**Role:** Customer & Provider
**Description:** A searchable knowledge base organized into categories (Account, Bookings, Payment, Complaints) with popular articles, full article pages, and contact options (live chat and call) for unresolved questions.
**User actions:** Search, browse categories, read articles, and contact support via chat or phone.
**Typical use cases:** Self-serve answers and escalation to support.
**Related features:** Settings (support links).
**Business value:** Deflects support load and improves satisfaction.

---

## 18. App Settings (Shared)

### 18.1 Settings
**Role:** Customer & Provider
**Description:** General app settings including theme (light, dark, system), language (Arabic, English, French), and links (privacy policy, terms of service, support, share, rate, website), plus the app version.
**User actions:** Change theme and language, open legal/support links, share or rate the app.
**Typical use cases:** Personalizing the app and accessing legal information.
**Related features:** Profile hub.
**Business value:** Accessibility, compliance, and personalization.

### 18.2 Localization & Theming
**Role:** Customer & Provider
**Description:** Full support for Arabic (right-to-left), English, and French, plus light and dark themes that can follow the system.
**User actions:** Switch language and theme at any time.
**Typical use cases:** Using the app comfortably in a preferred language and appearance.
**Related features:** Settings, Profile hub.
**Business value:** Broadens reach and accessibility across the market.

---

## Feature relationships at a glance

- **Discovery → Decision → Booking:** Home/Search/Map → Service detail/Provider store → Booking flow → Confirmation.
- **Post-booking:** Tracking ↔ Messaging ↔ Reviews, all reachable from the Bookings list.
- **Engagement loop:** Bookings and Reviews earn Loyalty points → Rewards/Promotion spend them.
- **Provider operations:** Setup → Services → Requests/Clients → Messaging → Wallet → Promotion.
- **Cross-cutting:** Notifications, Help Center, Profile, Addresses, and Settings support every flow.

See **[USER_JOURNEYS.md](USER_JOURNEYS.md)** for end-to-end flow diagrams and **[FEATURE_SUMMARY.md](FEATURE_SUMMARY.md)** for status at a glance.
