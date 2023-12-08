import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Import der Datenbankvorlagen
import { handleSqlRequest } from './src/general';
//import { handleSqlRequestAndSafeToDisk } from './src/general';

//Import der Menüs
import StartMenu from './src/menus/StartMenu';
import MainMenu from './src/menus/MainMenu';
import KlassikerMenu from './src/menus/KlassikerMenu';
import CardGamesMenu from './src/menus/CardGamesMenu';
import MiniGamesMenu from './src/menus/MiniGamesMenu';
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



import { enableScreens } from 'react-native-screens';
enableScreens();


export default function App() {
  ////////////////////////////////////////////////////////
  ///////////////////// SQL-ABFRAGEN  ////////////////////
  ////////////////////////////////////////////////////////
  /*
  //LOAD FROM API and SAFE TO DISK
  const [texts_Picolo, setTexts_Picolo] = useState(["Platzhalterfrage"]);
  const [textsWahrheitSpinTheBottle, setTextsWahrheitSpinTheBottle] = useState(["Platzhalterfrage"]);
  const [textsPflichtSpinTheBottle, setTextsPflichtSpinTheBottle] = useState(["Platzhalterfrage"]);
  const [manyQuestions, setManyQuestions] = useState(["Platzhalterfrage"]);
  const [words, setWords] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    handleSqlRequestAndSafeToDisk("texts_Picolo", setTexts_Picolo, 'SELECT * FROM `game_klassiker_questions` WHERE NOT(fk_pool = 22)');
    handleSqlRequestAndSafeToDisk("textsWahrheitSpinTheBottle", setTextsWahrheitSpinTheBottle, 'SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 2');
    handleSqlRequestAndSafeToDisk("textsPflichtSpinTheBottle", setTextsPflichtSpinTheBottle, 'SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 3')
    handleSqlRequestAndSafeToDisk("manyQuestions", setManyQuestions, 'SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 22');
    handleSqlRequestAndSafeToDisk("words", setWords, 'SELECT * FROM `game_activity_words`');
  }, []);

  //TODO: Falls API nicht erreichbar: Daten aus lokalem Gerätespeicher holen
  // -> Vielleicht auch einfach immer?
  //TODO: Initial-Arrays im Code in extra Datei hinterlegen falls beim ersten Start kein Internet da ist
  */

  //Klassiker: Vorglühen
  const [texts_Picolo, setTexts_Picolo] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE NOT(fk_pool = 22)');
      setTexts_Picolo(result);
  };
  fetchData();
  }, []);

  //Spin The Bottle
  const [textsWahrheitSpinTheBottle, setTextsWahrheitSpinTheBottle] = useState(["Platzhalterfrage"]);
  const [textsPflichtSpinTheBottle, setTextsPflichtSpinTheBottle] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result1 = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 2');
      /*const result1 = [{"author": "", "bool_drink": 1, "content": "Alle trinken, die schonmal betrunken einen Baum hochgeklettert sind.", "drunk_level": 3, "exposure_level": 0, "fk_pool": 16, "id": 12, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "#1, hast du schon einmal einen Filmriss gehabt?", "drunk_level": 4, "exposure_level": 0, "fk_pool": 2, "id": 13, "timestamp": "2023-08-07T16:43:34.000Z"}] */
      setTextsWahrheitSpinTheBottle(result1);

      const result2 = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 3');
      //const result2 = [{"author": "", "bool_drink": 1, "content": "Alle trinken, die schonmal betrunken einen Baum hochgeklettert sind.", "drunk_level": 3, "exposure_level": 0, "fk_pool": 16, "id": 12, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "#1, hast du schon einmal einen Filmriss gehabt?", "drunk_level": 4, "exposure_level": 0, "fk_pool": 2, "id": 13, "timestamp": "2023-08-07T16:43:34.000Z"}] 
      setTextsPflichtSpinTheBottle(result2);
  };
  fetchData();
  }, []);

  //100.000 Questions
  const [manyQuestions, setManyQuestions] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 22');
      //const result = [{"author": null, "bool_drink": 1, "content": "Wer stürzt immer am schnellsten ab?", "drunk_level": 5, "exposure_level": 7, "fk_pool": 22, "id": 99, "timestamp": "2023-09-07T17:35:13.000Z"}]
      setManyQuestions(result);
  };
  fetchData();
  }, []);

  //Activity
  const [words, setWords] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_activity_words`');
      setWords(result);
  };
  fetchData();
  }, []);


  ////////////////////////////////////////////////////////
  /////////// Daten aus lokalem Speicher holen  //////////
  ////////////////////////////////////////////////////////

  //Allgemeine Funktion zum Laden aus dem Gerätespeicher
  /*const loadFromDisk = async (setter, item) => {
    try {
      const response = await AsyncStorage.getItem(item);
      if(response){
        const ret = JSON.parse(response);
        setter(ret)
      }
    } catch (error) {
        console.error('Fehler beim Laden', error);
    }
  }*/

  //Relikt zum Löschen der Items: AsyncStorage.setItem("drinkTypes", JSON.stringify([]));

  const [drinkTypes, setDrinkTypes] = useState([]); 
  /*useEffect(() => {
    loadFromDisk(setDrinkTypes, "drinkTypes");
    //loadFromDisk(setTexts_Picolo, "texts_Picolo");
    //loadFromDisk(setTextsWahrheitSpinTheBottle, "textsWahrheitSpinTheBottle");
    //loadFromDisk(setTextsPflichtSpinTheBottle, "textsPflichtSpinTheBottle");
    //loadFromDisk(setManyQuestions, "manyQuestions");
    //loadFromDisk(setWords, "words");
  }, []) // Das leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgeführt wird
  */




  //Für Menus
  const Stack = createStackNavigator();
  
  
  //Globale Variablen aus Context
  const [playerNames, setPlayerNames] = useState([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    
    <VariablesContext.Provider value={{ settingsVisible, setSettingsVisible, playerNames, setPlayerNames, drinkTypes, setDrinkTypes, infoVisible, setInfoVisible}}>
    <NavigationContainer>
      
      <Stack.Navigator 
        initialRouteName="StartMenu"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
      <Stack.Screen name="StartMenu" component={StartMenu} />
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="KlassikerMenu" component={KlassikerMenu} />
      <Stack.Screen name="CardGamesMenu" component={CardGamesMenu} />
      <Stack.Screen name="MiniGamesMenu" component={MiniGamesMenu} />
      <Stack.Screen name="AddPlayer" component={AddPlayer} />
      
      <Stack.Screen 
          name="PicoloGame" 
          component={PicoloGame}
          initialParams={{ texts: texts_Picolo }} 
      />
      <Stack.Screen 
          name="ManyQuestionsGame" 
          component={ManyQuestionsGame}
          initialParams={{ manyQuestions: manyQuestions }} 
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
