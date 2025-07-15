declare module 'react' {
  export interface Component<P = {}, S = {}> {
    render(): React.ReactNode;
  }
  
  export interface ReactNode {}
  
  export interface FC<P = {}> {
    (props: P): ReactNode;
  }
  
  export function createContext<T>(defaultValue: T): {
    Provider: FC<{ value: T; children?: ReactNode }>;
    Consumer: FC<{ children: (value: T) => ReactNode }>;
  };
  
  export function useContext<T>(context: any): T;
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  
  export default React;
  namespace React {
    export interface Component<P = {}, S = {}> {
      render(): React.ReactNode;
    }
    export interface ReactNode {}
    export interface FC<P = {}> {
      (props: P): ReactNode;
    }
    export function createContext<T>(defaultValue: T): {
      Provider: FC<{ value: T; children?: ReactNode }>;
      Consumer: FC<{ children: (value: T) => ReactNode }>;
    };
    export function useContext<T>(context: any): T;
    export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
    export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  }
}

declare module 'react-native' {
  import { Component } from 'react';
  
  export interface ViewStyle {
    flex?: number;
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginHorizontal?: number;
    marginVertical?: number;
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    backgroundColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    position?: 'absolute' | 'relative';
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    zIndex?: number;
    elevation?: number;
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    opacity?: number;
    transform?: any[];
    overflow?: 'visible' | 'hidden' | 'scroll';
    [key: string]: any;
  }
  
  export interface TextStyle extends ViewStyle {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontFamily?: string;
    fontStyle?: 'normal' | 'italic';
    color?: string;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textDecorationColor?: string;
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
    lineHeight?: number;
    letterSpacing?: number;
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    [key: string]: any;
  }
  
  export type StyleProp<T> = T | T[] | null | undefined;
  
  interface ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    onLayout?: (event: any) => void;
    onPress?: () => void;
    onLongPress?: () => void;
    accessible?: boolean;
    accessibilityLabel?: string;
    accessibilityRole?: string;
    testID?: string;
    [key: string]: any;
  }
  
  export class View extends Component<ViewProps> {}
  
  interface TextProps {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    onPress?: () => void;
    selectable?: boolean;
    testID?: string;
    [key: string]: any;
  }
  
  export class Text extends Component<TextProps> {}
  
  interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    onScroll?: (event: any) => void;
    scrollEventThrottle?: number;
    pagingEnabled?: boolean;
    bounces?: boolean;
    bouncesZoom?: boolean;
    alwaysBounceHorizontal?: boolean;
    alwaysBounceVertical?: boolean;
    refreshControl?: React.ReactNode;
    onRefresh?: () => void;
    refreshing?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
    [key: string]: any;
  }
  
  export class ScrollView extends Component<ScrollViewProps> {}
  
  interface RefreshControlProps {
    refreshing: boolean;
    onRefresh?: () => void;
    colors?: string[];
    progressBackgroundColor?: string;
    progressViewOffset?: number;
    size?: 'default' | 'large';
    tintColor?: string;
    title?: string;
    titleColor?: string;
    [key: string]: any;
  }
  
  export class RefreshControl extends Component<RefreshControlProps> {}
  
  export const StyleSheet: {
    create<T>(styles: T): T;
    flatten(style: any): any;
    absoluteFill: ViewStyle;
    absoluteFillObject: ViewStyle;
    hairlineWidth: number;
  };
  
  export const Alert: {
    alert(
      title: string,
      message?: string,
      buttons?: Array<{
        text?: string;
        onPress?: () => void;
        style?: 'default' | 'cancel' | 'destructive';
      }>,
      options?: {
        cancelable?: boolean;
        onDismiss?: () => void;
      }
    ): void;
  };
  
  export const Dimensions: {
    get(dim: 'window' | 'screen'): {
      width: number;
      height: number;
      scale: number;
      fontScale: number;
    };
    addEventListener(type: 'change', handler: (dimensions: any) => void): void;
    removeEventListener(type: 'change', handler: (dimensions: any) => void): void;
  };
  
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    Version: string | number;
    select<T>(specifics: { ios?: T; android?: T; web?: T; windows?: T; macos?: T; default?: T }): T;
  };
  
  export const BackHandler: {
    addEventListener(eventName: 'hardwareBackPress', handler: () => boolean): void;
    removeEventListener(eventName: 'hardwareBackPress', handler: () => boolean): void;
  };
  
  export const Keyboard: {
    addListener(eventName: string, callback: (event: any) => void): any;
    removeListener(eventName: string, callback: (event: any) => void): void;
    dismiss(): void;
  };
  
  export const Linking: {
    openURL(url: string): Promise<any>;
    canOpenURL(url: string): Promise<boolean>;
    getInitialURL(): Promise<string | null>;
    addEventListener(type: 'url', handler: (event: { url: string }) => void): void;
    removeEventListener(type: 'url', handler: (event: { url: string }) => void): void;
  };
  
  export const AppState: {
    currentState: 'active' | 'background' | 'inactive';
    addEventListener(type: 'change', handler: (nextAppState: 'active' | 'background' | 'inactive') => void): void;
    removeEventListener(type: 'change', handler: (nextAppState: 'active' | 'background' | 'inactive') => void): void;
  };
}

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

