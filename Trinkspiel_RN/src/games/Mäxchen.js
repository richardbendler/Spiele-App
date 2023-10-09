import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, Image, Animated, StyleSheet, ImageBackground } from 'react-native';
//import { Audio } from 'expo-av'; //TODO: wieder nutzen

// Sie müssten die tatsächlichen Pfade zu Ihren Würfelbildern angeben.
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

  const handleChallenge = () => {
    setDiceHidden(false);
  };

  const rollDice = async () => {
    setDiceHidden(false);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    // Reset the playback position and play the dice sound
    //await diceSound.setPositionAsync(0); //TODO: wieder nutzen
    //await diceSound.playAsync(); //TODO: wieder nutzen

    // Update the dice result in the middle of the animation
    setTimeout(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 1500);
  };

  const hideDice = () => {
    setDiceHidden(true);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '3600deg'],  // 10 full rotations
  });

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Mäxchen</Text>
        <TouchableOpacity style={styles.button} onPress={rollDice}>
          <Text style={styles.buttonText}>Würfeln</Text>
        </TouchableOpacity>
        {!isDiceHidden && (
          <View>
            <Animated.Image style={{ ...styles.dice, transform: [{ rotate: rotateInterpolate }] }} source={diceImages[dice1]} />
            <Animated.Image style={{ ...styles.dice, transform: [{ rotate: rotateInterpolate }] }} source={diceImages[dice2]} />
          </View>
        )}
        {isDiceHidden && gameStarted &&
          <TouchableOpacity style={styles.button} onPress={handleChallenge}>
            <Text style={styles.buttonText}>Anzweifeln</Text>
          </TouchableOpacity>
        }
        {!isDiceHidden && 
          <TouchableOpacity style={styles.button} onPress={hideDice}>
            <Text style={styles.buttonText}>Würfel in Becher zurücklegen</Text>
          </TouchableOpacity>
        }
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  button: {
    backgroundColor: '#A0522D', // dunkelbraune Farbe, die an Holz erinnert
    padding: 10,
    borderRadius: 5,
    margin: 10,
    elevation: 5, // fügt Schatten auf Android hinzu
    shadowColor: '#000', // fügt Schatten auf iOS hinzu
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