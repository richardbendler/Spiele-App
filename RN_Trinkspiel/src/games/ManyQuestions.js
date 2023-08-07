// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';

import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';

const ManyQuestionsGame = ({route }) => {
  const { manyQuestions } = shuffleArrayFisherYates(route.params);

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
    <View style={appStyles.completeScreenGameContainer}>
      <View style={appStyles.gameContainer}>
        <TouchableOpacity onPress={showNextQuestion}>
          <Question question={manyQuestions && manyQuestions.length > 0 ? replaceHashtagsWithoutDuplicates(manyQuestions[questionIndex].content) : ''}/>
        </TouchableOpacity>
      </View>
      <HandleFeedback texts={manyQuestions} textsIndex={questionIndex}/>
    </View>
  );
};


export default ManyQuestionsGame;