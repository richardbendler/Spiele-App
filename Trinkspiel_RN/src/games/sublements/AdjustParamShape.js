import React, { useContext } from 'react';
import { VariablesContext } from '../../../VariablesContext';


export const replaceHashtagsWithoutDuplicates = (inputString, options = {}) => {
  try{
      const { players, language } = useContext(VariablesContext);
      const requireDrinkingPlayers = Boolean(options.requireDrinkingPlayers);
      const drinksOnly = players.filter(p => p.drinks);
      const playerPool =
        requireDrinkingPlayers && drinksOnly.length > 0
          ? drinksOnly
          : players.length > 0
          ? players
          : [];
      const playerNames = playerPool.map(p => p.name); //array of player names
      const fallbackNames = players.map(p => p.name);

      //inputString = inputString.charAt(0).toLowerCase() + inputString.slice(1);

      console.log(`Recieved Input: ${inputString}\n Player Names: ${playerNames}`)

      // Kopie des Namensarrays erstellen, um Manipulationen vorzunehmen
      const hasInitialPool = playerNames.length > 0;
      let availableNames = hasInitialPool ? [...playerNames] : [...fallbackNames];

      if (availableNames.length === 0) {
        const fallbackLabel = language === 'en' ? 'player' : 'Spieler*in';
        return inputString.replace(/#/g, fallbackLabel);
      }

      return inputString.replace(/#/g, () => {
          if (availableNames.length === 0) {
            // Wenn alle Namen verwendet wurden, setze die Liste zurück
            availableNames = playerNames.length > 0 ? [...playerNames] : [...fallbackNames];
          }
          // Zufälligen Index aus den verfügbaren Namen auswählen
          const randomIndex = Math.floor(Math.random() * availableNames.length);
      
          // Wähle den Namen an diesem Index aus
          const name = availableNames[randomIndex];
          console.log("name: "+name);
      
          // Entferne den ausgewählten Namen aus der Liste der verfügbaren Namen
          availableNames.splice(randomIndex, 1);
      
          // Ersetze das Hashtag durch den ausgewählten Namen
          return name;
        });
    }catch(error){
      console.log(error);
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
