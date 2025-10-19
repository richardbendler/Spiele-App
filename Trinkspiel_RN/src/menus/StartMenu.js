import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';
import NetInfo from "@react-native-community/netinfo";

const USE_BAR_START_LAYOUT = true;
const BAR_WELCOME_ACCENTS = ["#E5C185", "#F08974", "#7AC1B2"]; // bleibt

import { Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { Caveat_400Regular, Caveat_500Medium, Caveat_600SemiBold, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { useFonts } from "expo-font";

const StartMenu = ({ navigation }) => {
  const { language } = useContext(VariablesContext);
  const { t } = useTranslation();
  const startText = useMemo(() => t('startMenu'), [t]);

  const heroTitle = startText?.title ?? (language === 'de' ? 'Deine Trinkspielbar' : 'Your drink game bar');
  const heroSubtitle = startText?.subtitle ?? (language === 'de' ? 'Starte mit einem Spiel, das zu eurer Runde passt.' : 'Kick things off with a game that matches your crew.');
  const playLabel = startText?.playButton ?? (language === 'de' ? 'Jetzt starten' : 'Start now');

  const featureCards = useMemo(() => [
    {
      key: 'mix',
      title: language === 'de' ? 'Spielauswahl' : 'Game selection',
      text: language === 'de' ? 'Von Klassikern wie Kingscup bis zu neuen Ideen - alles an einem Ort.' : 'From Kingscup classics to fresh ideas - all in one place.',
    },
    {
      key: 'mood',
      title: language === 'de' ? 'Stimmungsbarometer' : 'Set the vibe',
      text: language === 'de' ? 'Kurze Beschreibungen helfen euch das passende Spiel sofort zu finden.' : 'Short descriptions help you pick the perfect game instantly.',
    },
    {
      key: 'stats',
      title: language === 'de' ? 'Log & Stats' : 'Log & stats',
      text: language === 'de' ? 'Mit dem Drinkcounter behaltet ihr eure Runde immer im Blick.' : 'Track your session with the built-in drink counter.',
    },
  ], [language]);

  const [backgroundAspectRatio, setBackgroundAspectRatio] = useState(100);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handleImageLoad = (e) => {
    const { width, height } = e.nativeEvent.source;
    const aspectRatio = width / height;
    setBackgroundAspectRatio(aspectRatio);
  };

  const backgroundImageWidth = windowHeight * backgroundAspectRatio;

  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const [fontsLoaded] = useFonts({
    Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold,
    Caveat_400Regular, Caveat_500Medium, Caveat_600SemiBold, Caveat_700Bold
  });
  if (!fontsLoaded) {
    return <View style={{justifyContent:'center', alignItems:'center'}}>
      <Image source={require('../../assets/images/logo/adaptive_logo_weinglas_transparent.png')} style={{ width: 72, height: 72, resizeMode: 'contain' }} />
      <Text>{t('common')?.loading ?? 'Loading'}</Text>
    </View>;
  }

  if (!USE_BAR_START_LAYOUT) {
    return (
      <View style={{alignItems: 'flex-start'}}>
        <ImageBackground source={require("../../assets/images/bar/bar_background_filled.png")} 
          style={{ height: windowHeight, width: backgroundImageWidth }}
          onLoad={handleImageLoad}
        >
          {/* ... alte Bottle-Ansicht unverändert ... */}
        </ImageBackground>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/bar/bar_background_filled.png")}
      style={styles.barBackground}
    >
      <View style={styles.barOverlay} />

      <View style={styles.barContent}>
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/images/logo/adaptive_logo_weinglas_transparent.png')}
            style={styles.heroLogo}
          />
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroLabel}>{language === 'de' ? 'Trinkspielbar' : 'Bar mode'}</Text>
            <Text style={styles.heroTitle}>{heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
          </View>
        </View>

        {/* TEXTPANELS: neutral, nicht wie Buttons */}
        <View style={styles.featureGrid}>
          {featureCards.map((feature, index) => (
            <View key={feature.key} style={styles.featureRow}>
              <View style={[styles.featureAccent, { backgroundColor: BAR_WELCOME_ACCENTS[index % BAR_WELCOME_ACCENTS.length] }]} />
              <View style={styles.featurePanel}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {startText?.disclaimer ? (
          <View style={styles.disclaimerPanel}>
            <Text style={styles.disclaimerHeading}>
              {language === 'de' ? 'Hinweis' : 'Heads-up'}
            </Text>
            <Text style={styles.disclaimerCopy}>{startText.disclaimer}</Text>
          </View>
        ) : null}

        {/* Primärer CTA bleibt klar als Button gestaltet */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MainMenu')}
          style={styles.startButtonNew}
          activeOpacity={0.9}
        >
          <Text style={styles.startButtonNewLabel}>{playLabel}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counter}>
        <View style={styles.counterTop} />
        <View style={styles.counterFront} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  barBackground: { flex: 1 },
  barOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 14, 22, 0.6)' },
  barContent: { flex: 1, paddingHorizontal: 28, paddingTop: 90, paddingBottom: 160, justifyContent: 'space-between' },

  heroSection: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  heroLogo: { width: 84, height: 84, resizeMode: 'contain' },
  heroTextBlock: { flex: 1 },
  heroLabel: { color: '#E5C185', fontFamily: 'Caveat_500Medium', fontSize: 24 },
  heroTitle: { color: '#FFFFFF', fontSize: 32, fontFamily: 'Quicksand_700Bold' },
  heroSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 20, marginTop: 8, fontFamily: 'Quicksand_300Light' },

  /** Panels statt Button-Look */
  featureGrid: { marginTop: 36, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'stretch' },
  featureAccent: { width: 4, borderRadius: 4 },
  featurePanel: {
    flex: 1,
    backgroundColor: 'rgba(24,19,15,0.55)', // transparenter Panel-Look
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginLeft: 10,
    // WICHTIG: keine Border & kein Shadow -> kein Button-Eindruck
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  featureTitle: { color: '#F5E9D7', fontSize: 15, fontFamily: 'Quicksand_300Bold' },
  featureText: { color: 'rgba(255,255,255,0.78)', fontSize: 13, lineHeight: 19, marginTop: 4, fontFamily: 'Quicksand_300Light' },

  disclaimerPanel: {
    marginTop: 20,
    backgroundColor: 'rgba(12,16,24,0.55)', // leichter als zuvor
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  disclaimerHeading: { color: '#E5C185', fontSize: 12, fontFamily: 'Quicksand_300Bold', letterSpacing: 1, textTransform: 'uppercase' },
  disclaimerCopy: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18, marginTop: 8, fontFamily: 'Quicksand_300Light' },

  /** Primärer CTA (Button) bewusst deutlich */
  startButtonNew: {
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#E5C185',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 36,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  startButtonNewLabel: { color: '#231C18', fontSize: 16, fontFamily: 'Quicksand_300Bold', letterSpacing: 1 },

  counter: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', pointerEvents: 'none' },
  counterTop: { width: '88%', height: 18, backgroundColor: 'rgba(53, 40, 32, 0.95)', borderTopLeftRadius: 18, borderTopRightRadius: 18, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  counterFront: { width: '100%', height: 80, backgroundColor: 'rgba(41, 30, 24, 0.92)' },
});

export default StartMenu;
