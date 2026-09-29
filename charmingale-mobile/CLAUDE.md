



Task: (1) Wire up AsyncStorage-based first-time onboarding, and (2) configure the app icon/logo for the build.

Stack: Expo SDK 57, expo-router (file-based routing, EAS build - not Expo Go), NativeWind (className), TypeScript, react-native-safe-area-context, react-native-svg.

=== PART 1: First-time onboarding ===

Context:
- Onboarding screen already exists and is fully built at `app/onBoarding.tsx` (note the capital B — filename is case-sensitive, keep it as-is). It's a swipeable FlatList with 4 slides, SVG illustrations, Skip button, dots indicator, and Next/Get Started button.
- Root layout is at `app/_layout.tsx`.
- It's already registered in the Stack as `<Stack.Screen name="onBoarding" options={{ headerShown: false }}/>`.

Steps:
1. Install AsyncStorage:
   `npx expo install @react-native-async-storage/async-storage`

2. In `app/onBoarding.tsx`:
   - Import AsyncStorage.
   - Find the `finish` function (currently `const finish = () => router.replace('/');`).
   - Make it async: on finish, call `await AsyncStorage.setItem('hasSeenOnboarding', 'true')`, then `router.replace('/')`.

3. In `app/_layout.tsx`:
   - Import AsyncStorage.
   - There's a `useEffect` that currently calls `registerForPushNotifications()` and a temporary test `setTimeout(() => router.replace('/onBoarding'), 0)` — REMOVE the setTimeout line.
   - Replace it with: `AsyncStorage.getItem('hasSeenOnboarding').then((seen) => { if (!seen) router.replace('/onBoarding'); });` inside the same useEffect, after registerForPushNotifications().

Constraints for Part 1:
- Do NOT rewrite entire files — make targeted, minimal edits only (Ctrl+F style patches).
- Do NOT change the onBoarding screen's UI/slides/SVGs — they're already final.
- Do NOT add any backend calls — this is 100% local via AsyncStorage.

=== PART 2: App icon / logo setup ===

Context:
- Logo file already exists at `assets/charmingale.png`.
- Need it wired into `app.json` so it's used as the actual app icon in the EAS build (launcher icon on Android, and app icon on iOS if applicable).

Steps:
1. Open `app.json`, find the `"expo": { ... }` object.
2. Set or update the top-level icon field:
   `"icon": "./assets/charmingale.png"`
3. For Android adaptive icon, under `"android": { ... }`, set:
```json
   "adaptiveIcon": {
     "foregroundImage": "./assets/charmingale.png",
     "backgroundColor": "#FFE4EA"
   }
```
   (use the app's blush background color for backgroundColor — check tailwind.config.js for the exact hex if `#FFE4EA` isn't correct)
4. If there's an existing "icon" or "adaptiveIcon" field pointing to a different/placeholder file, replace it — don't leave both.
5. Check `assets/charmingale.png` dimensions — flag it if it's not square or is smaller than 1024x1024, since that can cause a blurry or rejected icon. Recommend resizing to 1024x1024 if needed, but don't attempt image resizing yourself, just flag it.

Constraints for Part 2:
- Only edit `app.json` (and note if resizing the PNG is needed) — do not touch other native config unless the icon field requires a sibling field to exist.
- Do not change splash screen config unless asked.

=== Final ===
- This whole task (AsyncStorage + icon change) requires a NEW EAS build (native config + native module changed). Give me the exact `eas build` command for the android development profile.
- Remind me to verify after build:
  - App icon shows correctly on the home screen/launcher.
  - First app open (fresh install / cleared app data) → onBoarding shows first.
  - After completing or skipping onboarding → goes to home (index/Dashboard).
  - Subsequent reopens/reloads → skips onBoarding, goes straight to home.