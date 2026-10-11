import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { toolColors } from '../theme/toolColors';
import useResponsive from '../hooks/useResponsive';
import ToolLogo from '../components/ToolLogo';

function Section({ title, color, items, text, isDesktop }) {
  return (
    <View style={[styles.card, { borderLeftColor: color, width: isDesktop ? '48.5%' : '100%' }]}>
      <Text style={[styles.cardTitle, { color }]}>{title}</Text>
      {text ? <Text style={styles.body}>{text}</Text> : null}
      {items &&
        items.map((item, i) => (
          <Text key={i} style={styles.body}>
            • {item}
          </Text>
        ))}
    </View>
  );
}

export default function ToolDetailScreen({ route, navigation }) {
  const { tool } = route.params;
  const { isDesktop, maxContentWidth } = useResponsive();
  const accent = toolColors[tool.id] || colors.primary;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: maxContentWidth, padding: 16 }}>
        <LinearGradient
          colors={[colors.navy, accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <ToolLogo tool={tool} size={48} />
          <Text style={styles.name}>{tool.name}</Text>
          <Text style={styles.tagline}>{tool.tagline}</Text>
          <Text style={styles.categoryPill}>{tool.category}</Text>
        </LinearGradient>

        <View style={styles.grid}>
          <Section title="Speciality" color={accent} text={tool.speciality} isDesktop={isDesktop} />
          <Section title="Advantages" color={colors.success} items={tool.advantages} isDesktop={isDesktop} />
          <Section title="Disadvantages" color={colors.danger} items={tool.disadvantages} isDesktop={isDesktop} />
          <Section title="Limitations" color={colors.primary} items={tool.limitations} isDesktop={isDesktop} />
        </View>

        <TouchableOpacity
          style={[styles.guideButton, { backgroundColor: accent }]}
          onPress={() => navigation.navigate('StepGuide', { tool })}
        >
          <Text style={styles.guideButtonText}>Start Step-by-Step Guide →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  name: { fontFamily: 'Inter_700Bold', fontSize: 28, color: colors.white, marginTop: 10 },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#EAF1FF', marginTop: 4, textAlign: 'center' },
  categoryPill: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 12,
    overflow: 'hidden',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 5,
  },
  cardTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 8 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', lineHeight: 22, marginBottom: 4 },
  guideButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  guideButtonText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.white },
});