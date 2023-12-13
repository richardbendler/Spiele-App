// In einer Datei namens VorglühenGame.js
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';
import InfoText from './sublements/InfoText';

const Activity = ({route }) => {
  const { words } = shuffleArrayFisherYates(route.params);

  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

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
          <TouchableOpacity onPress={showNextQuestion} style={{width: '100%', height: '100%',justifyContent: 'center',alignItems: 'center',}}>
            <Question question={words && words.length > 0 ? replaceHashtagsWithoutDuplicates(words[wordsIndex].word) : ''}/>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={words} textsIndex={wordsIndex} table={'games_activity_evaluation'}/>

        <InfoText header={"Activity!"} rules={"Ihr seid reihum nacheinander mit erklären dran. Wer dran ist, hat 30 Sekunden Zeit, so viele angezeigte Wörter zu erklären oder per Pantomime vorzuführen. Für jedes richtig erratene Wort darf die erklärende Person und die Person, die es gerade erraten hat, einen Schluck direkt verteilen. Have Fun!"}/>
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {top: 20, left: 20}]}>
          <Text style={appStyles.infoButtonText}>ℹ</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};


export default Activity;