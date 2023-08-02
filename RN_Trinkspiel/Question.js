import React from 'react';
import { View, Text } from 'react-native';

const Question = ({ question }) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{question}</Text>
    </View>
  );
};

const styles = {
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
  },
};

export default Question;
