import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import { colors } from '../theme/colors';

export default function UserBadge() {
  const { name } = useUser();
  if (!name) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', marginRight: 14, maxWidth: 150 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.white },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.white,
    marginLeft: 8,
    maxWidth: 100,
  },
});