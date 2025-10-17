import React, { useState, useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';

import { replaceHashtagsWithoutDuplicates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';
import { useTranslation } from '../i18n';

const ManyQuestionsGame = ({ route }) => {
  const [manyQuestions] = useState(route.params.manyQuestionsData);
  const [gameEnded, setGameEnded] = useState(false);

  const { infoVisible, setInfoVisible, language } = useContext(VariablesContext);
  const { t } = useTranslation();
  const copy = useMemo(() => t('manyQuestions'), [t]);

  const [questionIndex, setQuestionIndex] = useState(0);

  const currentQuestion =
    manyQuestions && manyQuestions.length > 0 ? manyQuestions[questionIndex] : null;

  const questionText = currentQuestion
    ? replaceHashtagsWithoutDuplicates(
        language === 'en' && currentQuestion.content_en
          ? currentQuestion.content_en
          : currentQuestion.content
      )
    : '';

  const showNextQuestion = () => {
    if (!manyQuestions || manyQuestions.length === 0) {
      return;
    }

    if (questionIndex < manyQuestions.length - 1) {
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
          <View style={{ height: '90%' }}>
            <View style={{ width: '100%', height: '15%', justifyContent: 'center', alignItems: 'center' }} />
            <View style={{ width: '100%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
              <Question question={questionText} />
            </View>
          </View>
          <TouchableOpacity onPress={showNextQuestion} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>{copy.next}</Text>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={manyQuestions} textsIndex={questionIndex} table={'game_klassiker_questions'} />

        <InfoText header={'1000 Questions!'} rules={copy.rules} />
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
});

export default ManyQuestionsGame;

