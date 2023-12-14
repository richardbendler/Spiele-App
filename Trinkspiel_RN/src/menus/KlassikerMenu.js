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
          {/*<TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
              <Text style={appStyles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>*/}

          <Settings/>

          <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={[appStyles.imageWithTextContainer, {height: '28%', left: '20%', top: '21%'}]} >
              <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
              <Text style={appStyles.bottleText}>The One</Text>
          </TouchableOpacity>
          
          <View style={{ top: '49%', left: '0%', height: '1%', width: '100%' }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ManyQuestionsGame')} style={[appStyles.imageWithTextContainer, { height: '28%', left: '60%', top: '56%'}]}>
                <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                  {/* HACK: used to position Text properly */}
                  <View style={{ top: '5%', right: '75%' }}>
                    <Text style={appStyles.bottleText}>100.000{"\n"} Questions</Text>
                  </View>
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