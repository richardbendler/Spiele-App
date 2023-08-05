import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

function KlassikerMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <Button 
        title="Vorglühen" 
        //onPress={() => navigation.navigate('ManyQuestionsGame')}
        /> 
    <Button 
        title="Schon gut dabei" 
        //onPress={() => navigation.navigate('ManyQuestionsGame')}
        /> 
    <Button 
        title="Heiß" 
        //onPress={() => navigation.navigate('ManyQuestionsGame')}
        /> 
    <Button 
        title="Wahrheit oder Pflicht" 
        //onPress={() => navigation.navigate('ManyQuestionsGame')}
        /> 


      
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