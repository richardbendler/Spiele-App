import React, { useContext, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Easing } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';
import { secretMissions } from '../data/secretMissions';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const SecretMission = () => {
  const { setInfoVisible, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { t, language } = useTranslation();
  const copy = useMemo(() => t('secretMission') || {}, [t]);

  const [deck, setDeck] = useState(() => shuffle([...secretMissions]));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const flip = useRef(new Animated.Value(0)).current; // 0 = front, 1 = back
  const spin = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const spinBack = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flip.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = flip.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  const frontPulse = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (!revealed) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(frontPulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(frontPulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [revealed, frontPulse]);
  const pulseScale = frontPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  const mission = finished ? null : deck[index] ?? null;
  const missionText = mission ? (language === 'en' ? mission.en : mission.de) : '';
  const [tutorialStep, setTutorialStep] = useState(0);

  const labels = useMemo(() => {
    return {
      title: language === 'de' ? 'Geheime Mission' : 'Secret Mission',
      reveal: copy.reveal || (language === 'de' ? 'Aufdecken' : 'Reveal'),
      hide: copy.hide || (language === 'de' ? 'Verstecken' : 'Hide'),
      next: copy.next || (language === 'de' ? 'Nächste Mission' : 'Next mission'),
      end: copy.end || (language === 'de' ? 'Ihr habt alle Missionen gesehen!' : 'You reached the end!'),
      infoHeader: copy.infoTitle || (language === 'de' ? 'Geheime Mission' : 'Secret Mission'),
      info:
        copy.info ||
        (language === 'de'
          ? 'Nimm reihum das Handy und decke nur auf, wenn du dran bist. Merke dir deine Mission und verdecke sie wieder, damit die Nächste Person ihre eigene Mission ziehen kann.'
          : 'Take turns with the phone. Reveal only when it is your turn. Remember your mission and hide it again so the next person can draw theirs.'),
    };
  }, [copy, language]);

  const animateTo = (value) => Animated.timing(flip, { toValue: value, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start();

  const onReveal = () => {
    setRevealed(true);
    animateTo(1);
  };

  const onHide = () => {
    // Hide and immediately advance to next hidden mission for the next player
    setRevealed(false);
    animateTo(0);
    setTimeout(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= deck.length) {
          setFinished(true);
          return i; // stay, end will show on front
        }
        return next;
      });
    }, 160);
  };

  const onNextHidden = () => {
    if (finished) {
      const reshuffled = shuffle([...secretMissions]);
      setDeck(reshuffled);
      setIndex(0);
      setFinished(false);
      setRevealed(false);
      animateTo(0);
      return;
    }
    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      setFinished(true);
      setRevealed(false);
      animateTo(0);
      return;
    }
    setIndex(nextIndex);
    setRevealed(false);
    animateTo(0);
  };

  const isHidden = !revealed;

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
            <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
          </TouchableOpacity>
          <Animated.View style={[styles.cardWrapper]}>
            {/* FRONT (hidden) */}
            <Animated.View style={[StyleSheet.absoluteFill, styles.cardFace, { transform: [{ rotateY: spin }], opacity: frontOpacity }]}> 
              <Animated.View style={[styles.card, { transform: [{ scale: pulseScale }] }]}> 
                <Text style={styles.cardTitle}>{labels.title}</Text>
                {finished ? (
                  <Text style={styles.endText}>{labels.end}</Text>
                ) : (
                  <Text style={styles.hintText}>{language === 'de' ? 'Nur aufdecken, wenn du dran bist. Danach verstecken.' : 'Reveal only on your turn. Then hide again.'}</Text>
                )}
              </Animated.View>
            </Animated.View>

            {/* BACK (revealed) */}
            <Animated.View style={[StyleSheet.absoluteFill, styles.cardFace, { transform: [{ rotateY: spinBack }], opacity: backOpacity }]}> 
              <View style={[styles.card, { backgroundColor: 'rgba(32,26,23,0.9)' }]}> 
                <Text style={styles.missionText}>{missionText}</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Controls */}
          <View style={styles.controls}>
            {isHidden ? (
              <TouchableOpacity onPress={onReveal} style={[appStyles.gameActionButton, { paddingHorizontal: 24, paddingVertical: 12 }]}>
                <Text style={appStyles.gameActionButtonText}>{labels.reveal}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onHide} style={[appStyles.gameActionButton, { backgroundColor: '#B784D7', paddingHorizontal: 24, paddingVertical: 12 }]}>
                <Text style={appStyles.gameActionButtonText}>{labels.hide}</Text>
              </TouchableOpacity>
            )}
          </View>

          <InfoText header={labels.infoHeader} rules={labels.info} />
          <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20, opacity: 0.7 }]}>
            <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
          </TouchableOpacity>
          <InfoHint />
          <TutorialOverlay
            visible={tutorialEnabled}
            steps={[
              { text: language === 'de' ? 'Tippe auf Aufdecken, um deine Mission zu sehen.' : 'Tap Reveal to see your mission.', placement: 'bottom' },
              { text: language === 'de' ? 'Verstecken und weitergeben – jede Person zieht ihre eigene Mission.' : 'Hide again and pass on – each player draws their own mission.', placement: 'top' },
            ]}
            stepIndex={tutorialStep}
            onNext={() => setTutorialStep((s) => Math.min(1, s + 1))}
            onClose={() => setTutorialEnabled(false)}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardWrapper: { width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1 },
  cardFace: { backfaceVisibility: 'hidden', alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '88%',
    minHeight: 220,
    borderRadius: 18,
    backgroundColor: 'rgba(245,233,215,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  cardTitle: { color: '#201a17', fontFamily: 'Quicksand_700Bold', fontSize: 24, textAlign: 'center' },
  hintText: { color: 'rgba(32,26,23,0.66)', fontFamily: 'Quicksand_300Light', fontSize: 14, marginTop: 10 },
  endText: { color: '#201a17', fontFamily: 'Quicksand_700Bold', fontSize: 16, marginTop: 8, textAlign: 'center' },
  missionText: { color: '#F5E9D7', fontFamily: 'Quicksand_700Bold', fontSize: 20, lineHeight: 28, textAlign: 'center' },
  controls: { paddingVertical: 16 },
});

export default SecretMission;



