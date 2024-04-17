import React, { useState, useContext } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

    const TwoPartButton = ({ playerObject, togglePlayerDrinks }) => {
        return (
            <TouchableOpacity onPress={() => togglePlayerDrinks(playerObject)}>
                <View style={styles.buttonContainer}>
                    <View style={[styles.halfButton, {
                        backgroundColor: playerObject.drinks ? 'green' : 'grey',
                        opacity: playerObject.drinks ? 1 : 0.5
                    }]}>
                        <Text style={styles.buttonText}>Trinkt</Text>
                    </View>
                    <View style={[styles.halfButton, {
                        backgroundColor: !playerObject.drinks ? 'red' : 'grey',
                        opacity: !playerObject.drinks ? 1 : 0.5
                    }]}>
                        <Text style={styles.buttonText}>Trinkt nicht</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={appStyles.playerListText}>
            <Text style={{ color: 'white', paddingRight: '2%', width: '35%' }} ellipsizeMode='tail' numberOfLines={1}>{playerObject.name}</Text>
            <View style={{ width: '50%' }}>
                <TwoPartButton playerObject={player} togglePlayerDrinks={togglePlayerDrinks} />
            </View>
            <View style={{ paddingLeft: '2%' }}>
                <Button
                    onPress={() => {
                        removePlayer(playerObject);
                    }}
                    title={'✖'}
                    color={'red'}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
    },
    halfButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});


export default NameContainer;