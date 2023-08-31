import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';

function KlassikerMenu({ navigation }) {
  return (
    <View style={appStyles.pageContainer}>
      <View style={appStyles.smallPageContainer}>
        <View style={appStyles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('PicoloGame')} style={appStyles.menuButton}>
            <Text style={appStyles.menuButtonText}>Picolo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ManyQuestionsGame')} style={appStyles.menuButton}>
            <Text style={appStyles.menuButtonText}>100.000 Questions</Text>
          </TouchableOpacity>
        </View>
        <SettingsButton/>
      </View>
    </View>
  );
}

export default KlassikerMenu;