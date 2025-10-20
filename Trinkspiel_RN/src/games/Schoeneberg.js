import React, { useMemo, useRef, useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Easing, ScrollView, Dimensions } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['♣', '♦', '♥', '♠'];
const RANK_VALUE = Object.fromEntries(RANKS.map((r, i) => [r, i + 2]));

const createDeck = () => {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({ suit: s, rank: r });
    }
  }
  return deck;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const compareRanks = (a, b) => {
  const va = RANK_VALUE[a.rank];
  const vb = RANK_VALUE[b.rank];
  return va === vb ? 0 : va > vb ? 1 : -1;
};

const GuessSelector = ({ labels, onPick }) => {
  return (
    <View style={styles.guessBox}>
      <TouchableOpacity style={[styles.guessBtn]} onPress={() => onPick('lower')}>
        <Text style={styles.guessLabel}>{labels.lower}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.guessBtn]} onPress={() => onPick('equal')}>
        <Text style={styles.guessLabel}>{labels.equal}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.guessBtn]} onPress={() => onPick('higher')}>
        <Text style={styles.guessLabel}>{labels.higher}</Text>
      </TouchableOpacity>
    </View>
  );
};

const PlusPad = ({ accent, onPress, pulse, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, scale]);
  const content = (
    <TouchableOpacity style={styles.plusButton} onPress={onPress} activeOpacity={0.9} disabled={disabled}>
      <Text style={[styles.plusIcon, { color: accent, opacity: disabled ? 0.4 : 1 }]}>+</Text>
    </TouchableOpacity>
  );
  const baseStyle = [styles.plusPad, { borderColor: `${accent}70`, backgroundColor: `${accent}18` }];
  if (disabled) {
    return <View style={[...baseStyle, { opacity: 0.5 }]}>{content}</View>;
  }
  return <Animated.View style={[...baseStyle, { transform: [{ scale }] }]}>{content}</Animated.View>;
};

const CardView = ({ card }) => {
  const isRed = card.suit === '♦' || card.suit === '♥';
  return (
    <View style={styles.card}>
      <Text style={[styles.cardRank, isRed && { color: '#ff8080' }]}>{card.rank}</Text>
      <Text style={[styles.cardSuit, isRed && { color: '#ff8080' }]}>{card.suit}</Text>
    </View>
  );
};

