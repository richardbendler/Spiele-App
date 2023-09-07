import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function MiniGamesMenu({ navigation }) {
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

          <TouchableOpacity onPress={() => navigation.navigate('MaexchenGame')} style={[appStyles.imageWithTextContainer, { left: 100, top: 300 }]}>
                <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                <Text style={appStyles.bottleText}>Mäxchen</Text>
          </TouchableOpacity>

          <TouchableOpacity /*onPress={() => navigation.navigate('Activity')}*/ style={[appStyles.imageWithTextContainer, { left: 330, top: 300}]}>
                <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                <Text style={appStyles.bottleText}>(Flaschendrehen)</Text>
          </TouchableOpacity>

          <View style={{ top: 415 }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Activity')} style={[appStyles.imageWithTextContainer, { left: 200, top: 550}]}>
                <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                <Text style={appStyles.bottleText}>Activity / Scharade</Text>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => navigation.navigate('DrinkCounter')} style={[appStyles.imageWithTextContainer, { left: 400, top: 550}]}>
            <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
            <Text style={appStyles.bottleText}>Getränkezähler</Text>
          </TouchableOpacity>

          <View style={{ top: 645 }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View> 
              
        </View>
      </View>
    </ImageBackground>
  );
}

export default MiniGamesMenu;