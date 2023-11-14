import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import SettingsButton from './sublements/SettingsButton';
import Settings from './sublements/Settings';
import NetInfo from "@react-native-community/netinfo";


const StartMenu = ({ navigation }) => {
    const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

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


  return (
    <ImageBackground source={require("../../assets/images/bar/bar_image_complete.png")} style={{flex: 1}}>
    <Settings/>
    <View style={appStyles.pageContainer}>
        
            <View style={appStyles.smallPageContainer}>
                <View style={appStyles.menuContainer}>
                    
                    
                    <Text>
                        {isConnected ? 'Du bist mit dem Internet verbunden.' : 'Du bist nicht mit dem Internet verbunden.'}
                    </Text>


                    <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.chalkboardButton}>
                        <Text style={appStyles.chalkboardButtonText}>Spielen</Text>
                    </TouchableOpacity>
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