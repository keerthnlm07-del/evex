& "C:\Users\LENOVO\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r "C:\Users\LENOVO\.gemini\antigravity\scratch\evex-mobile-app\android\app\build\outputs\apk\debug\app-debug.apk"# EVEX – Event Management & Gig Workforce Platform (Android Mobile Application)

EVEX is a modern, unified Android mobile application connecting three distinct user categories:
1. **Customers** – Individuals & organizations planning weddings, summits, birthdays, and anniversaries.
2. **Event Managers** – Production studios & event management agencies handling bids, budgets, and crew recruitment.
3. **Job Seekers** – Gig workers, hospitality specialists, photographers, decorators, and crew looking for verified event jobs.

---

## 📱 Architecture & Key Features

### 1. Mobile-First Android UX
- **Android Smartphone Frame (Pixel / Galaxy)** with status bar (live clock, 5G, WiFi, battery), dynamic camera punch-hole, and bottom Android gesture navigation bar.
- Switchable **Fluid Mobile View** toggle for native testing directly on mobile viewports.
- Deep Navy (`#0A0F1D`), Pure White, and Vibrant Purple (`#7C3AED`, `#A855F7`) / Emerald (`#10B981`) accents.
- Responsive cards, bottom sheets, smooth tab navigation, and touch-optimized tap targets.

### 2. Strict Role-Based Authentication & Portal Isolation
- Separate portals: Customer, Event Manager, Job Seeker.
- **Strict Role Isolation Rule:** Once authenticated, a user cannot switch roles inside their active session. To change roles, the user must explicitly **Sign Out**, return to the Role Selection screen, select another portal, and log in.
- Role-specific login and registration flows with demo accounts pre-configured for instant 1-click evaluation.

### 3. Integrated Reactive State & Shared Workflows
All three portals are interconnected via a reactive, persistent database:
- **Customer submits event requirement** $\rightarrow$ Event Managers immediately see it in **Requests**.
- **Event Manager accepts proposed budget or sends a counter-quote** $\rightarrow$ Customer instantly receives the proposal card in their **Bookings & Quotes** dashboard.
- **Customer accepts proposal** $\rightarrow$ Creates a **Confirmed Booking** and triggers escrow payment options.
- **Event Manager posts a gig opening** $\rightarrow$ Appears immediately on the **Job Seeker Gig Board**.
- **Job Seeker applies for a gig** $\rightarrow$ Event Manager receives the application, inspects the candidate profile, and **Accepts/Rejects**.
- **Customer makes payment (Razorpay / UPI)** $\rightarrow$ Booking balance updates, receipt is generated, and Event Manager is credited in Escrow.

---

## 🚀 Portals & Bottom Navigation

### 👤 Customer Portal
- **Home**: Welcome dashboard, active statistics, upcoming event cards, "Plan an Event" & "Find Event Services" quick action buttons.
- **Explore**: Directory of top-rated event agencies with verified badges, specialties, and 1-click proposal requests.
- **Bookings**: Budget-based matching with proposal comparison cards (offered price, portfolio image, deliverables, rating, Accept/Reject actions), confirmed event timeline, and past events.
- **Payments**: 256-bit Razorpay / UPI simulated checkout (Google Pay, PhonePe, Cards, NetBanking), outstanding balance tracker, and downloadable receipt statements.
- **Profile**: Account details, total event expenditure, and role sign-out.

### 🏢 Event Manager Portal
- **Dashboard**: Total inquiries, active proposals, confirmed events, active gig openings, applicant count, and revenue overview (contracted vs collected).
- **Requests**: Review customer event requirements, accept target budgets directly, submit counter-proposals with custom amounts and notes, or decline inquiries.
- **Recruitment**: Publish new gig postings (position, openings, daily rate, venue, timings, skills) and manage candidate applications (profile review, hiring confirmation, status notes).
- **Bookings**: Confirmed contracts, client contact details, event logistics, and payment collection tracking.
- **Profile**: Agency portfolio, verified domains, experience metrics, and role sign-out.

### 🛠️ Job Seeker Portal
- **Home**: Gig statistics (Available, Applied, Selected, Completed, Total Earnings), active upcoming gig card with venue directions.
- **Find Jobs**: Event-specific job board with filters by role, location, salary tier, and event type. Complete gig brief, spot counter, and 1-click application with pitch.
- **My Applications**: Visual lifecycle tracking (`Applied` $\rightarrow$ `Under Review` $\rightarrow$ `Accepted` $\rightarrow$ `Completed`) with agency instructions.
- **Earnings**: Cumulative earnings overview, payout history, and instant UPI / Bank withdrawal simulation.
- **Profile**: Verified skills chips, past gig track record, client reviews, daily rate preferences, and role sign-out.

---

## 🛠️ How to Run Locally

```bash
# Navigate to project folder
cd evex-mobile-app

# Install dependencies (if not already installed)
npm install

# Start Vite mobile dev server
npm run dev

# Or build for production
npm run build
```

---

## 📦 Android APK Packaging (Capacitor)

To compile EVEX into a native Android `.apk` / `.aab`:

```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 2. Initialize Capacitor
npx cap init "EVEX" "com.evex.mobile" --web-dir "dist"

# 3. Build Web Assets
npm run build

# 4. Add Android platform
npx cap add android

# 5. Open in Android Studio & Build APK
npx cap open android
```
