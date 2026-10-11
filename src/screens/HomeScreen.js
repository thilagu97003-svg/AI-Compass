import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { tools, categories } from '../data/tools';
import ToolCard from '../components/ToolCard';
import useResponsive from '../hooks/useResponsive';
import ToolMarquee from '../components/ToolMarquee';

export default function HomeScreen({ navigation }) {
  const { columns, maxContentWidth, isDesktop } = useResponsive();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = tools.filter(
    (t) =>
      (category === 'All' || t.category === category) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  const header = (
    <View>
      <Text style={[styles.heading, { fontSize: isDesktop ? 32 : 24 }]}>
        Learn AI tools step by step
      </Text>
      <ToolMarquee onPressTool={(tool) => navigation.navigate('ToolDetail', { tool })} />
  
      <TextInput
        style={styles.search}
        placeholder="Search AI tools..."
        placeholderTextColor="#8A97B2"
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.chips}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCategory(c)}
            style={[styles.chip, category === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.inner, { maxWidth: maxContentWidth }]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          key={columns}
          data={filtered}
          numColumns={columns}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          ListEmptyComponent={<Text style={styles.empty}>No tools found</Text>}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View style={{ width: `${100 / columns}%`, padding: 6 }}>
              <ToolCard
                tool={item}
                onPress={() => navigation.navigate('ToolDetail', { tool: item })}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  inner: { flex: 1, width: '100%' },
  heading: {
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
    marginHorizontal: 6,
    marginTop: 8,
    marginBottom: 12,
  },
    
  search: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    marginHorizontal: 6,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 12, marginHorizontal: 2 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCE6F7',
    margin: 4,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.navy },
  chipTextActive: { color: colors.white },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Inter_400Regular',
    color: '#4A5A7A',
  },
});