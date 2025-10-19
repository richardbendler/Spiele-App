import React, {
  useMemo,
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

const ROWS = 6;
const COLUMNS = 6;
const TOTAL_CELLS = ROWS * COLUMNS;
const DRINK_CARD_COUNT = 12;
const DRINK_VALUES = [1, 2, 3, 4, 5];
const diceImages = {
  1: require('../../assets/images/wuerfel_1.png'),
  2: require('../../assets/images/wuerfel_2.png'),
  3: require('../../assets/images/wuerfel_3.png'),
  4: require('../../assets/images/wuerfel_4.png'),
  5: require('../../assets/images/wuerfel_5.png'),
  6: require('../../assets/images/wuerfel_6.png'),
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildBoard = () => {
  const base = [];
  for (let row = 1; row <= ROWS; row += 1) {
    for (let col = 1; col <= COLUMNS; col += 1) {
      base.push({
        id: `${row}-${col}`,
        row,
        col,
        revealed: false,
        type: 'empty',
        value: 0,
        color: Math.random() < 0.5 ? 'red' : 'black',
      });
    }
  }

  shuffle(base)
    .slice(0, DRINK_CARD_COUNT)
    .forEach((cell) => {
      cell.type = 'drink';
      cell.value = DRINK_VALUES[Math.floor(Math.random() * DRINK_VALUES.length)];
    });

  return base;
};

const FALLBACK_COPY = {
  de: {
    title: 'Six by Six',
    infoTitle: 'Six by Six',
    rules:
      'Legt 36 verdeckte Karten in einem 6x6-Raster aus. Auf etwa einem Drittel stehen Schluckzahlen, alle Karten sind rot oder schwarz. Würfelt mit zwei Würfeln: Der erste bestimmt die Zeile, der zweite die Spalte. Deckt die Karte auf, erfüllt die Aufgabe und lasst sie offen. Rot bedeutet: du bist direkt nochmal dran. Schwarz bedeutet: weiter zur nächsten Person. Mischt den Tisch neu, wenn ihr ohne offene Felder weiterspielen wollt.',
    rollHint: 'Würfel 1 = Zeile, Würfel 2 = Spalte.',
    revealedLabel: 'Aufgedeckt: {{open}}/36',
    rollButton: 'Würfeln',
    resetButton: 'Tisch neu mischen',
    lastRollLabel: 'Letzter Wurf',
    coordinateLabel: 'Feld {{row}}-{{col}}',
    coordinateShort: '{{row}}/{{col}}',
    sipSingular: '{{count}} Schluck',
    sipPlural: '{{count}} Schlucke',
    safeShort: 'Frei',
    safeCard: 'Frei – nichts passiert.',
    alreadyRevealed: 'Schon offen – würfelt erneut!',
    turnAgain: 'Rot: Du bist nochmal dran.',
    turnPass: 'Schwarz: Nächste Person ist dran.',
    modal: {
      startTitle: 'Bereit?',
      startBody: 'Nehmt zwei Würfel. Der erste bestimmt die Zeile, der zweite die Spalte.',
      drinkTitle: 'Schlucke ansagen',
      drinkBody: 'Die Karte zeigt {{count}} {{unit}}. Rot heißt: du bist sofort nochmal dran.',
      safeTitle: 'Kein Drink',
      safeBody: 'Glück gehabt! Kein Drink – gib die Würfel weiter.',
      againTitle: 'Nochmal dran',
      againBody: 'Rot bedeutet: Du würfelst direkt erneut.',
      passTitle: 'Weitergeben',
      passBody: 'Schwarz bedeutet: Die nächste Person ist dran.',
      alreadyTitle: 'Schon offen',
      alreadyBody: 'Dieses Feld war bereits aufgedeckt. Würfelt nochmal.',
      button: 'Weiter',
    },
  },
  en: {
    title: 'Six by Six',
    infoTitle: 'Six by Six',
    rules:
      'Lay out 36 facedown cards in a 6x6 grid. About a third show sip counts and every card is red or black. Roll two dice: the first die picks the row, the second die picks the column. Flip the card, follow the instruction, and leave it face up. Red means you go again, black passes to the next player. Shuffle the grid when you want a fresh board.',
    rollHint: 'Die one = row, die two = column.',
    revealedLabel: 'Revealed: {{open}}/36',
    rollButton: 'Roll dice',
    resetButton: 'Reset grid',
    lastRollLabel: 'Last roll',
    coordinateLabel: 'Tile {{row}}-{{col}}',
    coordinateShort: '{{row}}/{{col}}',
    sipSingular: '{{count}} sip',
    sipPlural: '{{count}} sips',
    safeShort: 'Safe',
    safeCard: 'Safe - nothing happens.',
    alreadyRevealed: 'Card already open - roll again!',
    turnAgain: 'Red: You go again.',
    turnPass: 'Black: Pass to the next player.',
    modal: {
      startTitle: 'Ready?',
      startBody: 'Grab two dice. The first picks the row, the second picks the column.',
      drinkTitle: 'Call the sips',
      drinkBody: 'The card shows {{count}} {{unit}}. Red means you roll again immediately.',
      safeTitle: 'Safe card',
      safeBody: 'Lucky you! No drink – pass the dice on.',
      againTitle: 'Go again',
      againBody: 'Red means you take another turn right away.',
      passTitle: 'Pass on',
      passBody: 'Black means the next player rolls.',
      alreadyTitle: 'Already open',
      alreadyBody: 'This tile was open already. Roll again.',
      button: 'Continue',
    },
  },
};

const useSixBySixCopy = (language, t) => {
  const fallback = language === 'en' ? FALLBACK_COPY.en : FALLBACK_COPY.de;
  const translated = t('sixBySix');
  if (!translated) {
    return fallback;
  }
  return {
    ...fallback,
    ...translated,
    modal: {
      ...fallback.modal,
      ...(translated.modal ?? {}),
    },
  };
};

const SixBySixGame = () => {
  const { infoVisible, setInfoVisible, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { t, language } = useTranslation();
  const copy = useMemo(() => useSixBySixCopy(language, t), [language, t]);

  const [board, setBoard] = useState(() => buildBoard());
  const [diceOne, setDiceOne] = useState(1);
  const [diceTwo, setDiceTwo] = useState(1);
  const [activeCellId, setActiveCellId] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [transientTip, setTransientTip] = useState(null);
  const [hint, setHint] = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    // no modal popup on load; tutorial is controlled via the tutorial button
    setHint(null);
    setHintVisible(false);
    setTransientTip(null);
  }, [copy.modal.startBody, copy.modal.startTitle]);

  const spin = useMemo(
    () =>
      rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
      }),
    [rotateAnim],
  );

  const revealedCount = useMemo(
    () => board.filter((cell) => cell.revealed).length,
    [board],
  );

  const formatCoordinate = useCallback(
    (row, col, template) =>
      (template || '{{row}}/{{col}}')
        .replace('{{row}}', String(row))
        .replace('{{col}}', String(col)),
    [],
  );

  const formatModalText = useCallback((template, replacements) => {
    if (!template) {
      return '';
    }
    return Object.entries(replacements).reduce(
      (acc, [key, value]) =>
        acc.replace(new RegExp(`{{${key}}}`, 'g'), value),
      template,
    );
  }, []);

  const showHint = useCallback((title, body) => {
    if (!title && !body) {
      setHint(null);
      setHintVisible(false);
      return;
    }
    setHint({ title, body });
    setHintVisible(true);
  }, []);

  const getUnitLabel = useCallback(
    (value) => {
      if (language === 'en') {
        return value === 1 ? 'sip' : 'sips';
      }
      return value === 1 ? 'Schluck' : 'Schlucke';
    },
    [language],
  );

  const formatDrinkText = useCallback(
    (value) => {
      const template = value === 1 ? copy.sipSingular : copy.sipPlural;
      return template
        .replace('{{count}}', String(value))
        .replace('{{unit}}', getUnitLabel(value));
    },
    [copy.sipPlural, copy.sipSingular, getUnitLabel],
  );

  const resolveResultMessage = useCallback(
    (result) => {
      if (!copy || !result) {
        return copy?.rollHint ?? '';
      }
      const coordinate = formatCoordinate(result.row, result.col, copy.coordinateLabel);
      if (result.type === 'already') {
        return `${coordinate} • ${copy.alreadyRevealed}`;
      }
      const turnHint = result.color === 'red' ? copy.turnAgain : copy.turnPass;
      if (result.type === 'drink') {
        return `${coordinate} • ${formatDrinkText(result.value)} • ${turnHint}`;
      }
      return `${coordinate} • ${copy.safeCard} • ${turnHint}`;
    },
    [copy, formatCoordinate, formatDrinkText],
  );

  const handleResolvedHint = useCallback(
    (resolved) => {
      if (!resolved) {
        return;
      }
      if (resolved.type === 'already') {
        showHint(copy.modal.alreadyTitle, copy.modal.alreadyBody);
        return;
      }

      const againTitle = copy.modal.againTitle;
      const againBody = copy.modal.againBody;
      const passTitle = copy.modal.passTitle;
      const passBody = copy.modal.passBody;
      const followTitle = resolved.color === 'red' ? againTitle : passTitle;
      const followBody = resolved.color === 'red' ? againBody : passBody;

      if (resolved.type === 'drink') {
        const base = formatModalText(copy.modal.drinkBody, {
          count: String(resolved.value ?? 0),
          unit: getUnitLabel(resolved.value ?? 0),
        });
        const parts = [base];
        if (followBody) {
          parts.push(
            followTitle ? `${followTitle}: ${followBody}` : followBody,
          );
        }
        showHint(copy.modal.drinkTitle, parts.join('\n\n'));
        return;
      }

      const parts = [copy.modal.safeBody];
      if (followBody) {
        parts.push(followTitle ? `${followTitle}: ${followBody}` : followBody);
      }
      showHint(copy.modal.safeTitle, parts.join('\n\n'));
    },
    [copy.modal, formatModalText, getUnitLabel, showHint],
  );

  const revealCell = useCallback(
    (row, col) => {
      let resolved = null;
      setBoard((prev) =>
        prev.map((cell) => {
          if (cell.row === row && cell.col === col) {
            if (cell.revealed) {
              resolved = { ...cell, type: cell.type, status: 'already' };
              return cell;
            }
            resolved = { ...cell, revealed: true };
            return resolved;
          }
          return cell;
        }),
      );

      if (resolved) {
        const resultType = resolved.status === 'already' ? 'already' : resolved.type;
        const nextResult = {
          type: resultType,
          value: resolved.value,
          color: resolved.color,
          row,
          col,
        };
        setLastResult(nextResult);
        handleResolvedHint(nextResult);
        setTransientTip(resolveResultMessage(nextResult));
      } else {
        setLastResult(null);
      }
    },
    [handleResolvedHint],
  );

  const rollDice = useCallback(() => {
    if (rolling) {
      return;
    }
    const nextOne = Math.floor(Math.random() * 6) + 1;
    const nextTwo = Math.floor(Math.random() * 6) + 1;
    setRolling(true);
    setHintVisible(false);
    setDiceOne(nextOne);
    setDiceTwo(nextTwo);
    setActiveCellId(`${nextOne}-${nextTwo}`);

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      revealCell(nextOne, nextTwo);
      setRolling(false);
    });
  }, [revealCell, rotateAnim, rolling]);

  const resetBoard = useCallback(() => {
    setBoard(buildBoard());
    setActiveCellId(null);
    setLastResult(null);
    // no modal on reset; keep flow clean
  }, [copy.modal.startBody, copy.modal.startTitle, showHint]);

  const boardRows = useMemo(() => {
    const rows = [];
    for (let row = 1; row <= ROWS; row += 1) {
      rows.push(board.filter((cell) => cell.row === row));
    }
    return rows;
  }, [board]);

  const statusMessage = resolveResultMessage(lastResult);

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.rollHint}</Text>
            <Text style={styles.stats}>
              {copy.revealedLabel.replace('{{open}}', String(revealedCount))}
            </Text>
          </View>

          <View style={styles.diceRow}>
            <Animated.Image source={diceImages[diceOne]} style={[styles.dice, { transform: [{ rotate: spin }] }]} />
            <Animated.Image source={diceImages[diceTwo]} style={[styles.dice, { transform: [{ rotate: spin }] }]} />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[appStyles.gameActionButton, rolling && styles.disabledButton]}
              onPress={rollDice}
              activeOpacity={0.9}
            >
              <Text style={appStyles.gameActionButtonText}>{copy.rollButton}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={resetBoard} activeOpacity={0.9}>
              <Text style={styles.resetButtonText}>{copy.resetButton}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>{copy.lastRollLabel}</Text>
            <Text style={styles.statusMessage}>{statusMessage}</Text>
          </View>

          <View style={styles.grid}>
            {boardRows.map((rowCells) => (
              <View key={`row-${rowCells[0].row}`} style={styles.gridRow}>
                {rowCells.map((cell) => {
                  const isActive = cell.id === activeCellId;
                  const cellStyles = [
                    styles.cell,
                    !cell.revealed && styles.cellHidden,
                    cell.revealed && (cell.color === 'red' ? styles.cellRed : styles.cellBlack),
                    isActive && styles.cellActive,
                  ];
                  return (
                    <View key={cell.id} style={cellStyles}>
                      <Text style={styles.coordinateText}>
                        {formatCoordinate(cell.row, cell.col, copy.coordinateShort)}
                      </Text>
                      {cell.revealed ? (
                        cell.type === 'drink' ? (
                          <View style={styles.cardContent}>
                            <Text style={styles.cardValue}>{cell.value}</Text>
                            <Text
                              style={styles.cardLabel}
                              numberOfLines={1}
                              adjustsFontSizeToFit
                              minimumFontScale={0.75}
                              ellipsizeMode="tail"
                            >
                              {formatDrinkText(cell.value)}
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.safeLabel}>{copy.safeShort}</Text>
                        )
                      ) : (
                        <Text style={styles.hiddenMark}>?</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          {transientTip ? (
            <View style={styles.transientTip}>
              <Text style={styles.transientTipText}>{transientTip}</Text>
              <TouchableOpacity onPress={() => setTransientTip(null)} style={styles.transientTipClose}>
                <Text style={styles.transientTipCloseText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>

        <InfoText header={copy.infoTitle} rules={copy.rules} />
        <InfoHint />
        <TouchableOpacity
          onPress={() => setInfoVisible(true)}
          style={[appStyles.infoButton, styles.infoButton]}
        >
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
        </TouchableOpacity>

        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Würfelt mit zwei Würfeln: 1. Zeile, 2. Spalte.' : 'Roll two dice: 1st row, 2nd column.', placement: 'top' },
            { text: language === 'de' ? 'Deckt die Karte auf und befolgt die Aktion.' : 'Reveal the card and follow the action.', placement: 'bottom' },
            { text: language === 'de' ? 'Rot = nochmal dran, Schwarz = weitergeben.' : 'Red = go again, Black = pass turn.', placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s) => (s + 1) % 3)}
          onClose={() => setTutorialEnabled(false)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 140,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Quicksand_300Light',
  },
  stats: {
    color: 'rgba(229,193,133,0.9)',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 13,
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  dice: {
    width: 92,
    height: 92,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229,193,133,0.7)',
    backgroundColor: 'rgba(9,9,9,0.4)',
  },
  resetButtonText: {
    color: '#E5C185',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 15,
  },
  statusCard: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 6,
  },
  statusTitle: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusMessage: {
    color: 'white',
    fontFamily: 'Quicksand_300Light',
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  cellHidden: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cellRed: {
    backgroundColor: 'rgba(196, 45, 62, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cellBlack: {
    backgroundColor: 'rgba(24,24,24,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cellActive: {
    borderWidth: 2,
    borderColor: '#E5C185',
    shadowColor: '#E5C185',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  coordinateText: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontFamily: 'Quicksand_300Bold',
  },
  hiddenMark: {
    fontSize: 32,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Quicksand_300Bold',
  },
  cardContent: {
    alignItems: 'center',
    gap: 4,
  },
  cardValue: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
  },
  cardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Quicksand_300Light',
    textAlign: 'center',
  },
  safeLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Quicksand_300Bold',
    textAlign: 'center',
  },
  infoButton: {
    top: 24,
    left: 20,
  },
  transientTip: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  transientTipText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
    fontFamily: 'Quicksand_300Light',
  },
  transientTipClose: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  transientTipCloseText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18,
  },
});

export default SixBySixGame;
