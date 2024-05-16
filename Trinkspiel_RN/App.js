import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Import der Datenbankvorlagen
import {  getGameData } from './src/general';

//Import der Menüs
import StartMenu from './src/menus/StartMenu';
import MainMenu from './src/menus/MainMenu';
import AddPlayer from './src/menus/AddPlayer';

//Import der Spiele
import PicoloGame from './src/games/PicoloGame';
import ManyQuestionsGame from './src/games/ManyQuestions';
import Kingscup from './src/games/Kingscup';
import MaexchenGame from './src/games/Mäxchen';
import DrinkCounter from './src/games/DrinkCounter';
import Activity from './src/games/Activity';
import SpinTheBottle from './src/games/SpinTheBottle';
import HorseRace from './src/games/HorseRace';

//Import des Contextes -> Verwaltet globale Variablen
import { VariablesContext } from './VariablesContext';

//Import von Hilfsfunktionen
import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from './src/games/sublements/AdjustParamShape';

import { enableScreens } from 'react-native-screens';
enableScreens();

//Import von db_backup
import {db_backup_texts_Picolo} from './src/db_backup';
import {db_backup_textsWahrheitSpinTheBottle} from './src/db_backup';
import {db_backup_textsPflichtSpinTheBottle} from './src/db_backup';
import {db_backup_manyQuestions} from './src/db_backup';
import {db_backup_words} from './src/db_backup';


export default function App() {
  const [texts_Picolo, setTexts_Picolo] = useState([]);
  const [textsWahrheitSpinTheBottle, setTextsWahrheitSpinTheBottle] = useState(["Platzhalterfrage"]);
  const [textsPflichtSpinTheBottle, setTextsPflichtSpinTheBottle] = useState(["Platzhalterfrage"]);
  const [manyQuestions, setManyQuestions] = useState(["Platzhalterfrage"]);
  const [words, setWords] = useState(["Platzhalterfrage"]);

  ////////////////////////////////////////////////////////
  /////////// Daten aus db_backup.js  //////////
  ////////////////////////////////////////////////////////
  useEffect(() => {
    //setTexts_Picolo(db_backup_texts_Picolo)
    //setTextsWahrheitSpinTheBottle(db_backup_textsWahrheitSpinTheBottle)
    //setTextsPflichtSpinTheBottle(db_backup_textsPflichtSpinTheBottle)
    //setManyQuestions(db_backup_manyQuestions)
    //setWords(db_backup_words)
  }, []) // Das leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgeführt wird

  ////////////////////////////////////////////////////////
  /////////// Daten aus lokalem Speicher holen  //////////
  ////////////////////////////////////////////////////////

  //Allgemeine Funktion zum Laden aus dem Gerätespeicher
  const loadFromDisk = async (setter, item) => {
    try {
      const response = await AsyncStorage.getItem(item);
      if(response){
        const ret = JSON.parse(response);
        setter(ret)
      }
    } catch (error) {
        console.error('Fehler beim Laden', error);
    }
  }

  //Relikt zum Löschen der Items: AsyncStorage.setItem("drinkTypes", JSON.stringify([]));

  const [drinkTypes, setDrinkTypes] = useState([]); 
  useEffect(() => {
    loadFromDisk(setDrinkTypes, "drinkTypes");
    //TODO: Wird hier nicht überschrieben falls DB-Anfrage zu lange dauert?
    //loadFromDisk(setTexts_Picolo, "texts_Picolo");
    //loadFromDisk(setTextsWahrheitSpinTheBottle, "textsWahrheitSpinTheBottle");
    //loadFromDisk(setTextsPflichtSpinTheBottle, "textsPflichtSpinTheBottle");
    //loadFromDisk(setManyQuestions, "manyQuestions");
    //loadFromDisk(setWords, "words");
  }, []) // Das leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgeführt wird


  
  ////////////////////////////////////////////////////////
  ///////////////////// SQL-ABFRAGEN  ////////////////////
  ////////////////////////////////////////////////////////
  
  //LOAD FROM API and SAFE TO DISK
  useEffect(() => {
    // new API routes
    getGameData("texts_Picolo", setTexts_Picolo, "theOne");
    getGameData("textsWahrheitSpinTheBottle", setTextsWahrheitSpinTheBottle, "bottleSpinTruth");
    getGameData("textsPflichtSpinTheBottle", setTextsPflichtSpinTheBottle, "bottleSpinDare");
    getGameData("manyQuestions", setManyQuestions, "manyQuestions");
    getGameData("words", setWords, "activity")
  }, []) // Das leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgeführt wird

  //TODO: Falls API nicht erreichbar: Daten aus lokalem Gerätespeicher holen
  // -> Vielleicht auch einfach immer?
  //TODO: Initial-Arrays im Code in extra Datei hinterlegen falls beim ersten Start kein Internet da ist


  //Für Menus
  const Stack = createStackNavigator();
  
  //Globale Variablen aus Context
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [players, setPlayers] = useState([]);  

  return (
    <VariablesContext.Provider value={{ settingsVisible, setSettingsVisible, drinkTypes, setDrinkTypes, infoVisible, setInfoVisible, players, setPlayers}}>
    <NavigationContainer>
      
      <Stack.Navigator 
        initialRouteName="StartMenu"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false,
        }}
      >
      <Stack.Screen name="StartMenu" component={StartMenu} />
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="AddPlayer" component={AddPlayer} />
      
      <Stack.Screen 
          name="PicoloGame" 
          component={PicoloGame}
          initialParams={{ picoloData: texts_Picolo }} 
      />
      <Stack.Screen 
          name="ManyQuestionsGame" 
          component={ManyQuestionsGame}
          initialParams={{ manyQuestionsData: shuffleArrayFisherYates(manyQuestions) }} 
      />
      <Stack.Screen name="Kingscup" component={Kingscup} />
      <Stack.Screen name="MaexchenGame" component={MaexchenGame} />
      <Stack.Screen 
          name="Activity" 
          component={Activity}
          initialParams={{ words: words }} 
      />
      <Stack.Screen name="DrinkCounter" component={DrinkCounter} />
      <Stack.Screen 
          name="SpinTheBottle" 
          component={SpinTheBottle} 
          initialParams={{textsWahrheitSpinTheBottle: textsWahrheitSpinTheBottle, textsPflichtSpinTheBottle: textsPflichtSpinTheBottle}}
      />
      <Stack.Screen name="HorseRace" component={HorseRace} />
    </Stack.Navigator>
  </NavigationContainer>
</VariablesContext.Provider>
  );
}
