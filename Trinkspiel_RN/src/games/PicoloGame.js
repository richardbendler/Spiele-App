// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';

import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';

const PicoloGame = ({route }) => {
  const texts = shuffleArrayFisherYates(route.params.texts);
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
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={showNextQuestion} style={{width: '100%', height: '100%',justifyContent: 'center',alignItems: 'center',}}>
            <Question question={texts && texts.length > 0 ? replaceHashtagsWithoutDuplicates(texts[textsIndex].content) : ''}/>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={texts} textsIndex={textsIndex} table={'games_activity_evaluation'}/>
      </View>
    </ImageBackground>
  );
};


export default PicoloGame;