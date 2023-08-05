import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

function MiniGamesMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <Button 
        title="Mäxchen" 
        onPress={() => navigation.navigate('MaexchenGame')}
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

export default MiniGamesMenu;