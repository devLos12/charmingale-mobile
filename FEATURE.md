# Charmingale Features Overview

This document summarizes the features currently implemented in the app across the mobile client and backend services.

## 1. Dashboard and Progress Overview

The dashboard is the main home screen and acts as the user progress center.

### Included functionality
- App branding and greeting banner
- Overall learning progress card
- Completed topics vs total topics count
- Progress bar for the learning journey
- Studied time summary
- Current streak count
- Estimated hours left based on remaining work
- Category preview list for quick navigation
- Notification badge indicator on the top bar
- Pull-to-refresh support for reloading dashboard data

### Key behavior
- Fetches category data on load
- Fetches dashboard statistics from the backend
- Fetches unread notifications from the notification store
- Displays a loading state while dashboard data is preparing
- Shows a motivational rotating message panel

### Main files
- `charmingale-mobile/src/features/dashboard/components/dashboard.tsx`
- `charmingale-mobile/src/features/dashboard/store/index.ts`
- `server/src/modules/dashboard/components/get-dashboard-topics.ts`

---

## 2. Categories, Topic Browsing, and Learning Flow

This feature handles the category browsing and concept learning journey.

### Included functionality
- Dashboard category preview cards
- Category detail screen by color/category name
- Topic grouping by `topicHeader`
- Topic ordering and category-level filtering
- Concept unlocking logic based on previous completion
- Concept list inside each category
- Study timer per concept
- Start / pause / resume timer behavior
- Completion tracking and progression updates
- Completed concept state indication
- Redirect to completion screen after finishing a concept

### Category flow
- User selects a category color/name
- App loads category topics from the backend
- Topics are grouped and sorted by topic order
- Concepts are displayed with lock/unlock states
- The first concept is normally accessible and later concepts unlock after prior ones are completed

### Concept flow
- User opens a concept page
- App loads concept details and allocated study minutes
- Timer starts when the user presses the start button
- Countdown updates every second
- When the timer reaches zero, the concept gets marked complete
- User is redirected to the completion screen after finishing

### Main files
- `charmingale-mobile/src/features/categories/components/CategoryPreview.tsx`
- `charmingale-mobile/src/features/categories/components/CategoryScreen.tsx`
- `charmingale-mobile/src/features/categories/components/ConceptScreen.tsx`
- `charmingale-mobile/src/features/categories/store/index.ts`
- `charmingale-mobile/src/features/categories/hooks/useUpdateConcept.ts`

---

## 3. Files and Learning Materials

This feature supports concept-based reading and study materials.

### Included functionality
- Upload file for a specific concept
- Fetch concept-specific files from the backend/storage
- Display uploaded materials in a material list
- Show file name and metadata
- Open a selected file in the PDF viewer
- Empty-state handling when no material exists yet
- Loading state while files are being fetched
- Material section integrated directly into the concept detail screen

### File behavior
- The app gets files associated with a concept ID
- Each file item is rendered as a readable card
- Clicking a file pushes to the PDF viewer screen
- Upload flow is available from the concept detail page

### Main files
- `charmingale-mobile/src/features/files/components/MaterialSection.tsx`
- `charmingale-mobile/src/features/files/components/UploadFileButton.tsx`
- `charmingale-mobile/src/features/files/store/index.ts`
- `charmingale-mobile/src/features/files/types/index.ts`
- `charmingale-mobile/src/features/files/hooks/useUploadFile.ts`

---

## 4. Notification System

The app includes a notification feature for updates, reminders, and user activity visibility.

### Included functionality
- Notification screen with list view
- Unread notification counter
- Read and unread notification states
- Mark notification as read after tapping it
- Notification empty state when there are no items
- Notification path routing for deep linking to relevant screens
- Notification refresh via dashboard re-fetch

### Behavior
- Notification data is fetched from the backend API
- Unread notifications are highlighted visually
- Tapping a notification opens the associated route when a `path` is available
- After opening, the notification is marked as read

