import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { toolColors } from '../theme/toolColors';
import { tools } from '../data/tools';
import ToolLogo from './ToolLogo';

const ITEM_W = 180;
const GAP = 12;
const SET_W = tools.length * (ITEM_W + GAP);
const useNative = Platform.OS !== 'web';

export default function ToolMarquee({ onPressTool, speed = 45 }) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, {
        toValue: -SET_W,
        duration: (SET_W / speed) * 1000,
        easing: Easing.linear,
        useNativeDriver: useNative,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [x, speed]);

  // Two copies of the list so the loop looks endless
  const items = [...tools, ...tools];

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.strip, { transform: [{ translateX: x }] }]}>
        {items.map((tool, i) => {
          const accent = toolColors[tool.id] || colors.primary;
          return (
            <Pressable
              key={`${tool.id}-${i}`}
              onPress={() => onPressTool(tool)}
              style={({ hovered }) => [
                styles.item,
                { borderTopColor: accent },
                hovered && { borderColor: accent },
              ]}
            >
              <ToolLogo tool={tool} size={26} pad={6} />
              <View style={styles.textWrap}>
                <Text style={styles.name} numberOfLines={1}>{tool.name}</Text>
                <Text style={[styles.category, { color: accent }]} numberOfLines={1}>
                  {tool.category}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>

      <LinearGradient
        colors={[colors.background, 'rgba(245,249,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, { left: 0 }]}
      />
      <LinearGradient
        colors={['rgba(245,249,255,0)', colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, { right: 0 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 6,
    marginBottom: 14,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  strip: {
    flexDirection: 'row',
    width: SET_W * 2,
    alignSelf: 'flex-start',
  },
  item: {
    width: ITEM_W,
    marginRight: GAP,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderTopWidth: 4,
    borderColor: '#DCE6F7',
    paddingVertical: 10,
    paddingHorizontal: 10,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  textWrap: { flex: 1, marginLeft: 8 },
  name: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.navy },
  category: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 2 },
  fade: { position: 'absolute', top: 0, bottom: 0, width: 28 },
});