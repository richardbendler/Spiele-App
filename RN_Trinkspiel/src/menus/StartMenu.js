import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import SettingsButton from './sublements/SettingsButton';
import Settings from './sublements/Settings';

const StartMenu = ({ navigation }) => {
    const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  return (
    <ImageBackground source={require("../../assets/images/bar/bar_image_complete.png")} style={{flex: 1}}>
    <Settings/>
    <View style={appStyles.pageContainer}>
        
            <View style={appStyles.smallPageContainer}>
                <View style={appStyles.menuContainer}>
                    
                    
                    


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