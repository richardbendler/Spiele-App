import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Animated, Easing, StyleSheet } from 'react-native';
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
  const copy = useMemo(() => t('picoloGame'), [t]);

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
  const revealAnim = useRef(new Animated.Value(0)).current;
  const [contentVisible, setContentVisible] = useState(false);

  const targetRotation = revealAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const targetScale = revealAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1.05, 1] });
  const targetOpacity = revealAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.2, 0.6, 1] });

  useEffect(() => {
    setCurrentIndex(0);
  }, [questions]);

  const hasQuestions = questions.length > 0;
  const currentQuestion = hasQuestions ? questions[currentIndex] : null;
  useEffect(() => {
    if (!hasQuestions) {
      setContentVisible(false);
      return;
    }
    setContentVisible(false);
    revealAnim.setValue(0);
    Animated.timing(revealAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setContentVisible(true));
  }, [hasQuestions, currentIndex, revealAnim]);


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

  const nextButtonLabel = copy?.nextButton ?? (language === 'de' ? 'Moderator: Naechste Karte' : 'Moderator: Next card');
  const infoText = copy?.rules ?? t('theOne.info');
  const noPromptMessage = t('theOne.noEligiblePrompt');
  const revealHint = copy?.revealHint ?? t('theOne.revealHint');

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={[appStyles.completeScreenGameContainer, { backgroundColor }]}>
        <View style={appStyles.gameContainer}>
          <View
            style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
          >
            <Animated.View
              style={[
                styles.categoryTarget,
                {
                  transform: [{ rotate: targetRotation }, { scale: targetScale }],
                  opacity: targetOpacity,
                },
              ]}
            >
              <Text style={styles.categoryLabel}>{categoryLabel}</Text>
            </Animated.View>
            {hasQuestions ? (
              contentVisible ? (
                <Question question={displayedText} />
              ) : (
                <Text style={styles.revealHint}>{revealHint}</Text>
              )
            ) : (
              <Text style={styles.revealHint}>{noPromptMessage}</Text>
            )}
          </View>
          {hasQuestions ? (
            <TouchableOpacity
              onPress={showNextQuestion}
              style={[appStyles.gameActionButton, { marginTop: 16 }]}
            >
              <Text style={appStyles.gameActionButtonText}>{nextButtonLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {hasQuestions ? (
          <HandleFeedback texts={questions} textsIndex={currentIndex} table={'game_klassiker_questions'} />
        ) : null}

        <InfoText header={copy?.infoTitle ?? 'The One!'} rules={infoText} />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20 }]}>
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  categoryTarget: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryLabel: {
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  revealHint: {
    marginTop: 16,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Quicksand_300Light',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PicoloGame;


