import React from 'react';
import type { ScrollViewProps, ViewProps } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BaseProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  scrollable?: boolean;
}

type Props = BaseProps &
  (
    | (ViewProps & { scrollable?: false })
    | (ScrollViewProps & { scrollable: true })
  );

export function Screen({
  edges = ['top', 'bottom'],
  scrollable = false,
  children,
  style,
  ...props
}: Props) {
  if (scrollable) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView
          style={styles.bg}
          contentContainerStyle={[styles.scrollContent, style as object]}
          showsVerticalScrollIndicator={false}
          {...(props as ScrollViewProps)}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[styles.bg, style as object]} {...(props as ViewProps)}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'hsl(180, 25%, 98%)',
  },
  bg: {
    flex: 1,
    backgroundColor: 'hsl(180, 25%, 98%)',
  },
  scrollContent: {
    flexGrow: 1,
  },
});
