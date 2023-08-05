import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';

function KlassikerMenu({ navigation }) {
  return (
    <View style={appStyles.menuContainer}>
      <TouchableOpacity /*onPress={() => navigation.navigate('ManyQuestionsGame')}*/ style={appStyles.menuButton}>
        <Text style={appStyles.menuButtonText}>Vorglühen</Text>
      </TouchableOpacity>
      <TouchableOpacity /*onPress={() => navigation.navigate('ManyQuestionsGame')}*/ style={appStyles.menuButton}>
        <Text style={appStyles.menuButtonText}>Schon gut dabei</Text>
      </TouchableOpacity>
      <TouchableOpacity /*onPress={() => navigation.navigate('ManyQuestionsGame')}*/ style={appStyles.menuButton}>
        <Text style={appStyles.menuButtonText}>Heiß</Text>
      </TouchableOpacity>
      <TouchableOpacity /*onPress={() => navigation.navigate('ManyQuestionsGame')}*/ style={appStyles.menuButton}>
        <Text style={appStyles.menuButtonText}>Wahrheit oder Pflicht</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default KlassikerMenu;