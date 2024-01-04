import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ScrollView, Alert } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import NameContainer from './sublements/AddPlayerNameContainer';

const PlayerInput = React.memo(({ onAddPlayer }) => {
  const [currentName, setCurrentName] = useState('');

  const handleAddPlayer = () => {
    if (currentName.trim() !== '') {
      onAddPlayer(currentName);
      setCurrentName('');
    }
  };

  return (
    <View>
      <Text style={appStyles.title}>Enter Player Names</Text>
      <TextInput
        placeholder="Enter a name"
        placeholderTextColor="white"
        value={currentName}
        onChangeText={text => setCurrentName(text)}
        style={appStyles.input}
      />
      <TouchableOpacity onPress={handleAddPlayer} style={appStyles.chalkboardButton}>
        <Text style={[appStyles.chalkboardButtonText, { fontSize: 20 }]}>Add Player</Text>
      </TouchableOpacity>
    </View>
  );
});

//for tracking different player ids
let player_id = 0;

const AddPlayer = ({ navigation }) => {
  const { playerNames, setPlayerNames } = useContext(VariablesContext);

  const handleAddPlayer = useCallback(
    (name) => {
      setPlayerNames([...playerNames, {id: player_id, name, drinks: true}]);
      player_id += 1;
    },
    [playerNames]
  );

  const startGame = () => {
    if (playerNames.length >= 2) {
      navigation.navigate('PicoloGame');
    } else {
      Alert.alert("Zu wenig Spieler", "Um dieses Spiel zu starten werden mindestens zwei Spieler benötigt.")
    }
  }

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{ flex: 1 }} >
      <View style={appStyles.menuContainer}>
        <View style={{ width: '70%' }}>
          <PlayerInput onAddPlayer={handleAddPlayer} />

          <View style={{ height: 200 }}>
            <FlatList
              data={playerNames}
              renderItem={({ item }) =>
                <NameContainer player={item} />
              }
              keyExtractor={(item, index) => index.toString()}
              style={appStyles.playerList}
            />
          </View>


        </View>
        <TouchableOpacity onPress={startGame} style={[appStyles.chalkboardButton, {}]}>
          <Text style={appStyles.chalkboardButtonText}>Spielen</Text>
        </TouchableOpacity>

      </View>

    </ImageBackground>

  );
};

export default AddPlayer;
