import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../theme/colors';
import useResponsive from '../hooks/useResponsive';
import ToolLogo from '../components/ToolLogo';
import { toolColors } from '../theme/toolColors';

// Minimum steps to finish before the quiz unlocks (change to 5 to need all steps)
const MIN_STEPS_FOR_QUIZ = 2;

function Info({ label, value }) {
  if (!value) return null;
  return (
    <Text style={styles.info}>
      <Text style={styles.infoLabel}>{label}: </Text>
      {value}
    </Text>
  );
}

export default function StepGuideScreen({ route, navigation }) {
  const { tool } = route.params;
  const accent = toolColors[tool.id] || colors.primary;
  const { isDesktop } = useResponsive();
  const [done, setDone] = useState([]);
  const [open, setOpen] = useState(0);
  const [copied, setCopied] = useState(null);
  const [quizAlert, setQuizAlert] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const steps = tool.steps.map((s) =>
    typeof s === 'string' ? { title: s, where: '', when: '', action: '' } : s
  );
  const total = steps.length;
  const percent = Math.round((done.length / total) * 100);
  const storageKey = `progress:${tool.id}`;
  const quizLocked = done.length < MIN_STEPS_FOR_QUIZ;

  // Load saved progress when the screen opens
  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (value) {
          const saved = JSON.parse(value);
          setDone(saved);
          const next = steps.findIndex((_, i) => !saved.includes(i));
          setOpen(next);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [storageKey]);

  // Save progress whenever it changes
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(storageKey, JSON.stringify(done)).catch(() => {});
  }, [done, loaded, storageKey]);

  const toggleDone = (i) =>
    setDone((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const copy = async (text, i) => {
    await Clipboard.setStringAsync(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: isDesktop ? 800 : 1200, padding: 16 }}>
        <View style={styles.progressCard}>
          <View style={styles.titleRow}>
            <View style={{ marginRight: 10 }}>
              <ToolLogo tool={tool} size={22} pad={5} />
            </View>
            <Text style={[styles.progressTitle, { flex: 1, marginRight: 12 }]}>
              {tool.project || `Complete a project with ${tool.name}`}
            </Text>
            <Text style={styles.sampleBadge}>SAMPLE</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${percent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {done.length} of {total} steps done ({percent}%)
          </Text>
        </View>

        {tool.url ? (
          <TouchableOpacity
            style={[styles.openBtn, { backgroundColor: accent }]}
            onPress={() => Linking.openURL(tool.url)}
          >
            <Text style={styles.openBtnText}>Open {tool.name} ↗</Text>
          </TouchableOpacity>
        ) : null}

        {steps.map((step, i) => {
          const isDone = done.includes(i);
          const isOpen = open === i;
          return (
            <View key={i} style={[styles.step, isDone && styles.stepDone]}>
              <TouchableOpacity
                style={styles.stepHeader}
                onPress={() => setOpen(isOpen ? -1 : i)}
                activeOpacity={0.8}
              >
                <TouchableOpacity
                  onPress={() => toggleDone(i)}
                  style={[styles.circle, isDone && styles.circleDone]}
                >
                  <Text style={styles.circleText}>{isDone ? '✓' : i + 1}</Text>
                </TouchableOpacity>
                <Text style={[styles.stepTitle, isDone && styles.stepTitleDone]}>{step.title}</Text>
                {isDone && <Text style={styles.doneLabel}>Completed</Text>}
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.details}>
                  <Info label="📍 Where" value={step.where} />
                  <Info label="⏱ When" value={step.when} />
                  <Info label="✅ Action" value={step.action} />

                  {step.prompt ? (
                    <View style={styles.promptBox}>
                      <Text style={styles.promptText}>{step.prompt}</Text>
                      <TouchableOpacity onPress={() => copy(step.prompt, i)}>
                        <Text style={styles.copyBtn}>
                          {copied === i ? 'Copied ✓' : 'Copy prompt'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <Info label="📤 Expected result" value={step.output} />
                  <Info label="➡️ Next" value={step.next} />

                  <TouchableOpacity
                    style={[styles.doneBtn, isDone && styles.doneBtnActive]}
                    onPress={() => {
                      toggleDone(i);
                      if (!isDone) setOpen(i + 1 < total ? i + 1 : -1);
                    }}
                  >
                    <Text style={[styles.doneBtnText, isDone && styles.doneBtnTextActive]}>
                      {isDone ? 'Completed ✓ (tap to undo)' : 'Mark as done'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {percent === 100 && (
          <View style={styles.congrats}>
            <Text style={styles.congratsText}>🎉 Great job! Project Complete.</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.quizBtn, percent === 100 && styles.quizBtnActive]}
          onPress={() => {
            if (quizLocked) {
              setQuizAlert(true);
            } else {
              setQuizAlert(false);
              navigation.navigate('Quiz', { tool });
            }
          }}
        >
          <Text style={[styles.quizBtnText, percent === 100 && styles.quizBtnTextActive]}>
            📝 Test your knowledge (Quiz)
          </Text>
        </TouchableOpacity>

        {done.length > 0 && (
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setDone([]);
              setOpen(0);
            }}
          >
            <Text style={styles.resetText}>Reset progress</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.disclaimer}>
          Note: Tool interfaces and feature names may change over time. If a menu or button looks
          different, check the tool's official help page.
        </Text>
      </View>

      <Modal
        visible={quizAlert && quizLocked}
        transparent
        animationType="fade"
        onRequestClose={() => setQuizAlert(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupEmoji}>🔒</Text>
            <Text style={styles.popupTitle}>Quiz locked</Text>
            <Text style={styles.popupText}>
              Complete your project step guide first. Mark at least {MIN_STEPS_FOR_QUIZ}{' '}
              {MIN_STEPS_FOR_QUIZ === 1 ? 'step' : 'steps'} as done to unlock the quiz.
            </Text>
            <Text style={styles.popupCount}>
              {done.length} of {MIN_STEPS_FOR_QUIZ} required steps done
            </Text>
            <TouchableOpacity style={styles.popupBtn} onPress={() => setQuizAlert(false)}>
              <Text style={styles.popupBtnText}>Go to steps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressCard: { backgroundColor: colors.navy, borderRadius: 16, padding: 20, marginBottom: 16 },
  progressTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.white },
  barBg: { height: 10, backgroundColor: '#1B3A7A', borderRadius: 6, marginTop: 14, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: colors.success, borderRadius: 6 },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.background, marginTop: 8 },
  step: { backgroundColor: colors.white, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#DCE6F7' },
  stepDone: { borderColor: colors.success, backgroundColor: '#F1F9F2' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  circle: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  circleDone: { backgroundColor: colors.success },
  circleText: { fontFamily: 'Inter_700Bold', color: colors.white, fontSize: 15 },
  stepTitle: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.navy },
  stepTitleDone: { color: '#2E7D32' },
  arrow: { color: '#4A5A7A', fontSize: 12 },
  details: { paddingHorizontal: 16, paddingBottom: 16 },
  info: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', lineHeight: 22, marginBottom: 6 },
  infoLabel: { fontFamily: 'Inter_700Bold', color: colors.navy },
  promptBox: { backgroundColor: colors.background, borderRadius: 10, padding: 12, marginTop: 6, borderWidth: 1, borderColor: '#DCE6F7' },
  promptText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#2B3A5C', lineHeight: 20 },
  copyBtn: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.primary, marginTop: 8 },
  congrats: { backgroundColor: colors.success, borderRadius: 14, padding: 16, alignItems: 'center' },
  congratsText: { fontFamily: 'Inter_700Bold', color: colors.white, fontSize: 15 },
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#6B7A99',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  resetBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 8 },
  resetText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#C92020' },
  openBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  openBtnText: { fontFamily: 'Inter_700Bold', color: colors.white, fontSize: 15 },
  doneBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  doneBtnActive: { backgroundColor: colors.success, borderColor: colors.success },
  doneBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primary },
  doneBtnTextActive: { color: colors.white },
  doneLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: colors.success,
    marginRight: 10,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sampleBadge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1,
    color: '#9DB4E0',
    backgroundColor: '#1B3A7A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quizBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: colors.white,
  },
  quizBtnActive: { backgroundColor: colors.primary },
  quizBtnText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.primary },
  quizBtnTextActive: { color: colors.white },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 77, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  popup: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 5,
    borderTopColor: colors.danger,
  },
  popupEmoji: { fontSize: 40 },
  popupTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: colors.navy, marginTop: 8 },
  popupText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#4A5A7A',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  popupCount: { fontFamily: 'Inter_700Bold', fontSize: 13, color: colors.danger, marginTop: 12, marginBottom: 18 },
  popupBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  popupBtnText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.white },
});