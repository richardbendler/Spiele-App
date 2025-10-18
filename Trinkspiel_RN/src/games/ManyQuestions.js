import React, { useState, useContext, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';

import { replaceHashtagsWithoutDuplicates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';
import { useTranslation } from '../i18n';
import { manyQuestionsSampleTexts } from '../data/manyQuestionsTexts';

const ManyQuestionsGame = ({ route }) => {
  const [gameEnded, setGameEnded] = useState(false);

  const { infoVisible, setInfoVisible, language, manyQuestions: manyQuestionsContext } = useContext(VariablesContext);
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
          <View style={styles.questionArea}>
            <Text style={styles.questionText}>{questionText || copy.end}</Text>
          </View>
          <TouchableOpacity onPress={showNextQuestion} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>{copy.next}</Text>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={questions} textsIndex={questionIndex} table={'game_klassiker_questions'} />

        <InfoText header={copy.infoTitle} rules={copy.rules} />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20 }]}>
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
        </TouchableOpacity>
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
});

export default ManyQuestionsGame;

