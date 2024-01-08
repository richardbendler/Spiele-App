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
          {/*<TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
              <Text style={appStyles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>*/}

          <Settings/>

          <TouchableOpacity onPress={() => navigation.navigate('Kingscup')} style={[appStyles.imageWithTextContainer, { height: '20%', left: '20%', top: '36%'}]}>
                <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                {/* HACK: used to position Text properly */}
                <View style={{ top: '7%', right: '75%' }}>
                  <Text style={appStyles.bottleText}>Kingscup</Text>
                </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Kingscup')} style={[appStyles.imageWithTextContainer, { height: '20%', left: '60%', top: '36%'}]} disabled={true}>
                <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                {/* HACK: used to position Text properly */}
                <View style={{ top: '12%', right: '75%' }}>
                  <Text style={appStyles.bottleText}>Schöneberg</Text>
                </View>
          </TouchableOpacity>

          <View style={{ top: '56%', left: '0%', height: '1%', width: '100%' }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('HorseRace')} style={[appStyles.imageWithTextContainer, { height: '20%', left: '15%', top: '71%'}]} disabled={true}>
                <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                {/* HACK: used to position Text properly */}
                <View style={{ top: '12%', right: '75%' }}>
                  <Text style={appStyles.bottleText}>6 by 6</Text>
                </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('HorseRace')} style={[appStyles.imageWithTextContainer, { height: '20%', left: '60%', top: '71%'}]}>
                <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                {/* HACK: used to position Text properly */}
                <View style={{ top: '10%', right: '75%' }}>
                  <Text style={appStyles.bottleText}>Pferderennen</Text>
                </View>
          </TouchableOpacity>

          
          

          <View style={{ top: '90%', left: '0%', height: '1%', width: '100%' }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

        </View>
      </View>
    </ImageBackground>
  );
}

export default CardGamesMenu;