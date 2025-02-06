import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ScrollView, Alert } from 'react-native';
import Slider from '@react-native-community/slider'; 
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import NameContainer from './sublements/AddPlayerNameContainer';

const PlayerInput = React.memo(({ onAddPlayer }) => {
  const [currentName, setCurrentName] = useState('');

  const handler = () => {
    if (currentName.trim() !== '') {
      onAddPlayer(currentName);
      setCurrentName('');
    }
  };

  return (
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', }}>
      <Text style={appStyles.textHeader2}>Namen eingeben</Text>
      <Text style={[appStyles.textNormal2, {width: '70%', textAlign: 'center'}]}>Bitte gib die Namen aller mitspielenden Personen ein!</Text>
      <TextInput
        placeholder="Hier einen Namen eingeben"
        placeholderTextColor="white"
        value={currentName}
        onChangeText={text => setCurrentName(text)}
        style={[appStyles.input, {marginVertical: 20}]}
      />
      <TouchableOpacity onPress={handler} style={[appStyles.chalkboardButton, {marginBottom: 30}]}>
        <Text style={[appStyles.chalkboardButtonText, { fontSize: 20 }]}>Hinzufügen</Text>
      </TouchableOpacity>
    </View>
  );
});

//for tracking different player ids
let player_id = 0;

const AddPlayer = ({ navigation }) => {
  const { players, setPlayers } = useContext(VariablesContext);
  const [drunkennessLevel, setDrunkennessLevel] = useState(5);
  const [drunkennessLevelsAsText, setDrunkennessLevelsAsText] = useState(["Stock nüchtern", "Gerade angefangen zu trinken", "Erste Wirkung", "Leicht angetrunken", "Moderat angetrunken", "Doller angetrunken", "Ziemlich doll angetrunken", "Können kaum noch laufen", "Uiuiuiui", "Haat jmd nen E1mer??"]); //TODO:
  const [desiredDrunkenness, setDesiredDrunkenness] = useState(5);
  const [desiredDrunkennessLevelsAsText, setDesiredDrunkennessLevelsAsText] = useState(["Stock nüchtern", "Gerade angefangen zu trinken", "Erste Wirkung", "Leicht angetrunken", "Moderat angetrunken", "Doller angetrunken", "Ziemlich doll angetrunken", "Können kaum noch laufen", "Uiuiuiui", "Haat jmd nen E1mer??"]);
  const [familiarityLevel, setFamiliarityLevel] = useState(5);
  const [familiarityLevelsAsText, setFamiliarityLevelsAsText] = useState(["Heute kennengelernt", "...", "...", "...", "...", "...", "Kennen uns gut", "Kennen uns sehr gut", "Kennen uns lange", "Alte Bekannte"]);
  
  
  const handleAddPlayer = useCallback(
    (name) => {
      //check if array already has players
      players != [] ? setPlayers([...players, {id: player_id, name, drinks: true}]) : setPlayers([{id: player_id, name, drinks: true}]);
      player_id += 1;
    },
    [players]
  );

  const startGame = () => {
    if (players.length >= 2) {
      navigation.navigate('PicoloGame');
    } else {
      Alert.alert("Zu wenig Spieler", "Um dieses Spiel zu starten werden mindestens zwei Spieler benötigt.")
    }
  }

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{ flex: 1 }} >
      <View style={appStyles.menuContainer}>
        <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center', }}>
          <PlayerInput onAddPlayer={handleAddPlayer} />

          
          <Text style={[appStyles.textNormal2, {width: '100%', textAlign: 'center'}]}>In der Liste könnt ihr dann markieren, ob Personen Alkohol trinken oder nicht. Wer nicht trinkt, bekommt auch keine Aufgaben, wo es ums Trinken geht.</Text>
          <Text style={[appStyles.textHeader4, {marginVertical: 1}]}>Wer ist dabei:</Text>
          
          <View style={{ height: 200, marginVertical: 1 }}>
            <FlatList
              data={players}
              renderItem={({ item }) =>
                <NameContainer playerObject={item} />
              }
              keyExtractor={(item, index) => index.toString()}
              style={appStyles.playerList}
            />
          </View>

          {/* Die Regler */}
          <View style={{ width: '100%', marginTop: 20 }}>
            <Text style={appStyles.textNormal2}>Wie betrunken seid ihr gerade?</Text>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={5}
              onValueChange={setDrunkennessLevel}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Text style={appStyles.textNormal2}>Wert: {drunkennessLevelsAsText[drunkennessLevel-1]}</Text>
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Text style={appStyles.textNormal2}>Wie betrunken möchtet ihr werden?</Text>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={5}
              onValueChange={setDesiredDrunkenness}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Text style={appStyles.textNormal2}>Wert: {desiredDrunkennessLevelsAsText[desiredDrunkenness-1]}</Text>
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Text style={appStyles.textNormal2}>Wie gut kennt ihr euch schon?</Text>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={5}
              onValueChange={setFamiliarityLevel}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Text style={appStyles.textNormal2}>Wert: {familiarityLevelsAsText[familiarityLevel-1]}</Text>
          </View>


        </View>
        <TouchableOpacity onPress={startGame} style={[appStyles.chalkboardButtonPrimaryColor, {}]}>
          <Text style={appStyles.chalkboardButtonText}>Spielen</Text>
        </TouchableOpacity>

      </View>

    </ImageBackground>
  );
};

export default AddPlayer;



