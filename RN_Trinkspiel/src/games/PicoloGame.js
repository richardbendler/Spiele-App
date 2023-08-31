// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';

import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';

const PicoloGame = ({route }) => {
  const { texts } = shuffleArrayFisherYates(route.params);
  //shuffleArrayFisherYates(result.map(row => row.content))
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

  
  
  return (
    <View style={appStyles.completeScreenGameContainer}>
      <View style={appStyles.gameContainer}>
        <TouchableOpacity onPress={showNextQuestion}>
          <Question question={texts && texts.length > 0 ? replaceHashtagsWithoutDuplicates(texts[textsIndex].content) : ''}/>
        </TouchableOpacity>
      </View>
      <HandleFeedback texts={texts} textsIndex={textsIndex}/>
    </View>
  );
};


export default PicoloGame;