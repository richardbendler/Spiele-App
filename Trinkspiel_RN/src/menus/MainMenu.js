import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function MainMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  return (
    <ImageBackground source={require("../../assets/images/bar/bar_image_complete.png")} style={{flex: 1}}>
    <View style={appStyles.pageContainer}>
      <View style={[appStyles.smallPageContainer, {height: '60%', justifyContent: 'center'}]}>
        <ImageBackground source={require("../../assets/images/bar/settings_tafel.png")} style={appStyles.imageBackgroundStyle} resizeMode="contain">
        <View style={appStyles.menuContainer}>
          

            <Settings/>



            <TouchableOpacity onPress={() => navigation.navigate('KlassikerMenu')} style={[appStyles.chalkboardButton, { marginTop: 20 }]}>
              {<Text style={appStyles.chalkboardButtonText}>Klassiker</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CardGamesMenu')} style={appStyles.chalkboardButton}>
              <Text style={appStyles.chalkboardButtonText}>Kartenspiele</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MiniGamesMenu')} style={appStyles.chalkboardButton}>
              <Text style={appStyles.chalkboardButtonText}>Mini Games</Text>
            </TouchableOpacity>
            
            
        </View>
        </ImageBackground>
        {/*SettingsButton*/}
        {/*<TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
            <Text style={appStyles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>*/}
      </View>
    </View>
    </ImageBackground>
  );
}

export default MainMenu;