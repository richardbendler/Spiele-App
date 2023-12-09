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
          {/*<TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
              <Text style={appStyles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>*/}

          <Settings/>

          <TouchableOpacity onPress={() => navigation.navigate('MaexchenGame')} style={[appStyles.imageWithTextContainer, { left: '10%', top: '15%'}]}>
                <Image source={require('../../assets/images/bottles/bottle_004.png')} style={appStyles.bottleButton}/>
                {/* HACK: used to position Text properly */}
                <View style={{ top: '13%', right: '75%' }}>
                  <Text style={appStyles.bottleText}>Mäxchen</Text>
                </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SpinTheBottle')} style={[appStyles.imageWithTextContainer, { left: '60%', top: '15%'}]}>
                <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                {/* HACK: used to position Text properly */}
                <View style={{ top: '16%', right: '75%' }}>
                  <Text style={appStyles.bottleText}>Flaschendrehen</Text>
                </View>
          </TouchableOpacity>

          <View style={{ top: '49%', left: '0%', height: '1%', width: '100%' }}>
              <Image source={require('../../assets/images/bar/shelf.png')} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Activity')} style={[appStyles.imageWithTextContainer, { left: '13%', top: '50%'}]}>
                <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                {/* HACK: used to position Text properly */}
                <View style={{ top: '10%', right: '75%' }}>
                  <Text style={appStyles.bottleText}>Activity {"\n"}Scharade</Text>
                </View>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => navigation.navigate('DrinkCounter')} style={[appStyles.imageWithTextContainer, { left: '60%', top: '50%'}]}>
            <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
            {/* HACK: used to position Text properly */}
            <View style={{ top: '15%', right: '75%' }}>
              <Text style={appStyles.bottleText}>Getränkezähler</Text>
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

export default MiniGamesMenu;