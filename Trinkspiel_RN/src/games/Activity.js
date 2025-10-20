// In einer Datei namens VorglühenGame.js
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';

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

  const { tutorialEnabled, setTutorialEnabled } = React.useContext(require('../../VariablesContext').VariablesContext);
  const [tutorialStep, setTutorialStep] = React.useState(0);
  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={showNextQuestion} style={{width: '100%', height: '100%',justifyContent: 'center',alignItems: 'center',}}>
            <Question question={words && words.length > 0 ? replaceHashtagsWithoutDuplicates(words[wordsIndex].word) : ''}/>
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={words} textsIndex={wordsIndex} table={'game_activity_words'}/>

        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? 'Tutorial aus' : 'Tutorial an'}</Text>
        </TouchableOpacity>
        <InfoText header={"Activity!"} rules={"Ihr seid reihum nacheinander mit erklären dran. Wer dran ist, hat 30 Sekunden Zeit, so viele angezeigte Wörter zu erklären oder per Pantomime vorzuführen. Für jedes richtig erratene Wort darf die erklärende Person und die Person, die es gerade erraten hat, einen Schluck direkt verteilen. Have Fun!"}/>
        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: 'Wort lesen und erklären oder pantomimisch darstellen.', placement: 'top' },
            { text: 'Tippt unten auf weiter, sobald ihr bereit seid.', placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s)=> Math.min(1, s+1))}
          onClose={() => setTutorialEnabled(false)}
        />
        <InfoHint />
        {/** Regeln-Button entfernt (Tutorials ersetzen ihn) */}
      </View>
    </ImageBackground>
  );
};


export default Activity;
