import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Animated, Easing, StyleSheet } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

import { buildTheOneDeck } from './sublements/theOneDeckBuilder';
import HandleFeedback from './sublements/HandleFeedBack';
import PromptRenderer from './sublements/PromptRenderer';

const buildDisplayText = (entry, language, startingPlayer) => {
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
        const starter = startingPlayer ? `Starting: ${startingPlayer}. ` : '';
        return starter + 'Go around naming ' + topic + '. Whoever hesitates, repeats, or draws a blank drinks.';
      }
      const starter = startingPlayer ? `Startet: ${startingPlayer}. ` : '';
      return starter + 'Zaehlt der Reihe nach ' + topic + ' auf. Wer nicht weiter weiss, wiederholt oder stolpert, muss trinken.';
    }
    case 6: {
      if (language === 'en') {
        const starter = startingPlayer ? `Starting: ${startingPlayer}. ` : '';
        return starter + baseText;
      }
      const starter = startingPlayer ? `Startet: ${startingPlayer}. ` : '';
      return starter + baseText;
    }
    default:
      return baseText;
  }
};

const PicoloGame = ({ route }) => {
  const { t, language } = useTranslation();
  const { infoVisible, setInfoVisible, players, theOneSettings, theOnePrompts, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const [tutorialStep, setTutorialStep] = useState(0);
  const copy = useMemo(() => t('picoloGame'), [t]);

  const rawPrompts = useMemo(() => {
    const routeData = route.params?.theOneData;
    if (Array.isArray(routeData) && routeData.length > 0) {
      return [...routeData];
    }
    return Array.isArray(theOnePrompts) ? [...theOnePrompts] : [];
  }, [route.params?.theOneData, theOnePrompts]);
  const wheelPools = useMemo(() => {
    const map = new Map();
    rawPrompts.forEach((entry) => {
      const poolKey = entry?.pool?.key;
      if (poolKey && !map.has(poolKey) && entry?.pool) {
        map.set(poolKey, entry.pool);
      }
    });
    return Array.from(map.values());
  }, [rawPrompts]);
  const questions = useMemo(
    () => buildTheOneDeck(rawPrompts, theOneSettings, { players }),
    [rawPrompts, theOneSettings, players]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const revealAnim = useRef(new Animated.Value(0)).current;
  const [contentVisible, setContentVisible] = useState(false);

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
  // Determine a random starting player for round-robin style prompts (Category/Rhyme)
  const startingPlayerName = useMemo(() => {
    if (!currentQuestion || !Array.isArray(players) || players.length === 0) return null;
    const poolId = currentQuestion?.pool?.id;
    if (poolId !== 5 && poolId !== 6) return null;
    const idx = Math.floor(Math.random() * players.length);
    const candidate = players[idx];
    return candidate && typeof candidate.name === 'string' && candidate.name.trim().length > 0
      ? candidate.name
      : null;
  }, [currentIndex, players, currentQuestion?.pool?.id]);

  const cardText = currentQuestion ? buildDisplayText(currentQuestion, language, startingPlayerName) : '';
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

  const requireDrinkingPlayers = Boolean(currentQuestion?.metadata?.drinkInvolved);

  const nextButtonLabel = (copy?.nextButton ? (language==='de' ? copy.nextButton : copy.nextButton) : (language==='de' ? 'Nächste Karte' : 'Next card'));
  const infoText = copy?.rules ?? t('theOne.info');
  const noPromptMessage = t('theOne.noEligiblePrompt');
  const revealHint = copy?.revealHint ?? t('theOne.revealHint');

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={[appStyles.completeScreenGameContainer, { backgroundColor }]}>
        <View style={appStyles.gameContainer}>
          <View style={styles.screenStack}>
            <View style={styles.wheelSection}>
              <View style={styles.wheelArea}>
                <CategoryWheel
                  pools={wheelPools}
                  currentPoolKey={currentQuestion?.pool?.key}
                  language={language}
                />
              </View>
              <Text style={styles.categoryLabel}>{categoryLabel}</Text>
            </View>
            <View style={styles.cardSection}>
              {hasQuestions ? (
                contentVisible ? (
                  <PromptRenderer
                    prompt={currentQuestion}
                    language={language}
                    players={players}
                    settings={theOneSettings}
                    defaultText={cardText}
                    requireDrinkingPlayers={requireDrinkingPlayers}
                  />
                ) : (
                  <Text style={styles.revealHint}>{revealHint}</Text>
                )
              ) : (
                <Text style={styles.revealHint}>{noPromptMessage}</Text>
              )}
            </View>
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

        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>
        <InfoText header={copy?.infoTitle ?? 'The One!'} rules={infoText} />
        <InfoHint />
        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            {
              text:
                language === 'de'
                  ? 'Bestimmt eine Moderation: Diese Person behält das Handy, liest vor und tippt weiter.'
                  : 'Choose a moderator: They keep the phone, read aloud, and tap next.',
              placement: 'top',
            },
            {
              text:
                language === 'de'
                  ? 'Tippt unten auf „Nächste Karte“, um die nächste Aufgabe zu zeigen.'
                  : 'Tap Next card to reveal the next prompt.',
              placement: 'bottom',
            },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s) => Math.min(1, s + 1))}
          onClose={() => setTutorialEnabled(false)}
        />
      </View>
    </ImageBackground>
  );
};


