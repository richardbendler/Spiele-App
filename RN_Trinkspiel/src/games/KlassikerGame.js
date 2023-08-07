// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Question from './Question';
import { appStyles } from '../../styles';

const KlassikerGame = ({route }) => {
  const { texts } = route.params;
  const [textsIndex, setTextsIndex] = useState(0);

  const showNextQuestion = () => {
    try{
      if (textsIndex < texts.length - 1) {
        setTextsIndex(textsIndex + 1);
      }
    }catch (error){
        setTextsIndex(0);
    }
  };
  

  const [feedbackText, setFeedbackText] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const handleFeedback = (feedback) => {
    //Animation
    setFeedbackText(feedback ? '👍 Danke für dein Feedback!' : '👎 Danke für dein Feedback!');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      fadeAnim.setValue(0);
      translateY.setValue(0);
      setFeedbackText(null);
    });

    //handle Feedback
    //zuerst die Id der Frage rausfinden:


    //sql:
    //const sqlInsert = `INSERT INTO games_evaluation (id, fk_question, fk_type, value, comment, author, timestamp) VALUES (NULL, 13, ${like}, NULL, NULL, NULL, current_timestamp())`;
  };

  const [pressedButton, setPressedButton] = useState(null);
  
  return (
    <View style={styles.container}>
      <View style={appStyles.gameContainer}>
        <TouchableOpacity onPress={showNextQuestion}>
          <Question question={texts && texts.length > 0 ? texts[textsIndex] : ''}/>
        </TouchableOpacity>
      </View>
      <View style={styles.feedbackContainer}>
        <View style={styles.feedbackContainer}>
          <Text style={styles.questionText}>Wie findest du diese Frage?</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => handleFeedback(true)}>
              <Text style={styles.buttonText}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFeedback(false)}>
              <Text style={styles.buttonText}>👎</Text>
            </TouchableOpacity>
          </View>
          {feedbackText && (
            <Animated.View style={[styles.feedbackTextContainer, { right: 10, opacity: fadeAnim, transform: [{ translateY }] }]}>
              <Text style={styles.feedbackText}>{feedbackText}</Text>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  feedbackContainer: {
    //position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Increased spacing
    //backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 20, // Increased horizontal padding
  },
  feedbackTextContainer: {
    position: 'absolute',
    top: -60,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 12,
    color: '#555',
  },
  pressedButton: {
    backgroundColor: '#d0d0d0', // Darker background color for the pressed state
    borderColor: '#888',       // Border color for the pressed state
    borderWidth: 1,            // Border width for the pressed state
  },
  questionText: {
    fontSize: 14,
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 5,
    marginHorizontal: 15, // Increased spacing between buttons
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    marginHorizontal: 10, // Increase this value for more space between buttons
  },
});

export default KlassikerGame;