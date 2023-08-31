import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';

function MainMenu({ navigation }) {
  return (
    <View style={appStyles.pageContainer}>
      <View style={appStyles.smallPageContainer}>
        <View style={appStyles.menuContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('KlassikerMenu')} style={appStyles.menuButton}>
              <Text style={appStyles.menuButtonText}>Klassiker</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CardGamesMenu')} style={appStyles.menuButton}>
              <Text style={appStyles.menuButtonText}>Kartenspiele</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MiniGamesMenu')} style={appStyles.menuButton}>
              <Text style={appStyles.menuButtonText}>Mini Games</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('DrinkCounter')} style={appStyles.menuButton}>
              <Text style={appStyles.menuButtonText}>Getränkezähler</Text>
            </TouchableOpacity>
        </View>
        <SettingsButton/>
      </View>
    </View>
  );
}

export default MainMenu;