declare module 'react-native-paper' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle, StyleProp } from 'react-native';

  // Theme interface
  export interface MD3LightTheme {
    colors: {
      primary: string;
      onPrimary: string;
      primaryContainer: string;
      onPrimaryContainer: string;
      secondary: string;
      onSecondary: string;
      secondaryContainer: string;
      onSecondaryContainer: string;
      tertiary: string;
      onTertiary: string;
      tertiaryContainer: string;
      onTertiaryContainer: string;
      error: string;
      onError: string;
      errorContainer: string;
      onErrorContainer: string;
      background: string;
      onBackground: string;
      surface: string;
      onSurface: string;
      surfaceVariant: string;
      onSurfaceVariant: string;
      outline: string;
      outlineVariant: string;
      shadow: string;
      scrim: string;
      inverseSurface: string;
      inverseOnSurface: string;
      inversePrimary: string;
      elevation: {
        level0: string;
        level1: string;
        level2: string;
        level3: string;
        level4: string;
        level5: string;
      };
      surfaceDisabled: string;
      onSurfaceDisabled: string;
      backdrop: string;
    };
    fonts: any;
    roundness: number;
    version: number;
    isV3: boolean;
    animation: {
      scale: number;
    };
  }

  export const MD3LightTheme: MD3LightTheme;

  // Provider
  interface PaperProviderProps {
    children: React.ReactNode;
    theme?: any;
  }

  export class Provider extends Component<PaperProviderProps> {}

  // Common props
  interface CommonProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }

  // Text components
  interface TextProps extends CommonProps {
    variant?: 'displayLarge' | 'displayMedium' | 'displaySmall' | 'headlineLarge' | 'headlineMedium' | 'headlineSmall' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'labelLarge' | 'labelMedium' | 'labelSmall';
    style?: StyleProp<TextStyle>;
  }

  export class Text extends Component<TextProps> {}
  export class Title extends Component<TextProps> {}
  export class Paragraph extends Component<TextProps> {}
  export class Caption extends Component<TextProps> {}
  export class Headline extends Component<TextProps> {}
  export class Subheading extends Component<TextProps> {}

  // Input components
  interface TextInputProps extends CommonProps {
    label?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    mode?: 'flat' | 'outlined';
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: boolean;
    disabled?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    placeholder?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
  }

  export class TextInput extends Component<TextInputProps> {}

  // Button components
  interface ButtonProps extends CommonProps {
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean;
    icon?: string;
    compact?: boolean;
    uppercase?: boolean;
    labelStyle?: StyleProp<TextStyle>;
    contentStyle?: StyleProp<ViewStyle>;
  }

  export class Button extends Component<ButtonProps> {}

  interface FABProps extends CommonProps {
    icon: string;
    onPress?: () => void;
    small?: boolean;
    large?: boolean;
    disabled?: boolean;
    loading?: boolean;
    visible?: boolean;
    label?: string;
  }

  export class FAB extends Component<FABProps> {}

  // Card components
  interface CardProps extends CommonProps {
    mode?: 'elevated' | 'outlined' | 'contained';
    onPress?: () => void;
    onLongPress?: () => void;
  }

  export class Card extends Component<CardProps> {
    static Content: typeof Component;
    static Actions: typeof Component;
    static Cover: typeof Component;
    static Title: typeof Component;
  }

  // List components
  interface ListItemProps extends CommonProps {
    title: string;
    description?: string;
    left?: (props: { color: string; style: StyleProp<ViewStyle> }) => React.ReactNode;
    right?: (props: { color: string; style: StyleProp<ViewStyle> }) => React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
  }

  export class List extends Component {
    static Item: typeof Component;
    static Icon: typeof Component;
    static Section: typeof Component;
    static Subheader: typeof Component;
    static Accordion: typeof Component;
  }

  // Chip components
  interface ChipProps extends CommonProps {
    mode?: 'flat' | 'outlined';
    selected?: boolean;
    onPress?: () => void;
    onClose?: () => void;
    disabled?: boolean;
    icon?: string;
    avatar?: React.ReactNode;
    selectedColor?: string;
    showSelectedOverlay?: boolean;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    compact?: boolean;
  }

  export class Chip extends Component<ChipProps> {}

  // Surface components
  interface SurfaceProps extends CommonProps {
    elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  }

  export class Surface extends Component<SurfaceProps> {}

  // ActivityIndicator
  interface ActivityIndicatorProps extends CommonProps {
    animating?: boolean;
    color?: string;
    size?: 'small' | 'large' | number;
    hidesWhenStopped?: boolean;
  }

  export class ActivityIndicator extends Component<ActivityIndicatorProps> {}

  // Helper components
  interface HelperTextProps extends CommonProps {
    type?: 'error' | 'info';
    visible?: boolean;
    padding?: 'none' | 'normal';
  }

  export class HelperText extends Component<HelperTextProps> {}

  // Divider
  interface DividerProps extends CommonProps {
    inset?: boolean;
  }

  export class Divider extends Component<DividerProps> {}

  // Badge
  interface BadgeProps extends CommonProps {
    visible?: boolean;
    size?: number;
  }

  export class Badge extends Component<BadgeProps> {}

  // Switch
  interface SwitchProps extends CommonProps {
    disabled?: boolean;
    onValueChange?: (value: boolean) => void;
    value?: boolean;
    color?: string;
  }

  export class Switch extends Component<SwitchProps> {}

  // Checkbox
  interface CheckboxProps extends CommonProps {
    status: 'checked' | 'unchecked' | 'indeterminate';
    disabled?: boolean;
    onPress?: () => void;
    uncheckedColor?: string;
    color?: string;
  }

  export class Checkbox extends Component<CheckboxProps> {}

  // RadioButton
  interface RadioButtonProps extends CommonProps {
    value: string;
    status?: 'checked' | 'unchecked';
    disabled?: boolean;
    onPress?: () => void;
    uncheckedColor?: string;
    color?: string;
  }

  export class RadioButton extends Component<RadioButtonProps> {
    static Group: typeof Component;
    static Android: typeof Component;
    static IOS: typeof Component;
  }

  // ProgressBar
  interface ProgressBarProps extends CommonProps {
    progress?: number;
    color?: string;
    indeterminate?: boolean;
    visible?: boolean;
  }

  export class ProgressBar extends Component<ProgressBarProps> {}

  // Snackbar
  interface SnackbarProps extends CommonProps {
    visible: boolean;
    onDismiss: () => void;
    action?: {
      label: string;
      onPress: () => void;
    };
    duration?: number;
    elevation?: number;
  }

  export class Snackbar extends Component<SnackbarProps> {}

  // Dialog
  interface DialogProps extends CommonProps {
    visible: boolean;
    onDismiss: () => void;
    dismissable?: boolean;
  }

  export class Dialog extends Component<DialogProps> {
    static Title: typeof Component;
    static Content: typeof Component;
    static Actions: typeof Component;
    static ScrollArea: typeof Component;
  }

  // Portal
  interface PortalProps {
    children: React.ReactNode;
  }

  export class Portal extends Component<PortalProps> {
    static Host: typeof Component;
  }

  // Menu
  interface MenuProps extends CommonProps {
    visible: boolean;
    onDismiss: () => void;
    anchor: React.ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
  }

  export class Menu extends Component<MenuProps> {
    static Item: typeof Component;
  }

  // Modal
  interface ModalProps extends CommonProps {
    visible: boolean;
    onDismiss: () => void;
    contentContainerStyle?: StyleProp<ViewStyle>;
    dismissable?: boolean;
  }

  export class Modal extends Component<ModalProps> {}

  // Searchbar
  interface SearchbarProps extends CommonProps {
    placeholder?: string;
    onChangeText?: (query: string) => void;
    value?: string;
    icon?: string;
    onIconPress?: () => void;
    onSubmitEditing?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    inputStyle?: StyleProp<TextStyle>;
    loading?: boolean;
  }

  export class Searchbar extends Component<SearchbarProps> {}

  // Appbar
  interface AppbarProps extends CommonProps {
    mode?: 'small' | 'medium' | 'large' | 'center-aligned';
    elevated?: boolean;
  }

  export class Appbar extends Component<AppbarProps> {
    static Header: typeof Component;
    static Content: typeof Component;
    static Action: typeof Component;
    static BackAction: typeof Component;
  }

  // BottomNavigation
  interface BottomNavigationProps extends CommonProps {
    navigationState: {
      index: number;
      routes: Array<{
        key: string;
        title: string;
        focusedIcon?: string;
        unfocusedIcon?: string;
        badge?: string | number;
        color?: string;
        accessibilityLabel?: string;
        testID?: string;
      }>;
    };
    onIndexChange: (index: number) => void;
    renderScene: (props: { route: any; jumpTo: (key: string) => void }) => React.ReactNode;
    barStyle?: StyleProp<ViewStyle>;
    activeColor?: string;
    inactiveColor?: string;
    sceneAnimationEnabled?: boolean;
    sceneAnimationType?: 'opacity' | 'shifting';
    keyboardHidesNavigationBar?: boolean;
    safeAreaInsets?: {
      bottom?: number;
      top?: number;
      left?: number;
      right?: number;
    };
    labeled?: boolean;
    shifting?: boolean;
    compact?: boolean;
  }

  export class BottomNavigation extends Component<BottomNavigationProps> {}

  // IconButton
  interface IconButtonProps extends CommonProps {
    icon: string;
    iconColor?: string;
    size?: number;
    disabled?: boolean;
    onPress?: () => void;
    mode?: 'contained' | 'contained-tonal' | 'outlined';
    containerColor?: string;
    rippleColor?: string;
    selected?: boolean;
    loading?: boolean;
    animated?: boolean;
  }

  export class IconButton extends Component<IconButtonProps> {}

  // Avatar
  interface AvatarProps extends CommonProps {
    size?: number;
  }

  export class Avatar extends Component<AvatarProps> {
    static Icon: typeof Component;
    static Image: typeof Component;
    static Text: typeof Component;
  }

  // DataTable
  interface DataTableProps extends CommonProps {}

  export class DataTable extends Component<DataTableProps> {
    static Header: typeof Component;
    static Title: typeof Component;
    static Row: typeof Component;
    static Cell: typeof Component;
    static Pagination: typeof Component;
  }

  // Drawer
  interface DrawerProps extends CommonProps {}

  export class Drawer extends Component<DrawerProps> {
    static Item: typeof Component;
    static Section: typeof Component;
    static CollapsedItem: typeof Component;
  }

  // SegmentedButtons
  interface SegmentedButtonsProps extends CommonProps {
    value: string;
    onValueChange: (value: string) => void;
    buttons: Array<{
      value: string;
      label?: string;
      icon?: string;
      disabled?: boolean;
      accessibilityLabel?: string;
      testID?: string;
      style?: StyleProp<ViewStyle>;
      labelStyle?: StyleProp<TextStyle>;
      showSelectedCheck?: boolean;
      checkedColor?: string;
      uncheckedColor?: string;
    }>;
    multiSelect?: boolean;
    density?: 'regular' | 'small' | 'medium' | 'high';
  }

  export class SegmentedButtons extends Component<SegmentedButtonsProps> {}

  // Tooltip
  interface TooltipProps extends CommonProps {
    title: string;
    children: React.ReactElement;
    enterTouchDelay?: number;
    leaveTouchDelay?: number;
    theme?: any;
  }

  export class Tooltip extends Component<TooltipProps> {}

  // TouchableRipple
  interface TouchableRippleProps extends CommonProps {
    onPress?: () => void;
    onLongPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    disabled?: boolean;
    rippleColor?: string;
    borderless?: boolean;
    background?: any;
    centered?: boolean;
    underlayColor?: string;
  }

  export class TouchableRipple extends Component<TouchableRippleProps> {}
}

