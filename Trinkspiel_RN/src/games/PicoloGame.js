import React, { useState, useContext, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

import { replaceHashtagsWithoutDuplicates } from './sublements/AdjustParamShape';
import { buildTheOneDeck } from './sublements/theOneDeckBuilder';
import HandleFeedback from './sublements/HandleFeedBack';

const buildDisplayText = (entry, language) => {
  if (!entry) {
    return '';
  }

  const baseText = language === 'en' && entry.content_en ? entry.content_en : entry.content;

  switch (entry.pool?.id) {
    case 2:
    case 3:
      return `#! ${baseText}`;
    case 5: {
      const topic = typeof baseText === 'string' ? baseText.replace(/\.+$/, '') : '';
      if (language === 'en') {
        return 'Go around naming ' + topic + '. Whoever hesitates, repeats, or draws a blank drinks.';
      }
      return 'Zaehlt der Reihe nach ' + topic + ' auf. Wer nicht weiter weiss, wiederholt oder stolpert, muss trinken.';
    }
    default:
      return baseText;
  }
};

const PicoloGame = ({ route }) => {
  const { t, language } = useTranslation();
  const { infoVisible, setInfoVisible, players, theOneSettings, theOnePrompts } = useContext(VariablesContext);

  const rawPrompts = useMemo(() => {
    const routeData = route.params?.theOneData;
    if (Array.isArray(routeData) && routeData.length > 0) {
      return [...routeData];
    }
    return Array.isArray(theOnePrompts) ? [...theOnePrompts] : [];
  }, [route.params?.theOneData, theOnePrompts]);

  const questions = useMemo(
    () => buildTheOneDeck(rawPrompts, theOneSettings, { players }),
    [rawPrompts, theOneSettings, players]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [questions]);

  const hasQuestions = questions.length > 0;
  const currentQuestion = hasQuestions ? questions[currentIndex] : null;

  const categoryLabel =
    currentQuestion?.pool?.label?.[language] ?? currentQuestion?.pool?.label?.de ?? '';
  const cardText = currentQuestion ? buildDisplayText(currentQuestion, language) : '';
  const backgroundColor = currentQuestion?.pool?.color ?? '#2F4F4F';

  const showNextQuestion = () => {
    if (!hasQuestions) {
      return;
    }
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next >= questions.length ? 0 : next;
    });
  };

  const displayedText = replaceHashtagsWithoutDuplicates(cardText, {
    requireDrinkingPlayers: Boolean(currentQuestion?.metadata?.drinkInvolved),
  });

  const infoText = t('theOne.info');
  const noPromptMessage = t('theOne.noEligiblePrompt');

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={[appStyles.completeScreenGameContainer, { backgroundColor }]}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity
            onPress={showNextQuestion}
            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={appStyles.textHeader2}>{categoryLabel}</Text>
            <Question question={hasQuestions ? displayedText : noPromptMessage} />
          </TouchableOpacity>
        </View>
        {hasQuestions ? (
          <HandleFeedback texts={questions} textsIndex={currentIndex} table={'game_klassiker_questions'} />
        ) : null}

        <InfoText header={'The One!'} rules={infoText} />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20 }]}>
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default PicoloGame;


