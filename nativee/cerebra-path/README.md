# Go Birdie - Expo Router Version

## Vision

Go Birdie aims to help golfers improve faster through smarter practice and on-course decision support. By turning practice and round data into personalized insights, the app acts as a digital coach and caddie, guiding players toward better performance and more confident play.

## Scope

The app focuses on three core areas:

- **Practice Tracking & Analysis**  
  Capture practice data to identify strengths, weaknesses, and improvement trends.

- **Personalized Coaching**  
  Generate tailored practice tips and adaptive challenges based on player performance.

- **On-Course Caddie Assistance**  
  Provide club and strategy suggestions during rounds using player data and situational context.

## 📦 What's Inside

### Core Files (Ready to Copy)

- `app/context/ProgressContext.tsx` - State management with AsyncStorage
- `app/data/tips.ts`
- `constants/theme.ts` - design system

### Screens (Expo Router Compatible)

- `app/_layout.tsx` - Root layout with ProgressProvider
- `app/index.tsx` - Animated home screen
- `app/onboarding.tsx` - Interest selection
- `app/AuthScreen.tsx` - Log in screen
- `app/screens/DashboardScreen.tsx` - Home window
- `app/screens/MenuOverlay` - Control display
- `app/MenuWindowSettings/Settings.tsx` - General settings

## 🚀 Quick Setup

## Prerequisites

Make sure the following are installed:

- Node.js (LTS recommended)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator)
- Xcode (for iOS simulator, macOS only)

### 1. Install Dependencies

```bash
npx expo install expo
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/elements
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
npm install expo-linear-gradient @react-native-async-storage/async-storage
npx expo install @react-native-masked-view/masked-view
npm install nativewind tailwindcss
npm install react react-dom react-native react-native-web

```

### 2. Copy Files to Your Project

```bash
# From this cerebra-path-expo-router folder:
cp -r app/context your-project/app/
cp -r app/data your-project/app/
cp constants/theme.ts your-project/constants/

# Copy screens
cp app/_layout.tsx your-project/app/
cp app/index.tsx your-project/app/
cp app/onboarding.tsx your-project/app/
```

### 3. Create Remaining Screens

You have 3 options:

**Option A:** Convert the React Navigation screens from the main `src/` folder to Expo Router format

**Option B:** I can create them for you - just ask!

**Option C:** Start with these 3 screens and build the rest gradually

### 4. Test the Flow

```bash
npx expo start
```

Navigate: Home → Onboarding → (Dashboard - you'll create this)
Project Structure

```
cerebra-path/
├── app/                    # Expo Router screens & layouts
├── assets/                 # Images, fonts, icons
├── components/             # Reusable UI components
├── context/                # React Context providers (e.g. UserContext)
├── database/               # Supabase / local database helpers
├── hooks/                  # Custom React hooks
├── scripts/                # Utility & reset scripts
├── styles/
│   └── jaska.css            # Global styles
├── app.json                # Expo configuration
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md

```

## 🔨 What You Need to Create

The screens using the React Navigation versions as reference:

1. **dashboard.tsx** - Copy from `src/screens/DashboardScreen.tsx`, replace:
   - `useNavigation()` → `useRouter()`
   - `navigation.navigate()` → `router.push()`

2. **AuthScreen.tsx** - Copy from `src/AuthScreen.tsx`

3. **progress.tsx** - Copy from `src/screens/ProgressScreen.tsx`

4. **Settings.tsx** - Copy from `src/MenuWindowSettings/Settings.tsx`, update:
   - `route.params`
   - Dynamic route handling

## 🤝 Need Help?

Check the detailed guides or ask for the complete screen conversions!

---
