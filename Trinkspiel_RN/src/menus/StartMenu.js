import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import SettingsButton from './sublements/SettingsButton';
import Settings from './sublements/Settings';
import { useTranslation } from '../i18n';
import NetInfo from "@react-native-community/netinfo";

//Fonts
//Die Benennungen der Imports kann man mit Autocomplete herausfinden
//Wichtig: Schriftarten mÃ¼ssen weiter unten noch in fontsLoaded hinzugefÃ¼gt werden
//import { Raleway_200ExtraLight } from "@expo-google-fonts/raleway";
import { Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
//import { Quicksand_300Bold } from "@expo-google-fonts/quicksand";
import { Caveat_400Regular, Caveat_500Medium, Caveat_600SemiBold, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { useFonts } from "expo-font";

//HANDLE SQL REQUESTS
const handleSqlRequest = async (sqlRequest) => {
    //TODO: remove this function and it's references. This was used for the old API to query data. It's not clear if the API calls in this file are actually required.
};

// API_DISABLED: Remote test fetch disabled while the app serves local sample texts.
/* API_RESTORE_STEP: Uncomment this helper to hit the test API again.
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
                throw error; // Fehler weiterwerfen, um ihn in der nÃ¤chsthÃ¶heren Funktion zu behandeln
            });

        return response; // RÃ¼ckgabe der tatsÃ¤chlichen Antwort
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
        throw error; // Fehler weiterwerfen, um ihn in der nÃ¤chsthÃ¶heren Funktion zu behandeln
    }
};

*/
const StartMenu = ({ navigation }) => {
    const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);
    const { t } = useTranslation();
    const startText = useMemo(() => t('startMenu'), [t]);
    const commonText = useMemo(() => t('common'), [t]);

    const [backgroundAspectRatio, setBackgroundAspectRatio] = useState(100); // Standardwert ist 1
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const handleImageLoad = (e) => {
        const { width, height } = e.nativeEvent.source;
        const aspectRatio = width / height;
        setBackgroundAspectRatio(aspectRatio);
      };

    // Berechnen der Breite des Hintergrundbildes basierend auf dem SeitenverhÃ¤ltnis
    const backgroundImageWidth = windowHeight * backgroundAspectRatio;



    //Test Internet Connection
    const [isConnected, setIsConnected] = useState(true);
    useEffect(() => {
        // Ãœberwache die Internetverbindung
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected);
        });
    
        return () => {
          // Stelle sicher, dass du das Abonnement auflÃ¶st, um Speicherlecks zu vermeiden
          unsubscribe();
        };
      }, []);

    //Zugriff Test-API
    // API_DISABLED: skip the remote test endpoint while offline data is active.
    /* API_RESTORE_STEP: Uncomment this block to fetch showcase data from the API again.
    const [ret, setRet] = useState(["Platzhalter"]);
    useEffect(() => {
        const fetchData = async () => {
        const result = await handleTestAPI();
        setRet(JSON.stringify(result));
    };
    fetchData();
    }, []);

    */
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
        Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold,
        Caveat_400Regular, Caveat_500Medium, Caveat_600SemiBold, Caveat_700Bold
        });
        if (!fontsLoaded) {
        return <View style={{justifyContent:"center", alignItems:"center"}}>
            <Image source={require('../../assets/images/logo/adaptive_logo_weinglas_transparent.png')} style={appStyles.bottleButton} />
            <Text>{commonText.loading}</Text>
        </View> ;
    }

    

  return (
    <View style={{alignItems: 'flex-start'}}>
      <ImageBackground source={require("../../assets/images/bar/bar_background.png")} 
      style={{ height: windowHeight, width: backgroundImageWidth }}
      onLoad={handleImageLoad}
      >
        <View style={{
            width: windowWidth,
            height: windowHeight, // Stellt sicher, dass die MenÃ¼-Container die gleiche Breite wie das Hintergrundbild haben
            flexDirection: 'row',
            justifyContent: 'center', // Anpassen nach Bedarf fÃ¼r die Platzierung der MenÃ¼buttons
            alignItems: 'center', // Zentriert die MenÃ¼buttons vertikal
        }}>
            <Settings/>
                                        
                    <Text>
                        {isConnected ? '' : 'ðŸŒ'} {/*  TODO: lÃ¶schen/ersetzen */}
                    </Text>

                    {/* SCHILD */}
                    <View style={{position: 'absolute', top: '10%', width: '40%', height: '10%'}}>
                        <Image source={require('../../assets/images/bar/schild.png')} style={appStyles.bottleButton} />
                    </View>

                    {/* SCHRIFTZUG SUBTEXT */}
                    <View style={{position: 'absolute', top: '6%', width: '100%'}}>
                        <Text style={[{textAlign: 'center', color: 'black', fontFamily: 'Caveat_400Regular', fontSize: 20}]}>Die eine Trinkspielapp, die alle anderen ersetzt!</Text>
                    </View>


                        {/* ðŸ¾ FLASCHEN ðŸ¾*/}
                        <Image source={require('../../assets/images/bottles/bottle_001.png')} style={{position: 'absolute', resizeMode: 'contain', left: '3%', top: '20%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_002.png')} style={{position: 'absolute', resizeMode: 'contain', left: '28%', top: '20%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_003.png')} style={{position: 'absolute', resizeMode: 'contain', left: '50%', top: '20%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_004.png')} style={{position: 'absolute', resizeMode: 'contain', left: '67%', top: '20%', width: '19%', height: '12%', }}/>
                        <Image source={require('../../assets/images/bottles/bottle_005.png')} style={{position: 'absolute', resizeMode: 'contain', left: '90%', top: '20%', width: '19%', height: '12%', }}/>

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
                    <View style={{ position: 'absolute', top: '32%', alignItems: 'center', justifyContent: 'bottom' }}>
                        <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                    </View>




                    {/* REGAL 2 */}
                    <View style={{ position: 'absolute', top: '50%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottom' }}>
                        <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.chalkboardButton}>
                        <Text style={appStyles.chalkboardButtonText}>{startText.playButton}</Text>
                    </TouchableOpacity>
                    {startText?.disclaimer ? (
                        <Text style={styles.disclaimerText}>{startText.disclaimer}</Text>
                    ) : null}

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
                    <Text style={appStyles.settingsButtonText}>âš™ï¸</Text>
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
    disclaimerText: {
      marginTop: 16,
      color: 'rgba(255,255,255,0.7)',
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
      paddingHorizontal: 24,
      fontFamily: 'Quicksand_300Light',
    },
  });

export default StartMenu;

