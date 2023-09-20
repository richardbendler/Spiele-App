import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
//TODO: import SettingsButton from './sublements/SettingsButton';
//TODO: import Settings from './sublements/Settings';

const StartMenu = ({ navigation }) => {
    //TODO: const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);
    //<ImageBackground source={require("../../assets/images/bar/bar_image_complete.png")} style={{flex: 1}}>
    /* TODO: <Settings/> */
    //</ImageBackground>
  return (
    
    
    <View style={appStyles.pageContainer}>
        
            <View style={appStyles.smallPageContainer}>
                <View style={appStyles.menuContainer}>
                    
                    
                    


                    <TouchableOpacity /*onPress={() => navigation.navigate('MainMenu')}*/ style={appStyles.chalkboardButton}>
                        <Text style={appStyles.chalkboardButtonText}>Spielen</Text>
                    </TouchableOpacity>
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
            </View>
        
    </View>
    
  );
};

export default StartMenu;