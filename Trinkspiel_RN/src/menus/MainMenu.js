import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function MainMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  return (
    <ImageBackground source={require("../../assets/images/bar/bar_background.png")} style={{flex: 1, width: '100%'}}>
    <View style={appStyles.pageContainer}>
      <View style={[appStyles.smallPageContainer, {height: '100%', width: '100%', justifyContent: 'top'}]}>
        
        {/*<View style={appStyles.menuContainer}>*/}
          

            <Settings/>

            <View style={{position: 'absolute', top: '15%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => navigation.navigate('KlassikerMenu')} style={[appStyles.chalkboardButton, {width: '65%'}]}>
                {<Text style={appStyles.chalkboardButtonText}>Klassiker</Text>}
              </TouchableOpacity>
            </View>

            <View style={{position: 'absolute', top: '34%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => navigation.navigate('CardGamesMenu')} style={[appStyles.chalkboardButton, {width: '65%'}]}>
                <Text style={appStyles.chalkboardButtonText}>Kartenspiele</Text>
              </TouchableOpacity>
            </View>

            <View style={{position: 'absolute', top: '52%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => navigation.navigate('MiniGamesMenu')} style={[appStyles.chalkboardButton, {width: '65%'}]}>
                <Text style={appStyles.chalkboardButtonText}>Mini Games</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('DrinkCounter')} style={[appStyles.imageWithTextContainer, {height: '10%', left: '50%', top: '90%'}]} >
              <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
              <View style={{ top: '0%', right: '75%' }}>
                <Text style={appStyles.bottleText}>Getränkezähler</Text>
              </View>
            </TouchableOpacity>
            
            
        {/*</View>*/}

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