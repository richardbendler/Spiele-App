import React, { useState, useContext, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';
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

// Reihenfolge von stark nach schwach; Index dient als Rang zum Vergleichen von Ansagen.
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

const getCombinationCode = (first, second) => {
  const high = Math.max(first, second);
  const low = Math.min(first, second);
  if (high === 2 && low === 1) return '21';
  return `${high}${low}`;
};

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
          headline: 'Choose your call',
          body: 'Your roll: {{combination}}. Pick what to announce below, cover the dice, and pass the phone along.',
        },
        hidden: {
          headline: 'Trust or challenge?',
          body: 'Announced: {{announced}}. Believe it and roll onward – or challenge and see the real dice.',
        },
        revealed: {
          headline: 'Revealed!',
          body: 'The real roll was {{combination}} — announced was {{announced}}.',
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
      pickerTitle: 'What do you announce?',
      pickerHintFirst: 'This is the first call of the round — anything goes.',
      pickerHintBeat: 'Must be higher than: {{value}}',
      pickerHintForced: "Your real roll isn't high enough — you have to bluff.",
      maxAnnounced: 'Mäxchen was announced — nothing can beat that. Challenge to see if it is true!',
      verdictHonest: 'Told the truth (or better)! Whoever doubted was wrong and drinks.',
      verdictBluff: 'Busted bluffing! The announcer drinks.',
      infoTitle: 'Mäxchen!',
      rules:
        'Roll in turn while keeping the result to yourself. Pick an announcement from the list below the dice, cover the dice, and pass the phone on. Your announcement must beat the one you were told – either because you rolled higher or by bluffing.\n\nDice results are read as two-digit numbers with the higher digit first. Doubles beat normal numbers. The highest result is Mäxchen (2 and 1). If you challenge and the announcer lied, they drink; if they told the truth (or better), you drink instead.',
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
        headline: 'Ansage wählen',
        body: 'Dein Wurf: {{combination}}. Wähle unten deine Ansage, verdecke die Würfel und gib das Handy weiter.',
      },
      hidden: {
        headline: 'Glauben oder zweifeln?',
        body: 'Angesagt: {{announced}}. Glaubst du es, würfle weiter – oder zweifle an und deck die echten Würfel auf.',
      },
      revealed: {
        headline: 'Aufgedeckt!',
        body: 'Es wurde tatsächlich {{combination}} gewürfelt — angesagt war {{announced}}.',
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
    pickerTitle: 'Was sagst du an?',
    pickerHintFirst: 'Das ist die erste Ansage der Runde — alles ist erlaubt.',
    pickerHintBeat: 'Muss höher sein als: {{value}}',
    pickerHintForced: 'Dein echter Wurf reicht nicht — du musst bluffen.',
    maxAnnounced: 'Mäxchen wurde angesagt — das kann niemand mehr toppen. Nur noch Anzweifeln möglich!',
    verdictHonest: 'Ehrlich angesagt (oder sogar tiefgestapelt)! Die zweifelnde Person lag falsch und trinkt.',
    verdictBluff: 'Beim Bluffen erwischt! Die ansagende Person trinkt.',
    infoTitle: 'Mäxchen!',
    rules:
      'Würfelt reihum so, dass nur ihr selbst das Ergebnis seht. Wählt aus der Liste unter den Würfeln eure Ansage, verdeckt die Würfel und gebt das Handy weiter. Eure Ansage muss die zuletzt gehörte übertreffen – entweder weil ihr wirklich höher liegt oder indem ihr blufft.\n\nWürfelergebnisse werden immer zur zweistelligen Zahl mit der höheren Ziffer vorne gelesen. Pasche schlagen normale Zahlen. Das höchste Ergebnis ist Mäxchen (2 und 1). Wer anzweifelt und die ansagende Person hat gelogen, die trinkt dann; war die Ansage ehrlich (oder untertrieben), trinkt die zweifelnde Person.',
  };
};

