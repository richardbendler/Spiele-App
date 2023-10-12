import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ScrollView } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';

const PlayerInput = React.memo(({ onAddPlayer }) => {
  const [currentName, setCurrentName] = useState('');

  const handleAddPlayer = () => {
    if (currentName.trim() !== '') {
      onAddPlayer(currentName);
      setCurrentName('');
    }
  };

  return (
    <>
      <Text style={appStyles.title}>Enter Player Names</Text>
      <TextInput
        placeholder="Enter a name"
        placeholderTextColor="white"
        value={currentName}
        onChangeText={text => setCurrentName(text)}
        style={appStyles.input}
      />
      <TouchableOpacity onPress={handleAddPlayer} style={appStyles.chalkboardButton}>
        <Text style={[appStyles.chalkboardButtonText, {fontSize:20}]}>Add Player</Text>
      </TouchableOpacity>
    </>
  );
});

const AddPlayer = ({ navigation }) => {
  const { playerNames, setPlayerNames } = useContext(VariablesContext);

  const handleAddPlayer = useCallback(
    (name) => {
      setPlayerNames([...playerNames, name]);
    },
    [playerNames]
  );

  return (
    <ImageBackground source={require("../../assets/images/bar/settings_tafel.png")} style={{flex: 1}}>
      <View style={appStyles.menuContainer}>
        <View style={{width:'70%'}}>
          <PlayerInput onAddPlayer={handleAddPlayer} />
          
              <View style={{ height: 200 }}>
                <FlatList
                data={playerNames}
                renderItem={({ item }) => <Text style={appStyles.playerListText}>{item}</Text>}
                keyExtractor={(item, index) => index.toString()}
                style={appStyles.playerList}
              />
              </View>


        </View>
        <TouchableOpacity onPress={() => navigation.navigate('PicoloGame')} style={[appStyles.chalkboardButton, {}]}>
          <Text style={appStyles.chalkboardButtonText}>Spielen</Text>
        </TouchableOpacity>
      
        </View>

    </ImageBackground>

  );
};

export default AddPlayer;
