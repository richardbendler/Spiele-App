import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../../styles';
import { VariablesContext } from '../../../VariablesContext';

const NameContainer = ({ player }) => {

    const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

    const { playerNames, setPlayerNames } = useContext(VariablesContext);
    // Ändern Sie die Variable "drinks" für einen bestimmten Spieler
    const togglePlayerDrinks = (playerObject) => {
        setPlayerNames((prevPlayerNames) => {
            const updatedPlayerNames = [...prevPlayerNames]; // Erstellen Sie eine Kopie der Spielerliste
            const index = updatedPlayerNames.indexOf(player);
            updatedPlayerNames[index].drinks = !updatedPlayerNames[index].drinks; // Ändern Sie den Wert
            return updatedPlayerNames; // Geben Sie die aktualisierte Liste zurück
        });
    };

    const removePlayer = (playerObject) => {
        index = playerNames.indexOf(playerObject);
        if (index > -1) {
            let newPlayerList = [...playerNames];
            newPlayerList.splice(index, 1);
            setPlayerNames(newPlayerList);
            console.log("removed player");
        } else {
            console.log("Could not find player");
        }
    }


    const [playerDrinks, setPlayerDrinks] = useState(player.drinks);



    return (
        <View style={appStyles.playerListText}>
            <Text style={{ color: 'white', paddingRight: '2%', width: '35%' }} ellipsizeMode='tail'>{player.name}</Text>
            <View style={{ width: '50%' }}>
                <Button
                    onPress={() => {
                        setPlayerDrinks(!playerDrinks);
                        togglePlayerDrinks(player);
                    }}
                    title={playerDrinks ? "trinkt" : "trinkt nicht"}
                    color={playerDrinks ? 'green' : 'red'}
                />
            </View>
            <View style={{ paddingLeft: '2%' }}>
                <Button
                    onPress={() => {
                        removePlayer(player);
                    }}
                    title={'-'}
                    color={'red'}
                />
            </View>
        </View>
    )
};

export default NameContainer;