// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';

import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';

const PicoloGame = ({ route }) => {
  // array of available questions
  const texts = shuffleArrayFisherYates(route.params.picoloData);
  // set current question to display, based on the index
  let index = 0;
  const [currentCategory, setCurrentCategory] = useState(texts[index].pool_name);
  const [currentText, setCurrentText] = useState(texts[index].content);
  const [currentColor, setCurrentColor] = useState(texts[index].pool_color);

  console.log("pool_color: ", texts[index].pool_name)

  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

  const showNextQuestion = () => {
    try{
      index++;
      setCurrentCategory(texts[index].pool_name);
      setCurrentText(texts[index].content);
      setCurrentColor(texts[index].pool_color);
    }catch (error){
      // reset to first question, if error occurs
      index = 0;
      setCurrentCategory(texts[index].pool_name);
      setCurrentText(texts[index].content);
      setCurrentColor(texts[index].pool_color);
    }
  };
  
  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={[appStyles.completeScreenGameContainer, {backgroundColor: currentColor}]}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={showNextQuestion} style={{width: '100%', height: '100%',justifyContent: 'center',alignItems: 'center',}}>
            <Text style={appStyles.textHeader2}>{currentCategory}!</Text>
            <Question question={texts && texts.length > 0 ? replaceHashtagsWithoutDuplicates(currentText) : ''}/>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={texts} textsIndex={index} table={'game_klassiker_questions'}/>
          
        <InfoText header={"The One!"} rules={"Der klassischte aller Trinkspiel-Modi - und auch gleichzeitig der einfachste! \n \n Alles was ihr machen müsst, wird euch auf dem Bildschirm angezeigt."}/>
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {top: 20, left: 20}]}>
          <Text style={appStyles.infoButtonText}>Regeln</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};


export default PicoloGame;