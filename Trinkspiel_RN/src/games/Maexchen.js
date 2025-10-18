import React, { useState, useContext, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

const diceImages = {
  1: require('../../assets/images/wuerfel_1.png'),
  2: require('../../assets/images/wuerfel_2.png'),
  3: require('../../assets/images/wuerfel_3.png'),
  4: require('../../assets/images/wuerfel_4.png'),
  5: require('../../assets/images/wuerfel_5.png'),
  6: require('../../assets/images/wuerfel_6.png'),
};

const RANKING_VALUES = [
  '21',
  '66',
  '55',
  '44',
  '33',
  '22',
  '11',
  '65',
  '64',
  '63',
  '62',
  '61',
  '54',
  '53',
  '52',
  '51',
  '43',
  '42',
  '41',
  '32',
];

const HIDDEN_SYMBOL = '?';

const buildCopy = (language) => {
  if (language === 'en') {
    return {
      title: 'Mäxchen',
      tagline: 'Bluff, trust, and call bluffs when you dare.',
      phases: {
        ready: {
          headline: 'Ready to roll',
          body: 'The active player rolls in secret and keeps the result hidden. Shield the screen so nobody peeks.',
        },
        showing: {
          headline: 'Remember your result',
          body: 'Your roll: {{combination}}. Decide what to announce, cover the dice, and pass the phone along.',
        },
        hidden: {
          headline: 'Pass it on & bluff',
          body: 'Announce a higher value than the one you heard. The next player can believe you and roll – or challenge.',
        },
        revealed: {
          headline: 'Revealed!',
          body: 'It was actually {{combination}}. Whoever guessed wrong drinks. Then start a fresh round.',
        },
      },
      buttons: {
        roll: 'Roll dice',
        hide: 'Cover & pass on',
        trust: 'I believe you – I roll',
        reveal: 'Challenge & reveal',
        restart: 'Start a new round',
      },
      combo: {
        maexchen: 'Mäxchen (21)',
        pair: 'Double {{value}}',
      },
      resultLabel: 'Your roll: {{value}}',
      ranking: {
        title: 'Ranking (high → low)',
        maexchen: 'Mäxchen',
        pair: 'Double {{value}}',
        default: '',
      },
      infoTitle: 'Mäxchen!',
      rules:
        'Roll in turn while keeping the result to yourself. Cover the dice and pass the phone on. The next player must name a higher value than the one they heard – either because they beat it or by bluffing.\n\nDice results are read as two-digit numbers with the higher digit first. Doubles beat normal numbers. The highest result is Mäxchen (2 and 1). If you challenge and are right, you hand out a drink; if you are wrong, you drink instead.',
    };
  }

  return {
    title: 'Mäxchen',
    tagline: 'Blufft, glaubt – und zweifelt, wenn ihr mutig seid.',
    phases: {
      ready: {
        headline: 'Bereit zum Würfeln',
        body: 'Die Person am Zug würfelt verdeckt und behält das Ergebnis für sich. Halte den Bildschirm bedeckt, damit niemand mitschaut.',
      },
      showing: {
        headline: 'Ergebnis merken',
        body: 'Dein Wurf: {{combination}}. Überlege, was du ansagst, verdecke die Würfel und gib das Handy weiter.',
      },
      hidden: {
        headline: 'Weitergeben & bluffen',
        body: 'Sag einen höheren Wert an als zuletzt gehört. Die nächste Person darf dir glauben und würfeln – oder dich anzweifeln.',
      },
      revealed: {
        headline: 'Aufgedeckt!',
        body: 'Es wurde tatsächlich {{combination}}. Wer falsch lag, trinkt. Startet dann eine neue Runde.',
      },
    },
    buttons: {
      roll: 'Würfeln',
      hide: 'Verdecken & weitergeben',
      trust: 'Ich glaube dir – ich würfle',
      reveal: 'Anzweifeln & aufdecken',
      restart: 'Neue Runde starten',
    },
    combo: {
      maexchen: 'Mäxchen (21)',
      pair: 'Pasch {{value}}',
    },
    resultLabel: 'Dein Wurf: {{value}}',
    ranking: {
      title: 'Rangfolge (hoch → niedrig)',
      maexchen: 'Mäxchen',
      pair: 'Pasch {{value}}',
      default: '',
    },
    infoTitle: 'Mäxchen!',
    rules:
      'Würfelt reihum so, dass nur ihr selbst das Ergebnis seht. Verdeckt die Würfel und gebt das Handy weiter. Die nächste Person muss einen höheren Wert nennen, als sie gehört hat – entweder weil sie es schafft oder indem sie blufft.\n\nWürfelergebnisse werden immer zur zweistelligen Zahl mit der höheren Ziffer vorne. Pasche schlagen normale Zahlen. Das höchste Ergebnis ist Mäxchen (2 und 1). Wer anzweifelt und Recht hat, verteilt einen Schluck; wer sich irrt, trinkt selbst.',
  };
};

const MaexchenGame = () => {
  const [diceOne, setDiceOne] = useState(1);
  const [diceTwo, setDiceTwo] = useState(1);
  const [phase, setPhase] = useState('ready');
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { infoVisible, setInfoVisible } = useContext(VariablesContext);
  const { t, language } = useTranslation();
  const copy = useMemo(() => buildCopy(language), [language]);

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

  const getCombinationLabel = useCallback(
    (first, second) => {
      const high = Math.max(first, second);
      const low = Math.min(first, second);
      if (high === 2 && low === 1) {
        return copy.combo.maexchen;
      }
      if (high === low) {
        return copy.combo.pair.replace('{{value}}', String(high));
      }
      return `${high}${low}`;
    },
    [copy]
  );

  const combinationLabel = useMemo(
    () => getCombinationLabel(diceOne, diceTwo),
    [diceOne, diceTwo, getCombinationLabel]
  );

  const phaseInfo = useMemo(() => {
    const templates = copy.phases;
    const current = templates[phase] ?? templates.ready;
    const replaceCombination = (text) => text.replace('{{combination}}', combinationLabel);
    return {
      headline: current.headline,
      body: replaceCombination(current.body),
    };
  }, [copy, phase, combinationLabel]);

  const renderPrimaryButton = () => {
    switch (phase) {
      case 'ready':
        return (
          <TouchableOpacity onPress={rollDice} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>{copy.buttons.roll}</Text>
          </TouchableOpacity>
        );
      case 'showing':
        return (
          <TouchableOpacity onPress={hideDice} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>{copy.buttons.hide}</Text>
          </TouchableOpacity>
        );
      case 'hidden':
        return (
          <TouchableOpacity onPress={rollDice} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>{copy.buttons.trust}</Text>
          </TouchableOpacity>
        );
      case 'revealed':
        return (
          <TouchableOpacity onPress={resetRound} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>{copy.buttons.restart}</Text>
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
        <Text style={styles.secondaryButtonText}>{copy.buttons.reveal}</Text>
      </TouchableOpacity>
    );
  };

  const showDiceFaces = phase !== 'hidden';

  const resultText = useMemo(
    () => copy.resultLabel.replace('{{value}}', combinationLabel),
    [copy, combinationLabel]
  );

  const rankingLabel = useCallback(
    (value) => {
      if (value === '21') {
        return copy.ranking.maexchen;
      }
      if (value[0] === value[1]) {
        return copy.ranking.pair.replace('{{value}}', value[0]);
      }
      return copy.ranking.default;
    },
    [copy]
  );

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={appStyles.textHeader1}>{copy.title}</Text>
          <Text style={styles.subHeadline}>{copy.tagline}</Text>
        </View>

        <View style={styles.phaseCard}>
          <Text style={styles.phaseHeadline}>{phaseInfo.headline}</Text>
          <Text style={styles.phaseBody}>{phaseInfo.body}</Text>
        </View>

        <View style={styles.diceRow}>
          {[diceOne, diceTwo].map((value, index) => (
            <View key={`dice-${index}`} style={[styles.diceSlot, !showDiceFaces && styles.diceSlotHidden]}>
              {showDiceFaces ? (
                <Animated.Image
                  style={[styles.diceImage, { transform: [{ rotate: spin }] }]}
                  source={diceImages[value]}
                />
              ) : (
                <Text style={styles.hiddenMark}>{HIDDEN_SYMBOL}</Text>
              )}
            </View>
          ))}
        </View>

        {(phase === 'showing' || phase === 'revealed') && (
          <Text style={styles.resultLabel}>{resultText}</Text>
        )}

        <View style={styles.buttonColumn}>
          {renderPrimaryButton()}
          {renderSecondaryButton()}
        </View>

        <View style={styles.rankingCard}>
          <Text style={styles.rankingTitle}>{copy.ranking.title}</Text>
          <View style={styles.rankingGrid}>
            {RANKING_VALUES.map((value) => (
              <View key={value} style={styles.rankingItem}>
                <Text style={styles.rankingValue}>{value}</Text>
                {rankingLabel(value) ? <Text style={styles.rankingLabel}>{rankingLabel(value)}</Text> : null}
              </View>
            ))}
          </View>
        </View>

        <InfoText header={copy.infoTitle} rules={copy.rules} />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20 }]}>
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
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
