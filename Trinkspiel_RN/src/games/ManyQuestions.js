// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Button } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';

import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';

const ManyQuestionsGame = ({ route }) => {
  const [manyQuestions, setManyQuestions] = useState(shuffleArrayFisherYates(route.params.manyQuestionsData)) ;

  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

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
          <View style={{height: '90%'}}>
            <View style={{width: '100%', height: '15%',justifyContent: 'center',alignItems: 'center',}}></View>
            <View style={{width: '100%', height: '80%',justifyContent: 'center',alignItems: 'center',}}>
              <Question question={manyQuestions && manyQuestions.length > 0 ? replaceHashtagsWithoutDuplicates(manyQuestions[questionIndex].content) : ''}/>
            </View>
          </View>
          <TouchableOpacity onPress={showNextQuestion} style={appStyles.gameActionButton}>
            <Text style={appStyles.gameActionButtonText}>Nächste Aussage</Text>
          </TouchableOpacity>
          
        </View>
        <HandleFeedback texts={manyQuestions} textsIndex={questionIndex} table={'game_klassiker_questions'}/>

        <InfoText header={"1000 Questions!"} rules={"Eine Person startet und liest die Frage (leise für sich!). Dann gibt die Person das Handy verdeckt an die Person weiter, auf die die Aussage/Frage am ehesten aus der Runde zutrifft. \n\n Die gewählte Person kann dann wieder überlegen, ob die Aussage auf eine andere Person noch besser zutrifft. \n\n Sobald eine Person akzeptiert oder zum zweiten Mal das Handy hat, muss die Person vorlesen und trinken. Danach macht diese Person mit der nächsten Aussage weiter."}/>
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {top: 20, left: 20}]}>
          <Text style={appStyles.infoButtonText}>Regeln</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};


export default ManyQuestionsGame;