import React, { useState, useContext, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Animated, Easing } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { VariablesContext } from '../../VariablesContext';

import { replaceHashtagsWithoutDuplicates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';
import { useTranslation } from '../i18n';
import { manyQuestionsSampleTexts } from '../data/manyQuestionsTexts';

const ManyQuestionsGame = ({ route }) => {
  const [gameEnded, setGameEnded] = useState(false);

  const { infoVisible, setInfoVisible, language, manyQuestions: manyQuestionsContext, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { t } = useTranslation();
  const copy = useMemo(() => t('manyQuestions'), [t]);
  const navigationData = route.params?.manyQuestionsData;

  const questions = useMemo(() => {
    if (Array.isArray(navigationData) && navigationData.length > 0) {
      return navigationData;
    }
    if (Array.isArray(manyQuestionsContext) && manyQuestionsContext.length > 0) {
      return manyQuestionsContext;
    }
    return manyQuestionsSampleTexts;
  }, [navigationData, manyQuestionsContext]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [tutorialStep, setTutorialStep] = useState(0);
  const revealAnim = React.useRef(new Animated.Value(0)).current;
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    setQuestionIndex(0);
    setGameEnded(false);
  }, [questions]);

  const currentQuestion = questions.length > 0 ? questions[questionIndex] : null;

  const questionText = currentQuestion
    ? replaceHashtagsWithoutDuplicates(
        language === 'en' && currentQuestion.content_en
          ? currentQuestion.content_en
          : currentQuestion.content
      )
    : '';

  const showNextQuestion = () => {
    if (!questions || questions.length === 0) {
      return;
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setGameEnded(true);
    }
  };

  useEffect(() => {
    setContentVisible(false);
    revealAnim.setValue(0);
    Animated.timing(revealAnim, { toValue: 1, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }).start(() => setContentVisible(true));
  }, [questionIndex, revealAnim]);

  if (gameEnded) {
    return (
      <View style={styles.winnerScreen}>
        <View style={{ width: '90%' }}>
          <Text style={styles.winnerText}>{copy.end}</Text>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
            <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
          </TouchableOpacity>
          <View style={styles.questionArea}>
            <Animated.View style={[styles.cardBox, { opacity: revealAnim, transform: [{ scale: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }]}>
              {contentVisible ? (
                <Text style={styles.questionText}>{questionText || copy.end}</Text>
              ) : null}
            </Animated.View>
          </View>
          <TouchableOpacity onPress={showNextQuestion} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>{language === 'de' ? 'NÃ¤chste Karte' : 'Next card'}</Text>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={questions} textsIndex={questionIndex} table={'game_klassiker_questions'} />

        <InfoText header={copy.infoTitle} rules={copy.rules} />
        <InfoHint />
        {/** Regeln-Button entfernt (Tutorials ersetzen ihn) */}
        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Hier steht die Frage. Lest sie laut vor.' : 'This is the question. Read it aloud.', placement: 'top' },
            { text: language === 'de' ? 'Tippe hier fÃ¼r die nÃ¤chste Karte.' : 'Tap here for the next card.', placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s) => Math.min(1, s + 1))}
          onClose={() => setTutorialEnabled(false)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  winnerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAD02E',
    alignContent: 'center',
  },
  winnerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#D84315',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  questionArea: {
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
});

export default ManyQuestionsGame;






