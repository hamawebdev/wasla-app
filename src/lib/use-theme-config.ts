import type { Theme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

const WaslaLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'hsl(258, 52%, 54%)',
    background: 'hsl(180, 25%, 98%)',
    card: 'hsl(0, 0%, 100%)',
    text: 'hsl(199, 41%, 12%)',
    border: 'hsl(198, 21%, 88%)',
    notification: 'hsl(258, 52%, 54%)',
  },
};

const WaslaDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'hsl(258, 52%, 64%)',
    background: 'hsl(220, 20%, 10%)',
    card: 'hsl(220, 15%, 14%)',
    text: 'hsl(200, 30%, 92%)',
    border: 'hsl(220, 15%, 22%)',
    notification: 'hsl(258, 52%, 64%)',
  },
};

export function useThemeConfig(): Theme {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? WaslaDarkTheme : WaslaLightTheme;
}
