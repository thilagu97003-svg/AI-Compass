import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { tools } from '../data/tools';
import ToolLogo from '../components/ToolLogo';
import useResponsive from '../hooks/useResponsive';
import { useUser } from '../context/UserContext';

const useNative = Platform.OS !== 'web';

export default function SplashScreen({ navigation }) {
  const { isDesktop, isTablet, height } = useResponsive();
  const { name, ready, saveName } = useUser();
  const [input, setInput] = useState('');

  const titleSize = isDesktop ? 56 : isTablet ? 44 : 34;
  const subSize = isDesktop ? 20 : isTablet ? 18 : 16;

  // Compass size depends on the screen height so everything fits
  const dial = height < 640 ? 190 : isDesktop ? 250 : 220;
  const logoSize = Math.round(dial * 0.18);
  const logoPad = 0;
  const logoBox = logoSize + logoPad * 2;
  const ringRadius = dial / 2 - logoBox / 2 - 6;
  const center = dial / 2 - 2; // inside the 2px border
  const needleLen = (ringRadius - logoBox / 2 - 6) * 2;
  const half = needleLen / 2;
  const wing = Math.max(7, Math.round(needleLen * 0.075));
  const hub = Math.round(dial * 0.2);

  // One logo for each compass point, starting from the top (north)
  const spots = tools.map((tool, i) => {
    const angle = (-90 + i * (360 / tools.length)) * (Math.PI / 180);
    return {
      tool,
      left: center + ringRadius * Math.cos(angle) - logoBox / 2,
      top: center + ringRadius * Math.sin(angle) - logoBox / 2,
    };
  });

  const needle = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const needleLoop = Animated.loop(
      Animated.timing(needle, {
        toValue: 360,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: useNative,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: useNative,
      })
    );

    const entrance = Animated.timing(enter, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: useNative,
    });

    needleLoop.start();
    pulseLoop.start();
    entrance.start();

    return () => {
      needleLoop.stop();
      pulseLoop.stop();
      entrance.stop();
    };
  }, [needle, pulse, enter]);

  const rotate = needle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  const slideUp = enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const logoScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  const start = () => {
    saveName(input);
    navigation.replace('Main');
  };

  return (
    <LinearGradient
      colors={['#1E1B4B', '#7C3AED', '#F97316']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          {/* Compass: AI in the centre, 8 tools on the 8 compass points */}
          <View style={[styles.compassArea, { width: dial + 30, height: dial + 30 }]}>
            <Animated.View
              style={[
                styles.ring,
                {
                  width: dial,
                  height: dial,
                  borderRadius: dial / 2,
                  opacity: ringOpacity,
                  transform: [{ scale: ringScale }],
                },
              ]}
            />
            <View style={[styles.compass, { width: dial, height: dial, borderRadius: dial / 2 }]}>
              {spots.map(({ tool, left, top }) => (
                <Animated.View
                  key={tool.id}
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    opacity: enter,
                    transform: [{ scale: logoScale }],
                  }}
                >
                <ToolLogo tool={tool} size={logoSize} pad={logoPad} bare />
                </Animated.View>
              ))}

              <Animated.View
                style={{
                  width: wing * 2,
                  height: needleLen,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ rotate }],
                }}
              >
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: wing,
                    borderRightWidth: wing,
                    borderBottomWidth: half,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: '#EF4444',
                  }}
                />
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: wing,
                    borderRightWidth: wing,
                    borderTopWidth: half,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: '#F8FAFF',
                  }}
                />
              </Animated.View>

              <View style={[styles.hub, { width: hub, height: hub, borderRadius: hub / 2 }]}>
                <Text style={[styles.hubText, { fontSize: Math.round(hub * 0.4) }]}>AI</Text>
              </View>
            </View>
          </View>

          <Animated.View
            style={{ alignItems: 'center', opacity: enter, transform: [{ translateY: slideUp }] }}
          >
            <Text style={[styles.title, { fontSize: titleSize }]}>AI Compass</Text>
            <Text style={[styles.subtitle, { fontSize: subSize }]}>
              Your learning guide for AI tools
            </Text>

            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name (optional)"
              placeholderTextColor="rgba(255,255,255,0.65)"
              value={input}
              onChangeText={setInput}
              maxLength={20}
              onSubmitEditing={start}
              returnKeyType="go"
            />

            <TouchableOpacity style={styles.button} onPress={start} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Start Learning →</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  circleTop: { width: 320, height: 320, top: -100, right: -80 },
  circleBottom: { width: 260, height: 260, bottom: -90, left: -70 },
  content: { width: '100%', maxWidth: 600, alignItems: 'center' },

  compassArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  compass: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hub: {
    position: 'absolute',
    backgroundColor: '#1D4ED8',
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 0 14px rgba(29, 78, 216, 0.7)' },
      default: { elevation: 4 },
    }),
  },
  hubText: { fontFamily: 'Inter_700Bold', color: colors.white, letterSpacing: 0.5 },

  title: { fontFamily: 'Inter_700Bold', color: colors.white, textAlign: 'center' },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#E3ECFF',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 26,
  },
  nameInput: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 18,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
  buttonText: { fontFamily: 'Inter_700Bold', color: colors.primary, fontSize: 16 },
});