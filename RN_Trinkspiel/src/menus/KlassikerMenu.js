import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';

function KlassikerMenu({ navigation }) {
  return (
    <View style={appStyles.pageContainer}>
      <View style={appStyles.smallPageContainer}>
        <View style={appStyles.menuContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('VorglühenGame')} style={appStyles.menuButton}>
            <Text style={appStyles.menuButtonText}>Vorglühen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SchonGutDabeiGame')} style={appStyles.menuButton}>
            <Text style={appStyles.menuButtonText}>Schon gut dabei</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HeißGame')} style={appStyles.menuButton}>
            <Text style={appStyles.menuButtonText}>Heiß</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('WahrheitOderPflichtGame')} style={appStyles.menuButton}>
            <Text style={appStyles.menuButtonText}>Wahrheit oder Pflicht</Text>
          </TouchableOpacity>
        </View>
        <SettingsButton/>
      </View>
    </View>
  );
}

export default KlassikerMenu;