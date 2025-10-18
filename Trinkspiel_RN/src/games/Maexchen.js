import React, { useState, useContext, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';

const diceImages = {
  1: require('../../assets/images/wuerfel_1.png'),
  2: require('../../assets/images/wuerfel_2.png'),
  3: require('../../assets/images/wuerfel_3.png'),
  4: require('../../assets/images/wuerfel_4.png'),
  5: require('../../assets/images/wuerfel_5.png'),
  6: require('../../assets/images/wuerfel_6.png'),
};

const RANKING = [
  { value: '21', label: 'Mäxchen' },
  { value: '66', label: 'Pasch 6' },
  { value: '55', label: 'Pasch 5' },
  { value: '44', label: 'Pasch 4' },
  { value: '33', label: 'Pasch 3' },
  { value: '22', label: 'Pasch 2' },
  { value: '11', label: 'Pasch 1' },
  { value: '65', label: '' },
  { value: '64', label: '' },
  { value: '63', label: '' },
  { value: '62', label: '' },
  { value: '61', label: '' },
  { value: '54', label: '' },
  { value: '53', label: '' },
  { value: '52', label: '' },
  { value: '51', label: '' },
  { value: '43', label: '' },
  { value: '42', label: '' },
  { value: '41', label: '' },
  { value: '32', label: '' },
];

const describeRoll = (first, second) => {
  const high = Math.max(first, second);
  const low = Math.min(first, second);
  if (high === 2 && low === 1) {
    return 'Mäxchen (21)';
  }
  if (high === low) {
    return `Pasch ${high}${low}`;
  }
  return `${high}${low}`;
};

const MaexchenGame = () => {
  const [diceOne, setDiceOne] = useState(1);
  const [diceTwo, setDiceTwo] = useState(1);
  const [phase, setPhase] = useState('ready');
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

  const spin = useMemo(
    () =>
      rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
      }),
    [rotateAnim]
  );

  const rollDice = () => {
    setPhase('showing');
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));
    setDiceOne(Math.floor(Math.random() * 6) + 1);
    setDiceTwo(Math.floor(Math.random() * 6) + 1);
  };

  const hideDice = () => {
    setPhase('hidden');
  };

  const revealDice = () => {
    setPhase('revealed');
  };

  const resetRound = () => {
    setPhase('ready');
  };

  const combinationLabel = useMemo(() => describeRoll(diceOne, diceTwo), [diceOne, diceTwo]);

  const phaseInfo = useMemo(() => {
    switch (phase) {
      case 'showing':
        return {
          headline: 'Ergebnis merken',
          body: `Dein Wurf: ${combinationLabel}. Überlege, was du ansagst, verdecke die Würfel und gib das Handy weiter.`,
        };
      case 'hidden':
        return {
          headline: 'Weitergeben & bluffen',
          body: 'Sag einen höheren Wert an als zuletzt gehört. Die nächste Person darf dir glauben und würfeln – oder dich anzweifeln.',
        };
      case 'revealed':
        return {
          headline: 'Aufgedeckt!',
          body: `Es wurde tatsächlich ${combinationLabel}. Wer falsch lag, trinkt. Startet dann eine neue Runde.`,
        };
      default:
        return {
          headline: 'Bereit zum Würfeln',
          body: 'Die Person am Zug würfelt verdeckt und behält das Ergebnis für sich. Halte den Bildschirm bedeckt, damit niemand mitschaut.',
        };
    }
  }, [phase, combinationLabel]);

  const renderPrimaryButton = () => {
    switch (phase) {
      case 'ready':
        return (
          <TouchableOpacity onPress={rollDice} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>Würfeln</Text>
          </TouchableOpacity>
        );
      case 'showing':
        return (
          <TouchableOpacity onPress={hideDice} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>Verdecken & weitergeben</Text>
          </TouchableOpacity>
        );
      case 'hidden':
        return (
          <TouchableOpacity onPress={rollDice} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>Ich glaube dir – ich würfle</Text>
          </TouchableOpacity>
        );
      case 'revealed':
        return (
          <TouchableOpacity onPress={resetRound} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>Neue Runde starten</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderSecondaryButton = () => {
    if (phase !== 'hidden') {
      return null;
    }
    return (
      <TouchableOpacity onPress={revealDice} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Anzweifeln & aufdecken</Text>
      </TouchableOpacity>
    );
  };

  const showDiceFaces = phase !== 'hidden';

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={appStyles.textHeader1}>Mäxchen</Text>
          <Text style={styles.subHeadline}>Blufft, glaubt – und zweifelt, wenn ihr mutig seid.</Text>
        </View>

        <View style={styles.phaseCard}>
          <Text style={styles.phaseHeadline}>{phaseInfo.headline}</Text>
          <Text style={styles.phaseBody}>{phaseInfo.body}</Text>
        </View>

        <View style={styles.diceRow}>
          {[diceOne, diceTwo].map((value, index) => (
            <View key={`dice-${index}`} style={[styles.diceSlot, !showDiceFaces && styles.diceSlotHidden]}>
              {showDiceFaces ? (
                <Animated.Image style={[styles.diceImage, { transform: [{ rotate: spin }] }]} source={diceImages[value]} />
              ) : (
                <Text style={styles.hiddenMark}>?</Text>
              )}
            </View>
          ))}
        </View>

        {phase === 'showing' || phase === 'revealed' ? (
          <Text style={styles.resultLabel}>Dein Wurf: {combinationLabel}</Text>
        ) : null}

        <View style={styles.buttonColumn}>
          {renderPrimaryButton()}
          {renderSecondaryButton()}
        </View>

        <View style={styles.rankingCard}>
          <Text style={styles.rankingTitle}>Rangfolge (hoch → niedrig)</Text>
          <View style={styles.rankingGrid}>
            {RANKING.map((entry) => (
              <View key={entry.value} style={styles.rankingItem}>
                <Text style={styles.rankingValue}>{entry.value}</Text>
                {entry.label ? <Text style={styles.rankingLabel}>{entry.label}</Text> : null}
              </View>
            ))}
          </View>
        </View>

        <InfoText
          header={"Mäxchen!"}
          rules={
            'Würfelt reihum so, dass nur ihr selbst das Ergebnis seht. Verdeckt die Würfel und gebt das Handy weiter. Die nächste Person muss einen höheren Wert nennen, als sie gehört hat – entweder weil sie es schafft oder indem sie blufft.\n\nWürfelergebnisse werden immer zur zweistelligen Zahl mit der höheren Ziffer vorne. Pasche schlagen normale Zahlen. Das höchste Ergebnis ist Mäxchen (2 und 1). Wer anzweifelt und Recht hat, verteilt einen Schluck; wer sich irrt, trinkt selbst.'
          }
        />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20 }]}>
          <Text style={appStyles.infoButtonText}>Regeln</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 80,
    alignItems: 'center',
    gap: 24,
  },
  headerRow: {
    alignItems: 'center',
  },
  subHeadline: {
    marginTop: 6,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Quicksand_300Light',
  },
  phaseCard: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  phaseHeadline: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Quicksand_300Bold',
    textAlign: 'center',
  },
  phaseBody: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Quicksand_300Light',
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  diceSlot: {
    width: 118,
    height: 118,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceSlotHidden: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'transparent',
  },
  hiddenMark: {
    fontSize: 46,
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'Quicksand_300Bold',
  },
  diceImage: {
    width: 100,
    height: 100,
  },
  resultLabel: {
    color: '#E5C185',
    fontSize: 20,
    fontFamily: 'Quicksand_300Bold',
    textAlign: 'center',
  },
  buttonColumn: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButton: {
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(229,193,133,0.6)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand_300Bold',
    color: '#E5C185',
  },
  rankingCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rankingTitle: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Quicksand_300Bold',
    marginBottom: 12,
  },
  rankingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  rankingItem: {
    width: '30%',
    alignItems: 'center',
  },
  rankingValue: {
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 16,
  },
  rankingLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Quicksand_300Light',
  },
});

export default MaexchenGame;
