import React from 'react';
import { View, Text } from 'react-native';
import { appStyles } from '../styles';

const Question = ({ question }) => {
  return (
    <View style={appStyles.manyquestionsContainer}>
      <Text style={appStyles.manyQuestionsText}>{question}</Text>
    </View>
  );
};


export default Question;
