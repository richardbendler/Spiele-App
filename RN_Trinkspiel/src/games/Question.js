import React from 'react';
import { View, Text } from 'react-native';
import { appStyles } from '../../styles';

const Question = ({question }) => {
  console.log(question)
  {/*<View style={appStyles.manyquestionsContainer}>
      <Text style={appStyles.manyQuestionsText}>{question}</Text>
      <Text>Test123</Text>
  </View>*/}
  return (
    
    <View>
      <Text style={appStyles.manyQuestionsText}>{question}</Text>
    </View>
  );
};


export default Question;
