import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';

const AddPlayer = React.memo(function AddPlayer({ navigation }) {
    const { playerNames, setPlayerNames } = useContext(VariablesContext);
    const [currentName, setCurrentName] = useState('');

    
    const PrintAddPlayer = () => {
        return(
            <>
            <Text style={appStyles.title}>Enter Player Names</Text>
            <TextInput
                placeholder="Enter a name"
                value={currentName}
                onChangeText={text => setCurrentName(text)}
                style={appStyles.input}
            />
            <TouchableOpacity onPress={handleAddPlayer} style={appStyles.addButton}>
                <Text style={appStyles.buttonText}>Add Player</Text>
            </TouchableOpacity>
            <FlatList
                data={playerNames}
                renderItem={({ item }) => <Text>{item}</Text>}
                keyExtractor={(item, index) => index.toString()}
                style={appStyles.playerList}
            />
            </>
        )
  }

  const handleAddPlayer = useCallback(() => {
    if (currentName.trim() !== '') {
      setPlayerNames([...playerNames, currentName]);
      setCurrentName('');
    }
  }, [currentName, playerNames]);

  console.log("Rerender")
  return (
    
    <View style={appStyles.menuContainer}>
      <PrintAddPlayer/>
      <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
        <Text style={appStyles.menuButtonText}>To the Games</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddPlayer;