declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';
  
  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }
  
  export default class Icon extends Component<IconProps> {}
}

declare module 'react-native-modal-datetime-picker' {
  import { Component } from 'react';
  
  interface DateTimePickerProps {
    isVisible: boolean;
    mode?: 'date' | 'time' | 'datetime';
    onConfirm: (date: Date) => void;
    onCancel: () => void;
    minimumDate?: Date;
    maximumDate?: Date;
  }
  
  export default class DateTimePickerModal extends Component<DateTimePickerProps> {}
}

declare module '@react-native-firebase/auth' {
  export interface FirebaseAuthTypes {
    User: any;
  }
  
  interface Auth {
    (): {
      createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>;
      signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
      signOut: () => Promise<void>;
      onAuthStateChanged: (callback: (user: any) => void) => () => void;
      currentUser: any;
    };
  }
  
  const auth: Auth;
  export default auth;
  export { FirebaseAuthTypes };
}

declare module '@react-native-firebase/firestore' {
  interface FirestoreInstance {
    collection: (path: string) => any;
    FieldValue: {
      serverTimestamp: () => any;
      increment: (value: number) => any;
    };
  }
  
  interface Firestore {
    (): FirestoreInstance;
    FieldValue: {
      serverTimestamp: () => any;
      increment: (value: number) => any;
    };
  }
  
  const firestore: Firestore;
  export default firestore;
}