### Main files
- `charmingale-mobile/src/features/notification/components/notification-screen.tsx`
- `charmingale-mobile/src/features/notification/components/notification-list.tsx`
- `charmingale-mobile/src/features/notification/store/index.ts`
- `server/src/modules/notification/controller/get-notification.ts`
- `server/src/modules/notification/controller/update-notification.ts`

---

## 5. Push Notification Registration and Reminders

The app supports Expo push notifications to remind users to study and keep engagement active.

### Included functionality
- Push permission request on app startup
- Device token registration to the backend
- Expo push channel setup for Android
- Daily/hourly reminder-style push sending from the server
- Device token storage and lookup

### Behavior
- The root layout initializes push registration on app mount
- The app requests notification permission if needed
- The Expo token is saved to the backend `DeviceToken` table
- The server can send reminder messages to registered devices

### Main files
- `charmingale-mobile/src/lib/push.ts`
- `charmingale-mobile/src/app/_layout.tsx`
- `server/src/lib/expo-push.ts`
- `server/src/modules/notification/controller/push-register.ts`

---

## 6. Streak Tracking and Learning Consistency

The app tracks a daily study streak to encourage consistent learning.

### Included functionality
- Streak counter in the dashboard
- Daily streak updates based on user activity
- Philippine time-based streak logic
- Streak reset behavior when there is a gap in activity
- Streak persistence in the backend database

### Behavior
- The app calculates streaks using the local date logic aligned to Philippine time
- When a user completes a concept and updates progress, the streak system can be refreshed
- The dashboard shows the most recent streak count

### Main files
- `server/src/lib/streak.ts`
- `server/src/modules/categories/controller/update-concept-topic.ts`
- `charmingale-mobile/src/features/dashboard/store/index.ts`

---

## 7. App Routing and Navigation

The app uses Expo Router for screen-based navigation across the learning workflow.

### Routes represented in the app
- Home dashboard
- Category detail screen
- Concept detail screen
- PDF viewer screen
- Completion screen
- Notification screen

### Navigation behavior
- Category selection routes to the category topic list
- Concept items route to the concept study screen
- File selection opens the PDF viewer
- Completion flow redirects after concept completion
- Notification page is accessible from the dashboard header

### Main files
- `charmingale-mobile/src/app/_layout.tsx`
- `charmingale-mobile/src/app/index.tsx`
- `charmingale-mobile/src/app/categories/[colorName].tsx`
- `charmingale-mobile/src/app/concept/[conceptId].tsx`
- `charmingale-mobile/src/app/pdf-viewer.tsx`
- `charmingale-mobile/src/app/concept-completed.tsx`
- `charmingale-mobile/src/app/notification.tsx`

---

## 8. Theme and Design System

The app uses a custom theme palette defined in the Tailwind config to keep the interface consistent throughout the mobile app.

### Color palette
- `rose`: `#C6195C`
- `roseDeep`: `#8E1145`
- `blush`: `#FDEDF2`
- `ink`: `#3D1024`
- `gold`: `#C79A46`
- `muted`: `#A8748A`

### Design patterns used across features
- Soft rose and blush backgrounds
- White cards with rounded corners
- Primary actions in rose
- Accent highlights in gold
- Dark ink text with muted secondary text
- Icon-based navigation and actions
- Loading screens for async data states
- SafeArea-based screens for mobile layout
- Expo Router navigation between category, concept, PDF, and notification screens

---

## 9. Current Feature Summary

The app currently supports the following complete learning workflow:
1. View dashboard and overall learning progress
2. Browse categories and topics
3. Unlock and access concept-based lessons
4. Study with a per-concept timer
5. Pause, resume, and complete learning tasks
6. Track streak performance and engagement metrics
7. Upload and access concept study materials
8. Receive push reminders and view in-app notifications
9. Continue progression through the course structure and learning journey

This is the full feature set currently implemented in the project: a learning-focused app centered around category-based progression, concept completion, study tracking, materials support, and user engagement reminders.
