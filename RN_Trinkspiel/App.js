import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Button from './src/Button';
import Question from './src/Question';
// Similar to Question.js, adjust styling if needed:
//import WeatherButton from './src/WeatherButton';
//import WeatherQuestion from './src/WeatherQuestion';

export default function App() {
  const [generalGameStarted, setGeneralGameStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [weatherGameStarted, setWeatherGameStarted] = useState(false);
  const [weatherQuestionIndex, setWeatherQuestionIndex] = useState(0);
  const [inGame, setInGame] = useState(false);
  
  
  const generalQuestions = [
    'What is the capital of France?',
    'What is the largest mammal?',
    'Who wrote the play "Romeo and Juliet"?',
    // Add more general questions here
  ];
  
  const weatherQuestions = [
    'What causes rain?',
    'What is a tornado?',
    'How is temperature measured?',
    // Add more weather-related questions here
  ];

  const startGeneralGame = () => {
    setGeneralGameStarted(true);
    setInGame(true);
  };

  const startWeatherGame = () => {
    setWeatherGameStarted(true);
    setInGame(true);
  };

  const endAnyGame = () => {
    setGeneralGameStarted(false);
    setWeatherGameStarted(false);
    setInGame(false);
  }
  
  const showNextQuestion = () => {
    if (questionIndex < generalQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const showNextWeatherQuestion = () => {
    if (weatherQuestionIndex < weatherQuestions.length - 1) {
      setWeatherQuestionIndex(weatherQuestionIndex + 1);
    }
  };
  
  
  return (
    <View style={styles.container}>
      {generalGameStarted ? (
        <>
          <TouchableOpacity onPress={showNextQuestion}>
            <Question question={generalQuestions[questionIndex]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={endAnyGame} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {weatherGameStarted ? (
        <>
          <TouchableOpacity onPress={showNextWeatherQuestion}>
            <Question question={weatherQuestions[weatherQuestionIndex]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={endAnyGame} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {/* Hide all start buttons once any game starts */}
      {inGame ? null : (
          <Button onPress={startGeneralGame} title="Start General Game" />
      )}
      {inGame ? null : (
          <Button onPress={startWeatherGame} title="Start Weather Game" />
      )}
    </View>
    /*<View sytle={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} placeholder="Bitte trag hier was ein"/>
        <Button title="Add Goal"/>
      </View>
      <View></View>
  </View>*/
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  gameContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  exitButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'red', // Customize the button color
    padding: 10,
    borderRadius: 5,
  },
  exitButtonText: {
    color: 'white',
  },
  // ... (other styles)
  
  appContainer:{
    padding:50
  },
  inputContainer:{
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textInput:{
    borderWidth:1,
    borderColor: "blue",
    width:"80%",
    marginRight: 8,
    padding: 8
  },
  
});
