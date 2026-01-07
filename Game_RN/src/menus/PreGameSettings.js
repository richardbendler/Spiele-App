import React, { useMemo, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';

const mapScaleLabel = (scale, index) => (Array.isArray(scale) && index >= 0 && index < scale.length ? scale[index] : '');

const PreGameSettings = ({ navigation, route }) => {
  const nextGame = route?.params?.nextGame;
  const forwardParams = route?.params?.forwardParams;
  const { theOneSettings, setTheOneSettings } = useContext(VariablesContext);
  const { t, language } = useTranslation();

  const copy = useMemo(() => t('addPlayer'), [t]);
  const drinkingScale = useMemo(() => t('scales.drunkenness'), [t]);
  const familiarityScale = useMemo(() => t('scales.familiarity'), [t]);

  const sliderMaxIndex = Array.isArray(drinkingScale) ? drinkingScale.length - 1 : 0;
  const familiarityMax = Array.isArray(familiarityScale) ? familiarityScale.length - 1 : 0;

  const updateSetting = (key, maxValue) => (value) => {
    const upper = typeof maxValue === 'number' ? maxValue : sliderMaxIndex;
    const clamped = Math.max(0, Math.min(upper, Math.round(value)));
    setTheOneSettings((prev) => ({ ...prev, [key]: clamped }));
  };

  const startGame = () => {
    if (nextGame) {
      navigation.navigate(nextGame, forwardParams);
    } else {
      navigation.goBack();
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{copy.screenTitle}</Text>
        <Text style={styles.subtitle}>{copy.listHint}</Text>

        <View style={styles.sliderCard}>
          <Text style={styles.sliderTitle}>{copy.sliderCurrent}</Text>
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={sliderMaxIndex}
              step={1}
              value={theOneSettings.currentDrunkenness}
              onValueChange={updateSetting('currentDrunkenness', sliderMaxIndex)}
              minimumTrackTintColor="#E5C185"
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#E5C185"
            />
            <Text style={styles.sliderValue}>{copy.sliderCurrentLabel} {mapScaleLabel(drinkingScale, theOneSettings.currentDrunkenness)}</Text>
          </View>

          <Text style={styles.sliderTitle}>{copy.sliderDesired}</Text>
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={sliderMaxIndex}
              step={1}
              value={theOneSettings.desiredDrunkenness}
              onValueChange={updateSetting('desiredDrunkenness', sliderMaxIndex)}
              minimumTrackTintColor="#E5C185"
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#E5C185"
            />
            <Text style={styles.sliderValue}>{copy.sliderDesiredLabel} {mapScaleLabel(drinkingScale, theOneSettings.desiredDrunkenness)}</Text>
          </View>

          <Text style={styles.sliderTitle}>
            {nextGame === 'SpinTheBottle'
              ? t('spinTheBottle.touchyLabel', language === 'de' ? 'Wie touchy soll es werden?' : 'How touchy should it be?')
              : copy.sliderFamiliarity}
          </Text>
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={familiarityMax}
              step={1}
              value={theOneSettings.familiarity}
              onValueChange={updateSetting('familiarity', familiarityMax)}
              minimumTrackTintColor="#E5C185"
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#E5C185"
            />
            <Text style={styles.sliderValue}>
              {nextGame === 'SpinTheBottle'
                ? (theOneSettings.familiarity <= 2 ? 'soft' : theOneSettings.familiarity <= 6 ? 'medium' : 'spicy')
                : `${copy.sliderFamiliarityLabel} ${mapScaleLabel(familiarityScale, theOneSettings.familiarity)}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={startGame} style={styles.startButton} activeOpacity={0.9}>
          <Text style={styles.startButtonText}>{copy.startButton}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Quicksand_300Bold',
    color: 'white',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand_300Light',
    color: 'rgba(255,255,255,0.72)',
    marginBottom: 24,
  },
  sliderCard: {
    backgroundColor: 'rgba(12, 15, 21, 0.9)',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sliderTitle: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
    marginTop: 6,
  },
  sliderRow: {
    marginTop: 6,
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 42,
  },
  sliderValue: {
    textAlign: 'right',
    fontSize: 12,
    color: 'rgba(229,193,133,0.85)',
    fontFamily: 'Quicksand_300Bold',
  },
  startButton: {
    marginTop: 30,
    backgroundColor: '#E5C185',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#231C18',
    fontSize: 18,
    fontFamily: 'Quicksand_300Bold',
    letterSpacing: 1,
  },
});

export default PreGameSettings;
