/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, StyleSheet, TextStyle } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps & { noto?: boolean }) {
  const { style, lightColor, darkColor, noto, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Determine font family
  let fontFamily = noto ? 'NotoSans_400Regular' : 'Inter_400Regular';
  if (Array.isArray(style)) {
    const flatArray = StyleSheet.flatten(style);
    if (flatArray && typeof flatArray === 'object' && (flatArray.fontWeight === 'bold' || flatArray.fontWeight === '700' || flatArray.fontWeight === 700)) {
      fontFamily = noto ? 'NotoSans_700Bold' : 'Inter_700Bold';
    }
  } else if (style) {
    const flat = StyleSheet.flatten(style);
    if (flat && typeof flat === 'object' && (flat.fontWeight === 'bold' || flat.fontWeight === '700' || flat.fontWeight === 700)) {
      fontFamily = noto ? 'NotoSans_700Bold' : 'Inter_700Bold';
    }
  }

  return <DefaultText style={[{ color, fontFamily }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
