import React, { useMemo, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { appStyles } from '../../styles';
import { Animated, Easing } from 'react-native';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';
import { neverHaveIEverStatements } from '../data/neverHaveIEverStatements';
import { shuffleArrayFisherYates } from './sublements/AdjustParamShape';

const NeverHaveIEverGame = () => {
  const { infoVisible, setInfoVisible, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { t, language } = useTranslation();

  const copy = useMemo(() => t('neverHaveIEver'), [t]);

  const [deck, setDeck] = useState(() => shuffleArrayFisherYates([...neverHaveIEverStatements]));
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const revealAnim = React.useRef(new Animated.Value(0)).current;
  const [contentVisible, setContentVisible] = useState(false);

  const currentCard = finished ? null : deck[index] ?? null;
  const statementText = currentCard ? (language === 'en' ? currentCard.content_en : currentCard.content) : '';

  React.useEffect(() => {
    if (finished) {
      setContentVisible(false);
      return;
    }
    setContentVisible(false);
    revealAnim.setValue(0);
    Animated.timing(revealAnim, { toValue: 1, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }).start(() => setContentVisible(true));
  }, [index, finished, revealAnim]);

  const advance = () => {
    if (finished) {
      setDeck(shuffleArrayFisherYates([...neverHaveIEverStatements]));
      setIndex(0);
      setFinished(false);
      return;
    }

    if (index < deck.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    setFinished(true);
  };

  const buttonLabel = finished ? copy.restart : (language === 'de' ? 'Nächste Karte' : 'Next card');

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
            <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
          </TouchableOpacity>
          {finished ? (
            <View style={styles.finishedCard}>
              <Text style={styles.finishedText}>{copy.end}</Text>
            </View>
          ) : (
            <View style={styles.statementWrapper}>
              <Animated.View style={[styles.cardBox, { opacity: revealAnim, transform: [{ scale: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }]}>
                {contentVisible ? (
                  <Text style={styles.statementText}>{statementText}</Text>
                ) : null}
              </Animated.View>
            </View>
          )}

          <TouchableOpacity onPress={advance} style={[appStyles.gameActionButton, { marginTop: 16 }]}>
            <Text style={appStyles.gameActionButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>

        <InfoText header={copy.infoTitle} rules={copy.info} />
        {/** Regeln-Button entfernt (Tutorials ersetzen ihn) */}
        <InfoHint />
        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Hier steht die aktuelle Aussage. Lest sie laut vor.' : 'This is the current statement. Read it aloud.', placement: 'top' },
            { text: language === 'de' ? 'Tippe hier für die nächste Karte.' : 'Tap here for the next card.', placement: 'bottom' },
            { text: language === 'de' ? 'Viel Spaß und eskaliert nicht zu doll.' : 'Have fun — and don’t overdo it.', placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s) => Math.min(2, s + 1))}
          onClose={() => setTutorialEnabled(false)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  statementWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  statementText: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
  },
  cardBox: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    maxWidth: 720,
  },
  finishedCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  finishedText: {
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 34,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
  },
});

export default NeverHaveIEverGame;




