import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { toolColors } from '../theme/toolColors';
import ToolLogo from './ToolLogo';

export default function ToolCard({ tool, onPress }) {
  const accent = toolColors[tool.id] || colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.card,
        hovered && {
          transform: [{ scale: 1.04 }],
          borderColor: accent,
          ...Platform.select({
            web: { boxShadow: `0 10px 24px ${accent}33` },
            default: { elevation: 6 },
          }),
        },
        { borderTopColor: accent },
        pressed && {
          transform: [{ scale: 0.97 }],
          borderColor: accent,
          opacity: 0.95,
        },
      ]}
    >
      <View style={styles.logoWrap}>
        <ToolLogo tool={tool} size={34} />
      </View>
      <Text style={styles.name}>{tool.name}</Text>
      <Text style={styles.tagline}>{tool.tagline}</Text>
      <Text style={[styles.badge, { color: accent, backgroundColor: `${accent}1A` }]}>
        {tool.category}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    minHeight: 170,
    borderWidth: 1,
    borderTopWidth: 4,
    borderColor: '#DCE6F7',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
      },
    }),
  },
  logoWrap: { alignSelf: 'center', marginBottom: 8 },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: colors.navy,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#4A5A7A',
    marginTop: 4,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  badge: {
    alignSelf: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
    overflow: 'hidden',
  },
});