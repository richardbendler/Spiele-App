// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Question from './Question';
import { appStyles } from '../../styles';





const ManyQuestionsGame = ({route }) => {
  const { manyQuestions } = route.params;

  const [questionIndex, setQuestionIndex] = useState(0);
  const showNextQuestion = () => {
    try{
      if (questionIndex < manyQuestions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      }
    }catch (error){
      setQuestionIndex(0);
    }
    
  };

  return (
    <View style={appStyles.gameContainer}>
      <TouchableOpacity onPress={showNextQuestion}>
        <Question question={manyQuestions && manyQuestions.length > 0 ? manyQuestions[questionIndex] : ''}/>
        
      </TouchableOpacity>
    </View>
  );
};


export default ManyQuestionsGame;