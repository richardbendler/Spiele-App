import React, { useState, useContext } from 'react';
import { Button, View, Text } from 'react-native';
import { appStyles } from '../../../styles';
import { VariablesContext } from '../../../VariablesContext';

const NameContainer = ({ playerObject }) => {

    const { players, setPlayers } = useContext(VariablesContext);

    const togglePlayerDrinks = (playerObject) => {
        setPlayers((prevPlayerList) => {
            const updatedPlayerList = [...prevPlayerList]; // create a copy of player list
            const index = updatedPlayerList.indexOf(playerObject);
            updatedPlayerList[index].drinks = !updatedPlayerList[index].drinks; // toggle drinks boolean
            return updatedPlayerList; // return new list
        });
    };

    const removePlayer = (playerObject) => {
        index = players.indexOf(playerObject);
        if (index > -1) {
            let newPlayerList = [...players];
            newPlayerList.splice(index, 1);
            setPlayers(newPlayerList);
        }
    };


    const [player, setPlayer] = useState(playerObject);



    return (
        <View style={appStyles.playerListText}>
            <Text style={{ color: 'white', paddingRight: '2%', width: '35%' }} ellipsizeMode='tail' numberOfLines={1}>{playerObject.name}</Text>
            <View style={{ width: '50%' }}>
                <Button
                    onPress={() => {
                        setPlayer(!player.drinks);
                        togglePlayerDrinks(playerObject);
                    }}
                    title={playerObject.drinks ? "Trinkt" : "Trinkt nicht"}
                    color={playerObject.drinks ? 'green' : 'red'}
                />
            </View>
            <View style={{ paddingLeft: '2%' }}>
                <Button
                    onPress={() => {
                        removePlayer(playerObject);
                    }}
                    title={'-'}
                    color={'red'}
                />
            </View>
        </View>
    )
};

export default NameContainer;