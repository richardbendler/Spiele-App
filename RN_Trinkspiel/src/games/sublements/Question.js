import React from 'react';
import { View, Text } from 'react-native';
import { appStyles } from '../../../styles';

const Question = ({question }) => {
  //console.log(question)
  return (
    <View>
      <Text style={appStyles.onlyTextBasedGameText}>{question}</Text>
    </View>
  );
};

export default Question;
