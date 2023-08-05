import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { appStyles } from '../../styles';

function MainMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <Button 
        style={appStyles.menuButtonText}
        title="Klassiker"
        onPress={() => navigation.navigate('KlassikerMenu')}
      />
      <Button 
        title="100.000 Questions" 
        onPress={() => navigation.navigate('ManyQuestionsGame')}
        /> 
        <Button 
        title="Kingscup / Klatschen" 
        //onPress={() => navigation.navigate('ManyQuestionsGame')}
        />   
      <Button
        title="Mini Games"
        onPress={() => navigation.navigate('MiniGamesMenu')}
      />
      <Button 
        title="Activity / Scharade" 
        //onPress={() => navigation.navigate('ManyQuestionsGame')}
        />  
      
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