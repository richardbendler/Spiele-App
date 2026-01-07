import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TutorialOverlay = ({ visible, steps = [], stepIndex = 0, onNext, onClose }) => {
  if (!visible || !steps.length) return null;
  const step = steps[Math.max(0, Math.min(stepIndex, steps.length - 1))] || {};
  const { text, placement = 'bottom', highlightStyle } = step;
  const containerStyle = [styles.overlay, placement === 'top' ? styles.top : styles.bottom];
  const isLast = stepIndex >= steps.length - 1;
  const nextLabel = isLast ? 'Start' : 'Weiter';
  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 1000 }]}>
      {!!highlightStyle && <View pointerEvents="none" style={[styles.highlight, highlightStyle]} />}
      <View style={containerStyle}>
        <View style={styles.popup}>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>×</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { if (isLast) { onClose && onClose(); } else { onNext && onNext(); } }} style={styles.btn}>
              <Text style={styles.btnText}>{nextLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 24 },
  top: { top: 16, alignItems: 'center' },
  bottom: { bottom: 32, alignItems: 'center' },
  popup: { backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 14, padding: 14, maxWidth: 520, marginHorizontal: 10 },
  text: { color: 'white', fontSize: 14, lineHeight: 18, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },
  btn: { backgroundColor: '#FFD166', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  btnText: { color: '#231C18', fontFamily: 'Quicksand_300Bold' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  btnGhostText: { color: 'white', fontSize: 16, lineHeight: 16 },
  highlight: { position: 'absolute', borderWidth: 2, borderColor: '#FFD166', borderRadius: 8 },
});

export default TutorialOverlay;
