import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { toolColors } from '../theme/toolColors';
import { tools } from '../data/tools';
import { rules, fallbackRule, examples } from '../data/recommend';
import useResponsive from '../hooks/useResponsive';
import ToolLogo from '../components/ToolLogo';
import HoverCard from '../components/HoverCard';

function findRule(text) {
  const q = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  rules.forEach((r) => {
    const score = r.keywords.reduce(
      (sum, k) => (new RegExp(`\\b${k}s?\\b`).test(q) ? sum + k.split(' ').length : sum),
      0
    );
    if (score > bestScore) {
      best = r;
      bestScore = score;
    }
  });
  return best;
}

export default function RecommendScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState(null);
  const [matched, setMatched] = useState(true);

  const search = () => {
    if (!idea.trim()) return;
    const rule = findRule(idea);
    setMatched(!!rule);
    setResult(rule || fallbackRule);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: isDesktop ? 800 : 1200, padding: 16 }}>
        <Text style={styles.heading}>What do you want to work on?</Text>
        <Text style={styles.sub}>Describe your project in one line and get a tool workflow.</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Build a portfolio website"
          placeholderTextColor="#8A97B2"
          value={idea}
          onChangeText={setIdea}
          onSubmitEditing={search}
        />

        <View style={styles.chips}>
          {examples.map((e) => {
            const active = idea.trim().toLowerCase() === e.toLowerCase();
            return (
              <TouchableOpacity
                key={e}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setIdea(e)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{e}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={search}>
          <Text style={styles.buttonText}>Find the best tools</Text>
        </TouchableOpacity>

        {result && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.resultTitle}>{result.title}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>How to use this workflow</Text>
              <Text style={styles.infoText}>
                Each tool below suits one stage of your project. Follow the stages in order. You do not
                need to use every tool: skip a stage if you already have what it produces.
              </Text>
            </View>

            {!matched && (
              <Text style={styles.note}>
                We could not match your idea exactly, so here is a general workflow. Try words like website, resume, interview, presentation, data, study or code.
              </Text>
            )}

            {result.workflow.map((step, i) => {
              const tool = tools.find((t) => t.id === step.toolId);
              if (!tool) return null;
              const accent = toolColors[tool.id] || colors.primary;
              return (
                <HoverCard
                  key={i}
                  accent={accent}
                  style={[styles.card, { borderLeftColor: accent }]}
                >
                  <Text style={[styles.stage, { color: accent, backgroundColor: `${accent}1A` }]}>
                    Step {i + 1}: {step.stage}
                  </Text>
                  <View style={styles.toolRow}>
                    <ToolLogo tool={tool} size={22} pad={5} />
                    <Text style={styles.toolNameText}>{tool.name}</Text>
                  </View>
                  <Text style={styles.how}>{step.how}</Text>
                  <View style={styles.linkRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('StepGuide', { tool })}>
                      <Text style={[styles.link, { color: accent }]}>Open step-by-step guide →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ToolDetail', { tool })}>
                      <Text style={styles.linkMuted}>About {tool.name}</Text>
                    </TouchableOpacity>
                  </View>
                </HoverCard>
              );
            })}

            {result.choose && (
              <View style={styles.chooseCard}>
                <Text style={styles.chooseTitle}>
                  Not sure which one to pick? Choose by your situation
                </Text>
                {result.choose.map((opt, i) => {
                  const t = tools.find((x) => x.id === opt.toolId);
                  if (!t) return null;
                  const accent = toolColors[t.id] || colors.primary;
                  return (
                    <HoverCard
                      key={i}
                      accent={accent}
                      scale={1.015}
                      onPress={() => navigation.navigate('ToolDetail', { tool: t })}
                      style={[styles.optionRow, { borderLeftColor: accent }]}
                    >
                      <View style={styles.toolRow}>
                        <ToolLogo tool={t} size={22} pad={5} />
                        <Text style={styles.toolNameText}>{t.name}</Text>
                      </View>
                      <Text style={styles.optionWhen}>Choose this if: {opt.when}</Text>
                    </HoverCard>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heading: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.navy },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#4A5A7A', marginTop: 4, marginBottom: 16 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.navy },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTextActive: { color: colors.white },
  button: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.white },
  resultTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.navy, marginBottom: 8 },
  note: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7A99', marginBottom: 12 },
  infoBox: { backgroundColor: '#EAF1FF', borderRadius: 12, padding: 14, marginBottom: 12 },
  infoTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.navy, marginBottom: 4 },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#2B3A5C', lineHeight: 20 },

  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    borderLeftWidth: 5,
  },
  stage: {
    alignSelf: 'flex-start',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  toolRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  toolNameText: { fontFamily: 'Inter_700Bold', fontSize: 17, color: colors.navy, marginLeft: 10 },
  how: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', marginTop: 8, lineHeight: 21 },
  linkRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  link: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 10 },
  linkMuted: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#6B7A99', marginTop: 10, marginLeft: 16 },

  chooseCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.success,
    borderStyle: 'dashed',
  },
  chooseTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.navy, marginBottom: 4 },
  optionRow: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E6EEFB',
    borderLeftWidth: 5,
  },
  optionWhen: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#2B3A5C', marginTop: 6, lineHeight: 19 },
});