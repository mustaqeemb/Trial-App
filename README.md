# My Trial App - Firebase Phone Authentication

A React Native Expo app with Firebase backend integration featuring phone number authentication, user management, and persistent login state.

## Features

- 🔐 **Phone Number Authentication** - Sign in/sign up using phone numbers via Firebase Auth
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 💾 **Persistent Login** - Users stay logged in across app sessions
- 🗄️ **Firestore Integration** - User data stored in Firebase Firestore
- 🎨 **Modern UI** - Clean, responsive design with dark/light mode support
- ⚡ **Real-time Updates** - Authentication state managed with React Context

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20.19.4 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Firebase Account](https://firebase.google.com/)

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "my-trial-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Phone** authentication
3. Add your app's SHA-1 fingerprint (for Android) - see below

### 3. Enable Firestore Database

1. Go to **Firestore Database** in your Firebase console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

### 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the appropriate platform:
   - For web: Select the web icon (`</>`)
   - For Android: Select the Android icon
   - For iOS: Select the iOS icon
4. Copy the configuration object

### 5. Update Firebase Configuration

Replace the placeholder values in `config/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-trial-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Update the Firebase configuration in `config/firebase.ts` with your project details (see Firebase Setup section above).

### 4. Start the Development Server

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Press `w` to run in web browser
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
my-trial-app/
├── app/                          # App screens and navigation
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Home tab (login prompt)
│   │   ├── explore.tsx          # Explore tab (login prompt)
│   │   └── _layout.tsx          # Tab layout
│   ├── auth/                     # Authentication screens
│   │   ├── login.tsx            # Phone login screen
│   │   └── _layout.tsx          # Auth layout
│   ├── home.tsx                 # User home screen (authenticated)
│   ├── index.tsx                # Main app router
│   ├── modal.tsx                # Modal screen
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
├── config/                       # Configuration files
│   └── firebase.ts              # Firebase configuration
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Authentication context
├── constants/                    # App constants
├── hooks/                        # Custom hooks
└── assets/                       # Images and assets
```

## Authentication Flow

1. **Unauthenticated Users**: See login prompts on home and explore tabs
2. **Phone Login**: Enter phone number → Receive OTP → Verify OTP
3. **User Creation**: New users are automatically created in Firestore
4. **Persistent Login**: Users stay logged in across app sessions
5. **User Home**: Authenticated users see a personalized home screen

## Firestore Database Schema

### Users Collection

```javascript
users/{userId} {
  id: string,           // Same as Firebase Auth UID
  phoneNumber: string,  // User's phone number
  createdAt: timestamp  // Account creation timestamp
}
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Platform-Specific Setup

### Android Setup

1. **Get SHA-1 Fingerprint**:
   ```bash
   # For debug keystore
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. **Add SHA-1 to Firebase**:
   - Go to Firebase Console > Project Settings
   - Add your Android app
   - Add the SHA-1 fingerprint

### iOS Setup

1. **Add iOS App to Firebase**:
   - Go to Firebase Console > Project Settings
   - Add your iOS app
   - Use your bundle identifier (found in `app.json`)

### Web Setup

1. **Configure Web App**:
   - Add web app to Firebase project
   - Copy the configuration to `config/firebase.ts`

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**:
   - Ensure all Firebase config values are correct
   - Check that your Firebase project is properly set up

2. **Phone Authentication Not Working**:
   - Verify phone authentication is enabled in Firebase Console
   - Check that you're using a valid phone number format (+1234567890)

3. **Build Errors**:
   - Clear cache: `expo start -c`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

4. **Firestore Permission Denied**:
   - Check Firestore security rules
   - Ensure your app is properly authenticated

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Check [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

**Note**: Remember to replace the placeholder Firebase configuration with your actual project configuration before running the app.