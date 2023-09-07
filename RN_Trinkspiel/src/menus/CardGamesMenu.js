import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function CardGamesMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  return (
    <ImageBackground source={require("../../assets/images/bar/bar_background_without_bar_zoomed.png")} style={{flex: 1}}>
      <View style={appStyles.flexiblePageContainer}>
        <View style={appStyles.smallPageContainer}>
          
          {/*SettingsButton*/}
          <TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
              <Text style={appStyles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>

          <Settings/>

          <TouchableOpacity onPress={() => navigation.navigate('Kingscup')} style={[appStyles.imageWithTextContainer, { left: 300, top: 300 }]}>
                <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                <Text style={appStyles.bottleText}>Kingscup</Text>
          </TouchableOpacity>

          <View style={{ top: 415 }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

          <TouchableOpacity /*onPress={() => navigation.navigate('Pferderennen')}*/ style={[appStyles.imageWithTextContainer, { left: 200, top: 550}]}>
                <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                <Text style={appStyles.bottleText}>(Pferderennen)</Text>
          </TouchableOpacity>

          <View style={{ top: 645 }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

        </View>
      </View>
    </ImageBackground>
  );
}

export default CardGamesMenu;