declare module '@react-navigation/native' {
  import { Component } from 'react';
  
  interface NavigationContainerProps {
    children: React.ReactNode;
    theme?: any;
    linking?: any;
    fallback?: React.ReactNode;
    documentTitle?: {
      enabled?: boolean;
      formatter?: (options: any, route: any) => string;
    };
    onReady?: () => void;
    onStateChange?: (state: any) => void;
    initialState?: any;
    onUnhandledAction?: (action: any) => void;
  }
  
  export class NavigationContainer extends Component<NavigationContainerProps> {}
  
  export function useNavigation(): {
    navigate: (name: string, params?: any) => void;
    goBack: () => void;
    reset: (state: any) => void;
    setParams: (params: any) => void;
    dispatch: (action: any) => void;
    isFocused: () => boolean;
    canGoBack: () => boolean;
    getParent: (id?: string) => any;
    getState: () => any;
  };
  
  export function useRoute(): {
    key: string;
    name: string;
    params: any;
  };
  
  export function useFocusEffect(effect: () => void | (() => void)): void;
  
  export function useIsFocused(): boolean;
  
  export const CommonActions: {
    navigate: (name: string, params?: any) => any;
    goBack: () => any;
    reset: (state: any) => any;
    setParams: (params: any) => any;
  };
  
