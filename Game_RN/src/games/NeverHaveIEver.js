import React, { useMemo, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet ,Animated, Easing } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';
import { askForRatingIfEligible } from '../utils/rating';
import { orderBySeenPriority, markContentSeen } from '../utils/contentMemory';

// Eigener Namespace, da derselbe never-have-i-ever-Pool auch innerhalb des allgemeinen
// "The One"-Shuffles auftaucht (siehe contentMemory.js).
const NAMESPACE = 'theOne:never-have-i-ever';
const getPromptId = (entry) => entry?.content;

const NeverHaveIEverGame = () => {
  const { tutorialEnabled, setTutorialEnabled, neverHaveIEverPrompts } = useContext(VariablesContext);
  const { t, language } = useTranslation();

  const copy = useMemo(() => t('neverHaveIEver'), [t]);

  const deckSource = useMemo(() => (Array.isArray(neverHaveIEverPrompts) ? neverHaveIEverPrompts : []), [neverHaveIEverPrompts]);
  const [deck, setDeck] = useState(() => orderBySeenPriority(NAMESPACE, deckSource, getPromptId));
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const revealAnim = React.useRef(new Animated.Value(0)).current;
  const [contentVisible, setContentVisible] = useState(false);

  React.useEffect(() => {
    setDeck(orderBySeenPriority(NAMESPACE, deckSource, getPromptId));
    setIndex(0);
    setFinished(deckSource.length === 0);
  }, [deckSource]);

  const currentCard = finished ? null : deck[index] ?? null;
  const statementText = currentCard ? (language === 'en' ? currentCard.content_en : currentCard.content) : '';

  React.useEffect(() => {
    const id = getPromptId(currentCard);
    if (id) {
      markContentSeen(NAMESPACE, [id]);
    }
  }, [currentCard]);

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
      setDeck(orderBySeenPriority(NAMESPACE, deckSource, getPromptId));
      setIndex(0);
      setFinished(deckSource.length === 0);
      return;
    }

    if (index < deck.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    setFinished(true);
    // Nach Spielende ggf. Bewertungs-Popup anzeigen
    askForRatingIfEligible(language);
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
            { text: language === 'de' ? 'Viel Spaß und eskaliert nicht zu doll.' : 'Have fun — and do not overdo it.', placement: 'bottom' },
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
    backgroundColor: 'transparent',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    includeFontPadding: false,
  },
  cardBox: {
    width: '100%',
    maxWidth: 720,
    alignItems: 'center',
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
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
});

export default NeverHaveIEverGame;
