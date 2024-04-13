import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import SettingsButton from './sublements/SettingsButton';
import Settings from './sublements/Settings';
import NetInfo from "@react-native-community/netinfo";

//Fonts
import { Raleway_200ExtraLight } from "@expo-google-fonts/raleway";
import { Quicksand_300Light } from "@expo-google-fonts/quicksand";
import { useFonts } from "expo-font";

//HANDLE SQL REQUESTS
const handleSqlRequest = async (sqlRequest) => {
    //TODO: remove this function and it's references. This was used for the old API to query data. It's not clear if the API calls in this file are actually required.
};

const handleTestAPI = async () => {
    try {
        const response = await fetch('https://www.codeyourapp.de/tools/query.php?count=5&mode=0')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Senden des Texts.');
                }
                //console.log(response);
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

    const [backgroundAspectRatio, setBackgroundAspectRatio] = useState(100); // Standardwert ist 1
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const handleImageLoad = (e) => {
        const { width, height } = e.nativeEvent.source;
        const aspectRatio = width / height;
        setBackgroundAspectRatio(aspectRatio);
      };

    // Berechnen der Breite des Hintergrundbildes basierend auf dem Seitenverhältnis
    const backgroundImageWidth = windowHeight * backgroundAspectRatio;



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

     
    const [fontsLoaded] = useFonts({
        Raleway_200ExtraLight,
        Quicksand_300Light,
        });
        if (!fontsLoaded) {
        return <View style={{justifyContent:"center", alignItems:"center"}}>
            <Image source={require('../../assets/images/logo/adaptive_logo_weinglas_transparent.png')} style={appStyles.bottleButton} />
            <Text>Loading...</Text>
        </View> ;
    }

    

  return (
    <View style={{alignItems: 'flex-start'}}>
      <ImageBackground source={require("../../assets/images/bar/bar_background_without_bar.png")} 
      style={{ height: windowHeight, width: backgroundImageWidth }}
      onLoad={handleImageLoad}
      >
        <View style={{
            width: windowWidth,
            height: windowHeight, // Stellt sicher, dass die Menü-Container die gleiche Breite wie das Hintergrundbild haben
            flexDirection: 'row',
            justifyContent: 'center', // Anpassen nach Bedarf für die Platzierung der Menübuttons
            alignItems: 'center', // Zentriert die Menübuttons vertikal
        }}>
            <Settings/>
                                        
                    <Text>
                        {isConnected ? '' : '🌍'} {/*  TODO: löschen/ersetzen */}
                    </Text>

                    {/* SCHILD */}
                    <View style={{position: 'absolute', top: '10%', width: '40%', height: '10%'}}>
                        <Image source={require('../../assets/images/bar/schild.png')} style={appStyles.bottleButton} />
                    </View>


                        {/* 🍾 FLASCHEN 🍾*/}
                        <Image source={require('../../assets/images/bottles/bottle_001.png')} style={{position: 'absolute', resizeMode: 'contain', left: '3%', top: '19%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_002.png')} style={{position: 'absolute', resizeMode: 'contain', left: '28%', top: '19%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_003.png')} style={{position: 'absolute', resizeMode: 'contain', left: '50%', top: '19%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_004.png')} style={{position: 'absolute', resizeMode: 'contain', left: '67%', top: '19%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_005.png')} style={{position: 'absolute', resizeMode: 'contain', left: '90%', top: '19%', width: '19%', height: '12%', }}/>

                        <Image source={require('../../assets/images/bottles/bottle_009.png')} style={{position: 'absolute', resizeMode: 'contain', left: '-7%', top: '38%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_007.png')} style={{position: 'absolute', resizeMode: 'contain', left: '14%', top: '38%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_008.png')} style={{position: 'absolute', resizeMode: 'contain', left: '32%', top: '38%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_006.png')} style={{position: 'absolute', resizeMode: 'contain', left: '50%', top: '38%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_010.png')} style={{position: 'absolute', resizeMode: 'contain', left: '66%', top: '38%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_013.png')} style={{position: 'absolute', resizeMode: 'contain', left: '88%', top: '38%', width: '19%', height: '12%', }}/>

                        <Image source={require('../../assets/images/bottles/bottle_012.png')} style={{position: 'absolute', resizeMode: 'contain', left: '0%', top: '56%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_011.png')} style={{position: 'absolute', resizeMode: 'contain', left: '27%', top: '56%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_014.png')} style={{position: 'absolute', resizeMode: 'contain', left: '50%', top: '56%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_015.png')} style={{position: 'absolute', resizeMode: 'contain', left: '70%', top: '56%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_016.png')} style={{position: 'absolute', resizeMode: 'contain', left: '90%', top: '56%', width: '19%', height: '12%', }}/>

                        


                    {/* REGAL 1 */}
                    <View style={{ position: 'absolute', top: '31%', alignItems: 'center', justifyContent: 'bottm' }}>
                        <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                    </View>




                    {/* REGAL 2 */}
                    <View style={{ position: 'absolute', top: '50%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                        <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.chalkboardButton}>
                        <Text style={appStyles.chalkboardButtonText}>Spielen</Text>
                    </TouchableOpacity>

                    {/*<Text>{words.slice(0,50)}</Text>
                    <Text>--------------------------</Text>
                    <Text>{ret.slice(0,50)}</Text>*/}

                    {/*<TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
                        <Text style={appStyles.menuButtonText}>Custom Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
                        <Text style={appStyles.menuButtonText}>Eigene Karten</Text>
                    </TouchableOpacity>*/}

                </View>

                {/*<TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
                    <Text style={appStyles.settingsButtonText}>⚙️</Text>
                </TouchableOpacity>*/}
            

        </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    backgroundImage: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    },
  });

export default StartMenu;
