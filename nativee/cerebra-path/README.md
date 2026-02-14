# Go Birdie - Expo Router Version

Where the vision started:
https://ottomulari.tech/indexcaddy.html

## Vision & Target Audience:

Beginner to intermediate golfers looking to systematically progress to the next level.

GoBirdie is a smart, data-driven golf companion that bridges the gap between the driving range and the golf course.
By actively logging practice performance to build individual "club profiles," GoBirdie acts as a highly personalized digital caddie.
The ultimate goal is to completely replace traditional rangefinders and golf watches, providing players with automated, hyper-personalized club selections and swing tips based on their unique, historically tracked data.

## Scope

## The initial deployment relies on manual inputs to establish the core data loop, focusing on two main features:

GoBirdie Practice Drills:  
What it is: A comprehensive library of golf drills. While they can be used casually, the core value is in data collection.
How it works: After completing a drill, the app prompts the user to input their results.
The Output: The app builds a highly personalized "Skill Profile" for every individual club. It tracks specific tendencies (e.g., "Your 7-iron misses left 58% of the time") and uses this data to recommend personalized future practice plans.

GoBirdie Caddie (Manual Mode):
What it is: An on-course decision-support tool for the perfect club selection.
How it works: The user inputs variables for their upcoming shot (wind, temperature, elevation, and lie).
The Output: The app calculates the ideal club choice by combining the environmental inputs with the player's personalized data (gathered from an initial Q&A onboarding and their Practice Drill history).

## Future Roadmap

As the app evolves, the focus shifts from manual data entry to seamless, automated assistance.

## Phase 2: API & Sensor Automation

Integrate Weather APIs and phone GPS to automatically pull wind, temperature, and elevation.

Introduce AR/Camera functionality: Users simply point their phone at the pin to estimate distance, drastically reducing manual input during a round.

## Phase 3 (The Ultimate Product): The All-in-One Digital Caddie

Full Course GPS Integration: Incorporate the same software used by premium golf watches. The user only needs to manually input their "lie."

Automated Shot Calculation: The app automatically calculates the exact adjusted distance to the pin.

Predictive Coaching: Beyond just giving a club recommendation, the app provides personalized, context-aware tips based on historical practice data (e.g., "Adjusted distance is 155 yards. Use your 7-iron, but remember to keep the club face closed because you have a tendency to miss right with this club.")

## Phase 4

(Trackman API): For serious golfers at simulator bays or with personal launch monitors, GoBirdie integrates directly with Trackman. It automatically ingests highly accurate data points (carry, spin rate, face angle, smash factor) in real-time during the drill.

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
