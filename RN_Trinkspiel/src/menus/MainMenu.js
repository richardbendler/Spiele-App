import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { appStyles } from '../../styles';

function MainMenu({ navigation }) {
  return (
    <View style={appStyles.menuContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('KlassikerMenu')} style={appStyles.menuButton}>
          <Text style={appStyles.menuButtonText}>Klassiker</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManyQuestionsGame')} style={appStyles.menuButton}>
          <Text style={appStyles.menuButtonText}>100.000 Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity /*onPress={() => navigation.navigate('ManyQuestionsGame')}*/ style={appStyles.menuButton}>
          <Text style={appStyles.menuButtonText}>Kings Cup / Klatschen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MiniGamesMenu')} style={appStyles.menuButton}>
          <Text style={appStyles.menuButtonText}>Mini Games</Text>
        </TouchableOpacity>
        <TouchableOpacity /*onPress={() => navigation.navigate('ManyQuestionsGame')}*/ style={appStyles.menuButton}>
          <Text style={appStyles.menuButtonText}>Activity / Scharade</Text>
        </TouchableOpacity>

      
      
      {/* Fügen Sie hier weitere Buttons hinzu... */}
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

export default MainMenu;