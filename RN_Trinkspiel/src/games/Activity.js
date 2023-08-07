// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Question from './Question';
import { appStyles } from '../../styles';

const Activity = ({route }) => {
  const { words } = route.params;

  const [wordsIndex, setWordsIndex] = useState(0);
  const showNextQuestion = () => {
    try{
      if (wordsIndex < words.length - 1) {
        setWordsIndex(wordsIndex + 1);
      }
    }catch (error){
        setWordsIndex(0);
    }
    
  };

  return (
    <View style={appStyles.gameContainer}>
      <TouchableOpacity onPress={showNextQuestion}>
        <Question question={words && words.length > 0 ? words[wordsIndex] : ''}/>
        
      </TouchableOpacity>
    </View>
  );
};


export default Activity;