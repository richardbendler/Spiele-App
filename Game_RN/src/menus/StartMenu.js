import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Linking } from 'react-native';
import { PLAY_STORE_URL } from '../utils/rating';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

import { Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { Caveat_400Regular, Caveat_500Medium, Caveat_600SemiBold, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { useFonts } from "expo-font";

const StartMenu = ({ navigation }) => {
  const { language } = useContext(VariablesContext);
  const { t } = useTranslation();
  const startText = useMemo(() => t('startMenu'), [t]);

  // Titel/Subtitel gemäß Wunsch: "The One - Die Trinkspielbar"
  const heroTitle = 'The One';
  const heroSubtitle = language === 'de' ? 'Die Trinkspielbar' : 'The Drinking Game Bar';
  const playLabel = startText?.playButton ?? (language === 'de' ? 'Jetzt starten' : 'Start now');
  const quickDrinkCounterLabel = language === 'de' ? 'Getränkezähler' : 'Drink counter';
  const quickOpenLabel = language === 'de' ? 'Öffnen' : 'Open';

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
            {heroTitle ? (<Text style={styles.heroTitle}>{heroTitle}</Text>) : null}
            <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
          </View>
        </View>

        {/* TEXTPANELS: neutral, nicht wie Buttons */}
        {/* Feature panels entfernt laut Anforderung */}

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

        {/* Quicklink: Getränkezähler */}
        <TouchableOpacity
          onPress={() => navigation.navigate('DrinkCounter')}
          style={styles.quickLink}
          activeOpacity={0.9}
        >
          <View style={styles.quickLinkIcon}><Text style={styles.quickLinkIconText}>🥤</Text></View>
          <View style={styles.quickLinkCopy}>
            <Text style={styles.quickLinkTitle}>{quickDrinkCounterLabel}</Text>
            <Text style={styles.quickLinkSubtitle}>{language === 'de' ? 'Schneller Zugriff' : 'Quick access'}</Text>
          </View>
          <View style={styles.quickLinkAction}><Text style={styles.quickLinkActionLabel}>{quickOpenLabel}</Text></View>
        </TouchableOpacity>

        {/* Bewertung CTA */}
        <TouchableOpacity
          onPress={() => Linking.openURL(PLAY_STORE_URL)}
          style={styles.rateButton}
          activeOpacity={0.88}
        >
          <Text style={styles.rateButtonStar}>★</Text>
          <Text style={styles.rateButtonLabel}>
            {language === 'de' ? 'Dir gefällt die App? Bewerte uns im Play Store' : 'Enjoy the app? Rate us on Play Store'}
          </Text>
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
  // Hintergrund weniger stark abdunkeln, damit das Bar-Bild besser sichtbar bleibt
  barOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 14, 22, 0.35)' },
  barContent: { flex: 1, paddingHorizontal: 28, paddingTop: 80, paddingBottom: 120, justifyContent: 'space-between' },

  heroSection: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  heroLogo: { width: 112, height: 112, resizeMode: 'contain' },
  heroTextBlock: { flex: 1 },
  heroLabel: { color: '#E5C185', fontFamily: 'Caveat_500Medium', fontSize: 24 },
  heroTitle: { color: '#FFFFFF', fontSize: 44, fontFamily: 'Caveat_700Bold' },
  // Make subtitle a touch larger and with a nicer handwritten font
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 24, marginTop: 8, fontFamily: 'Caveat_500Medium' },

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
    marginTop: 36,
    alignSelf: 'center',
    backgroundColor: '#F2C77A',
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 52,
    // etwas mehr Leuchten, damit der Button heraussticht
    shadowColor: '#F2C77A',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.20)'
  },
  startButtonNewLabel: { color: '#231C18', fontSize: 20, fontFamily: 'Quicksand_700Bold', letterSpacing: 1.2 },

  rateButton: {
    marginTop: 18,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(229,193,133,0.65)',
    backgroundColor: 'rgba(24,19,15,0.48)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  rateButtonStar: { color: '#E5C185', fontSize: 14, marginTop: -1 },
  rateButtonLabel: { color: 'rgba(255,255,255,0.95)', fontSize: 13.5, fontFamily: 'Quicksand_300Bold', textAlign: 'center' },

  // Quicklink styles (aligned with MainMenu shortcut look & feel)
  quickLink: {
    marginTop: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(229,193,133,0.55)',
    backgroundColor: 'rgba(229,193,133,0.12)'
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229,193,133,0.65)',
    backgroundColor: 'rgba(229,193,133,0.18)'
  },
  quickLinkIconText: { fontSize: 18 },
  quickLinkCopy: { flex: 1, minWidth: 0 },
  quickLinkTitle: { color: '#F5E9D7', fontSize: 14, fontFamily: 'Quicksand_700Bold' },
  quickLinkSubtitle: { color: 'rgba(245,233,215,0.75)', fontSize: 11, marginTop: 2, fontFamily: 'Quicksand_300Light' },
  quickLinkAction: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E5C185',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkActionLabel: { fontSize: 12, fontFamily: 'Quicksand_300Bold', color: '#231C18', letterSpacing: 0.4 },

  counter: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', pointerEvents: 'none' },
  counterTop: { width: '88%', height: 18, backgroundColor: 'rgba(53, 40, 32, 0.95)', borderTopLeftRadius: 18, borderTopRightRadius: 18, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  counterFront: { width: '100%', height: 80, backgroundColor: 'rgba(41, 30, 24, 0.92)' },
});

export default StartMenu;
