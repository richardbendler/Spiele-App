import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, Image, Animated, StyleSheet, ImageBackground } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';
//import { Audio } from 'expo-av'; //TODO: wieder nutzen

// Sie muessten die tatsaechlichen Pfade zu Ihren Wuerfelbildern angeben.
const diceImages = {
  1: require('../../assets/images/würfel_1.png'),
  2: require('../../assets/images/würfel_2.png'),
  3: require('../../assets/images/würfel_3.png'),
  4: require('../../assets/images/würfel_4.png'),
  5: require('../../assets/images/würfel_5.png'),
  6: require('../../assets/images/würfel_6.png'),
};

//const diceSound = new Audio.Sound(); //TODO: wieder nutzen
//diceSound.loadAsync(require('../../assets/sounds/dice_shake.mp3')); //TODO: wieder nutzen

const MaexchenGame = () => {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isDiceHidden, setDiceHidden] = useState(true);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [gameStarted, setGameStarted] = useState(false);
  
  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

  const handleChallenge = () => {
    setDiceHidden(false);
  };

  const rollDice = async () => {
    setDiceHidden(false);
    setGameStarted(true);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    // Reset the playback position and play the dice sound
    //await diceSound.setPositionAsync(0); //TODO: wieder nutzen
    //await diceSound.playAsync(); //TODO: wieder nutzen

    // Update the dice result in the middle of the animation
    //setTimeout(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    //}, 1500);
  };

  const hideDice = () => {
    setDiceHidden(true);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '7200deg'],  // 10 full rotations
  });

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
        <View style={{alignItems: 'center', height:'60%', width: '80%'}}>
          <Text style={appStyles.textHeader1}>Maexchen</Text>
          {isDiceHidden && (
          <TouchableOpacity style={[appStyles.gameActionButton, {margin: 40}]} onPress={rollDice}>
            <Text style={appStyles.gameActionButtonText}>Wuerfeln</Text>
          </TouchableOpacity>
          )}

          {!gameStarted && (
            <Text style={[appStyles.textNormal1, {textAlign: 'center'}]}>{"Du moechtest die Regeln lesen? Dann klicke unten auf den Info-Button."}</Text>
          )}
          
          {isDiceHidden && gameStarted &&
            <View>
              <Text style={[appStyles.textNormal2, {textAlign: 'center'}]}>{"Du glaubst der vorherigen Person nicht? Dann zweifel an:"}</Text>
              <TouchableOpacity style={[appStyles.gameActionButton, {margin: 40}]} onPress={handleChallenge}>
                <Text style={appStyles.gameActionButtonText}>Anzweifeln</Text>
              </TouchableOpacity>
            </View>
          }
          {!isDiceHidden && 
            <View>
              <TouchableOpacity style={[appStyles.gameActionButton, {margin: 40}]} onPress={hideDice}>
                <Text style={appStyles.gameActionButtonText}>Wuerfel in Becher zuruecklegen</Text>
              </TouchableOpacity>
            </View>
          }
          {!isDiceHidden && (
            <View>
              <Animated.Image style={{ ...styles.dice, transform: [{ rotate: rotateInterpolate }] }} source={diceImages[dice1]} />
              <Animated.Image style={{ ...styles.dice, transform: [{ rotate: rotateInterpolate }] }} source={diceImages[dice2]} />
            </View>
          )}

          
        </View>

        <InfoText header={"Maexchen!"} rules={"Wuerfelt der Reihe um so, dass nur ihr selbst das Ergebnis seht. Verdeckt anschliessend euer Ergebnis und gebt das Handy zur naechsten Person weiter. Diese Person muss nun ein hoeheres Ergebnis wuerfeln. Sollte sie das nicht schaffen, muss sie ein hoeheres Ergebnis bluffen. \n\n Die beiden Wuerfelergebnisse werden immer aneinandergehaengt mit der hoeheren Zahl am Anfang. Eine 4 und eine 5 wuerden also die Zahl 54 ergeben, eine 3 und eine 2 die 32. Pasches sind immer ueber den normalen Werten und das allerhoechste Ergebnis ist 21. \n\n Wenn man nun glaub, die vorherige Person blufft, kann man anzweifeln. Wer erfolgreich angezweifelt wird, muss trinken. Wer faelschlich anzweifelt, muss ebenfalls trinken."}/>
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {}]}>
          <Text style={appStyles.infoButtonText}>Regeln</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#A0522D', // dunkelbraune Farbe, die an Holz erinnert
    padding: 10,
    borderRadius: 5,
    margin: 10,
    elevation: 5, // fuegt Schatten auf Android hinzu
    shadowColor: '#000', // fuegt Schatten auf iOS hinzu
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dice: {
    width: 100,
    height: 100,
    margin: 10,
  },
});

export default MaexchenGame;
