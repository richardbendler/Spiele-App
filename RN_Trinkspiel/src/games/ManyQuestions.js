// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
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
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={showNextQuestion} style={{width: '100%', height: '100%',justifyContent: 'center',alignItems: 'center',}}>
            <Question question={manyQuestions && manyQuestions.length > 0 ? replaceHashtagsWithoutDuplicates(manyQuestions[questionIndex].content) : ''}/>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={manyQuestions} textsIndex={questionIndex} table={'games_klassiker_evaluation'}/>
      </View>
    </ImageBackground>
  );
};


export default ManyQuestionsGame;