const Schoeneberg = () => {
  const { setInfoVisible, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const [tutorialStep, setTutorialStep] = useState(0);
  const { t, language } = useTranslation();
  const copy = useMemo(() => t('schoeneberg') || {}, [t]);

  const [deck, setDeck] = useState(() => shuffle(createDeck()));
  const [discard, setDiscard] = useState([]);
  const SLOTS = 8;
  const CENTER = Math.floor(SLOTS / 2);
  const [rows, setRows] = useState(() => {
    const d = [...deck];
    const initial = Array.from({ length: 6 }, () => {
      const c = d.pop();
      return {
        cards: c ? [{ card: c, slot: CENTER }] : [],
        nextLeft: CENTER - 1,
        nextRight: CENTER + 1,
      };
    });
    setDeck(d);
    return initial;
  });
  const [pending, setPending] = useState(null); // {rowIndex, side}
  const [streak, setStreak] = useState(0);
  const [toast, setToast] = useState(null); // {text}
  const [wrongReveal, setWrongReveal] = useState(null); // {rowIndex, side, newCard}
  const accent = '#F08974';

  const labels = useMemo(() => {
    return {
      infoHeader: copy.infoTitle || (language === 'de' ? 'Schöneberg' : 'Schöneberg'),
      info:
        copy.rules ||
        (language === 'de'
          ? 'Lege Karten links oder rechts an. Vor jedem Zug tippst du: höher, niedriger oder gleich im Vergleich zur Randkarte. Drei richtige in Folge – dann ist die nächste Person dran. Bei einem Fehler wird die komplette Reihe geleert; du trinkst so viele Schlucke wie Karten entfernt wurden. Danach wird eine neue Startkarte für die Reihe aufgedeckt.'
          : "Place a card on the left or right. Before drawing, guess higher, lower, or equal compared to the edge card. Three correct guesses in a row and then it is the next player's turn. On a mistake, the whole row is cleared; drink as many sips as cards removed. Then a new start card is revealed for that row."),
      higher: language === 'de' ? 'Höher' : 'Higher',
      lower: language === 'de' ? 'Niedriger' : 'Lower',
      equal: language === 'de' ? 'Gleich' : 'Equal',
      streak: language === 'de' ? 'Richtig in Folge' : 'Correct in a row',
      passTurn: language === 'de' ? 'Abgeben' : 'Pass turn',
      wrong: (n) => (language === 'de' ? `Falsch! Trinke ${n} Schluck(e)` : `Wrong! Drink ${n} sip(s)`),
    };
  }, [copy, language]);

  const drawCard = () => {
    if (deck.length > 0) {
      const c = deck[deck.length - 1];
      setDeck((d) => d.slice(0, -1));
      return c;
    }
    return null;
  };

  const handleGuess = (rowIndex, side, guess) => {
    const currentRow = rows[rowIndex];
    if (!currentRow) return;
    const last = currentRow.cards[currentRow.cards.length - 1];
    if (!last) return;
    const newCard = drawCard();
    if (!newCard) return;
    const cmp = compareRanks(newCard, last.card);
    const correct = (guess === 'lower' && cmp < 0) || (guess === 'equal' && cmp === 0) || (guess === 'higher' && cmp > 0);
    if (correct) {
      placeCard(rowIndex, side, newCard);
      setStreak((s) => s + 1);
    } else {
      setWrongReveal({ rowIndex, side, newCard });
    }
  };

  const placeCard = (rowIndex, side, newCard) => {
    setRows((prev) => {
      const next = prev.map((r) => ({ ...r }));
      const row = next[rowIndex];
      if (!row) return prev;
      const targetSlot = side === 'left' ? row.nextLeft : row.nextRight;
      if (targetSlot < 0 || targetSlot >= SLOTS) return prev;
      row.cards.push({ card: newCard, slot: targetSlot });
      if (side === 'left') row.nextLeft -= 1; else row.nextRight += 1;
      return next;
    });
  };

  const confirmWrong = () => {
    if (!wrongReveal) return;
    const { rowIndex } = wrongReveal;
    setRows((prev) => {
      const next = prev.map((r) => ({ ...r }));
      const row = next[rowIndex];
      const removed = row.cards.length;
      setToast({ text: labels.wrong(removed) });
      setTimeout(() => setToast(null), 1800);
      setDiscard((old) => [...old, ...row.cards.map((x) => x.card)]);
      const starter = drawCard();
      row.cards = starter ? [{ card: starter, slot: CENTER }] : [];
      row.nextLeft = CENTER - 1;
      row.nextRight = CENTER + 1;
      return next;
    });
    setStreak(0);
    setWrongReveal(null);
  };

  const requestGuess = (rowIndex, side) => {
    if (streak >= 3) return;
    const row = rows[rowIndex];
    if (!row) return;
    const canLeft = row.nextLeft >= 0;
    const canRight = row.nextRight < SLOTS;
    if ((side === 'left' && !canLeft) || (side === 'right' && !canRight)) {
      return;
    }
    setPending({ rowIndex, side });
  };

  const passTurn = () => setStreak(0);

  // Responsive sizes based on screen width
  const { width: screenWidth } = Dimensions.get('window');
  const sideWidth = 56;
  const horizontalPadding = 32; // approximate container padding/margins
  const availableCenterWidth = Math.max(0, screenWidth - horizontalPadding - 2 * sideWidth);
  const slotBaseWidth = 64;
  const slotWidth = Math.min(slotBaseWidth, Math.floor(availableCenterWidth / SLOTS) || slotBaseWidth);
  const cardScale = slotWidth / slotBaseWidth;
  const cardWidth = Math.max(24, slotWidth - 4);
  const cardHeight = cardWidth * 1.5;
  const fontScale = cardWidth / 48; // 48 was original base width

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
            <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
          </TouchableOpacity>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Schöneberg</Text>
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>{labels.streak}: {streak}/3</Text>
            </View>
            {streak >= 3 ? (
              <TouchableOpacity onPress={passTurn} style={styles.passButton}>
                <Text style={styles.passButtonText}>{labels.passTurn}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView contentContainerStyle={styles.rowsContainer}>
            {rows.map((row, idx) => {
              const isPendingHere = pending && pending.rowIndex === idx;
              const targetSlot = isPendingHere ? (pending.side === 'left' ? row.nextLeft : row.nextRight) : null;
              const canLeft = row.nextLeft >= 0;
              const canRight = row.nextRight < SLOTS;
              return (
                <View key={idx} style={styles.row}>
                  <View style={styles.side}>
                    {canLeft ? (
                      <PlusPad accent={accent} pulse onPress={() => requestGuess(idx, 'left')} disabled={streak >= 3} />
                    ) : (
                      <View style={[styles.plusPad, { opacity: 0.2 }]} />
                    )}
                  </View>

                  <View style={[styles.cardsStripFixed, { width: slotWidth * SLOTS, height: cardHeight + 8 }]}>
                    {targetSlot !== null && targetSlot >= 0 && targetSlot < SLOTS ? (
                      <View style={[styles.targetSlot, { left: targetSlot * slotWidth, width: slotWidth, height: cardHeight }]} />
                    ) : null}
                    {row.cards.map((c, i) => (
                      <View key={i} style={[styles.cardFixed, { left: c.slot * slotWidth }]}> 
                        <View style={[styles.card, { width: cardWidth, height: cardHeight, borderRadius: 10 * fontScale }]}>
                          <Text style={[styles.cardRank, { fontSize: 16 * fontScale }]}>{c.card.rank}</Text>
                          <Text style={[styles.cardSuit, { fontSize: 14 * fontScale }]}>{c.card.suit}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.side}>
                    {canRight ? (
                      <PlusPad accent={accent} pulse onPress={() => requestGuess(idx, 'right')} disabled={streak >= 3} />
                    ) : (
                      <View style={[styles.plusPad, { opacity: 0.2 }]} />
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {pending && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>{language === 'de' ? 'Dein Tipp' : 'Your guess'}</Text>
                <GuessSelector labels={labels} onPick={(g) => { handleGuess(pending.rowIndex, pending.side, g); setPending(null); }} />
                <TouchableOpacity onPress={() => setPending(null)} style={styles.modalClose}>
                  <Text style={{ color: '#fff' }}>{language === 'de' ? 'Abbrechen' : 'Cancel'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {wrongReveal && (
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBox, { paddingVertical: 12 }] }>
                <Text style={styles.modalTitle}>{language === 'de' ? 'Falsch geraten!' : 'Wrong guess!'}</Text>
                <View style={{ alignItems: 'center', marginTop: 6, marginBottom: 6 }}>
                  <CardView card={wrongReveal.newCard} />
                </View>
                {typeof wrongReveal.removed === 'number' ? (
                  <Text style={{ color: '#fff', marginBottom: 6, textAlign: 'center', fontFamily: 'Quicksand_300Bold' }}>
                    {labels.wrong(wrongReveal.removed)}
                  </Text>
                ) : null}
                <TouchableOpacity onPress={confirmWrong} style={styles.modalClose}>
                  <Text style={{ color: '#fff' }}>{language === 'de' ? 'Weiter' : 'Continue'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <InfoText header={labels.infoHeader} rules={labels.info} />
          <InfoHint />
          <TutorialOverlay
            visible={tutorialEnabled}
            steps={[
              { text: language === 'de' ? 'Tippe auf + um deinen Tipp zu platzieren.' : 'Tap + to place your guess.', placement: 'top' },
              { text: language === 'de' ? 'Wähle niedriger/gleich/höher und verfolge die Reihe.' : 'Pick lower/equal/higher and follow the row.', placement: 'bottom' },
            ]}
            stepIndex={tutorialStep}
            onNext={() => setTutorialStep((s) => (s + 1) % 2)}
            onClose={() => setTutorialEnabled(false)}
          />
        </View>

        {toast ? (
          <View style={styles.toast} pointerEvents="none">
            <Text style={styles.toastText}>{toast.text}</Text>
          </View>
        ) : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 112, marginBottom: 8 },
  headerTitle: { color: '#fff', fontFamily: 'Quicksand_700Bold', fontSize: 18 },
  streakPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)' },
  streakText: { color: '#fff', fontFamily: 'Quicksand_300Bold', fontSize: 12 },
  passButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(240,137,116,0.9)' },
  passButtonText: { color: '#201a17', fontFamily: 'Quicksand_700Bold' },

  rowsContainer: { paddingVertical: 8, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  side: { width: 56, alignItems: 'center', justifyContent: 'center' },
  plusPad: { width: 52, height: 80, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  plusButton: { padding: 6 },
  plusIcon: { fontSize: 24, fontWeight: '600' },
  cardsStrip: { alignItems: 'center', paddingHorizontal: 4, gap: 6 },
  cardsStripFixed: { position: 'relative', alignSelf: 'center' },
  cardFixed: { position: 'absolute', top: 0 },
  targetSlot: { position: 'absolute', top: 0, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(240,137,116,0.8)' },
  card: {
    width: 48,
    height: 72,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cardRank: { fontSize: 16, color: '#222', fontFamily: 'Quicksand_700Bold' },
  cardSuit: { fontSize: 14, color: '#222', marginTop: 2, fontFamily: 'Quicksand_300Bold' },

  guessBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 6,
    flexDirection: 'row',
    gap: 6,
  },
  guessBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  guessLabel: { color: '#fff', fontSize: 12 },

  toast: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toastText: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
    fontFamily: 'Quicksand_700Bold',
  },
  // Modal styles for guess and wrong-reveal overlays
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 96,
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '88%',
    backgroundColor: 'rgba(24,24,24,0.92)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Quicksand_700Bold',
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 8,
    backgroundColor: 'rgba(240,137,116,0.95)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});

export default Schoeneberg;
