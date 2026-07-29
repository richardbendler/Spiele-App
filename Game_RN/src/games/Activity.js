import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Question from './sublements/Question';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import { replaceHashtagsWithoutDuplicates } from './sublements/AdjustParamShape';
import HandleFeedback from './sublements/HandleFeedBack';
import InfoText from './sublements/InfoText';
import TutorialOverlay from './sublements/TutorialOverlay';
import InfoHint from './sublements/InfoHint';
import { markContentSeen } from '../utils/contentMemory';

const Activity = ({route }) => {
  // Reihenfolge kommt bereits aus App.js (orderedActivityWords), dort nach Seen-Prioritaet
  // sortiert - hier nur noch entnehmen, nicht nochmal mischen.
  const { words } = route.params;

  const { players, language, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);

  const [wordsIndex, setWordsIndex] = useState(0);
  const showNextQuestion = () => {
    try{
      if (wordsIndex < words.length - 1) {
        setWordsIndex(wordsIndex + 1);
      }
    }catch{
        setWordsIndex(0);
    }

  };

  useEffect(() => {
    const currentWord = words?.[wordsIndex];
    if (currentWord?.id !== undefined) {
      markContentSeen('activityWords', [currentWord.id]);
    }
  }, [words, wordsIndex]);

  const [tutorialStep, setTutorialStep] = useState(0);
  return (
    <View style={styles.background}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          <TouchableOpacity onPress={showNextQuestion} style={{width: '100%', height: '100%',justifyContent: 'center',alignItems: 'center',}}>
            <Question
              question={
                words && words.length > 0
                  ? replaceHashtagsWithoutDuplicates(words[wordsIndex].word, {
                      players,
                      language,
                    })
                  : ''
              }
            />
          </TouchableOpacity>
        </View>
        <HandleFeedback texts={words} textsIndex={wordsIndex} table={'game_activity_words'}/>

        <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}>
          <Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text>
        </TouchableOpacity>
        <InfoText
          header={"Activity!"}
          rules={
            language === 'de'
              ? 'Ihr seid reihum nacheinander mit erklären dran. Wer dran ist, hat 30 Sekunden Zeit, so viele angezeigte Wörter zu erklären oder per Pantomime vorzuführen. Für jedes richtig erratene Wort darf die erklärende Person und die Person, die es gerade erraten hat, einen Schluck direkt verteilen. Have Fun!'
              : "Take turns explaining. Whoever's turn it is has 30 seconds to explain or act out as many shown words as possible. For every correctly guessed word, the explaining person and the person who guessed it may each hand out one sip right away. Have fun!"
          }
        />
        <TutorialOverlay
          visible={tutorialEnabled}
          steps={[
            { text: language === 'de' ? 'Wort lesen und erklären oder pantomimisch darstellen.' : 'Read the word and explain it or act it out.', placement: 'top' },
            { text: language === 'de' ? 'Tippt unten auf weiter, sobald ihr bereit seid.' : 'Tap anywhere below to move on once you are ready.', placement: 'bottom' },
          ]}
          stepIndex={tutorialStep}
          onNext={() => setTutorialStep((s)=> Math.min(1, s+1))}
          onClose={() => setTutorialEnabled(false)}
        />
        <InfoHint />
        {/** Regeln-Button entfernt (Tutorials ersetzen ihn) */}
      </View>
    </View>
  );
};


export default Activity;
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#366350',
  },
});
