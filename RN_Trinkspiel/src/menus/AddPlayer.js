import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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
        value={currentName}
        onChangeText={text => setCurrentName(text)}
        style={appStyles.input}
      />
      <TouchableOpacity onPress={handleAddPlayer} style={appStyles.submitButton}>
        <Text style={appStyles.submitButtonText}>Add Player</Text>
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
    <View style={appStyles.menuContainer}>
      <PlayerInput onAddPlayer={handleAddPlayer} />
      <FlatList
        data={playerNames}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        style={appStyles.playerList}
      />
      <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
        <Text style={appStyles.menuButtonText}>Spielen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPlayer;
