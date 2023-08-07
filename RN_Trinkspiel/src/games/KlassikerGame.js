// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Question from './Question';
import { appStyles } from '../../styles';

const KlassikerGame = ({route }) => {
  const { texts } = route.params;

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
    <View style={appStyles.gameContainer}>
      <TouchableOpacity onPress={showNextQuestion}>
        <Question question={texts && texts.length > 0 ? texts[textsIndex] : ''}/>
        
      </TouchableOpacity>
    </View>
  );
};


export default KlassikerGame;