const WHEEL_SIZE = 320;

const CategoryWheel = ({ pools, currentPoolKey, language }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const poolList = Array.isArray(pools) && pools.length > 0 ? pools : [];
  const segmentAngle = poolList.length > 0 ? 360 / poolList.length : 360;

  useEffect(() => {
    if (!poolList.length) {
      return;
    }
    const rawIndex = poolList.findIndex((entry) => entry?.key === currentPoolKey);
    const index = rawIndex >= 0 ? rawIndex : 0;
    const baseAngle = index * segmentAngle + segmentAngle / 2;
    const extraSpins = 2 + ((index + poolList.length) % 3);
    const nextRotation = -(baseAngle + extraSpins * 360);
    Animated.timing(rotation, {
      toValue: nextRotation,
      duration: 900 + extraSpins * 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [poolList, currentPoolKey, rotation, segmentAngle]);

  if (poolList.length === 0) {
    return (
      <View style={styles.wheelFallback}>
        <Text style={styles.categoryLabel}>{language === 'de' ? 'Wird geladen...' : 'Loading...'}</Text>
      </View>
    );
  }

  const animatedRotation = rotation.interpolate({
    inputRange: [-7200, 7200],
    outputRange: ['-7200deg', '7200deg'],
  });

  const segmentNodes = poolList.map((pool, index) => {
    const color = pool?.color || `hsla(${(index / poolList.length) * 360},65%,45%,0.85)`;
    const rotationDeg = index * segmentAngle;
    return (
      <View
        key={`segment-${pool?.key || index}`}
        style={[styles.wheelSegment, { transform: [{ rotate: `${rotationDeg}deg` }] }]}
      >
        <View style={[styles.wheelSlice, { borderTopColor: color }]} />
      </View>
    );
  });

  const labelNodes = poolList.map((pool, index) => {
    const label =
      pool?.label?.[language] || pool?.label?.de || pool?.label?.en || pool?.name || pool?.key || 'Pool';
    const midAngleDeg = index * segmentAngle + segmentAngle / 2;
    const adjustedAngle = midAngleDeg - 90;
    const radians = (adjustedAngle * Math.PI) / 180;
    const radius = WHEEL_SIZE * 0.34;
    const offsetX = Math.cos(radians) * radius;
    const offsetY = Math.sin(radians) * radius;
    const labelFontSize = Math.max(9.5, Math.min(16, 19 - poolList.length * 0.25));

    return (
      <View key={`label-${pool?.key || index}`} style={styles.wheelLabelWrapper} pointerEvents="none">
        <Animated.View
          style={[
            styles.wheelLabelLine,
            {
              transform: [
                { translateX: offsetX },
                { translateY: offsetY },
                { rotate: `${adjustedAngle}deg` },
              ],
            },
          ]}
        >
          <Text style={[styles.wheelLabel, { fontSize: labelFontSize }]} numberOfLines={2} adjustsFontSizeToFit>
            {label}
          </Text>
        </Animated.View>
      </View>
    );
  });

  return (
    <View style={styles.wheelWrapper}>
      <Animated.View style={[styles.wheel, { transform: [{ rotate: animatedRotation }] }]}>
        {segmentNodes}
        <View style={styles.wheelCenter} />
      </Animated.View>
      <Animated.View
        style={[styles.wheelLabelsLayer, { transform: [{ rotate: animatedRotation }] }]}
        pointerEvents="none"
      >
        {labelNodes}
      </Animated.View>
      <View style={styles.wheelPointer}>
        <View style={styles.wheelPointerTip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenStack: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  wheelSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: WHEEL_SIZE + 80,
  },
  cardSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: WHEEL_SIZE + 30,
    marginBottom: 8,
    position: 'relative',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  wheelSegment: {
    position: 'absolute',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  wheelSlice: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: WHEEL_SIZE / 2,
    borderRightWidth: WHEEL_SIZE / 2,
    borderLeftWidth: WHEEL_SIZE / 2,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    opacity: 0.9,
  },
  wheelLabelsLayer: {
    position: 'absolute',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelLabelWrapper: {
    position: 'absolute',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelLabelLine: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelLabel: {
    width: WHEEL_SIZE * 0.44,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Quicksand_300Bold',
    includeFontPadding: false,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wheelCenter: {
    width: WHEEL_SIZE * 0.28,
    height: WHEEL_SIZE * 0.28,
    borderRadius: (WHEEL_SIZE * 0.28) / 2,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  wheelPointer: {
    position: 'absolute',
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  wheelPointerTip: {
    position: 'absolute',
    top: 8,
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  wheelFallback: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealHint: {
    marginTop: 16,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Quicksand_300Light',
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryLabel: {
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
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







