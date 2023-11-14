import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import SettingsButton from './sublements/SettingsButton';
import Settings from './sublements/Settings';
import NetInfo from "@react-native-community/netinfo";

//HANDLE SQL REQUESTS
const handleSqlRequest = async (sqlRequest) => {
    const token = "Bearer "+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFwcCJ9LCJpYXQiOjE2OTExNzU2OTV9.TqiVCGJdiq8lgn9-akwwzoRLxR5KZhllRXr_yWQL9JE"; // Token generieren und hier einfügen
    ret = '';
    try {
        //const response = await fetch('http://45.9.63.16:3000/api/sqlRequest', {
        const response = await fetch('https://my-tournament.org:8443/api/sqlRequest', {
        //https nutzt Port 443
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ sqlRequest }),
        });
    
        if (response.ok) {
        const responseText = await response.text();
        ret = JSON.parse(responseText);
        } else {
            console.log(response)
            console.error('Fehler beim Senden des Texts.');
        }
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
    }
    //console.log(ret);
    return ret;
};

const handleTestAPI = async () => {
    try {
        const response = await fetch('https://www.codeyourapp.de/tools/query.php?count=5&mode=0')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Senden des Texts.');
                }
                console.log(response);
                return response.text();
            })
            .catch(error => {
                console.error('Fehler bei der Anfrage:', error);
                throw error; // Fehler weiterwerfen, um ihn in der nächsthöheren Funktion zu behandeln
            });

        return response; // Rückgabe der tatsächlichen Antwort
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
        throw error; // Fehler weiterwerfen, um ihn in der nächsthöheren Funktion zu behandeln
    }
};

const StartMenu = ({ navigation }) => {
    const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

    //Test Internet Connection
    const [isConnected, setIsConnected] = useState(true);
    useEffect(() => {
        // Überwache die Internetverbindung
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected);
        });
    
        return () => {
          // Stelle sicher, dass du das Abonnement auflöst, um Speicherlecks zu vermeiden
          unsubscribe();
        };
      }, []);

    //Zugriff Test-API
    const [ret, setRet] = useState(["Platzhalter"]);
    useEffect(() => {
        const fetchData = async () => {
        const result = await handleTestAPI();
        setRet(JSON.stringify(result));
    };
    fetchData();
    }, []);

     //Activity
    const [words, setWords] = useState(["Platzhalterfrage"]);
    useEffect(() => {
        const fetchData = async () => {
        const result = await handleSqlRequest('SELECT * FROM `game_activity_words`');
        setWords(JSON.stringify(result));
    };
    fetchData();
    }, []);

     


  return (
    <ImageBackground source={require("../../assets/images/bar/bar_image_complete.png")} style={{flex: 1}}>
    <Settings/>
    <View style={appStyles.pageContainer}>
        
            <View style={appStyles.smallPageContainer}>
                <View style={appStyles.menuContainer}>
                    
                    
                    <Text>
                        {isConnected ? '' : 'Du bist nicht mit dem Internet verbunden...'}
                    </Text>


                    <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.chalkboardButton}>
                        <Text style={appStyles.chalkboardButtonText}>Spielen</Text>
                    </TouchableOpacity>

                    <Text>{words[0].content}</Text>
                    <Text>--------------------------</Text>
                    <Text>{ret}</Text>

                    {/*<TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
                        <Text style={appStyles.menuButtonText}>Custom Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
                        <Text style={appStyles.menuButtonText}>Eigene Karten</Text>
                    </TouchableOpacity>*/}

                

                    
                </View>

                <TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
                    <Text style={appStyles.settingsButtonText}>⚙️</Text>
                </TouchableOpacity>
            </View>
        
    </View>
    </ImageBackground>
  );
};

export default StartMenu;