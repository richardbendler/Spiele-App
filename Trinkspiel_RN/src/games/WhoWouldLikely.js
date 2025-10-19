import React, { useMemo, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';
import { whoWouldMostLikelyQuestions } from '../data/whoWouldMostLikelyQuestions';
import { shuffleArrayFisherYates } from './sublements/AdjustParamShape';

const WhoWouldLikelyGame = () => {
  const { infoVisible, setInfoVisible, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const [tutorialStep, setTutorialStep] = useState(0);
  const { t, language } = useTranslation();

  const copy = useMemo(() => t('whoWould'), [t]);

  const [deck, setDeck] = useState(() => shuffleArrayFisherYates([...whoWouldMostLikelyQuestions]));
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentCard = finished ? null : deck[index] ?? null;
  const questionText = currentCard ? (language === 'en' ? currentCard.content_en : currentCard.content) : '';

  const advance = () => {
    if (finished) {
      setDeck(shuffleArrayFisherYates([...whoWouldMostLikelyQuestions]));
      setIndex(0);
      setFinished(false);
      return;
    }
    if (index < deck.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const buttonLabel = finished ? copy.restart : (language === 'de' ? 'Nächste Karte' : 'Next card');

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          {finished ? (
            <View style={styles.finishedCard}>
              <Text style={styles.finishedText}>{copy.end}</Text>
            </View>
          ) : (
            <View style={styles.questionWrapper}>
              <Text style={styles.questionText}>{questionText}</Text>
            </View>
          )}
          <TouchableOpacity onPress={advance} style={[appStyles.gameActionButton, { marginTop: 16 }]}>
            <Text style={appStyles.gameActionButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>

          <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.gameActionButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>

        <InfoText header={copy.infoTitle} rules={copy.info} />
        <InfoHint />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20, opacity: 0.7 }]}>
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
        </TouchableOpacity>
        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Hier steht die aktuelle Aussage. Laut vorlesen, dann gemeinsam zeigen.' : 'This is the current prompt. Read it aloud, then point.' , placement: 'top' },
            { text: language === 'de' ? 'Tippe hier für die nächste Karte.' : 'Tap here for the next card.', placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s) => (s + 1) % 2)}
          onClose={() => setTutorialEnabled(false)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  questionWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  questionText: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
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

export default WhoWouldLikelyGame;





