import React, { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({ label, error, prefix, suffix, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        {prefix && <View style={styles.adornment}>{prefix}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="hsl(198, 15%, 45%)"
          textAlign="right"
          textAlignVertical="center"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {suffix && <View style={styles.adornment}>{suffix}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Rubik',
    fontSize: 14,
    fontWeight: '500',
    color: 'hsl(199, 41%, 12%)',
    marginBottom: 6,
    textAlign: 'right',
  },
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'hsl(198, 21%, 88%)',
    minHeight: 56,
    paddingHorizontal: 14,
  },
  focused: {
    borderColor: 'hsl(198, 25%, 36%)',
    borderWidth: 1.5,
  },
  errored: {
    borderColor: 'hsl(0, 84%, 60%)',
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontFamily: 'Rubik',
    fontSize: 16,
    color: 'hsl(199, 41%, 12%)',
    paddingVertical: 0,
  },
  adornment: {
    marginHorizontal: 4,
  },
  errorText: {
    fontFamily: 'Rubik',
    fontSize: 13,
    color: 'hsl(0, 84%, 60%)',
    marginTop: 4,
    textAlign: 'right',
  },
});
