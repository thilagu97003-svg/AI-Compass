import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import useResponsive from '../hooks/useResponsive';

const features = [
  '8 AI tools with speciality, advantages, disadvantages and limitations',
  'Step-by-step project guide for every tool, with ready-to-copy prompts',
  'Find My Tool: describe your project and get a tool workflow',
  'A 5-question quiz for every tool, with explanations',
  'Progress and best quiz scores saved on your device',
];

const notes = [
  'Find My Tool uses simple keyword rules. It does not use an AI service.',
  "Tool interfaces and feature names change over time. If a menu or button looks different, check the tool's official help page.",
  'Always review and test AI-generated output before you rely on it.',
  'Your name, progress and quiz scores are stored only on this device.',
  'Tool names and logos belong to their respective owners and are used here only for identification.',
];

function InfoCard({ icon, title, accent, children }) {
  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <View style={styles.titleRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.cardTitle, { color: accent }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function AboutScreen() {
  const { isDesktop } = useResponsive();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: isDesktop ? 800 : 1200, padding: 16 }}>
        <LinearGradient
          colors={['#1E1B4B', '#7C3AED', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={[styles.circle, styles.circleTop]} />
          <View style={[styles.circle, styles.circleBottom]} />
          <Text style={styles.emoji}>🧭</Text>
          <Text style={styles.title}>AI Compass</Text>
          <Text style={styles.tagline}>Your learning guide for AI tools</Text>
        </LinearGradient>

        <InfoCard icon="💡" title="What is this app?" accent="#2463EB">
          <Text style={styles.body}>
            AI Compass helps beginners understand popular AI tools, practise them with guided
            sample projects, and choose the right tool for their own work.
          </Text>
        </InfoCard>

        <InfoCard icon="✨" title="Features" accent="#7C3AED">
          {features.map((f) => (
            <Text key={f} style={styles.body}>• {f}</Text>
          ))}
        </InfoCard>

        <InfoCard icon="📌" title="Good to know" accent="#F97316">
          {notes.map((n) => (
            <Text key={n} style={styles.body}>• {n}</Text>
          ))}
        </InfoCard>

        <InfoCard icon="🛠️" title="Built with" accent="#43A047">
          <Text style={styles.body}>React Native, Expo, React Navigation and AsyncStorage.</Text>
        </InfoCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleTop: { width: 160, height: 160, top: -60, right: -40 },
  circleBottom: { width: 120, height: 120, bottom: -50, left: -30 },
  emoji: { fontSize: 44 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26, color: colors.white, marginTop: 6 },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#E3ECFF',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C9D8F2',
    borderLeftWidth: 5,
    ...Platform.select({
      web: { boxShadow: '0 4px 14px rgba(0, 26, 77, 0.07)' },
      default: { elevation: 2 },
    }),
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 18, marginRight: 8 },
  cardTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#2B3A5C',
    lineHeight: 22,
    marginBottom: 4,
  },
});