  export const NavigationActions: {
    navigate: (options: { routeName: string; params?: any; action?: any }) => any;
    back: (options?: { key?: string }) => any;
    setParams: (options: { key?: string; params: any }) => any;
  };
  
  export const StackActions: {
    push: (routeName: string, params?: any) => any;
    pop: (n?: number) => any;
    popToTop: () => any;
    replace: (routeName: string, params?: any) => any;
  };
  
  export const TabActions: {
    jumpTo: (routeName: string, params?: any) => any;
  };
  
  export const DrawerActions: {
    openDrawer: () => any;
    closeDrawer: () => any;
    toggleDrawer: () => any;
  };
}

declare module '@react-navigation/native-stack' {
  import { Component } from 'react';
  
  interface StackNavigationOptions {
    title?: string;
    headerShown?: boolean;
    headerTitle?: string;
    headerTitleAlign?: 'left' | 'center';
    headerTitleStyle?: any;
    headerStyle?: any;
    headerTintColor?: string;
    headerBackTitle?: string;
    headerBackTitleVisible?: boolean;
    headerLeft?: (props: any) => React.ReactNode;
    headerRight?: (props: any) => React.ReactNode;
    gestureEnabled?: boolean;
    animation?: 'default' | 'fade' | 'fade_from_bottom' | 'flip' | 'simple_push' | 'slide_from_bottom' | 'slide_from_right' | 'slide_from_left' | 'none';
    presentation?: 'card' | 'modal' | 'transparentModal' | 'containedModal' | 'containedTransparentModal' | 'fullScreenModal' | 'formSheet';
    statusBarAnimation?: 'none' | 'fade' | 'slide';
    statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
    statusBarBackgroundColor?: string;
    statusBarHidden?: boolean;
    statusBarTranslucent?: boolean;
    orientation?: 'default' | 'all' | 'portrait' | 'portrait_up' | 'portrait_down' | 'landscape' | 'landscape_left' | 'landscape_right';
    autoHideHomeIndicator?: boolean;
    freezeOnBlur?: boolean;
    [key: string]: any;
  }
  
