import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  online?: boolean;
}

export function Avatar({ source, name, size = 40, online = false }: Props) {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <View style={{ width: size, height: size }}>
      {source ? (
        <Image
          source={source}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
        </View>
      )}
      {online && (
        <View
          style={[
            styles.onlineDot,
            {
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: 'hsl(258, 45%, 88%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'Rubik',
    fontWeight: '600',
    color: 'hsl(258, 52%, 35%)',
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: 'hsl(142, 71%, 45%)',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
