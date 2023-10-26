import React, { useState, useContext } from 'react';
import { Button, View, Text } from 'react-native';
import { appStyles } from '../../../styles';
import { VariablesContext } from '../../../VariablesContext';

const NameContainer = ({ player }) => {

    const { playerNames, setPlayerNames } = useContext(VariablesContext);
    // Ändern Sie die Variable "drinks" für einen bestimmten Spieler
    const togglePlayerDrinks = (playerObject) => {
        setPlayerNames((prevPlayerNames) => {
            const updatedPlayerNames = [...prevPlayerNames]; // Create a copy of Player list
            const index = updatedPlayerNames.indexOf(player);
            updatedPlayerNames[index].drinks = !updatedPlayerNames[index].drinks; // change value
            return updatedPlayerNames; // return new list
        });
    };

    const removePlayer = (playerObject) => {
        index = playerNames.indexOf(playerObject);
        if (index > -1) {
            let newPlayerList = [...playerNames];
            newPlayerList.splice(index, 1);
            setPlayerNames(newPlayerList);
        }
    }


    const [playerDrinks, setPlayerDrinks] = useState(player.drinks);



    return (
        <View style={appStyles.playerListText}>
            <Text style={{ color: 'white', paddingRight: '2%', width: '35%' }} ellipsizeMode='tail' numberOfLines={1}>{player.name}</Text>
            <View style={{ width: '50%' }}>
                <Button
                    onPress={() => {
                        setPlayerDrinks(!playerDrinks);
                        togglePlayerDrinks(player);
                    }}
                    title={playerDrinks ? "Trinkt" : "Trinkt nicht"}
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