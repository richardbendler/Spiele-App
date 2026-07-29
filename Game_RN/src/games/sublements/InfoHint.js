import React, { useEffect, useRef, useState, useContext } from 'react';
import { Animated, Easing, StyleSheet, View, Text } from 'react-native';
import { VariablesContext } from '../../../VariablesContext';

// Lightweight pulse/arrow hint near the info button (top-left)
// Shows briefly after mount, then fades out. pointerEvents=none.
const InfoHint = ({ durationMs = 2200, offsetTop = 26, offsetLeft = 70 }) => {
  const { language } = useContext(VariablesContext);
  const [visible, setVisible] = useState(true);
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);
    anim.start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    pulse.start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 360, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start(() => {
        setVisible(false);
      });
      pulse.stop();
    }, durationMs);

    return () => { clearTimeout(timer); pulse.stop(); };
  }, [durationMs, opacity, scale]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.hint, { top: offsetTop, left: offsetLeft, transform: [{ scale }], opacity }]}>
        <View style={styles.dot} />
        <Text style={styles.label}>{language === 'en' ? 'Rules' : 'Regeln'}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  hint: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5C185' },
  label: { color: '#F5E9D7', fontSize: 12 },
});

export default InfoHint;
