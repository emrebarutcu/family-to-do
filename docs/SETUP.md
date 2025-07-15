# Family To-Do App Setup Guide

This guide will help you set up the Family To-Do App on your development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **React Native CLI** - `npm install -g react-native-cli`
- **Firebase CLI** - `npm install -g firebase-tools`

### Platform-Specific Requirements

#### For iOS Development:
- **Xcode** (latest version)
- **iOS Simulator** (comes with Xcode)
- **CocoaPods** - `sudo gem install cocoapods`

#### For Android Development:
- **Android Studio**
- **Android SDK**
- **Android Virtual Device (AVD)**

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FamilyTodoApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### 3.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Follow the setup wizard
4. Choose your preferred analytics settings

#### 3.2 Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optionally, enable **Google** sign-in for easier testing

#### 3.3 Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (we'll add security rules later)
3. Select a location for your database

#### 3.4 Add iOS and Android Apps

**For iOS:**
1. Go to **Project Settings** > **General**
2. Click **Add app** > **iOS**
3. Enter your bundle ID (e.g., `com.yourcompany.familytodoapp`)
4. Download `GoogleService-Info.plist`
5. Place it in `ios/FamilyTodoApp/`

**For Android:**
1. Go to **Project Settings** > **General**
2. Click **Add app** > **Android**
3. Enter your package name (e.g., `com.yourcompany.familytodoapp`)
4. Download `google-services.json`
5. Place it in `android/app/`

#### 3.5 Configure Firebase Config

1. Copy `src/config/firebase.example.ts` to `src/config/firebase.ts`
2. Replace the configuration values with your actual Firebase config
3. You can find your config in Firebase Console > Project Settings > General > Your apps

### 4. Platform Setup

#### 4.1 iOS Setup

```bash
cd ios
pod install
cd ..
```

#### 4.2 Android Setup

Make sure your Android development environment is set up correctly:

1. Set `ANDROID_HOME` environment variable
2. Add platform-tools to your PATH
3. Create an AVD in Android Studio

### 5. Firestore Security Rules

Replace the default Firestore rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Family members can access their family data
    match /families/{familyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
      
      // Members can read/write their own member data
      match /members/{memberId} {
        allow read, write: if request.auth != null && 
          (request.auth.uid == memberId || 
           get(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid)).data.role == 'parent');
      }
      
      // Tasks can be read by all family members
      match /tasks/{taskId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && 
          get(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid)).data.role == 'parent';
        allow update: if request.auth != null && 
          (resource.data.assigned_to == request.auth.uid || 
           get(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid)).data.role == 'parent');
      }
      
      // Only parents can create rewards
      match /rewards/{rewardId} {
        allow read: if request.auth != null;
        allow create, update, delete: if request.auth != null && 
          get(/databases/$(database)/documents/families/$(familyId)/members/$(request.auth.uid)).data.role == 'parent';
      }
    }
  }
}
```

### 6. Running the App

#### Start Metro Bundler

```bash
npm start
```

#### Run on iOS

```bash
npm run ios
```

#### Run on Android

```bash
npm run android
```

## Testing the App

### Test Data Setup

1. Register as a parent using the app
2. Create a family
3. Add some child profiles
4. Create tasks and assign them to children
5. Create rewards for children to earn

### Test Scenarios

1. **Parent Flow:**
   - Register → Create Family → Add Children → Create Tasks → Approve Tasks → Create Rewards

2. **Child Flow:**
   - View Tasks → Complete Tasks → Check Points → View Rewards

## Troubleshooting

### Common Issues

#### Firebase Connection Issues
- Ensure `google-services.json` and `GoogleService-Info.plist` are in the correct locations
- Check that your Firebase project has the correct bundle ID/package name

#### iOS Build Issues
- Run `cd ios && pod install` again
- Clean build folder in Xcode
- Ensure iOS deployment target is set correctly

#### Android Build Issues
- Clean project: `cd android && ./gradlew clean`
- Check Android SDK and build tools versions
- Ensure ANDROID_HOME is set correctly

#### Metro Bundler Issues
- Clear Metro cache: `npx react-native start --reset-cache`
- Clear npm cache: `npm cache clean --force`

### Debug Mode

To enable debugging:

1. Enable Debug mode in your device/simulator
2. Use React Native Debugger or Chrome DevTools
3. Check console logs for any errors

## Development Workflow

1. **Code Changes:**
   - Make your changes
   - Test on both iOS and Android
   - Run linting: `npm run lint`
   - Run tests: `npm test`

2. **Database Changes:**
   - Test with Firebase emulator during development
   - Update security rules as needed
   - Test with actual Firebase in staging

3. **Testing:**
   - Test all user flows
   - Test on different device sizes
   - Test offline behavior

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information
4. Include logs, screenshots, and steps to reproduce

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to the project.