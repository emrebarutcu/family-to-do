# Family To-Do App

A React Native Expo mobile application that allows parents to assign, track, and reward tasks completed by their children. The app features role-based access control, a point-based reward system, and real-time task management.

## Features

### Core Functionality
- **Role-Based Access**: Parents can register and create families; children are added by parents
- **Task Management**: Parents can create and assign tasks to children
- **Point System**: Children earn points for completing tasks
- **Reward System**: Parents can create rewards that children can claim with points
- **Real-Time Updates**: Task status updates and notifications
- **Progress Tracking**: Comprehensive dashboards for both parents and children

### User Roles

#### Parent Features
- Register and create family account
- Add children to the family
- Create and assign tasks with due dates and point values
- Approve or reject completed tasks
- Create and manage rewards
- View family dashboard and task overview
- Track children's progress and points

#### Child Features
- View assigned tasks with details and due dates
- Mark tasks as completed
- View earned points and task history
- Browse available rewards and track progress
- Child-friendly interface with visual feedback

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **State Management**: React Context API
- **Navigation**: React Navigation 6
- **UI Components**: React Native Elements, Expo Vector Icons
- **Styling**: StyleSheet API

## Project Structure

```
FamilyTodoApp/
├── src/
│   ├── config/
│   │   └── firebase.ts           # Firebase configuration
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication context
│   │   └── AppContext.tsx        # App state context
│   ├── navigation/
│   │   ├── AppNavigator.tsx      # Main app navigator
│   │   ├── ParentTabNavigator.tsx # Parent bottom tabs
│   │   └── ChildTabNavigator.tsx  # Child bottom tabs
│   ├── screens/
│   │   ├── AuthScreen.tsx        # Login/Register screen
│   │   ├── CreateFamilyScreen.tsx # Family creation screen
│   │   ├── SettingsScreen.tsx    # Settings screen
│   │   ├── parent/
│   │   │   ├── ParentHomeScreen.tsx  # Parent dashboard
│   │   │   ├── CreateTaskScreen.tsx  # Task creation
│   │   │   └── RewardsScreen.tsx     # Rewards management
│   │   └── child/
│   │       ├── ChildTasksScreen.tsx  # Child tasks view
│   │       └── ChildPointsScreen.tsx # Child points/rewards
│   ├── services/
│   │   └── firebase.ts           # Firebase service functions
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── utils/
├── App.tsx                       # App entry point
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FamilyTodoApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Get your Firebase configuration

4. **Configure Firebase**
   - Update `src/config/firebase.ts` with your Firebase configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Family members can read/write their family data
       match /families/{familyId} {
         allow read, write: if request.auth != null && 
           request.auth.uid in resource.data.members;
         
         match /members/{memberId} {
           allow read, write: if request.auth != null;
         }
         
         match /tasks/{taskId} {
           allow read, write: if request.auth != null;
         }
         
         match /rewards/{rewardId} {
           allow read, write: if request.auth != null;
         }
       }
     }
   }
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

## Usage

### Getting Started

1. **Parent Registration**
   - Open the app and tap "Sign Up"
   - Enter parent details (name, email, password)
   - Complete registration

2. **Family Setup**
   - Create a family name
   - Add children to the family
   - Set up initial tasks and rewards

3. **Daily Usage**
   - Parents: Create tasks, review submissions, manage rewards
   - Children: Complete tasks, earn points, claim rewards

### Database Schema

#### Users Collection
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'parent' | 'child';
  family_id: string;
  points?: number;
  joined_at: Date;
}
```

#### Families Collection
```typescript
interface Family {
  id: string;
  family_name: string;
  invite_code: string;
  created_by: string;
  created_at: Date;
}
```

#### Tasks Subcollection
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  type: 'chore' | 'homework' | 'other';
  assigned_to: string;
  assigned_by: string;
  due_date: Date;
  points: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  created_at: Date;
  completed_at?: Date;
  approved_at?: Date;
  rejected_reason?: string;
}
```

#### Rewards Subcollection
```typescript
interface Reward {
  id: string;
  title: string;
  points_required: number;
  created_by: string;
  created_at: Date;
}
```

## Key Features Implementation

### Authentication Flow
- Only parents can register new accounts
- Children are added by parents through the app
- Role-based navigation and feature access

### Task Management
- Parents create tasks with titles, descriptions, due dates, and point values
- Children can mark tasks as completed
- Parents review and approve/reject submissions
- Points are automatically awarded upon approval

### Reward System
- Parents create rewards with point requirements
- Children can view progress toward rewards
- Visual indicators show when rewards are available to claim

### Real-time Updates
- Context-based state management ensures data consistency
- Automatic refresh functionality
- Pull-to-refresh support on all screens

## Customization

### Theme Colors
- Primary: `#007AFF` (Blue)
- Child Theme: `#FF6B6B` (Coral)
- Success: `#4CAF50` (Green)
- Warning: `#FFA500` (Orange)
- Error: `#FF4444` (Red)

### Adding New Features
1. Define new types in `src/types/index.ts`
2. Add service functions in `src/services/firebase.ts`
3. Update context providers if needed
4. Create new screens and components
5. Update navigation structure

## Development

### Running the App
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Building for Production
```bash
# Build for production
expo build:android
expo build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions about the Family To-Do App, please create an issue in the repository or contact the development team.

## Future Enhancements

- Push notifications for task reminders
- Photo attachments for task submissions
- Weekly/monthly progress reports
- Achievement badges and milestones
- Multi-language support
- Dark mode support
- Task templates and recurring tasks
- Family calendar integration