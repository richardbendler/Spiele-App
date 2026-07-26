import React, { useMemo, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

const ROWS = 6;
const COLUMNS = 6;
const DRINK_CARD_COUNT = 12;
const DRINK_VALUES = [1, 2, 3, 4, 5];

const buildBoard = () => {
  const base = [];
  for (let row = 1; row <= ROWS; row += 1) {
    for (let col = 1; col <= COLUMNS; col += 1) {
      base.push({ id: `${row}-${col}`, row, col, revealed: false, type: 'empty', value: 0, color: Math.random() < 0.5 ? 'red' : 'black' });
    }
  }
  const shuffled = [...base].sort(() => Math.random() - 0.5);
  shuffled.slice(0, DRINK_CARD_COUNT).forEach((cell) => {
    cell.type = 'drink';
    cell.value = DRINK_VALUES[Math.floor(Math.random() * DRINK_VALUES.length)];
  });
  return base;
};

const SixBySixGame = () => {
  const { tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { t, language } = useTranslation();
  const copy = useMemo(() => t('sixBySix') || { title: 'Six by Six', infoTitle: 'Six by Six', rules: '' }, [t]);

  const [board, setBoard] = useState(buildBoard());
  const [tutorialStep, setTutorialStep] = useState(0);
  const [activeCellId, setActiveCellId] = useState(null);
  const [tip, setTip] = useState('');

  const boardRows = useMemo(() => {
    const rows = [];
    for (let r = 1; r <= ROWS; r += 1) rows.push(board.filter((c) => c.row === r));
    return rows;
  }, [board]);

  const formatDrinkText = (value) => {
    if (language === 'en') return `${value} ${value === 1 ? 'sip' : 'sips'}`;
    return `${value} ${value === 1 ? 'Schluck' : 'Schlucke'}`;
  };

  const resolveResultMessage = (cell) => {
    const coord = `${cell.row}/${cell.col}`;
    const turnHint = cell.color === 'red' ? (language === 'en' ? 'Red: go again.' : 'Rot: Du bist nochmal dran.') : (language === 'en' ? 'Black: pass turn.' : 'Schwarz: weitergeben.');
    if (cell.type === 'drink') {
      return language === 'en' ? `${coord} – ${formatDrinkText(cell.value)} – ${turnHint}` : `${coord} – ${formatDrinkText(cell.value)} – ${turnHint}`;
    }
    return language === 'en' ? `${coord} – Safe – ${turnHint}` : `${coord} – Frei – ${turnHint}`;
  };

  const revealCell = (row, col) => {
    setBoard((prev) => prev.map((c) => (c.row === row && c.col === col ? { ...c, revealed: true } : c)));
  };

  const resetBoard = () => {
    setBoard(buildBoard());
    setActiveCellId(null);
    setTip('');
  };

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{copy.title || 'Six by Six'}</Text>
          </View>

          <View style={styles.grid}>
            {boardRows.map((rowCells) => (
              <View key={`row-${rowCells[0].row}`} style={styles.gridRow}>
                {rowCells.map((cell) => {
                  const isActive = cell.id === activeCellId;
                  const cellStyles = [styles.cell, !cell.revealed && styles.cellHidden, cell.revealed && (cell.color === 'red' ? styles.cellRed : styles.cellBlack), isActive && styles.cellActive];
                  return (
                    <TouchableOpacity key={cell.id} style={cellStyles} activeOpacity={0.85}
                      onPress={() => {
                        setActiveCellId(cell.id);
                        if (!cell.revealed) revealCell(cell.row, cell.col);
                        setTip(resolveResultMessage({ ...cell, revealed: true }));
                      }}
                    >
                      <Text style={styles.coordinateText}>{`${cell.row}/${cell.col}`}</Text>
                      {cell.revealed ? (
                        cell.type === 'drink' ? (
                          <View style={styles.cardContent}>
                            <Text style={styles.cardValue}>{cell.value}</Text>
                            <Text style={styles.cardLabel}>{formatDrinkText(cell.value)}</Text>
                          </View>
                        ) : (
                          <Text style={styles.safeLabel}>{language === 'en' ? 'Safe' : 'Frei'}</Text>
                        )
                      ) : (
                        <Text style={styles.hiddenMark}>?</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.resetButton} onPress={resetBoard} activeOpacity={0.9}>
              <Text style={styles.resetButtonText}>{language === 'en' ? 'Reset grid' : 'Tisch neu mischen'}</Text>
            </TouchableOpacity>
          </View>

          {tip ? (
            <View style={styles.transientTip}>
              <Text style={styles.transientTipText}>{tip}</Text>
            </View>
          ) : null}
        </ScrollView>

        <InfoText header={copy.infoTitle || 'Six by Six'} rules={copy.rules || ''} />
        <InfoHint />

        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Tippt ein Feld eurer Wahl an.' : 'Tap any tile you like.', placement: 'top' },
            { text: language === 'de' ? 'Ein Hinweis zeigt, was passiert.' : 'A hint shows what happens.', placement: 'bottom' },
            { text: language === 'de' ? 'Rot = nochmal dran, Schwarz = weitergeben.' : 'Red = go again, Black = pass turn.', placement: 'bottom' },
            { text: language === 'de' ? 'Viel Spaß und eskaliert nicht zu doll.' : "Have fun — and don't overdo it.", placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s) => Math.min(3, s + 1))}
          onClose={() => setTutorialEnabled(false)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 120, paddingBottom: 100, gap: 20 },
  header: { alignItems: 'center', gap: 6 },
  title: { fontSize: 28, color: 'white', fontFamily: 'Quicksand_300Bold' },
  grid: { gap: 10 },
  gridRow: { flexDirection: 'row', gap: 10 },
  cell: { flex: 1, aspectRatio: 0.6, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative', paddingHorizontal: 10, paddingVertical: 16 },
  cellHidden: { backgroundColor: 'rgba(0,0,0,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cellRed: { backgroundColor: 'rgba(196, 45, 62, 0.85)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  cellBlack: { backgroundColor: 'rgba(24,24,24,0.85)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cellActive: { borderWidth: 2, borderColor: '#E5C185', shadowColor: '#E5C185', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
  coordinateText: { position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.65)', fontSize: 11, fontFamily: 'Quicksand_300Bold' },
  hiddenMark: { fontSize: 32, color: 'rgba(255,255,255,0.4)', fontFamily: 'Quicksand_300Bold' },
  cardContent: { alignItems: 'center', gap: 4 },
  cardValue: { fontSize: 32, color: 'white', fontFamily: 'Quicksand_300Bold' },
  cardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Quicksand_300Light', textAlign: 'center' },
  safeLabel: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontFamily: 'Quicksand_300Bold', textAlign: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14 },
  resetButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(229,193,133,0.7)', backgroundColor: 'rgba(9,9,9,0.4)' },
  resetButtonText: { color: '#E5C185', fontFamily: 'Quicksand_300Bold', fontSize: 15 },
  transientTip: { position: 'absolute', left: 20, right: 20, bottom: 24, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  transientTipText: { color: '#fff', fontSize: 14, lineHeight: 18, flex: 1, fontFamily: 'Quicksand_300Light' },
});

export default SixBySixGame;
