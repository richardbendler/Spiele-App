// Import necessary React and React Native modules
import React, { useState, useContext, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, Dimensions, PanResponder, ImageBackground } from 'react-native';
import { VariablesContext } from '../../VariablesContext';
import Question from './sublements/Question';
import { deleteHashtags, replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import InfoText from './sublements/InfoText';
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { appStyles } from '../../styles';
import HandleFeedback from './sublements/HandleFeedBack';
import { useTranslation } from '../i18n';

// Main component for the Spin the Bottle game
const SpinTheBottle = ({ route }) => {
  const textsWahrheitSpinTheBottle = useMemo(
    () => shuffleArrayFisherYates(route.params.textsWahrheitSpinTheBottle),
    [route.params.textsWahrheitSpinTheBottle]
  );
  const textsPflichtSpinTheBottle = useMemo(
    () => shuffleArrayFisherYates(route.params.textsPflichtSpinTheBottle),
    [route.params.textsPflichtSpinTheBottle]
  );

  const [randomSelection, setRandomSelection] = useState(0); // Entscheidung ob Schlucke, Wahrheit oder Pflicht
  const [rndIndex, setRndIndex] = useState(0); // Index fuer die zufaellig gewaehlte Aussage aus einem der Pools
  const [outcome, setOutcome] = useState({ type: 'initial' });

  const { infoVisible, setInfoVisible, language, tutorialEnabled, setTutorialEnabled, theOneSettings } = useContext(VariablesContext);
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
        const entry = textsWahrheitSpinTheBottle[outcome.index];
        if (!entry) {
          return copy.truthLabel ?? '';
        }
        const textValue =
          language === 'en' && entry.content_en ? entry.content_en : entry.content;
        return `${copy.truthLabel ?? ""} ${textValue}`.trim();
      }
      case 'dare': {
        const entry = textsPflichtSpinTheBottle[outcome.index];
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
  }, [outcome, copy, language, textsPflichtSpinTheBottle, textsWahrheitSpinTheBottle]);

  const questionText = useMemo(() => deleteHashtags(displayedText || ''), [displayedText]);
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

          // Auswahl zwischen Schlucke (0), Wahrheit (1), Pflicht (2) basierend auf "Touchy"-Level (re-uses familiarity)
          const touchy = Math.max(0, Math.min(9, Number(theOneSettings?.familiarity ?? 5)));
          const pDare = 0.2 + 0.06 * touchy; // 0.2 .. 0.74
          const pTruth = 0.5 - 0.03 * touchy; // 0.5 .. 0.23
          const pSips = Math.max(0.06, 1 - pDare - pTruth); // remainder, keep >= 0.06
          const r = Math.random();
          const randomSelection = r < pSips ? 0 : r < pSips + pTruth ? 1 : 2;
          setRandomSelection(randomSelection);

          switch (randomSelection) {
            case 0: {  // Schlucke! Option
              const sips = generateRandomSips();
              setOutcome({ type: 'sips', count: sips });
              break;
            }
            case 1: {  // Wahrheit! Option
              const truthIndex = Math.floor(Math.random() * textsWahrheitSpinTheBottle.length);
              setRndIndex(truthIndex);
              setOutcome({ type: 'truth', index: truthIndex });
              break;
            }
            case 2: {  // Pflicht! Option
              const dareIndex = Math.floor(Math.random() * textsPflichtSpinTheBottle.length);
              setRndIndex(dareIndex);
              setOutcome({ type: 'dare', index: dareIndex });
              break;
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
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>

        <View style={{flex: 1, height:'100%'}}>
          <View style={{height: '20%', justifyContent: 'center', alignItems: 'center',}}></View>

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
        {randomSelection==0?
          <></>
          :
            randomSelection==1?
              <HandleFeedback texts={textsWahrheitSpinTheBottle} textsIndex={rndIndex} table={'game_klassiker_questions'}/>
            :
            <HandleFeedback texts={textsPflichtSpinTheBottle} textsIndex={rndIndex} table={'game_klassiker_questions'}/>
          }
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

    </ImageBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sipsTextDisplay: {
    fontSize: 30,
    position: 'absolute',
    top: height * 0.1,
    color: '#333',
    fontWeight: 'bold',
    color: 'white',
  },
  bottle: {
    width: 110,
    height: 250,
  },
  hintText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    color: 'white',
  }
});

export default SpinTheBottle;




