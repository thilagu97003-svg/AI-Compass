import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { quizzes } from '../data/quizzes';
import useResponsive from '../hooks/useResponsive';
import { useUser } from '../context/UserContext';

// Total time for the whole quiz, in seconds
const TIME_LIMIT = 180;
// Finish within this many seconds (with 5/5) to get the "super fast" message
const FAST_LIMIT = 90;

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function QuizScreen({ route, navigation }) {
  const { tool } = route.params;
  const questions = quizzes[tool.id] || [];
  const { isDesktop } = useResponsive();
  const { name } = useUser();
  const isFocused = useIsFocused();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timedOut, setTimedOut] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const key = `quizBest:${tool.id}`;

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((v) => {
        if (v !== null) setBest(Number(v));
      })
      .catch(() => {});
  }, [key]);

  // Countdown: runs only while the quiz is open (pauses in the Dictionary)
  useEffect(() => {
    if (finished || timedOut || !isFocused) return undefined;
    const id = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [finished, timedOut, isFocused]);

  // When the time reaches 0, show the popup
  useEffect(() => {
    if (timeLeft === 0 && !finished && !timedOut) {
      setTimedOut(true);
      setShowPopup(true);
    }
  }, [timeLeft]);

  // Result emoji animation (clap for 5/5, handshake shake for 3-4/5, bounce for the rest)
  const anim = useRef(new Animated.Value(0)).current;
  const ratio = questions.length > 0 ? score / questions.length : 0;
  const perfect = ratio === 1;
  const good = ratio >= 0.6 && !perfect;
  useEffect(() => {
    if (!finished) return undefined;
    anim.setValue(0);
    const pulse = (to, ms) =>
      Animated.timing(anim, { toValue: to, duration: ms, useNativeDriver: false });
    let loop;
    if (perfect) {
      loop = Animated.loop(
        Animated.sequence([
          pulse(1, 90),
          pulse(0, 90),
          pulse(1, 90),
          pulse(0, 90),
          Animated.delay(450),
        ]),
        { iterations: 5 }
      );
    } else if (good) {
      loop = Animated.loop(
        Animated.sequence([
          pulse(1, 110),
          pulse(0, 110),
          pulse(1, 110),
          pulse(0, 110),
          pulse(1, 110),
          pulse(0, 110),
          Animated.delay(500),
        ]),
        { iterations: 4 }
      );
    } else {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: false,
          }),
        ]),
        { iterations: 5 }
      );
    }
    loop.start();
    return () => loop.stop();
  }, [finished]);
  const emojiScale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });
  const emojiRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '10deg'] });
  const clapX = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.72] });
  const clapY = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const shakeY = anim.interpolate({ inputRange: [0, 1], outputRange: [-5, 5] });
  const shakeRot = anim.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '8deg'] });

  const total = questions.length;
  const current = questions[index];

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const finishQuiz = () => {
    setFinished(true);
    if (best === null || score > best) {
      setBest(score);
      AsyncStorage.setItem(key, String(score)).catch(() => {});
    }
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      finishQuiz();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    finishQuiz();
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setTimeLeft(TIME_LIMIT);
    setTimedOut(false);
    setShowPopup(false);
  };

  const wrapper = { width: '100%', maxWidth: isDesktop ? 800 : 1200, padding: 16 };

  if (total === 0) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <View style={wrapper}>
          <Text style={styles.heading}>No quiz available yet for {tool.name}.</Text>
        </View>
      </ScrollView>
    );
  }

  if (finished) {
    const percent = Math.round((score / total) * 100);
    const taken = timedOut ? TIME_LIMIT : TIME_LIMIT - timeLeft;
    const heading =
      percent === 100
        ? 'Excellent'
        : percent >= 60
        ? 'Well done'
        : 'Nice try';
    const resultEmoji = percent === 100 ? '👏' : percent >= 60 ? '🤝' : '👍📚';
    const message =
      percent === 100
        ? 'Excellent! You understood this tool very well.'
        : percent >= 60
        ? 'Good work! Review the guide once more to master it.'
        : 'Keep going. Read the step-by-step guide again and retry.';
    const timeMessage = timedOut
      ? '⏰ Time was up this round. Try next time, you will do better!'
      : percent === 100 && taken <= FAST_LIMIT
      ? '⚡ Super fast! Great speed and focus.'
      : percent === 100
      ? '👏 Well done! You finished within the time.'
      : percent >= 60
      ? '⏱ Finished within the time. Review the guide to score higher.'
      : 'Take your time with the guide, then try again.';
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <View style={wrapper}>
          <View style={styles.resultCard}>
            <View style={styles.emojiWrap}>
              {perfect && (
                <Animated.Text style={[styles.spark, { left: 6, opacity: anim }]}>✨</Animated.Text>
              )}
              <Animated.Text
                style={[
                  styles.resultEmoji,
                  {
                    transform: perfect
                      ? [{ scaleX: clapX }, { scaleY: clapY }]
                      : good
                      ? [{ translateY: shakeY }, { rotate: shakeRot }]
                      : [{ scale: emojiScale }, { rotate: emojiRotate }],
                  },
                ]}
              >
                {resultEmoji}
              </Animated.Text>
              {perfect && (
                <Animated.Text style={[styles.spark, { right: 6, opacity: anim }]}>✨</Animated.Text>
              )}
            </View>
            <Text style={styles.resultName}>
              {name ? `${heading}, ${name}!` : `${heading}!`}
            </Text>
            <Text style={styles.resultScore}>{score} / {total}</Text>
            <Text style={styles.resultMsg}>{message}</Text>
            <Text style={styles.resultTime}>⏱ Time taken: {formatTime(taken)}</Text>
            <Text style={styles.timeMsg}>{timeMessage}</Text>
          
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={restart}>
            <Text style={styles.primaryText}>Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryText}>Back to guide</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={wrapper}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Text style={styles.counter}>Question {index + 1} of {total}</Text>
            <Text style={[styles.timer, timeLeft <= 20 && styles.timerLow]}>
              ⏱ {formatTime(timeLeft)}
            </Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${((index + 1) / total) * 100}%` }]} />
          </View>
        </View>

        <Text style={styles.question}>{current.q}</Text>

        {current.options.map((opt, i) => {
          const isCorrect = i === current.answer;
          const isChosen = i === selected;
          const answered = selected !== null;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={() => choose(i)}
              style={[
                styles.option,
                answered && isCorrect && styles.optionCorrect,
                answered && isChosen && !isCorrect && styles.optionWrong,
              ]}
            >
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}.</Text>
              <Text style={styles.optionText}>{opt}</Text>
              {answered && isCorrect && <Text style={styles.mark}>✓</Text>}
              {answered && isChosen && !isCorrect && <Text style={styles.markWrong}>✗</Text>}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.lookupBtn}
          onPress={() => navigation.navigate('DictionaryLookup')}
          activeOpacity={0.8}
        >
          <Text style={styles.lookupText}>📖 Look up a word</Text>
        </TouchableOpacity>

        {selected !== null && (
          <View style={styles.explainBox}>
            <Text style={styles.explainTitle}>
              {selected === current.answer ? 'Correct!' : 'Not quite.'}
            </Text>
            <Text style={styles.explainText}>{current.explain}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={next}>
              <Text style={styles.primaryText}>
                {index + 1 < total ? 'Next question' : 'See result'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showPopup} transparent animationType="fade" onRequestClose={closePopup}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupEmoji}>⏰</Text>
            <Text style={styles.popupTitle}>Time's up!</Text>
            <Text style={styles.popupText}>
              Your quiz time is over. Let's see how you did.
            </Text>
            <TouchableOpacity style={styles.popupBtn} onPress={closePopup}>
              <Text style={styles.primaryText}>See result</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heading: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.navy },
  header: { marginBottom: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.primary },
  timer: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.navy },
  timerLow: { color: colors.danger },
  barBg: { height: 8, backgroundColor: '#DCE6F7', borderRadius: 6, marginTop: 8, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.primary, borderRadius: 6 },
  question: { fontFamily: 'Inter_700Bold', fontSize: 19, color: colors.navy, marginBottom: 16, lineHeight: 27 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#F1F9F2' },
  optionWrong: { borderColor: colors.danger, backgroundColor: '#FDF1F1' },
  optionText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: '#2B3A5C', lineHeight: 22 },
  optionLetter: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.primary, marginRight: 10 },
  mark: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.success, marginLeft: 8 },
  markWrong: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.danger, marginLeft: 8 },
  lookupBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  lookupText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.primary },
  explainBox: { backgroundColor: '#EAF1FF', borderRadius: 12, padding: 14, marginTop: 6 },
  explainTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.navy, marginBottom: 4 },
  explainText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', lineHeight: 21, marginBottom: 12 },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  primaryText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.white },
  secondaryBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  secondaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.primary },
  resultCard: { backgroundColor: colors.navy, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  resultEmoji: { fontSize: 44 },
  emojiWrap: { width: 140, height: 60, alignItems: 'center', justifyContent: 'center' },
  spark: { position: 'absolute', top: 2, fontSize: 22 },
  resultName: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.white, marginTop: 8, textAlign: 'center' },
  resultScore: { fontFamily: 'Inter_700Bold', fontSize: 40, color: colors.white, marginTop: 8 },
  resultMsg: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.background, textAlign: 'center', marginTop: 8 },
  resultTime: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.white, marginTop: 14 },
  timeMsg: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFD580', textAlign: 'center', marginTop: 6 },
  best: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#9DB4E0', marginTop: 12 },
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
  },
  popupEmoji: { fontSize: 44 },
  popupTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, color: colors.navy, marginTop: 8 },
  popupText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#4A5A7A',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 22,
  },
  popupBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
});