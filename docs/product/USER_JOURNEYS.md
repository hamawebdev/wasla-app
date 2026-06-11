# Wasla — User Journeys

End-to-end journeys actually found in the Wasla app, represented as Mermaid flowcharts with supporting notes. These show how customers and providers move through the product from first launch to completing their goals.

> Journeys included: Onboarding & sign-in, Location setup, Service discovery, Booking, Booking tracking & cancellation, Communication, Reviews, Loyalty & rewards, Provider onboarding, Provider service management, Provider request handling, Provider wallet, and Provider promotion.

---

## 1. Onboarding & Sign-in

Both customers and providers share the same entry flow, branching by role after verification. Providers complete an extra store setup.

```mermaid
flowchart TD
    A[Open app first time] --> B[Welcome onboarding<br/>3 intro slides]
    B -->|Start now / I have an account| C[Choose how to use Wasla]
    C --> D{Select role}
    D -->|I'm looking for a service| E[Customer]
    D -->|I provide services| F[Provider]
    E --> G[Register:<br/>name, +213 phone, optional email]
    F --> G
    G --> H[Enter 6-digit verification code]
    H --> I{Role?}
    I -->|Customer| J[Customer Home]
    I -->|Provider| K[Provider store setup]
    K --> L[Provider Dashboard]

    C -.demo mode.-> M[Account picker:<br/>pick demo customer or provider]
    M -.->|Customer| J
    M -.->|Provider| L
```

**Notes**
- The welcome onboarding appears only on first launch.
- Social sign-in (Google, Facebook) is offered as an alternative on the registration screen.
- In demo mode, an account picker provides instant access and any six-digit code is accepted.

---

## 2. Location Setup (Customer)

```mermaid
flowchart TD
    A[Location prompt] --> B{Share device location?}
    B -->|Allow location| C[Detect current location]
    B -->|Choose manually| D[City / wilaya list]
    D --> E[Search neighborhood or city]
    E --> F[Select city]
    F --> G[Confirm location]
    C --> H[Localized home & map]
    G --> H
```

**Notes**
- Location powers "Services near you," distance sorting, and the map.
- Users who decline GPS can still get localized results by picking a city.

---

## 3. Service Discovery (Customer)

```mermaid
flowchart TD
    A[Customer Home] --> B{How to discover?}
    B -->|Search bar| C[Search screen]
    B -->|Category chip| D[Category browse]
    B -->|Featured / Nearby| E[Service detail]
    B -->|Map toggle| F[Map discovery]
    B -->|Saved| G[Favorites]

    C --> C1[Apply filters:<br/>category, price, rating,<br/>distance, availability]
    C1 --> C2[Sort: nearest /<br/>price / highest rated]
    C2 --> E
    D --> E
    F --> E
    G --> E

    E --> H[View store / reviews]
    E --> I[Save to favorites]
    E --> J[Book now]
    E --> K[Chat]
```

**Notes**
- The home feed, search, category browse, and map all converge on the **Service detail** page.
- From a service, users can branch to the provider's store, save it, chat, or start a booking.

---

## 4. Booking a Service (Customer)

```mermaid
flowchart TD
    A[Service detail] -->|Book now| B[Step 1: Date & time]
    B --> C[Pick available date]
    C --> D[Pick time slot]
    D --> E[Step 2: Details & payment]
    E --> F[Choose service address]
    F -->|none saved| F1[Add new address]
    F1 --> G
    F --> G[Add notes]
    G --> H[Select payment:<br/>Cash / Gold Card / BaridiMob]
    H --> I{Apply promo code?}
    I -->|Yes| I1[Enter code → discount applied]
    I -->|No| J
    I1 --> J[Review price breakdown:<br/>service + fee − discount = total]
    J --> K[Confirm booking]
    K --> L[Confirmation:<br/>Awaiting confirmation]
    L --> M[Track provider]
    L --> N[Message provider]
    L --> O[Explore services]
```

**Notes**
- The price breakdown is always transparent: service cost, platform fee, any discount, grand total.
- After confirming, the booking is **pending** until the provider accepts it.

---

## 5. Booking Tracking & Cancellation (Customer)

```mermaid
flowchart TD
    A[Bookings list] --> B{Tab}
    B -->|Current| C[Pending / Confirmed booking]
    B -->|Completed| D[Completed booking]
    B -->|Cancelled| E[Cancelled booking]

    C --> F{Action}
    F -->|Track| G[Live tracking:<br/>Accepted → On the way → Arrived]
    G --> H[Call or Chat provider]
    F -->|Message| I[Chat thread]
    F -->|Cancel| J[Select cancellation reason]
    J --> K[Add optional notes]
    K --> L[Confirm cancellation]
    L --> E
    D -->|Write review| M[Review flow]
```

