import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';

function MiniGamesMenu({ navigation }) {
  return (
    <View style={appStyles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('MaexchenGame')} style={appStyles.menuButton}>
          <Text style={appStyles.menuButtonText}>Mäxchen</Text>
        </TouchableOpacity>
    </View>
  );
}

export default MiniGamesMenu;