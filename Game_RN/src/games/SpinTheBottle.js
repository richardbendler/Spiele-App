// Import necessary React and React Native modules
import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, Dimensions, PanResponder } from 'react-native';
import { VariablesContext } from '../../VariablesContext';
import Question from './sublements/Question';
import { deleteHashtags, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import InfoText from './sublements/InfoText';
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { appStyles } from '../../styles';
import HandleFeedback from './sublements/HandleFeedBack';
import { useTranslation } from '../i18n';

// 0-9 Reglerwert -> 1-5 Inhalts-Stufe (2 Reglerschritte pro Stufe statt nur 3 grober Buckets).
const intensityCeilingFromSlider = (value) => {
  const clamped = Math.max(0, Math.min(9, Number(value) || 0));
  return Math.min(5, Math.ceil((clamped + 1) / 2));
};

// Main component for the Spin the Bottle game
const SpinTheBottle = ({ route }) => {
  const {
    language,
    tutorialEnabled,
    setTutorialEnabled,
    theOneSettings,
    setTheOneSettings,
    spinTheBottleTruths,
    spinTheBottleDares,
  } = useContext(VariablesContext);

  const truthPool = useMemo(() => {
    if (Array.isArray(spinTheBottleTruths) && spinTheBottleTruths.length > 0) {
      return spinTheBottleTruths;
    }
    if (Array.isArray(route.params?.textsWahrheitSpinTheBottle)) {
      return route.params.textsWahrheitSpinTheBottle;
    }
    return [];
  }, [spinTheBottleTruths, route.params?.textsWahrheitSpinTheBottle]);

  const darePool = useMemo(() => {
    if (Array.isArray(spinTheBottleDares) && spinTheBottleDares.length > 0) {
      return spinTheBottleDares;
    }
    if (Array.isArray(route.params?.textsPflichtSpinTheBottle)) {
      return route.params.textsPflichtSpinTheBottle;
    }
    return [];
  }, [spinTheBottleDares, route.params?.textsPflichtSpinTheBottle]);

  const textsWahrheitSpinTheBottle = useMemo(
    () => shuffleArrayFisherYates(truthPool),
    [truthPool]
  );
  const textsPflichtSpinTheBottle = useMemo(
    () => shuffleArrayFisherYates(darePool),
    [darePool]
  );

  const [randomSelection, setRandomSelection] = useState('initial'); // Entscheidung ob Schlucke, Wahrheit oder Pflicht
  const [outcome, setOutcome] = useState({ type: 'initial' });
  // Praeziser (fraktionaler) Fortschritt fuer die Gating-Berechnung dieser Session. Die geteilte
  // Einstellung (theOneSettings.currentDrunkenness) wird nur gerundet zurückgeschrieben, da andere
  // Screens (z.B. PreGameSettings) den Wert als Array-Index fuer die Skalen-Beschriftung nutzen.
  const [drunkProgress, setDrunkProgress] = useState(() => {
    const start = Number(theOneSettings?.currentDrunkenness);
    return Number.isFinite(start) ? Math.max(0, Math.min(9, start)) : 4;
  });
  // PanResponder wird per useRef nur einmal erzeugt - sein Callback wuerde sonst den
  // drunkProgress-Wert vom allerersten Render einfrieren (Stale Closure). Ref immer aktuell halten.
  const drunkProgressRef = useRef(drunkProgress);
  useEffect(() => {
    drunkProgressRef.current = drunkProgress;
  }, [drunkProgress]);
  const [tutorialStep, setTutorialStep] = useState(0);
  const { t } = useTranslation();
  const copy = useMemo(() => {
    const value = t('spinTheBottleGame');
    return typeof value === 'object' && value !== null ? value : {};
  }, [t]);

  const displayedText = useMemo(() => {
    switch (outcome.type) {
      case 'initial':
        return copy.initialPrompt ?? '';
      case 'spinning':
        return '';
      case 'sips':
        return `${outcome.count} ${copy.sipsLabel ?? ""}`.trim();
      case 'truth': {
        const entry = outcome.entry;
        if (!entry) {
          return copy.truthLabel ?? '';
        }
        const textValue =
          language === 'en' && entry.content_en ? entry.content_en : entry.content;
        return `${copy.truthLabel ?? ""} ${textValue}`.trim();
      }
      case 'dare': {
        const entry = outcome.entry;
        if (!entry) {
          return copy.dareLabel ?? '';
        }
        const textValue =
          language === 'en' && entry.content_en ? entry.content_en : entry.content;
        return `${copy.dareLabel ?? ""} ${textValue}`.trim();
      }
      default:
        return '';
    }
  }, [outcome, copy, language]);

  const questionText = useMemo(() => deleteHashtags(displayedText || ''), [displayedText]);

  const drunkennessScale = useMemo(() => {
    const value = t('scales.drunkenness');
    return Array.isArray(value) ? value : [];
  }, [t]);
  const progressLabel = useMemo(() => {
    const current = Math.round(Math.max(0, Math.min(9, Number(theOneSettings?.currentDrunkenness) || 0)));
    const desired = Math.round(Math.max(0, Math.min(9, Number(theOneSettings?.desiredDrunkenness) || 0)));
    const currentLabel = drunkennessScale[current] ?? `${current}/9`;
    if (current >= desired) {
      return language === 'de' ? `Stimmung: ${currentLabel} (Ziel erreicht)` : `Mood: ${currentLabel} (goal reached)`;
    }
    const desiredLabel = drunkennessScale[desired] ?? `${desired}/9`;
    return language === 'de' ? `Stimmung: ${currentLabel} · Ziel: ${desiredLabel}` : `Mood: ${currentLabel} · Goal: ${desiredLabel}`;
  }, [theOneSettings?.currentDrunkenness, theOneSettings?.desiredDrunkenness, drunkennessScale, language]);
  // Ref variable for the rotation value of the bottle, initialized with 0
  const rotationValue = useRef(new Animated.Value(0)).current;
  // Ref variable for the last rotation position, initialized with 0
  const lastRotation = useRef(0);

  // Function to generate a random number of sips (between 1 and 5)
  function generateRandomSips() {
    return Math.floor(Math.random() * 5) + 1;
  }

  // Creating a PanResponder object to handle touch inputs
  const panResponder = useRef(
    PanResponder.create({
      // Function that determines whether this PanResponder should start responding to touch starts
      onStartShouldSetPanResponder: () => true,
      // Function called on touch start
      onPanResponderGrant: () => {
        // Stops any current animation of the bottle
        rotationValue.stopAnimation();
        // Sets the rotation offset to the current value of lastRotation
        rotationValue.setOffset(lastRotation.current);
        // Sets the rotation value to 0
        rotationValue.setValue(0);
      },
      // Function called on touch move (not used but could be useful for future enhancements)
      onPanResponderMove: Animated.event([null, { dx: rotationValue }], { useNativeDriver: false }),
      // Funktion, die bei Freigabe der Beruehrung aufgerufen wird
      onPanResponderRelease: (e, { vx }) => {
        // Beenden der aktuellen Animation und Festlegen des Offsets
        rotationValue.stopAnimation((currentValue) => {
          lastRotation.current = currentValue;
        });
        rotationValue.setOffset(lastRotation.current);
        rotationValue.setValue(0);
      
        setOutcome({ type: 'spinning' });

        // Starten der neuen Animation mit einem zufaelligen Endwert
        Animated.timing(rotationValue, {
          toValue: Math.random() * 360 * 30,  // Zufaelliger Endwert fuer die Animation, multipliziert mit 5
          duration: Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000,  // Zufaellige Dauer zwischen 3 und 5 Sekunden
          useNativeDriver: false,
        }).start(() => {

          // Nach Abschluss der Animation: Aktualisieren von lastRotation und Zuruecksetzen des Offsets und Werts
          lastRotation.current += rotationValue._value;
          rotationValue.setOffset(lastRotation.current);
          rotationValue.setValue(0);

          // Inhalts-Obergrenze: eine Frage/Aufgabe wird nur angeboten, wenn sie SOWOHL zum
          // "Touchy"-Regler ALS AUCH zum aktuellen Betrunkenheits-Fortschritt der Gruppe passt.
          const currentDrunkenness = drunkProgressRef.current;
          const desiredDrunkenness = Math.max(0, Math.min(9, Number(theOneSettings?.desiredDrunkenness ?? 6)));
          const touchy = Math.max(0, Math.min(9, Number(theOneSettings?.familiarity ?? 5)));

          const contentCeiling = Math.min(
            intensityCeilingFromSlider(touchy),
            intensityCeilingFromSlider(currentDrunkenness)
          );
          const eligibleTruths = textsWahrheitSpinTheBottle.filter((e) => (e.intensity ?? 1) <= contentCeiling);
          const eligibleDares = textsPflichtSpinTheBottle.filter((e) => (e.intensity ?? 1) <= contentCeiling);

          // Schlucke-Anteil richtet sich danach, wie weit die Gruppe noch vom Wunschziel entfernt
          // ist: grosse Luecke -> viele Schlucke, um aufzuholen. Ziel erreicht/ueberschritten ->
          // kaum noch Schlucke, dafuer wieder "normalere" Wahrheit/Pflicht-Fragen.
          const gapRatio = Math.max(0, Math.min(1, (desiredDrunkenness - currentDrunkenness) / 9));
          const pSips = 0.15 + 0.55 * gapRatio; // 0.15 (Ziel erreicht) .. 0.70 (max. Luecke)
          const remaining = 1 - pSips;
          const pDareShare = Math.min(0.75, 0.35 + 0.03 * touchy);
          const pDare = remaining * pDareShare;
          const pTruth = Math.max(0.02, remaining - pDare);

          const weightedOptions = [
            { type: 'sips', weight: pSips },
            ...(eligibleTruths.length > 0 ? [{ type: 'truth', weight: Math.max(0.02, pTruth) }] : []),
            ...(eligibleDares.length > 0 ? [{ type: 'dare', weight: Math.max(0.02, pDare) }] : []),
          ];

          const totalWeight = weightedOptions.reduce((sum, entry) => sum + entry.weight, 0);
          let roll = Math.random() * (totalWeight || 1);
          let selected = weightedOptions[0]?.type || 'sips';
          for (const entry of weightedOptions) {
            if (roll <= entry.weight) {
              selected = entry.type;
              break;
            }
            roll -= entry.weight;
          }

          setRandomSelection(selected);

          switch (selected) {
            case 'sips': {  // Schlucke! Option
              const sips = generateRandomSips();
              setOutcome({ type: 'sips', count: sips });
              // Betrunkenheits-Fortschritt der Gruppe steigt mit jedem verteilten Schluck.
              // Praezise lokal fortschreiben, aber nur gerundet in die geteilte Einstellung
              // zurückschreiben (siehe Kommentar bei drunkProgress).
              const nextProgress = Math.max(0, Math.min(9, drunkProgressRef.current + sips * 0.15));
              drunkProgressRef.current = nextProgress;
              setDrunkProgress(nextProgress);
              setTheOneSettings((prev) => ({ ...prev, currentDrunkenness: Math.round(nextProgress) }));
              break;
            }
            case 'truth': {  // Wahrheit! Option
              const entry = eligibleTruths[Math.floor(Math.random() * eligibleTruths.length)];
              setOutcome({ type: 'truth', entry });
              break;
            }
            case 'dare': {  // Pflicht! Option
              const entry = eligibleDares[Math.floor(Math.random() * eligibleDares.length)];
              setOutcome({ type: 'dare', entry });
              break;
            }
            default: {
              setOutcome({ type: 'sips', count: generateRandomSips() });
            }
          }
        });
      },
      
      
      

    })
  ).current; // Gets the current value of the ref

  const rotation = rotationValue.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg']
  });

  return (
    <View style={styles.background}>

        <View style={{flex: 1, height:'100%'}}>
          <View style={{height: '20%', justifyContent: 'center', alignItems: 'center',}}>
            <Text style={styles.progressLabel}>{progressLabel}</Text>
          </View>

          <View style={{height: '30%', justifyContent: 'center', alignItems: 'center',}}>
            <Animated.View 
              {...panResponder.panHandlers} 
              style={{ transform: [{ rotate: rotation }] }}
            >
              <Image source={require('../../assets/images/bottles/bottle_003.png')} style={styles.bottle} />
            </Animated.View>
          </View>
          
          <View style={{height: '40%', justifyContent: 'center', alignItems: 'center',}}>
            <Question question={questionText} />
          </View>
        </View>
        <View style={{height: '10%', justifyContent: 'center', alignItems: 'center'}}>
        {(randomSelection === 'truth' || randomSelection === 'dare') && outcome.entry ? (
          <HandleFeedback texts={[outcome.entry]} textsIndex={0} table={'game_klassiker_questions'}/>
        ) : null}
        </View>

        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>
        <InfoText header={copy.infoHeader ?? 'Spin the Bottle!'} rules={copy.rules ?? ''} />
        <InfoHint />
        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Legt das Handy in die Mitte auf den Tisch. Dreht die Flasche mit dem Finger (Tippen reicht auch).' : 'Place the phone in the middle on the table. Spin the bottle with your finger (tapping works too).', placement: 'top' },
            { text: language === 'de' ? 'Auf wen die Flasche zeigt, macht die angezeigte Aufgabe (Schlucke, Wahrheit oder Pflicht).' : 'Whoever it points to does the shown task (sips, truth, or dare).', placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s) => Math.min(1, s + 1))}
          onClose={() => setTutorialEnabled(false)}
        />
        {/* Regelbutton ausgeblendet für Flaschendrehen */}

    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#366350',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sipsTextDisplay: {
    fontSize: 30,
    position: 'absolute',
    top: height * 0.1,
    fontWeight: 'bold',
    color: 'white',
  },
  bottle: {
    width: 110,
    height: 250,
  },
  progressLabel: {
    position: 'absolute',
    top: 56,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Quicksand_300Bold',
  },
  hintText: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  }
});

export default SpinTheBottle;
