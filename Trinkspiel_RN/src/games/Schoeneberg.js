import React, { useMemo, useRef, useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from 'react-native';
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

const PlusPad = ({ accent, onPress, pulse, disabled, height }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
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

  const baseStyle = [
    styles.plusPad,
    { height },
    { borderColor: `${accent}70`, backgroundColor: `${accent}18` },
  ];

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

  // ensures a true center column
  const SLOTS = 9;
  const CENTER = Math.floor(SLOTS / 2);

  const [rows, setRows] = useState(() => {
    const d = [...deck];
    const initial = Array.from({ length: 8 }, () => {
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
  const [wrongReveal, setWrongReveal] = useState(null); // {rowIndex, side, newCard, removed}
  const accent = '#F08974';

  // Reserved top area height for popups
  const { height: screenHeight } = Dimensions.get('window');
  const modalTopHeight = Math.max(120, Math.floor(screenHeight * 0.2));

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

    // Determine the edge card on the chosen side (leftmost or rightmost)
    if (!currentRow.cards.length) return;
    const edge = currentRow.cards.reduce((acc, c) => {
      if (!acc) return c;
      return side === 'left' ? (c.slot < acc.slot ? c : acc) : (c.slot > acc.slot ? c : acc);
    }, null);

    const newCard = drawCard();
    if (!newCard) return;

    // Compare with the edge card rather than the most recent pushed card
    const cmp = compareRanks(newCard, edge.card);
    const correct =
      (guess === 'lower' && cmp < 0) ||
      (guess === 'equal' && cmp === 0) ||
      (guess === 'higher' && cmp > 0);

    if (correct) {
      placeCard(rowIndex, side, newCard);
      setStreak((s) => {
        // After reaching 3, continuing is voluntary; for each further correct card, allow giving 1 sip
        if (s >= 3) {
          setToast({ text: language === 'de' ? 'Verteile 1 Schluck' : 'Give 1 sip' });
          setTimeout(() => setToast(null), 1200);
        }
        return s + 1;
      });
    } else {
      // Show how many cards will be removed (and thus sips to drink)
      setWrongReveal({ rowIndex, side, newCard, removed: currentRow.cards.length });
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
      if (side === 'left') row.nextLeft -= 1;
      else row.nextRight += 1;

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
    // After 3 correct, you may continue voluntarily (do not block)
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
  const sideWidth = 44; // make side pads narrower
  const horizontalPadding = 32; // approximate container padding/margins
  const availableCenterWidth = Math.max(0, screenWidth - horizontalPadding - 2 * sideWidth);
  const slotBaseWidth = 64; // make cards larger
  const slotWidth = Math.min(slotBaseWidth, Math.floor(availableCenterWidth / SLOTS) || slotBaseWidth);
  const cardScale = slotWidth / slotBaseWidth;
  const cardWidth = Math.max(24, slotWidth - 4);
  const cardHeight = cardWidth * 1.5;
  const fontScale = cardWidth / 48; // 48 was original base width

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity
            onPress={() => setTutorialEnabled(!tutorialEnabled)}
            style={[
              appStyles.infoButton,
              { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 },
            ]}
          >
            <Text style={appStyles.infoButtonText}>
              {tutorialEnabled
                ? language === 'de'
                  ? 'Tutorial aus'
                  : 'Tutorial off'
                : language === 'de'
                ? 'Tutorial an'
                : 'Tutorial on'}
            </Text>
          </TouchableOpacity>

          

          {/* overlayed header near the top */}
          <View style={[styles.topHeaderOverlay]}>
            <Text style={styles.topHeaderTitle}>
              {language === 'de' ? 'Schöneberg' : 'Schoeneberg'}
            </Text>
            <Text style={styles.topHeaderStreak}>
              {labels.streak}: {streak}/3
            </Text>
          </View>
          

          {/* rows */}
          <ScrollView contentContainerStyle={styles.rowsContainer}>
            {rows.map((row, idx) => {
              const isPendingHere = pending && pending.rowIndex === idx;
              const targetSlot =
                isPendingHere ? (pending.side === 'left' ? row.nextLeft : row.nextRight) : null;
              const canLeft = row.nextLeft >= 0;
              const canRight = row.nextRight < SLOTS;

              return (
                <View key={idx} style={styles.row}>
                  <View style={styles.side}>
                    {canLeft ? (
                      <PlusPad
                        accent={accent}
                        pulse
                        onPress={() => requestGuess(idx, 'left')}
                        disabled={false}
                        height={cardHeight}
                      />
                    ) : (
                      <View style={[styles.plusPad, { height: cardHeight, opacity: 0.2 }]} />
                    )}
                  </View>

                  <View
                    style={[styles.cardsStripFixed, { width: slotWidth * SLOTS, height: cardHeight + 8 }]}
                  >
                    {targetSlot !== null && targetSlot >= 0 && targetSlot < SLOTS ? (
                      <View
                        style={[
                          styles.targetSlot,
                          { left: targetSlot * slotWidth, width: slotWidth, height: cardHeight },
                        ]}
                      />
                    ) : null}

                    {row.cards.map((c, i) => (
                      <View
                        key={i}
                        style={[styles.cardFixed, { left: c.slot * slotWidth, width: slotWidth, alignItems: 'center' }]}
                      >
                        <View style={[styles.card, { width: cardWidth, height: cardHeight, borderRadius: 10 * fontScale }]}>
                          <Text style={[styles.cardRank, { fontSize: 16 * fontScale }]}>{c.card.rank}</Text>
                          <Text style={[styles.cardSuit, { fontSize: 14 * fontScale }]}>{c.card.suit}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.side}>
                    {canRight ? (
                      <PlusPad
                        accent={accent}
                        pulse
                        onPress={() => requestGuess(idx, 'right')}
                        disabled={false}
                        height={cardHeight}
                      />
                    ) : (
                      <View style={[styles.plusPad, { height: cardHeight, opacity: 0.2 }]} />
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Guess popup */}
          {pending ? (
            <View style={styles.modalOverlayBottom}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  {language === 'de' ? 'Dein Tipp' : 'Your Guess'}
                </Text>
                <GuessSelector
                  labels={labels}
                  onPick={(g) => {
                    const { rowIndex, side } = pending;
                    setPending(null);
                    handleGuess(rowIndex, side, g);
                  }}
                />
                <TouchableOpacity onPress={() => setPending(null)} style={styles.instructionButton}>
                  <Text style={{ color: '#201a17', fontFamily: 'Quicksand_700Bold' }}>
                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Wrong reveal popup */}
          {wrongReveal ? (
            <View style={styles.modalOverlayBottom}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  {labels.wrong(wrongReveal.removed)}
                </Text>
                <Text style={[styles.modalTitle, { fontSize: 14, opacity: 0.9 }]}>
                  {language === 'de' ? 'Gezogene Karte:' : 'Drawn card:'}
                </Text>
                <View style={[styles.card, { width: 60, height: 90, borderRadius: 10 }]}>
                  <Text style={[styles.cardRank]}>{wrongReveal.newCard.rank}</Text>
                  <Text style={[styles.cardSuit]}>{wrongReveal.newCard.suit}</Text>
                </View>
                <TouchableOpacity onPress={confirmWrong} style={styles.modalClose}>
                  <Text style={{ color: '#201a17', fontFamily: 'Quicksand_700Bold' }}>
                    {language === 'de' ? 'Weiter' : 'Continue'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <InfoText header={labels.infoHeader} rules={labels.info} />
          <InfoHint />

          <TutorialOverlay
            visible={tutorialEnabled}
            steps={[
              {
                text:
                  language === 'de'
                    ? 'Tippe auf + um deinen Tipp zu platzieren.'
                    : 'Tap + to place your guess.',
                placement: 'top',
              },
              {
                text:
                  language === 'de'
                    ? 'Wähle niedriger/gleich/höher und verfolge die Reihe.'
                    : 'Pick lower/equal/higher and follow the row.',
                placement: 'bottom',
              },
            ]}
            stepIndex={tutorialStep}
            onNext={() => setTutorialStep((s) => (s + 1) % 2)}
            onClose={() => setTutorialEnabled(false)}
          />
        </View>

        {toast ? (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toast.text}</Text>
          </View>
        ) : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  headerTitle: { color: '#fff', fontFamily: 'Quicksand_700Bold', fontSize: 18 },
  streakPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  streakText: { color: '#fff', fontFamily: 'Quicksand_300Bold', fontSize: 12 },
  passButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(240,137,116,0.9)',
  },
  passButtonText: { color: '#201a17', fontFamily: 'Quicksand_700Bold' },
  rowsContainer: { paddingVertical: 8, paddingTop: 180, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  side: { width: 44, alignItems: 'center', justifyContent: 'center' },
  plusPad: { width: 40, height: 130, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  plusButton: { padding: 4 },
  plusIcon: { fontSize: 20, fontWeight: '600' },
  cardsStrip: { alignItems: 'center', paddingHorizontal: 4, gap: 6 },
  cardsStripFixed: { position: 'relative', alignSelf: 'center' },
  cardFixed: { position: 'absolute', top: 0 },
  targetSlot: { position: 'absolute', top: 0, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(240,137,116,0.8)' },
  card: {
    width: 48,
    height: 130,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cardRank: { fontSize: 16, color: '#222', fontFamily: 'Quicksand_700Bold' },
  cardSuit: { fontSize: 14, color: '#222', marginTop: 2, fontFamily: 'Quicksand_300Bold' },
  guessBox: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    gap: 8,
  },
  guessBtn: { backgroundColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  guessLabel: { color: '#fff', fontSize: 14 },
  toast: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  toastText: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
    fontFamily: 'Quicksand_700Bold',
  },
  // Modal styles for guess and wrong-reveal overlays (top gap only)
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // height injected inline
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalOverlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '92%',
    backgroundColor: 'rgba(24,24,24,0.94)',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: { color: '#fff', fontSize: 18, fontFamily: 'Quicksand_700Bold', textAlign: 'center' },
  modalClose: {
    marginTop: 8,
    backgroundColor: 'rgba(240,137,116,0.97)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  // Top header overlay inside the reserved gap
  topHeaderOverlay: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  topHeaderTitle: { color: '#fff', fontFamily: 'Quicksand_700Bold', fontSize: 22 },
  topHeaderStreak: { color: '#fff', fontFamily: 'Quicksand_300Bold', fontSize: 14 },
  instructionPanel: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  instructionTitle: {
    color: '#fff',
    fontFamily: 'Quicksand_700Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 6,
  },
  instructionText: { color: '#fff', fontFamily: 'Quicksand_300Bold', fontSize: 14, textAlign: 'center' },
  instructionButton: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(240,137,116,0.97)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});

export default Schoeneberg;