const MaexchenGame = () => {
  const [diceOne, setDiceOne] = useState(1);
  const [diceTwo, setDiceTwo] = useState(1);
  const [phase, setPhase] = useState('ready');
  // Zuletzt angesagter Wert, der ueber "hidden" hinweg sichtbar/gueltig bleibt, bis jemand anzweifelt oder eine neue Runde startet.
  const [announcedCode, setAnnouncedCode] = useState(null);
  // Auswahl der aktuell werfenden Person waehrend "showing", bevor sie bestaetigt wird.
  const [selectedCode, setSelectedCode] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const [tutorialStep, setTutorialStep] = useState(0);
  const { language } = useTranslation();
  const copy = useMemo(() => buildCopy(language), [language]);

  const spin = useMemo(
    () =>
      rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
      }),
    [rotateAnim]
  );

  const announcedIndex = announcedCode ? RANKING_VALUES.indexOf(announcedCode) : null;
  // Erlaubt sind alle Ansagen mit echt kleinerem (= staerkerem) Index als die zuletzt gehoerte.
  const minLegalIndex = 0;
  const maxLegalIndex = announcedIndex === null ? RANKING_VALUES.length - 1 : announcedIndex - 1;
  const noLegalMoveLeft = announcedIndex === 0;

  const rollDice = () => {
    const nextOne = Math.floor(Math.random() * 6) + 1;
    const nextTwo = Math.floor(Math.random() * 6) + 1;
    const rollCode = getCombinationCode(nextOne, nextTwo);
    const rollIndex = RANKING_VALUES.indexOf(rollCode);
    // Vorauswahl: eigener echter Wurf, falls er legal ist - sonst der knapp ausreichende Bluff.
    const defaultCode = rollIndex <= maxLegalIndex ? rollCode : RANKING_VALUES[Math.max(minLegalIndex, maxLegalIndex)];

    setPhase('showing');
    setDiceOne(nextOne);
    setDiceTwo(nextTwo);
    setSelectedCode(defaultCode);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));
  };

  const hideDice = () => {
    setAnnouncedCode(selectedCode);
    setPhase('hidden');
  };

  const revealDice = () => {
    setPhase('revealed');
  };

  const resetRound = () => {
    setPhase('ready');
    setAnnouncedCode(null);
    setSelectedCode(null);
  };

  const getCombinationLabel = useCallback(
    (code) => {
      if (code === '21') {
        return copy.combo.maexchen;
      }
      if (code[0] === code[1]) {
        return copy.combo.pair.replace('{{value}}', code[0]);
      }
      return code;
    },
    [copy]
  );

  const myRollCode = useMemo(() => getCombinationCode(diceOne, diceTwo), [diceOne, diceTwo]);
  const combinationLabel = useMemo(() => getCombinationLabel(myRollCode), [myRollCode, getCombinationLabel]);
  const announcedLabel = useMemo(
    () => (announcedCode ? getCombinationLabel(announcedCode) : ''),
    [announcedCode, getCombinationLabel]
  );

  const wasBluff = useMemo(() => {
    if (!announcedCode) return false;
    const rollIndex = RANKING_VALUES.indexOf(myRollCode);
    // Hoeherer Index = schwaecher: wer schwaecher wirft als angesagt, hat geblufft.
    return rollIndex > announcedIndex;
  }, [announcedCode, announcedIndex, myRollCode]);

  const phaseInfo = useMemo(() => {
    const templates = copy.phases;
    const current = templates[phase] ?? templates.ready;
    const text = current.body
      .replace('{{combination}}', combinationLabel)
      .replace('{{announced}}', announcedLabel);
    return { headline: current.headline, body: text };
  }, [copy, phase, combinationLabel, announcedLabel]);

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
        if (noLegalMoveLeft) {
          return null;
        }
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

  const showDiceFaces = phase === 'showing' || phase === 'revealed';

  const resultText = useMemo(
    () => copy.resultLabel.replace('{{value}}', combinationLabel),
    [copy, combinationLabel]
  );

  const pickerHint = useMemo(() => {
    if (announcedIndex === null) return copy.pickerHintFirst;
    const beatLabel = getCombinationLabel(announcedCode);
    const rollIndex = RANKING_VALUES.indexOf(myRollCode);
    if (rollIndex > maxLegalIndex) return copy.pickerHintForced;
    return copy.pickerHintBeat.replace('{{value}}', beatLabel);
  }, [announcedIndex, announcedCode, myRollCode, maxLegalIndex, copy, getCombinationLabel]);

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={appStyles.textHeader1}>{copy.title}</Text>
          <Text style={styles.subHeadline}>{copy.tagline}</Text>
        </View>

        <View style={styles.phaseCard}>
          <Text style={styles.phaseHeadline}>{phaseInfo.headline}</Text>
          <Text style={styles.phaseBody}>{phaseInfo.body}</Text>
          {phase === 'hidden' && noLegalMoveLeft ? (
            <Text style={styles.warningText}>{copy.maxAnnounced}</Text>
          ) : null}
          {phase === 'revealed' ? (
            <Text style={styles.verdictText}>{wasBluff ? copy.verdictBluff : copy.verdictHonest}</Text>
          ) : null}
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

        <View style={styles.resultArea}>
          {(phase === 'showing' || phase === 'revealed') ? (
            <Text style={styles.resultLabel}>{resultText}</Text>
          ) : null}
        </View>

        {phase === 'showing' ? (
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>{copy.pickerTitle}</Text>
            <Text style={styles.pickerHint}>{pickerHint}</Text>
            <View style={styles.pickerGrid}>
              {RANKING_VALUES.map((value, index) => {
                const isLegal = index <= maxLegalIndex;
                const isSelected = value === selectedCode;
                return (
                  <TouchableOpacity
                    key={value}
                    disabled={!isLegal}
                    onPress={() => setSelectedCode(value)}
                    style={[
                      styles.pickerChip,
                      !isLegal && styles.pickerChipDisabled,
                      isSelected && styles.pickerChipSelected,
                    ]}
                  >
                    <Text style={[styles.pickerChipValue, isSelected && styles.pickerChipValueSelected]}>{value}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.buttonColumn}>
          {renderPrimaryButton()}
          {renderSecondaryButton()}
        </View>

        <InfoText header={copy.infoTitle} rules={copy.rules} />
        <InfoHint />
      </ScrollView>
      <TutorialOverlay
        visible={tutorialEnabled}
        steps={[
          { text: language === 'de' ? 'Würfeln, dann unten eine Ansage auswählen.' : 'Roll, then pick an announcement below.', placement: 'top' },
          { text: language === 'de' ? 'Verdecken, weitergeben. Die nächste Person glaubt oder zweifelt an.' : 'Cover, pass on. The next person trusts or challenges.', placement: 'bottom' },
        ]}
        stepIndex={tutorialStep}
        onNext={() => setTutorialStep((s) => (s + 1) % 2)}
        onClose={() => setTutorialEnabled(false)}
      />
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
  warningText: {
    color: '#F08974',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Quicksand_300Bold',
    marginTop: 4,
  },
  verdictText: {
    color: '#E5C185',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Quicksand_300Bold',
    marginTop: 4,
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
  resultArea: { minHeight: 22, justifyContent: 'center', alignItems: 'center' },
  resultLabel: {
    color: '#E5C185',
    fontSize: 20,
    fontFamily: 'Quicksand_300Bold',
    textAlign: 'center',
  },
  pickerCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 10,
  },
  pickerTitle: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 16,
  },
  pickerHint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'Quicksand_300Light',
    fontSize: 12,
    marginBottom: 4,
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  pickerChip: {
    minWidth: 46,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pickerChipDisabled: {
    opacity: 0.25,
  },
  pickerChipSelected: {
    backgroundColor: '#E5C185',
    borderColor: '#E5C185',
  },
  pickerChipValue: {
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 14,
  },
  pickerChipValueSelected: {
    color: '#231C18',
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
});

export default MaexchenGame;
