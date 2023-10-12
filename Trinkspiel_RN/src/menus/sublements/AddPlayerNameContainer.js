import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../../styles';
import { VariablesContext } from '../../../VariablesContext';

const NameContainer = ({ player }) => {

        const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);
    
        const { playerNames, setPlayerNames } = useContext(VariablesContext);
        // Ändern Sie die Variable "drinks" für einen bestimmten Spieler
        const togglePlayerDrinks = (playerIndex) => {
            setPlayerNames((prevPlayerNames) => {
                const updatedPlayerNames = [...prevPlayerNames]; // Erstellen Sie eine Kopie der Spielerliste
                updatedPlayerNames[playerIndex].drinks = !updatedPlayerNames[playerIndex].drinks; // Ändern Sie den Wert
                return updatedPlayerNames; // Geben Sie die aktualisierte Liste zurück
            });
        };
    
        const [playerDrinks, setPlayerDrinks] = useState(player.drinks);
    
    
    
        return (
            <View style={appStyles.playerListText}>
                <Text style={{ color: 'white', paddingRight: '10%' }}>{player.name}</Text>
                <Button 
                    onPress= {() => {
                        setPlayerDrinks(!playerDrinks);
                        togglePlayerDrinks(player.id);
                    }}
                    title = {playerDrinks ? "trinkt" : "trinkt nicht"}
                    color={ playerDrinks ? 'green' : 'red' }
                />
            </View>
        )
};

export default NameContainer;