  interface StackNavigatorProps {
    initialRouteName?: string;
    screenOptions?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
    children?: React.ReactNode;
    id?: string;
  }
  
  export function createNativeStackNavigator(): {
    Navigator: React.ComponentType<StackNavigatorProps>;
    Screen: React.ComponentType<{
      name: string;
      component?: React.ComponentType<any>;
      options?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
      initialParams?: any;
      getId?: (props: any) => string;
      listeners?: any;
      navigationKey?: string;
    }>;
    Group: React.ComponentType<{
      screenOptions?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
      children?: React.ReactNode;
    }>;
  };
  
  export type NativeStackNavigationProp<T = any> = {
    navigate: (name: string, params?: any) => void;
    push: (name: string, params?: any) => void;
    pop: (count?: number) => void;
    popToTop: () => void;
    replace: (name: string, params?: any) => void;
    goBack: () => void;
    setParams: (params: any) => void;
    dispatch: (action: any) => void;
    reset: (state: any) => void;
    isFocused: () => boolean;
    canGoBack: () => boolean;
  };
  
  export type NativeStackScreenProps<T = any> = {
    navigation: NativeStackNavigationProp<T>;
    route: {
      key: string;
      name: string;
      params: any;
    };
  };
}

declare module '@react-navigation/bottom-tabs' {
  import { Component } from 'react';
  
