import { Pressable, StyleSheet, Platform } from 'react-native';

export default function HoverCard({ accent = '#2463EB', scale = 1.02, onPress, style, children }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.base,
        onPress && styles.clickable,
        style,
        hovered && {
          transform: [{ scale }],
          borderColor: accent,
          ...Platform.select({
            web: { boxShadow: `0 10px 24px ${accent}33` },
            default: { elevation: 6 },
          }),
        },
        pressed &&
          onPress && {
            transform: [{ scale: 0.98 }],
            borderColor: accent,
            opacity: 0.95,
          },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: Platform.select({
    web: { transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease' },
    default: {},
  }),
  clickable: Platform.select({
    web: { cursor: 'pointer' },
    default: {},
  }),
});