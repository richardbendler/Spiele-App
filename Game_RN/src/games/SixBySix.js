import React, { useMemo, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView } from 'react-native';
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

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
// Rot/Schwarz folgt der echten Kartenfarbe, nicht mehr einem unabhaengigen Zufallswert.
const SUIT_COLOR = { Hearts: 'red', Diamonds: 'red', Clubs: 'black', Spades: 'black' };
const SUIT_SYMBOL = { Hearts: '♥', Diamonds: '♦', Clubs: '♣', Spades: '♠' };
const suitImages = {
  Hearts: require('../../assets/images/icons/cards/Hearts.png'),
  Diamonds: require('../../assets/images/icons/cards/Diamonds.png'),
  Clubs: require('../../assets/images/icons/cards/Clubs.png'),
  Spades: require('../../assets/images/icons/cards/Spades.png'),
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildBoard = () => {
  const deck = [];
  SUITS.forEach((suit) => RANKS.forEach((rank) => deck.push({ suit, rank })));
  const dealt = shuffle(deck).slice(0, ROWS * COLUMNS);

  const board = [];
  let index = 0;
  for (let row = 1; row <= ROWS; row += 1) {
    for (let col = 1; col <= COLUMNS; col += 1) {
      const card = dealt[index];
      index += 1;
      board.push({
        id: `${row}-${col}`,
        row,
        col,
        revealed: false,
        suit: card.suit,
        rank: card.rank,
        type: 'safe',
        value: 0,
      });
    }
  }
  shuffle(board)
    .slice(0, DRINK_CARD_COUNT)
    .forEach((cell) => {
      const target = board.find((c) => c.id === cell.id);
      target.type = 'drink';
      target.value = DRINK_VALUES[Math.floor(Math.random() * DRINK_VALUES.length)];
    });
  return board;
};

const SIX_BY_SIX_COPY = {
  de: {
    infoTitle: 'Six by Six!',
    rules:
      'Vor euch liegt ein 6x6-Feld aus 36 verdeckten Spielkarten.\n\nReihum deckt jede Person eine beliebige Karte ihrer Wahl auf.\n\nIst es eine Trinkkarte, trinkt die aufdeckende Person die angezeigte Anzahl Schlucke. Ist die Karte "Frei", passiert nichts.\n\nDanach entscheidet die Kartenfarbe über den nächsten Zug: Bei Rot (Herz/Karo) ist dieselbe Person nochmal dran und deckt direkt die nächste Karte auf. Bei Schwarz (Kreuz/Pik) ist die nächste Person am Zug.\n\nSind alle 36 Karten aufgedeckt, mischt "Tisch neu mischen" ein frisches Feld.',
  },
  en: {
    infoTitle: 'Six by Six!',
    rules:
      'A 6x6 field of 36 face-down playing cards lies in front of you.\n\nTake turns flipping any card of your choice.\n\nIf it is a drink card, the person who flipped it drinks the shown number of sips. If it says "Safe", nothing happens.\n\nThe card colour then decides the next turn: on Red (Hearts/Diamonds) the same person goes again and flips another card. On Black (Clubs/Spades) it is the next person\'s turn.\n\nOnce all 36 cards are revealed, tap "Reset grid" to shuffle a fresh field.',
  },
};

const SixBySixGame = () => {
  const { tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { language } = useTranslation();
  const copy = useMemo(() => SIX_BY_SIX_COPY[language === 'en' ? 'en' : 'de'], [language]);

  const [board, setBoard] = useState(buildBoard());
  const [tutorialStep, setTutorialStep] = useState(0);
  const [activeCellId, setActiveCellId] = useState(null);
  const [tip, setTip] = useState(null);

  const boardRows = useMemo(() => {
    const rows = [];
    for (let r = 1; r <= ROWS; r += 1) rows.push(board.filter((c) => c.row === r));
    return rows;
  }, [board]);

  const revealedCount = useMemo(() => board.filter((c) => c.revealed).length, [board]);

  const formatDrinkText = (value) => {
    if (language === 'en') return `${value} ${value === 1 ? 'sip' : 'sips'}`;
    return `${value} ${value === 1 ? 'Schluck' : 'Schlucke'}`;
  };

  const formatRankLabel = (rank) => {
    if (rank !== 'J' && rank !== 'Q' && rank !== 'K' && rank !== 'A') return rank;
    const names = {
      de: { J: 'Bube', Q: 'Dame', K: 'König', A: 'Ass' },
      en: { J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace' },
    };
    return names[language === 'en' ? 'en' : 'de'][rank];
  };

  const resolveResultMessage = (cell) => {
    const coord = `${cell.row}/${cell.col}`;
    const cardLabel = `${formatRankLabel(cell.rank)} ${SUIT_SYMBOL[cell.suit]}`;
    const isRed = SUIT_COLOR[cell.suit] === 'red';
    const turnText = isRed
      ? (language === 'en' ? '🔴 Red — go again!' : '🔴 Rot — du bist nochmal dran!')
      : (language === 'en' ? '⚫ Black — pass the phone on.' : '⚫ Schwarz — gib weiter.');
    const outcomeText = cell.type === 'drink'
      ? (language === 'en' ? `🍹 Drink! ${formatDrinkText(cell.value)}` : `🍹 Trinken! ${formatDrinkText(cell.value)}`)
      : (language === 'en' ? '✅ Safe — nothing happens.' : '✅ Frei — nichts passiert.');
    return { coord, cardLabel, outcomeText, turnText, isDrink: cell.type === 'drink' };
  };

  const revealCell = (row, col) => {
    setBoard((prev) => prev.map((c) => (c.row === row && c.col === col ? { ...c, revealed: true } : c)));
  };

  const resetBoard = () => {
    setBoard(buildBoard());
    setActiveCellId(null);
    setTip(null);
  };

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Six by Six</Text>
            <Text style={styles.miniRule}>
              {language === 'en'
                ? 'Flip a card each turn — drink card? Drink up. Then: Red = go again, Black = pass on.'
                : 'Deckt reihum eine Karte auf — Trinkkarte? Dann trinken. Danach: Rot = nochmal, Schwarz = weitergeben.'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'en' ? `${revealedCount}/36 cards revealed` : `${revealedCount}/36 Karten aufgedeckt`}
            </Text>
          </View>

          <View style={styles.grid}>
            {boardRows.map((rowCells) => (
              <View key={`row-${rowCells[0].row}`} style={styles.gridRow}>
                {rowCells.map((cell) => {
                  const isActive = cell.id === activeCellId;
                  const isRed = SUIT_COLOR[cell.suit] === 'red';
                  return (
                    <TouchableOpacity
                      key={cell.id}
                      style={[styles.cell, isActive && styles.cellActive]}
                      activeOpacity={0.85}
                      onPress={() => {
                        setActiveCellId(cell.id);
                        if (!cell.revealed) revealCell(cell.row, cell.col);
                        setTip(resolveResultMessage({ ...cell, revealed: true }));
                      }}
                    >
                      {cell.revealed ? (
                        <View style={styles.cardFace}>
                          <Text style={[styles.rankLabel, { color: isRed ? '#C4293E' : '#1B1B1F' }]}>{cell.rank}</Text>
                          <Image style={styles.suitIcon} source={suitImages[cell.suit]} resizeMode="contain" />
                          {cell.type === 'drink' ? (
                            <View style={styles.drinkBadge}>
                              <Text style={styles.drinkBadgeText}>+{cell.value}</Text>
                            </View>
                          ) : null}
                        </View>
                      ) : (
                        <View style={styles.cardBackWrap}>
                          <Image
                            style={styles.cardBackImage}
                            source={require('../../assets/images/icons/cards/card-back.png')}
                            resizeMode="cover"
                          />
                          <View style={styles.coordinateWrap}>
                            <Text style={styles.coordinateText}>{`${cell.row}/${cell.col}`}</Text>
                          </View>
                        </View>
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
        </ScrollView>

        {tip ? (
          <View style={[styles.transientTip, tip.isDrink ? styles.transientTipDrink : styles.transientTipSafe]}>
            <Text style={styles.transientTipCoord}>{`${language === 'en' ? 'Card' : 'Feld'} ${tip.coord} · ${tip.cardLabel}`}</Text>
            <Text style={styles.transientTipOutcome}>{tip.outcomeText}</Text>
            <Text style={styles.transientTipTurn}>{tip.turnText}</Text>
          </View>
        ) : null}

        <InfoText header={copy.infoTitle} rules={copy.rules} />
        <InfoHint />

        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Tippt eine beliebige verdeckte Karte an.' : 'Tap any face-down card.', placement: 'top' },
            { text: language === 'de' ? 'Ein Hinweis unten zeigt, was passiert ist.' : 'A hint at the bottom shows what happened.', placement: 'bottom' },
            { text: language === 'de' ? 'Rot = nochmal dran, Schwarz = weitergeben.' : 'Red = go again, Black = pass the turn.', placement: 'bottom' },
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 110, paddingBottom: 100, gap: 16 },
  header: { alignItems: 'center', gap: 4 },
  title: { fontSize: 26, color: 'white', fontFamily: 'Quicksand_300Bold' },
  miniRule: {
    fontSize: 13,
    color: '#E5C185',
    fontFamily: 'Quicksand_300Bold',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    paddingHorizontal: 12,
  },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Quicksand_300Light', marginTop: 2 },
  grid: { gap: 6 },
  gridRow: { flexDirection: 'row', gap: 6 },
  cell: {
    flex: 1,
    aspectRatio: 0.72,
    borderRadius: 8,
  },
  cellActive: {
    borderWidth: 2,
    borderColor: '#E5C185',
    shadowColor: '#E5C185',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  cardBackWrap: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#152A52',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cardBackImage: { ...StyleSheet.absoluteFillObject },
  coordinateWrap: {
    marginBottom: 3,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  coordinateText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 8,
    fontFamily: 'Quicksand_300Bold',
  },
  cardFace: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#F7F1E4',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  rankLabel: { fontSize: 15, fontFamily: 'Quicksand_700Bold' },
  suitIcon: { width: '48%', height: '32%', marginTop: 2 },
  drinkBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#E5C185',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  drinkBadgeText: { fontSize: 9, fontFamily: 'Quicksand_700Bold', color: '#231C18' },
  actionsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resetButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(229,193,133,0.7)', backgroundColor: 'rgba(9,9,9,0.4)' },
  resetButtonText: { color: '#E5C185', fontFamily: 'Quicksand_300Bold', fontSize: 15 },
  transientTip: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: 'rgba(10,10,12,0.95)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  transientTipDrink: { borderColor: '#E5C185' },
  transientTipSafe: { borderColor: 'rgba(122,193,178,0.7)' },
  transientTipCoord: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontFamily: 'Quicksand_300Bold',
    textAlign: 'center',
  },
  transientTipOutcome: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Quicksand_700Bold',
    textAlign: 'center',
  },
  transientTipTurn: {
    color: '#E5C185',
    fontSize: 16,
    lineHeight: 21,
    fontFamily: 'Quicksand_300Bold',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default SixBySixGame;
