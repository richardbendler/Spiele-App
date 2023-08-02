import React, { useState } from 'react';
import { appStyles } from './styles';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
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
  const [playerNames, setPlayerNames] = useState([]);
  const [currentName, setCurrentName] = useState('');
  
  
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

  const handleAddPlayer = () => {
    if (currentName.trim() !== '') {
      setPlayerNames([...playerNames, currentName]);
      setCurrentName('');
    }
  };
  
  
  return (
    <View style={appStyles.container}>
      {!inGame ? (
        <>
          <Text style={appStyles.title}>Enter Player Names</Text>
          <TextInput
            placeholder="Enter a name"
            value={currentName}
            onChangeText={text => setCurrentName(text)}
            style={appStyles.input}
          />
          <TouchableOpacity onPress={handleAddPlayer} style={appStyles.addButton}>
            <Text style={appStyles.buttonText}>Add Player</Text>
          </TouchableOpacity>
          <FlatList
            data={playerNames}
            renderItem={({ item }) => <Text>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            style={appStyles.playerList}
          />
        </>
      ) : null}

      {generalGameStarted ? (
        <>
          <TouchableOpacity onPress={showNextQuestion}>
            <Question question={generalQuestions[questionIndex]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
            <Text style={appStyles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {weatherGameStarted ? (
        <>
          <TouchableOpacity onPress={showNextWeatherQuestion}>
            <Question question={weatherQuestions[weatherQuestionIndex]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
            <Text style={appStyles.exitButtonText}>Exit</Text>
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
    /*<View sytle={appStyles.appContainer}>
      <View style={appStyles.inputContainer}>
        <TextInput style={appStyles.textInput} placeholder="Bitte trag hier was ein"/>
        <Button title="Add Goal"/>
      </View>
      <View></View>
  </View>*/
  );
}