**Notes**
- Booking statuses: **pending → confirmed → completed**, or **cancelled**.
- Tracking offers call and chat shortcuts and a map view of the provider's progress.

---

## 6. Communication (Shared)

```mermaid
flowchart TD
    A[Chats list] --> B[Filter: All / Bookings]
    B --> C[Open chat thread]
    C --> D[See linked booking]
    C --> E[Send message]
    C --> F[Send my location]
    C --> G[Send appointment reminder]
    C --> H[Report conversation]
    C --> I{{Safety banner:<br/>don't share phone<br/>before confirming}}
```

**Notes**
- Messaging is shared by customers and providers; threads are linked to a booking.
- The safety banner is a persistent reminder to keep personal numbers private until confirmation.

---

## 7. Reviews & Loyalty (Customer)

```mermaid
flowchart TD
    A[Completed booking / Service] -->|Write a review| B[Select star rating]
    B --> C[Add photos optional]
    C --> D[Write details]
    D --> E[Submit review]
    E --> F[Earn loyalty points]
    F --> G[Points & Rewards]
    G --> H[View tier & progress]
    G --> I[Unlock badges]
    G --> J[Redeem rewards]
    G --> K[Points history]
```

**Notes**
- Reviews feed the engagement loop: actions earn points, which unlock tiers/badges and can be redeemed for rewards.

---

## 8. Provider Onboarding

```mermaid
flowchart TD
    A[Provider role + verified] --> B[Step 1: Project info<br/>name + category]
    B --> C[Step 2: Work photos<br/>up to 5]
    C --> D[Step 3: Service area<br/>radius in km]
    D --> E[Finish]
    E --> F[Provider Dashboard]
```

**Notes**
- Store setup is a one-time, guided three-step flow that must be completed before the dashboard.

---

## 9. Provider Service Management

```mermaid
flowchart TD
    A[Provider Dashboard] --> B[Services tab]
    B --> C{Add or manage?}
    C -->|Manage| D[Toggle Active / Inactive]
    C -->|Add service| E[Step 1: Name & category]
    E --> F[Step 2: Description & price<br/>fixed or 'starting from']
    F --> G[Step 3: Work photos]
    G --> H[Step 4: Availability hours]
    H --> I[Publish]
    I --> J[Service visible to customers]
```

---

## 10. Provider Request Handling

```mermaid
flowchart TD
    A[New booking request] --> B[Dashboard / Requests]
    B --> C{New / Current / Completed}
    C -->|New| D{Accept or Reject?}
    D -->|Accept| E[Booking confirmed]
    E --> F[Chat thread opened with client]
    D -->|Reject| G[Booking cancelled]
    C -->|Current| H[Confirmed bookings]
    C -->|Completed| I[Past bookings]
    B --> J[Open client profile:<br/>history & contact]
```

**Notes**
- Accepting a request both **confirms** the booking and **opens a chat** with the client.
- Rejecting **cancels** the request.

---

## 11. Provider Wallet & Promotion

```mermaid
flowchart TD
    A[Provider Account] --> B[Wallet]
    B --> C[View balance]
    B --> D[Top up]
    B --> E[Withdraw earnings]
    B --> F[Transaction history:<br/>income / expense / topup / withdrawal]

    A --> G[Promote services]
    G --> H{Pay how?}
    H -->|Redeem points| I[Featured for 7 days]
    H -->|Buy directly| J[Payment gateway]
    J --> I
    I --> K[Top of search + Featured badge +<br/>notify nearby customers]
```

**Notes**
- Promotion can be funded with loyalty points or a direct purchase.
- Wallet centralizes provider finances: earnings, fees, top-ups, and withdrawals.

---

## Journey map at a glance

```mermaid
flowchart LR
    subgraph Customer
      O[Onboarding] --> L[Location] --> D[Discover] --> S[Service detail] --> BK[Book] --> T[Track] --> R[Review] --> P[Points & Rewards]
      D --> CH[Chat]
      BK --> CH
    end
    subgraph Provider
      PO[Onboarding/Setup] --> PD[Dashboard] --> SV[Services] --> RQ[Requests] --> PC[Chat] --> W[Wallet] --> PR[Promote]
    end
    R -.points.-> P
    P -.spend.-> PR
```

---

See **[USER_GUIDE.md](USER_GUIDE.md)** for step-by-step instructions and **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)** for full feature descriptions.
