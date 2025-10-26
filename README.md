# 📱 My Trial App

> A modern React Native mobile application with Firebase authentication and professional UI design

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-~54.0.20-000020?logo=expo)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-FFCA28?logo=firebase)

## 🌟 Overview

My Trial App is a cross-platform mobile application built with React Native and Expo, featuring secure phone number authentication powered by Firebase. The app provides a smooth user experience with modern UI components, persistent login sessions, and real-time user data management.

### ✨ Key Features

- 🔐 **Secure Phone Authentication** - OTP-based login with Firebase Auth
- 📱 **Cross-Platform Support** - iOS, Android, and Web compatible
- 🎨 **Modern UI Design** - Professional, clean interface with animations
- 💾 **Persistent Sessions** - Users stay logged in with AsyncStorage
- 🗄️ **Cloud Database** - User data stored in Firebase Firestore
- 🌓 **Theme Support** - Light and dark mode
- ⚡ **Real-time Updates** - Context-based state management
- 📊 **User Management** - Automatic user profile creation

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Firebase Setup](#-firebase-setup)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [Running the App](#-running-the-app)
- [Building for Production](#-building-for-production)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.19.4 - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Expo CLI** - Install via `npm install -g expo-cli`
- **Firebase Account** - [Create Account](https://firebase.google.com/)

### For Mobile Development:

- **iOS**: Xcode 15+ (Mac only)
- **Android**: Android Studio with Android SDK

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Visit the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `my-trial-app`
4. Enable Google Analytics (optional)
5. Click **"Create project"** and wait for provisioning

### Step 2: Enable Phone Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Enable the phone sign-in method
4. For Android: Add your SHA-1 fingerprint (see below)

### Step 3: Set Up Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a location close to your users
5. Click **"Enable"**

### Step 4: Get Configuration

1. Go to **Project Settings** (⚙️ gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** and select the platform:
   - **Web** (`</>` icon)
   - **Android** (Android icon)
   - **iOS** (iOS icon)
4. Copy the configuration object

### Step 5: Update App Configuration

Update `config/firebase.ts` with your Firebase credentials:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyYourActualKey",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 6: Android SHA-1 Setup

1. Get your SHA-1 fingerprint:
   ```bash
   cd android
   ./gradlew signingReport
   ```
   
   Or for debug keystore:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore \
     -alias androiddebugkey -storepass android -keypass android
   ```

2. Add SHA-1 to Firebase:
   - Firebase Console → Project Settings
   - Under "Your apps", select Android app
   - Add SHA-1 fingerprint
   - Download `google-services.json`

---

## 📦 Installation

### Clone the Repository

```bash
git clone <your-repository-url>
cd my-trial-app
```

### Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### Configure Environment

Update the Firebase configuration in `config/firebase.ts` with your project details.

---

## 🏗️ Project Structure

```
my-trial-app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home tab
│   │   ├── explore.tsx          # Explore tab
│   │   └── _layout.tsx          # Tab layout config
│   ├── auth/                     # Authentication
│   │   ├── login.tsx            # Phone login screen
│   │   └── _layout.tsx          # Auth layout
│   ├── home.tsx                 # Authenticated home
│   ├── index.tsx                # App entry point
│   ├── modal.tsx                # Modal screen
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable UI components
│   ├── themed-text.tsx         # Themed text component
│   ├── themed-view.tsx         # Themed view component
│   └── ui/                      # UI components
├── config/
│   └── firebase.ts              # Firebase configuration
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── constants/
│   └── theme.ts                 # Theme colors & fonts
├── hooks/                       # Custom React hooks
├── assets/                      # Images and static assets
├── package.json                 # Dependencies
├── app.json                     # Expo configuration
└── tsconfig.json               # TypeScript config
```

---

## 🔐 Authentication Flow

### User Journey

1. **Entry Screen** → App checks authentication status
2. **Unauthenticated** → User sees welcome tabs with login prompts
3. **Phone Login** → User enters phone number → Receives OTP → Verifies code
4. **Account Creation** → New user data saved to Firestore
5. **Authenticated** → User redirected to personal home screen
6. **Persistent Login** → User stays logged in across sessions
7. **Sign Out** → Returns to login screen

### Technical Flow

```
User Input → Phone Number → Firebase Phone Auth Provider
    ↓
reCAPTCHA Verification
    ↓
OTP Sent (SMS) → User Enters OTP
    ↓
Phone Auth Credential Created
    ↓
Firebase Auth → User Authenticated
    ↓
Save to Firestore (users collection)
    ↓
Save to AsyncStorage (persistence)
    ↓
Update Auth Context → Redirect to Home
```

---

## 🚀 Running the App

### Start Development Server

```bash
npm start
```

This opens the Expo DevTools in your browser. You can then:

- Press `i` - Run on iOS simulator
- Press `a` - Run on Android emulator  
- Press `w` - Run in web browser
- Scan QR code - Open in Expo Go app on physical device

### Platform-Specific Commands

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Development Tips

- Enable **hot reload** for instant updates
- Use **React DevTools** for debugging
- Check **Expo DevTools** for logs and errors
- Enable **remote JS debugging** for deep inspection

---

## 📱 Building for Production

### Android Build

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

### iOS Build

```bash
# Development build
eas build --platform ios --profile development

# Production build  
eas build --platform ios --profile production
```

### OTA Updates

```bash
# Publish update
eas update --branch production --message "Bug fixes"
```

---

## 🗄️ Database Schema

### Firestore Collections

#### Users Collection

```typescript
users/{userId} {
  id: string,           // Firebase Auth UID
  phoneNumber: string,   // User's phone number
  createdAt: timestamp   // Account creation time
}
```

**Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎨 UI/UX Features

### Design System

- **Colors**: Professional color palette with dark/light variants
- **Typography**: Consistent font families and sizes
- **Components**: Reusable themed components
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Adaptive layouts for all screen sizes

### Component Library

- `ThemedText` - Typography component with theme support
- `ThemedView` - Container with theme-aware background
- `ParallaxScrollView` - Animated scroll container
- `HapticTab` - Haptic feedback for tab navigation

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset project to clean state |

---

## ❗ Troubleshooting

### Common Issues

#### 1. Firebase Configuration Error

**Problem**: App won't connect to Firebase

**Solution**:
- Verify all config values in `config/firebase.ts`
- Check Firebase project is active
- Ensure correct API keys are used

#### 2. Phone Authentication Not Working

**Problem**: OTP not sent or verification fails

**Solution**:
- Enable phone auth in Firebase Console
- Check phone number format: `+1234567890`
- Verify reCAPTCHA is working
- Check Firebase quota limits

#### 3. Build Fails

**Problem**: App crashes on build

**Solution**:
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Clear Expo cache
npx expo start --clear
```

#### 4. Firestore Permission Denied

**Problem**: Can't read/write to Firestore

**Solution**:
- Update security rules in Firebase Console
- Ensure user is authenticated
- Check collection paths match exactly

#### 5. Metro Bundler Issues

**Problem**: Bundler crashes or freezes

**Solution**:
```bash
# Kill node processes
killall node

# Restart Metro
npm start --reset-cache
```

---

## 📚 Tech Stack

### Core Technologies

- **React Native** `0.81.5` - Mobile framework
- **Expo** `~54.0.20` - Development platform
- **TypeScript** `~5.9.2` - Type safety
- **React** `19.1.0` - UI library

### Key Libraries

- **Firebase** `12.4.0` - Backend services
- **Expo Router** `~6.0.13` - File-based routing
- **React Navigation** `^7.1.8` - Navigation
- **AsyncStorage** `^2.2.0` - Local storage
- **Reanimated** `~4.1.1` - Animations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Follow ESLint configuration
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Support

Need help? Here's how to get support:

1. 📖 Check the [documentation](#)
2. 🐛 Search [existing issues](https://github.com/yourusername/my-trial-app/issues)
3. 💬 Open a [new issue](https://github.com/yourusername/my-trial-app/issues/new)
4. 📧 Contact: your-email@example.com

---

## 🌟 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Firebase](https://firebase.google.com/) for backend services
- [React Native Community](https://github.com/react-native-community) for great libraries

---

<div align="center">

**Built with ❤️ using React Native and Firebase**

⭐ Star this repo if you found it helpful!

</div>
