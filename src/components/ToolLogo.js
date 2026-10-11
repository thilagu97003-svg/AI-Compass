import { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { logoUrl, localLogos } from '../data/logos';

export default function ToolLogo({ tool, size = 36, pad = 8, bare = false }) {
  const [failed, setFailed] = useState(false);
  const uri = logoUrl(tool.id);
  const source = (localLogos && localLogos[tool.id]) || (uri ? { uri } : null);

  if (!source || failed) {
    return <Text style={{ fontSize: size }}>{tool.emoji}</Text>;
  }

  // bare = logo only, no box behind it (used on the Splash compass)
    if (bare) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          source={source}
          style={{
            width: size * 0.66,
            height: size * 0.66,
            borderRadius: size * 0.12,
          }}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      </View>
    );
  }

  const box = size + pad * 2;
  return (
    <View style={[styles.box, { width: box, height: box, borderRadius: box / 4 }]}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onError={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: '#E6EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});