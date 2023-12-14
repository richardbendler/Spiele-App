import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { VariablesContext } from '../../../VariablesContext';


//const names = ["Alice", "Bob", "Charlie", "David"];
export const replaceHashtagsWithoutDuplicates = (inputString) => {
    try{
      const { playerNames, setPlayerNames } = useContext(VariablesContext);

      // Kopie des Namensarrays erstellen, um Manipulationen vorzunehmen
      let availableNames = [...playerNames];

      
      return inputString.replace(/#[a-zA-Z0-9_]+/g, () => {
          if (availableNames.length === 0) {
            // Wenn alle Namen verwendet wurden, setze die Liste zurück
            availableNames = [...playerNames];
          }
      
          // Zufälligen Index aus den verfügbaren Namen auswählen
          const randomIndex = Math.floor(Math.random() * availableNames.length);
      
          // Wähle den Namen an diesem Index aus
          const name = availableNames[randomIndex];
      
          // Entferne den ausgewählten Namen aus der Liste der verfügbaren Namen
          availableNames.splice(randomIndex, 1);
      
          // Ersetze das Hashtag durch den ausgewählten Namen
          return name;
        });
    }catch(error){
      return inputString;
    }
}

export const deleteHashtags = (inputString) => {
  return inputString.replace(/#[a-zA-Z0-9_], +/g, () => {
      return "";
    });
}

//Sortiert ein Array zufällig neu
export const shuffleArrayFisherYates =(array) => {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Elemente tauschen
    }
    return array;
}
