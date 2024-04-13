import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { handleSqlRequest, postFeedback } from "../../general";

const HandleFeedback = ({ texts, textsIndex, table }) => {
  //Für Feedback
  const [feedbackText, setFeedbackText] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  function handleFeedback(feedback, table) {
    //Animation
    setFeedbackText(feedback == 1 ? '👍 Danke für dein Feedback!' : '👎 Danke für dein Feedback!');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      fadeAnim.setValue(0);
      translateY.setValue(0);
      setFeedbackText(null);
    });

    //handle Feedback
    //zuerst die Id der Frage rausfinden:


    const question_id = texts[textsIndex].id
    const question_content = texts[textsIndex].content
    
    postFeedback(table, question_id, feedback);
  }

  //check if user has voted
  let [hasVoted, setHasVoted] = useState(false);

  const checkVote = (vote) => {
    handleFeedback(vote, table);
    setHasVoted(true);
  }

  useEffect(() => {
    setHasVoted(false);
  }, [textsIndex])

  return (
    <View style={styles.feedbackContainer}>
      {(!hasVoted) && <View style={styles.feedbackContainer}>
        <Text style={styles.questionText}>Wie findest du diese Frage?</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => checkVote(1)}>
            <Text style={styles.buttonText}>👍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => checkVote(2)}>
            <Text style={styles.buttonText}>👎</Text>
          </TouchableOpacity>
        </View>
      </View>}
      {feedbackText && (
        <Animated.View style={[styles.feedbackTextContainer, { right: 10, opacity: fadeAnim, transform: [{ translateY }] }]}>
          <Text style={[styles.feedbackText, { color: 'white' }]}>{feedbackText}</Text>
        </Animated.View>
      )}
    </View>
  )


};

const styles = StyleSheet.create({
  feedbackContainer: {
    //position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Increased spacing
    //backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 20, // Increased horizontal padding
  },
  feedbackTextContainer: {
    position: 'absolute',
    top: -60,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 12,
    color: '#555',
  },
  pressedButton: {
    backgroundColor: '#d0d0d0', // Darker background color for the pressed state
    borderColor: '#888',       // Border color for the pressed state
    borderWidth: 1,            // Border width for the pressed state
  },
  questionText: {
    fontSize: 14,
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 5,
    marginHorizontal: 15, // Increased spacing between buttons
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    marginHorizontal: 10, // Increase this value for more space between buttons
  },
});

export default HandleFeedback;