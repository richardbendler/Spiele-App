// Import necessary React and React Native modules
import React, { useState, useContext, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, Dimensions, PanResponder, ImageBackground } from 'react-native';
import { VariablesContext } from '../../VariablesContext';
import Question from './sublements/Question';
import { deleteHashtags, replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';
import InfoText from './sublements/InfoText';
import { appStyles } from '../../styles';

// Main component for the Spin the Bottle game
const SpinTheBottle = ({route }) => {
  const textsWahrheitSpinTheBottle = shuffleArrayFisherYates(route.params.textsWahrheitSpinTheBottle);
  const textsPflichtSpinTheBottle = shuffleArrayFisherYates(route.params.textsPflichtSpinTheBottle);
  
  const [displayedText, setDisplayedText] = useState('');

  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

  // State variable for the number of sips, initialized with a random value
  const [sips, setSips] = useState(generateRandomSips());
  // Ref variable for the rotation value of the bottle, initialized with 0
  const rotationValue = useRef(new Animated.Value(0)).current;
  // Ref variable for the last rotation position, initialized with 0
  const lastRotation = useRef(0);

  // Function to generate a random number of sips (between 1 and 5)
  function generateRandomSips() {
    return Math.floor(Math.random() * 5) + 1;
  }

  // Creating a PanResponder object to handle touch inputs
  const panResponder = useRef(
    PanResponder.create({
      // Function that determines whether this PanResponder should start responding to touch starts
      onStartShouldSetPanResponder: () => true,
      // Function called on touch start
      onPanResponderGrant: () => {
        // Stops any current animation of the bottle
        rotationValue.stopAnimation();
        // Sets the rotation offset to the current value of lastRotation
        rotationValue.setOffset(lastRotation.current);
        // Sets the rotation value to 0
        rotationValue.setValue(0);
      },
      // Function called on touch move (not used but could be useful for future enhancements)
      onPanResponderMove: Animated.event([null, { dx: rotationValue }], { useNativeDriver: false }),
      // Funktion, die bei Freigabe der Berührung aufgerufen wird
      onPanResponderRelease: (e, { vx }) => {
        // Beenden der aktuellen Animation und Festlegen des Offsets
        rotationValue.stopAnimation((currentValue) => {
          lastRotation.current = currentValue;
        });
        rotationValue.setOffset(lastRotation.current);
        rotationValue.setValue(0);
      
        // Starten der neuen Animation mit einem zufälligen Endwert
        Animated.timing(rotationValue, {
          toValue: Math.random() * 360 * 30,  // Zufälliger Endwert für die Animation, multipliziert mit 5
          duration: Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000,  // Zufällige Dauer zwischen 3 und 5 Sekunden
          useNativeDriver: false,
        }).start(() => {
          // Nach Abschluss der Animation: Aktualisieren von lastRotation und Zurücksetzen des Offsets und Werts
          lastRotation.current += rotationValue._value;
          rotationValue.setOffset(lastRotation.current);
          rotationValue.setValue(0);

          // Zufällige Auswahl zwischen den drei Optionen treffen
          const randomSelection = Math.floor(Math.random() * 3);
          let resultText = '';
          switch (randomSelection) {
            case 0:  // Schlucke! Option
              resultText = `${sips} Schlucke!`;
              break;
            case 1:  // Wahrheit! Option
              randomTruth = textsWahrheitSpinTheBottle[Math.floor(Math.random() * textsWahrheitSpinTheBottle.length)].content
              resultText = `Wahrheit! ${randomTruth}`;
              break;
            case 2:  // Pflicht! Option
              randomDare= textsPflichtSpinTheBottle[Math.floor(Math.random() * textsPflichtSpinTheBottle.length)].content
              resultText = `Pflicht! ${randomDare}`;
              break;
          }

          // Setzen und Anzeigen des generierten Ergebnistexts
          // (Sie müssen den resultText in Ihrem State speichern und in Ihrer Render-Methode anzeigen)
          setDisplayedText(resultText);  // Sie müssen eine geeignete State-Variable und Setter-Funktion hinzufügen
        });
      },
      
      
      

    })
  ).current; // Gets the current value of the ref

  const rotation = rotationValue.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg']
  });

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.hintText}>Drehe die Flasche mit dem Finger</Text>
        <Animated.View 
          {...panResponder.panHandlers} 
          style={{ transform: [{ rotate: rotation }] }}
        >
          <Image source={require('../../assets/images/bottles/bottle_001.png')} style={styles.bottle} />
        </Animated.View>
        
        <Question question={displayedText && displayedText.length > 0 ? deleteHashtags(displayedText) : ''}/>


        <InfoText header={"Flaschendrehen!"} rules={"Dreht die Flasche! Auf wen die Flasche zeigt, muss die angezeigte Aktion ausführen. So einfach ist es..."}/>
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {top: 20, left: 20}]}>
          <Text style={appStyles.infoButtonText}>ℹ</Text>
        </TouchableOpacity>
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
    fontSize: 30,
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
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    color: 'white',
  }
});

export default SpinTheBottle;
