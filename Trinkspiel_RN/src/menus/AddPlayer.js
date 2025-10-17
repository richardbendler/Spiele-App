import React, { useState, useContext, useCallback, useMemo } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, FlatList, ImageBackground, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import NameContainer from './sublements/AddPlayerNameContainer';
import { useTranslation } from '../i18n';

const mapScaleLabel = (scale, index) => {
  if (!Array.isArray(scale) || index < 0 || index >= scale.length) {
    return '';
  }
  return scale[index];
};

const PlayerInput = React.memo(({ onAddPlayer, copy }) => {
  const [currentName, setCurrentName] = useState('');

  const handler = () => {
    const trimmedName = currentName.trim();
    if (trimmedName !== '') {
      onAddPlayer(trimmedName);
      setCurrentName('');
    }
  };

  return (
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={appStyles.textHeader2}>{copy.inputTitle}</Text>
      <Text style={[appStyles.textNormal2, { width: '70%', textAlign: 'center' }]}>{copy.inputSubtitle}</Text>
      <TextInput
        placeholder={copy.placeholder}
        placeholderTextColor="white"
        value={currentName}
        onChangeText={setCurrentName}
        style={[appStyles.input, { marginVertical: 20 }]}
      />
      <TouchableOpacity onPress={handler} style={[appStyles.chalkboardButton, { marginBottom: 30 }]}>
        <Text style={[appStyles.chalkboardButtonText, { fontSize: 20 }]}>{copy.addButton}</Text>
      </TouchableOpacity>
    </View>
  );
});

// for tracking different player ids
let player_id = 0;

const AddPlayer = ({ navigation }) => {
  const { players, setPlayers, theOneSettings, setTheOneSettings } = useContext(VariablesContext);
  const { t } = useTranslation();

  const addPlayerText = useMemo(() => t('addPlayer'), [t]);
  const drinkingScale = useMemo(() => t('scales.drunkenness'), [t]);
  const familiarityScale = useMemo(() => t('scales.familiarity'), [t]);

  const playerInputCopy = useMemo(
    () => ({
      inputTitle: addPlayerText.inputTitle,
      inputSubtitle: addPlayerText.inputSubtitle,
      placeholder: addPlayerText.placeholder,
      addButton: addPlayerText.addButton,
    }),
    [addPlayerText]
  );

  const { currentDrunkenness, desiredDrunkenness, familiarity } = theOneSettings;
  const sliderMaxIndex = Array.isArray(drinkingScale) ? drinkingScale.length - 1 : 0;

  const updateSetting = useCallback(
    (key, maxValue) => (value) => {
      const upperBound = typeof maxValue === 'number' ? maxValue : sliderMaxIndex;
      const clampedValue = Math.max(0, Math.min(upperBound, Math.round(value)));
      setTheOneSettings((prev) => ({ ...prev, [key]: clampedValue }));
    },
    [setTheOneSettings, sliderMaxIndex]
  );

  const handleAddPlayer = useCallback(
    (name) => {
      const nextId = player_id;
      player_id += 1;
      setPlayers((prev) => [...prev, { id: nextId, name, drinks: true }]);
    },
    [setPlayers]
  );

  const startGame = () => {
    if (players.length >= 2) {
      navigation.navigate('PicoloGame');
    } else {
      Alert.alert(addPlayerText.alertTitle, addPlayerText.alertMessage);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.menuContainer}>
        <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
          <PlayerInput onAddPlayer={handleAddPlayer} copy={playerInputCopy} />

          <Text style={[appStyles.textNormal2, { width: '100%', textAlign: 'center' }]}>
            {addPlayerText.listHint}
          </Text>
          <Text style={[appStyles.textHeader4, { marginVertical: 1 }]}>{addPlayerText.listHeader}</Text>

          <View style={{ height: 200, marginVertical: 1 }}>
            <FlatList
              data={players}
              renderItem={({ item }) => <NameContainer playerObject={item} />}
              keyExtractor={(item) => (item.id != null ? String(item.id) : item.name)}
              style={appStyles.playerList}
            />
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Text style={appStyles.textNormal2}>{addPlayerText.sliderCurrent}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={sliderMaxIndex}
              step={1}
              value={currentDrunkenness}
              onValueChange={updateSetting('currentDrunkenness')}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Text style={appStyles.textNormal2}>
              {addPlayerText.sliderCurrentLabel} {mapScaleLabel(drinkingScale, currentDrunkenness)}
            </Text>
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Text style={appStyles.textNormal2}>{addPlayerText.sliderDesired}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={sliderMaxIndex}
              step={1}
              value={desiredDrunkenness}
              onValueChange={updateSetting('desiredDrunkenness')}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Text style={appStyles.textNormal2}>
              {addPlayerText.sliderDesiredLabel} {mapScaleLabel(drinkingScale, desiredDrunkenness)}
            </Text>
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Text style={appStyles.textNormal2}>{addPlayerText.sliderFamiliarity}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={Array.isArray(familiarityScale) ? familiarityScale.length - 1 : 0}
              step={1}
              value={familiarity}
              onValueChange={updateSetting('familiarity', Array.isArray(familiarityScale) ? familiarityScale.length - 1 : 0)}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Text style={appStyles.textNormal2}>
              {addPlayerText.sliderFamiliarityLabel} {mapScaleLabel(familiarityScale, familiarity)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={startGame} style={[appStyles.chalkboardButtonPrimaryColor]}>
          <Text style={appStyles.chalkboardButtonText}>{addPlayerText.startButton}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default AddPlayer;

