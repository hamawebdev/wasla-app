import { Filter, Mic, Search } from 'lucide-react-native';
import * as React from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const MUTED = 'hsl(198, 15%, 45%)';
const PRIMARY = 'hsl(258, 52%, 54%)';

interface Props extends TextInputProps {
  onFilterPress?: () => void;
}

export function SearchBar({ onFilterPress, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onFilterPress} style={styles.icon} hitSlop={8}>
        <Filter size={20} color={MUTED} />
      </Pressable>

      <TextInput
        style={styles.input}
        placeholderTextColor={MUTED}
        textAlign={textAlignStart}
        returnKeyType="search"
        {...props}
      />

      <Pressable style={styles.icon} hitSlop={8}>
        <Mic size={20} color={MUTED} />
      </Pressable>

      <View style={styles.searchIcon}>
        <Search size={20} color={PRIMARY} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: rowDirection,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 52,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: 'hsl(199, 41%, 12%)',
  },
  icon: { padding: 4 },
  searchIcon: { padding: 4 },
});
