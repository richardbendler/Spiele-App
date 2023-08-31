import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';

function CardGamesMenu({ navigation }) {
  return (
    <View style={appStyles.pageContainer}>
      <View style={appStyles.smallPageContainer}>
        <View style={appStyles.menuContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Kingscup')} style={appStyles.menuButton}>
              <Text style={appStyles.menuButtonText}>Kingscup</Text>
            </TouchableOpacity>
            <TouchableOpacity /*onPress={() => navigation.navigate('Pferderennen')}*/ style={appStyles.menuButton}>
              <Text style={appStyles.menuButtonText}>(Pferderennen)</Text>
            </TouchableOpacity>
        </View>
        <SettingsButton/>
      </View>
    </View>
  );
}

export default CardGamesMenu;