// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';

import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';

const PicoloGame = ({ route }) => {
  // array of available questions
  const texts = shuffleArrayFisherYates(route.params.picoloData);
  // set current question to display, based on the index
  let index = 0;
  const [currentText, setCurrentText] = useState(texts[index].content);

  const showNextQuestion = () => {
    try{
      index++;
      setCurrentText(texts[index].content);
    }catch (error){
      // reset to first question, if error occurs
      index = 0;
      setCurrentText(texts[index].content);
    }
  };
  
  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={showNextQuestion} style={{width: '100%', height: '100%',justifyContent: 'center',alignItems: 'center',}}>
            <Question question={texts && texts.length > 0 ? replaceHashtagsWithoutDuplicates(currentText) : ''}/>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={texts} textsIndex={index} table={'games_activity_evaluation'}/>
      </View>
    </ImageBackground>
  );
};


export default PicoloGame;