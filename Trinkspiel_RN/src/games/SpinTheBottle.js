import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, Dimensions, PanResponder, ImageBackground } from 'react-native';

const SpinTheBottle = () => {
  const [sips, setSips] = useState(generateRandomSips());
  const rotationValue = useRef(new Animated.Value(0)).current;
  const lastRotation = useRef(0);

  function generateRandomSips() {
    return Math.floor(Math.random() * 5) + 1;
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        rotationValue.stopAnimation();
        rotationValue.setOffset(lastRotation.current);
        rotationValue.setValue(0);
      },
      onPanResponderMove: Animated.event([null, { dx: rotationValue }], { useNativeDriver: false }),
      onPanResponderRelease: (e, { vx }) => {
        rotationValue.flattenOffset();
        Animated.timing(rotationValue, {
          toValue: vx * 120, // Adjust this multiplier to increase/decrease the spin distance after release
          duration: 2000,
          useNativeDriver: true
        }).start(() => {
          lastRotation.current += rotationValue._value;
          setSips(generateRandomSips());
        });
      }
    })
  ).current;

  const rotation = rotationValue.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg']
  });

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>
        <Animated.View 
          {...panResponder.panHandlers} 
          style={{ transform: [{ rotate: rotation }] }}
        >
          <Image source={require('../../assets/images/bottles/bottle_003.png')} style={styles.bottle} />
        </Animated.View>
        <Text style={styles.hintText}>Drehe die Flasche mit dem Finger</Text>
        <Text style={styles.sipsTextDisplay}>{sips} Schlucke!</Text>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sipsTextDisplay: {
    fontSize: 40,
    position: 'absolute',
    top: height * 0.1,
    color: '#333',
    fontWeight: 'bold',
    color: 'white',
  },
  bottle: {
    width: 100,
    height: 250,
  },
  hintText: {
    marginTop: 20,
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    color: 'white',
  }
});

export default SpinTheBottle;
