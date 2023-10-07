import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function KlassikerMenu({ navigation }) {
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

          <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={[appStyles.imageWithTextContainer, { left: '10%', top: '15%'}]} >
              <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
              <Text style={appStyles.bottleText}>Picolo</Text>
          </TouchableOpacity>
          
          <View style={{ top: '49%', left: '0%', height: '1%', width: '100%' }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ManyQuestionsGame')} style={[appStyles.imageWithTextContainer, { left: '60%', top: '50%'}]}>
                <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                <Text style={appStyles.bottleText}>100.000 Questions</Text>
          </TouchableOpacity>

          <View style={{ top: '83%', left: '0%', height: '1%', width: '100%' }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

        </View>
      </View>
    </ImageBackground>
  );
}

export default KlassikerMenu;