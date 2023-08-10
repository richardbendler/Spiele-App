import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';

function MiniGamesMenu({ navigation }) {
  return (
    <View style={appStyles.pageContainer}>
      <View style={appStyles.smallPageContainer}>
        <View style={appStyles.menuContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('MaexchenGame')} style={appStyles.menuButton}>
              <Text style={appStyles.menuButtonText}>Mäxchen</Text>
            </TouchableOpacity>
        </View>
        <SettingsButton/>
      </View>
    </View>
  );
}

export default MiniGamesMenu;