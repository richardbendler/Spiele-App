// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';

import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';

const Activity = ({route }) => {
  const { words } = shuffleArrayFisherYates(route.params);

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
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={showNextQuestion}>
            <Question question={words && words.length > 0 ? replaceHashtagsWithoutDuplicates(words[wordsIndex].word) : ''}/>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={words} textsIndex={wordsIndex} table={'games_activity_evaluation'}/>
      </View>
    </ImageBackground>
  );
};


export default Activity;