// In einer Datei namens VorglühenGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Question from '../Question';

//SQL REQUEST
const handleSqlRequest = async (sqlRequest) => {
  const token = "Bearer "+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFwcCJ9LCJpYXQiOjE2OTExNzU2OTV9.TqiVCGJdiq8lgn9-akwwzoRLxR5KZhllRXr_yWQL9JE"; // Token generieren und hier einfügen
  ret = '';
  try {
    const response = await fetch('http://45.9.63.16:3000/api/sqlRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ sqlRequest }),
    });

    if (response.ok) {
      const responseText = await response.text();
      ret = JSON.parse(responseText);
    } else {
      console.error('Fehler beim Senden des Texts.');
    }
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
  console.log(ret);
  //console.log("responseText: " + responseText);
  return ret;
};

const ManyQuestionsGame = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  console.log(handleSqlRequest('SELECT * FROM `game_simple_questions`'));
  const [manyQuestions, setManyQuestions] = useState(handleSqlRequest('SELECT * FROM `game_simple_questions`')["_z"].map(row=>row.content));

  

  const showNextQuestion = () => {
    if (questionIndex < manyQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={showNextQuestion}>
        <Question question={manyQuestions[questionIndex]} />
      </TouchableOpacity>
    </View>
  );
};


export default ManyQuestionsGame;