  interface BottomTabNavigationOptions {
    title?: string;
    tabBarLabel?: string;
    tabBarShowLabel?: boolean;
    tabBarLabelPosition?: 'beside-icon' | 'below-icon';
    tabBarLabelStyle?: any;
    tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
    tabBarIconStyle?: any;
    tabBarBadge?: string | number;
    tabBarBadgeStyle?: any;
    tabBarAccessibilityLabel?: string;
    tabBarTestID?: string;
    tabBarButton?: (props: any) => React.ReactNode;
    tabBarActiveTintColor?: string;
    tabBarInactiveTintColor?: string;
    tabBarActiveBackgroundColor?: string;
    tabBarInactiveBackgroundColor?: string;
    tabBarHideOnKeyboard?: boolean;
    tabBarItemStyle?: any;
    tabBarStyle?: any;
    tabBarBackground?: () => React.ReactNode;
    lazy?: boolean;
    unmountOnBlur?: boolean;
    freezeOnBlur?: boolean;
    headerShown?: boolean;
    [key: string]: any;
  }
  
  interface BottomTabNavigatorProps {
    initialRouteName?: string;
    screenOptions?: BottomTabNavigationOptions | ((props: any) => BottomTabNavigationOptions);
    children?: React.ReactNode;
    id?: string;
    tabBar?: (props: any) => React.ReactNode;
    sceneContainerStyle?: any;
    detachInactiveScreens?: boolean;
    backBehavior?: 'firstRoute' | 'initialRoute' | 'order' | 'history' | 'none';
  }
  
  export function createBottomTabNavigator(): {
    Navigator: React.ComponentType<BottomTabNavigatorProps>;
    Screen: React.ComponentType<{
      name: string;
      component?: React.ComponentType<any>;
      options?: BottomTabNavigationOptions | ((props: any) => BottomTabNavigationOptions);
      initialParams?: any;
      getId?: (props: any) => string;
      listeners?: any;
      navigationKey?: string;
    }>;
    Group: React.ComponentType<{
      screenOptions?: BottomTabNavigationOptions | ((props: any) => BottomTabNavigationOptions);
      children?: React.ReactNode;
    }>;
  };
  
  export type BottomTabNavigationProp<T = any> = {
    navigate: (name: string, params?: any) => void;
    goBack: () => void;
    reset: (state: any) => void;
    setParams: (params: any) => void;
    dispatch: (action: any) => void;
    isFocused: () => boolean;
    canGoBack: () => boolean;
    jumpTo: (name: string, params?: any) => void;
  };
  
  export type BottomTabScreenProps<T = any> = {
    navigation: BottomTabNavigationProp<T>;
    route: {
      key: string;
      name: string;
      params: any;
    };
  };
}

// Global hook declarations
declare global {
  function useAuth(): {
    user: any;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, surname: string) => Promise<void>;
    signOut: () => Promise<void>;
    createFamily: (familyName: string) => Promise<void>;
  };
  
  function useFamily(): {
    family: any;
    members: any[];
    tasks: any[];
    rewards: any[];
    isLoading: boolean;
    refreshData: () => Promise<void>;
    createTask: (taskData: any) => Promise<void>;
    updateTaskStatus: (taskId: string, status: string) => Promise<void>;
    createReward: (rewardData: any) => Promise<void>;
  };
}