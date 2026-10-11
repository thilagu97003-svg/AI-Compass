import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { toolColors } from '../theme/toolColors';
import { tools } from '../data/tools';
import { quizzes } from '../data/quizzes';
import useResponsive from '../hooks/useResponsive';
import ToolLogo from '../components/ToolLogo';
import HoverCard from '../components/HoverCard';
import { useUser } from '../context/UserContext';

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProgressScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  const { name } = useUser();
  const [data, setData] = useState({});

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const keys = tools.flatMap((t) => [`progress:${t.id}`, `quizBest:${t.id}`]);
      AsyncStorage.multiGet(keys)
        .then((pairs) => {
          if (!active) return;
          const map = {};
          pairs.forEach(([k, v]) => {
            map[k] = v;
          });
          setData(map);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [])
  );

  const rows = tools.map((t) => {
    const steps = t.steps.length;
    let done = 0;
    try {
      done = JSON.parse(data[`progress:${t.id}`] || '[]').length;
    } catch (e) {
      done = 0;
    }
    const quizTotal = (quizzes[t.id] || []).length;
    const raw = data[`quizBest:${t.id}`];
    const best = raw === null || raw === undefined ? null : Number(raw);
    let quizNote = '';
    if (best !== null && quizTotal > 0) {
      const ratio = best / quizTotal;
      quizNote = ratio === 1 ? '🏆 Perfect' : ratio >= 0.6 ? 'Well done' : 'Try again to improve';
    }
    return { tool: t, steps, done, quizTotal, best, quizNote };
  });

  const totalSteps = rows.reduce((s, r) => s + r.steps, 0);
  const doneSteps = rows.reduce((s, r) => s + r.done, 0);
  const overall = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const toolsCompleted = rows.filter((r) => r.steps > 0 && r.done === r.steps).length;
  const quizzesTaken = rows.filter((r) => r.best !== null).length;
  const hasActivity = doneSteps > 0 || quizzesTaken > 0;
  const allDone =
    tools.length > 0 && toolsCompleted === tools.length && quizzesTaken === tools.length;
  const perfectCount = rows.filter(
    (r) => r.best !== null && r.quizTotal > 0 && r.best === r.quizTotal
  ).length;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: isDesktop ? 800 : 1200, padding: 16 }}>
        <Text style={styles.heading}>
          {name ? `${name}'s learning progress` : 'Your learning progress'}
        </Text>
        <Text style={styles.sub}>Saved on this device. Complete guides and quizzes to fill it up.</Text>

        <View style={styles.statsRow}>
          <Stat value={`${overall}%`} label="Overall progress" />
          <Stat value={`${toolsCompleted}/${tools.length}`} label="Tools completed" />
          <Stat value={`${quizzesTaken}/${tools.length}`} label="Quizzes taken" />
        </View>

        {allDone && (
          <View style={styles.doneBox}>
            <Text style={styles.doneEmoji}>🎓</Text>
            <Text style={styles.doneTitle}>
              {name ? `Congratulations, ${name}!` : 'Congratulations!'}
            </Text>
            <Text style={styles.doneText}>
              You have completed all {tools.length} tool guides and taken every quiz. You now know
              how to choose and use the main AI tools.
            </Text>
            <Text style={styles.doneNext}>Your next level</Text>
            <Text style={styles.doneText}>• Pick a real project and plan it with Find Tool.</Text>
            <Text style={styles.doneText}>
              • Combine two tools in one workflow, for example research first, then build.
            </Text>
            <Text style={styles.doneText}>
              • Practise writing your own prompts instead of only copying the sample ones.
            </Text>
            {perfectCount < tools.length && (
              <Text style={styles.doneText}>
                • Retake quizzes below 5/5 to earn a 🏆 on every tool ({perfectCount}/{tools.length}{' '}
                so far).
              </Text>
            )}
            <TouchableOpacity
              style={styles.doneBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Recommend')}
            >
              <Text style={styles.doneBtnText}>Plan a project with Find Tool</Text>
            </TouchableOpacity>
          </View>
        )}

        {!hasActivity && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              You have not started yet. Open any tool and begin its step-by-step guide to see your
              progress here.
            </Text>
          </View>
        )}

        {rows.map((r) => {
          const percent = r.steps ? Math.round((r.done / r.steps) * 100) : 0;
          const accent = toolColors[r.tool.id] || colors.primary;
          const full = r.steps > 0 && r.done === r.steps;
          return (
            <HoverCard
              key={r.tool.id}
              accent={accent}
              onPress={() => navigation.navigate('StepGuide', { tool: r.tool })}
              style={[styles.row, { borderLeftColor: accent }]}
            >
              <View style={styles.rowTop}>
                <View style={styles.rowNameWrap}>
                  <ToolLogo tool={r.tool} size={22} pad={5} />
                  <Text style={styles.rowName}>{r.tool.name}</Text>
                </View>
                <Text style={[styles.rowSteps, { color: full ? colors.success : accent }]}>
                  {r.done}/{r.steps} steps
                </Text>
              </View>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${percent}%`, backgroundColor: full ? colors.success : accent },
                  ]}
                />
              </View>
              <Text style={[styles.quizText, r.best !== null && styles[`note_${r.quizNote}`]]}>
                {r.best === null
                  ? 'Quiz: not taken yet'
                  : `Quiz best: ${r.best}/${r.quizTotal} · ${r.quizNote}`}
              </Text>
            </HoverCard>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heading: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.navy },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#4A5A7A', marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', marginBottom: 16 },
  stat: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    alignItems: 'center',
  },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 22, color: colors.white },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9DB4E0', marginTop: 2, textAlign: 'center' },
  emptyBox: { backgroundColor: '#EAF1FF', borderRadius: 12, padding: 14, marginBottom: 12 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', lineHeight: 21 },
  doneBox: {
    backgroundColor: '#F1F9F2',
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  doneEmoji: { fontSize: 36, textAlign: 'center' },
  doneTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: colors.navy, textAlign: 'center', marginTop: 6 },
  doneNext: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.navy, marginTop: 12, marginBottom: 4 },
  doneText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', lineHeight: 21, marginTop: 4 },
  doneBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  doneBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.white },
  row: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    borderLeftWidth: 5,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowNameWrap: { flexDirection: 'row', alignItems: 'center' },
  rowName: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.navy, marginLeft: 10 },
  rowSteps: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  barBg: { height: 8, backgroundColor: '#DCE6F7', borderRadius: 6, marginTop: 10, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 6 },
  quizText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#4A5A7A', marginTop: 8 },
  'note_🏆 Perfect': { color: colors.success, fontFamily: 'Inter_600SemiBold' },
  'note_Well done': { color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  'note_Try again to improve': { color: '#B45309', fontFamily: 'Inter_600SemiBold' },
});