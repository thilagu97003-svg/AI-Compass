import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { terms } from '../data/dictionary';
import useResponsive from '../hooks/useResponsive';
import HoverCard from '../components/HoverCard';

const languages = [
  { id: 'both', label: 'English + தமிழ்' },
  { id: 'en', label: 'English' },
  { id: 'ta', label: 'தமிழ்' },
];

const suggestions = ['prompt', 'token', 'hallucination', 'LLM', 'API key'];
const palette = ['#2463EB', '#7C3AED', '#F97316', '#43A047', '#EC4899', '#0891B2'];

// How well does this term match what the user typed (a word, a sentence or a question)?
function scoreOf(t, text) {
  const q = text.toLowerCase();
  let score = 0;
  t.aliases.forEach((a) => {
    const word = a.toLowerCase();
    if (new RegExp(`\\b${word}s?\\b`).test(q)) {
      score = Math.max(score, 100 + word.length);
    } else if (q.length >= 2 && (word.includes(q) || t.term.toLowerCase().includes(q))) {
      score = Math.max(score, 50);
    }
  });
  return score;
}

export default function DictionaryScreen() {
  const { isDesktop } = useResponsive();
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState('both');

  const q = query.trim();
  const list = q
    ? terms
        .map((t) => ({ t, score: scoreOf(t, q) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.t)
    : [...terms].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: isDesktop ? 800 : 1200, padding: 16 }}>
        <Text style={styles.heading}>AI Dictionary</Text>
        <Text style={styles.sub}>
          Type an AI word, a sentence or a question. Get the meaning in English and Tamil.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. hallucination, or: what is a token?"
          placeholderTextColor="#8A97B2"
          value={query}
          onChangeText={setQuery}
        />

        <View style={styles.row}>
          {suggestions.map((s) => (
            <TouchableOpacity key={s} style={styles.chip} onPress={() => setQuery(s)}>
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.segment}>
          {languages.map((l) => (
            <TouchableOpacity
              key={l.id}
              style={[styles.segmentBtn, lang === l.id && styles.segmentActive]}
              onPress={() => setLang(l.id)}
            >
              <Text style={[styles.segmentText, lang === l.id && styles.segmentTextActive]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.count}>
          {q ? `${list.length} result${list.length === 1 ? '' : 's'}` : `${terms.length} AI terms`}
        </Text>

         {q !== '' && list.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No match yet</Text>
            <Text style={styles.emptyText}>
              This dictionary covers {terms.length} common AI terms. Try one of the suggestions
              above, or type a single AI word.
            </Text>
          </View>
        )}

        {list.map((t, i) => {
          const accent = palette[i % palette.length];
          return (
            <HoverCard
              key={t.id}
              accent={accent}
              scale={1.01}
              style={[styles.card, { borderLeftColor: accent }]}
            >
              <Text style={[styles.term, { color: accent }]}>{t.term}</Text>

              {lang !== 'ta' && (
                <View style={styles.block}>
                  <Text style={styles.label}>English</Text>
                  <Text style={styles.body}>{t.en}</Text>
                </View>
              )}

              {lang !== 'en' && (
                <View style={styles.block}>
                  <Text style={styles.label}>தமிழ்</Text>
                  <Text style={styles.bodyTa}>{t.ta}</Text>
                </View>
              )}

              {t.example ? <Text style={styles.example}>Example: {t.example}</Text> : null}
            </HoverCard>
          );
        })}

        <Text style={styles.footer}>
          This is a built-in dictionary of common AI terms. It does not use a live AI service.
        </Text>
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
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
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
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E6EEFB',
    borderRadius: 12,
    padding: 4,
    marginTop: 6,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.navy },
  segmentTextActive: { color: colors.white },
  count: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#6B7A99', marginTop: 14, marginBottom: 8 },
  emptyBox: { backgroundColor: '#EAF1FF', borderRadius: 12, padding: 14, marginBottom: 12 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.navy, marginBottom: 4 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', lineHeight: 21 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    borderLeftWidth: 5,
  },
  term: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  block: { marginTop: 10 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#6B7A99', letterSpacing: 0.5, marginBottom: 2 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#2B3A5C', lineHeight: 22 },
  bodyTa: { fontSize: 15, color: '#2B3A5C', lineHeight: 26 },
  example: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7A99', marginTop: 10, fontStyle: 'italic' },
  footer: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7A99', textAlign: 'center', marginTop: 8, marginBottom: 16 },
});