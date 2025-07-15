# Family To-Do App

A comprehensive mobile application for managing family tasks, rewards, and point systems. Built with React Native, TypeScript, and Firebase.

## Features

### For Parents
- **Family Management**: Create and manage family groups
- **Task Assignment**: Assign tasks to children with due dates and point values
- **Task Approval**: Review and approve/reject completed tasks
- **Reward System**: Create rewards that children can claim with points
- **Progress Tracking**: Monitor children's progress and point accumulation
- **Child Management**: Add and manage child profiles

### For Children
- **Task Overview**: View assigned tasks with status and due dates
- **Task Completion**: Mark tasks as completed for parent approval
- **Point Tracking**: Monitor earned points and progress
- **Reward Viewing**: See available rewards and progress toward earning them
- **Achievement History**: View completed tasks and earned rewards

### Core Functionality
- **Role-Based Access**: Different interfaces for parents and children
- **Real-time Updates**: Live synchronization across all devices
- **Secure Authentication**: Firebase Authentication with email/password
- **Cloud Storage**: All data stored securely in Firebase Firestore
- **Push Notifications**: Task reminders and status updates
- **Mobile-First Design**: Optimized for iOS and Android

## Technical Architecture

### Frontend
- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation and routing
- **React Native Paper**: Material Design components
- **Context API**: State management

### Backend
- **Firebase Authentication**: User authentication and management
- **Firebase Firestore**: NoSQL cloud database
- **Firebase Cloud Messaging**: Push notifications
- **Firebase Security Rules**: Data access control

### Database Schema
```
/families/{family_id}
  - family_name: string
  - invite_code: string
  - created_by: user_id
  - created_at: timestamp
  
  /members/{user_id}
    - name: string
    - surname: string
    - email: string
    - role: "parent" | "child"
    - points: integer
    - joined_at: timestamp
    - avatar_url: string (optional)
  
  /tasks/{task_id}
    - title: string
    - description: string
    - type: "chore" | "homework" | "other"
    - assigned_to: user_id
    - assigned_by: user_id
    - due_date: timestamp
    - points: integer
    - status: "pending" | "submitted" | "approved" | "rejected"
    - created_at: timestamp
    - completed_at: timestamp (optional)
    - approved_at: timestamp (optional)
    - rejected_reason: string (optional)
  
  /rewards/{reward_id}
    - title: string
    - points_required: integer
    - created_by: user_id
    - created_at: timestamp

/users/{user_id}
  - email: string
  - user_type: "parent" | "child"
  - family_id: string
  - uid: string
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native development environment
- Firebase project
- iOS/Android development tools

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

3. **Firebase Configuration**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Add your iOS and Android apps to the project
   - Download and place configuration files:
     - `google-services.json` in `android/app/`
     - `GoogleService-Info.plist` in `ios/FamilyTodoApp/`

4. **Firestore Security Rules**
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
         // Only parents can create tasks
         // Only assigned children can update task status to 'submitted'
         // Only parents can approve/reject tasks
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

5. **Run the application**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

### Development

- **Start Metro bundler**: `npm start`
- **Run tests**: `npm test`
- **Lint code**: `npm run lint`
- **Type checking**: `npx tsc --noEmit`

## Key Design Decisions

### Authentication Flow
- Only parents can register through the main authentication screen
- Children do not have independent accounts
- Parents create child profiles after family setup
- This ensures parental control and simplifies onboarding

### Data Structure
- Single family document with subcollections for members, tasks, and rewards
- Denormalized structure for efficient queries
- Real-time listeners for live updates

### Security
- Firebase Security Rules enforce role-based access
- Parents have full control over family data
- Children can only modify their own task statuses
- All data is validated both client-side and server-side

### User Experience
- Role-based navigation (different tabs for parents vs children)
- Visual feedback for task statuses and progress
- Intuitive point system with progress bars
- Confirmation dialogs for important actions

## App Architecture

### State Management
- **AuthContext**: User authentication and family creation
- **FamilyContext**: Family data, tasks, and rewards
- **Firebase Services**: Database operations and business logic

### Navigation Structure
```
RootNavigator
├── AuthScreen (when not authenticated)
├── CreateFamilyScreen (when authenticated but no family)
└── MainNavigator (when authenticated and has family)
    ├── ParentNavigator (for parents)
    │   ├── ParentHomeScreen
    │   ├── AddTaskScreen
    │   ├── RewardsScreen
    │   └── SettingsScreen
    └── ChildNavigator (for children)
        ├── ChildTasksScreen
        ├── ChildPointsScreen
        └── SettingsScreen
```

### Component Structure
- **Screens**: Full-screen components for each page
- **Components**: Reusable UI components
- **Contexts**: State management and business logic
- **Services**: Firebase operations and utilities
- **Types**: TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

## Future Enhancements

- [ ] Avatar uploads for family members
- [ ] Recurring tasks
- [ ] Task categories and filtering
- [ ] Reward redemption tracking
- [ ] Weekly/monthly progress reports
- [ ] Push notifications for task reminders
- [ ] Photo attachments for task submissions
- [ ] Family leaderboards
- [ ] Integration with calendar apps
- [ ] Offline support with sync