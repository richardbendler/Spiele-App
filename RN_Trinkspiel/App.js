import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

//Import der Datenbankvorlagen
import { handleSqlRequest } from './src/general';

//Import der Menüs
import MainMenu from './src/menus/MainMenu';
import KlassikerMenu from './src/menus/KlassikerMenu';
import MiniGamesMenu from './src/menus/MiniGamesMenu';
import AddPlayer from './src/menus/AddPlayer';

//Import der Spiele
import ManyQuestionsGame from './src/games/ManyQuestions';
import KlassikerGame from './src/games/KlassikerGame';
import Kingscup from './src/games/Kingscup';
import MaexchenGame from './src/games/Mäxchen';
import DrinkCounter from './src/games/DrinkCounter';
import Activity from './src/games/Activity';

//Import des Contextes -> Verwaltet globale Variablen
import { VariablesContext } from './VariablesContext';


export default function App() {
  //API zu Backend
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const handleSendText = async () => {
    try {
      const response = await fetch('http://45.9.63.16:3000/api/sendText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const responseText = await response.text();
        setResponse(responseText);
      } else {
        console.error('Fehler beim Senden des Texts.');
      }
    } catch (error) {
      console.error('Ein Fehler ist aufgetreten:', error);
    }
  };


  


  ////////////////////////////////////////////////////////
  ///////////////////// SQL-ABFRAGEN  ////////////////////
  ////////////////////////////////////////////////////////

  //Klassiker: Vorglühen
  const [texts_Vorglühen, setTexts_Vorglühen] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 1');
      setTexts_Vorglühen(result);
  };
  fetchData();
  }, []);
  //Klassiker: Schon gut dabei
  const [texts_SchonGutDabei, setTexts_SchonGutDabei] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 2');
      setTexts_SchonGutDabei(result);
  };
  fetchData();
  }, []);
  //Klassiker: Heiß
  const [texts_Heiß, setTexts_Heiß] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 3');
      setTexts_Heiß(result);
  };
  fetchData();
  }, []);
  //Klassiker: Wahrheit oder Pflicht
  const [texts_WahrheitOderPflicht, setTexts_WahrheitOderPflicht] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 4');
      setTexts_WahrheitOderPflicht(result);
  };
  fetchData();
  }, []);

  //100.000 Questions
  const [manyQuestions, setManyQuestions] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 6');
      setManyQuestions(result);
  };
  fetchData();
  }, []);

  //Activity
  const [words, setWords] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 9 OR fk_pool = 10');
      setWords(result);
  };
  fetchData();
  }, []);




  //Für Menus
  const Stack = createStackNavigator();
  
  //Globale Variablen aus Context
  const [playerNames, setPlayerNames] = useState([]);
  const [drinkTypes, setDrinkTypes] = useState([]); 


  return (
    <VariablesContext.Provider value={{ playerNames, setPlayerNames, drinkTypes, setDrinkTypes }}>
      <NavigationContainer>
        
        <Stack.Navigator 
          initialRouteName="AddPlayer"
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="KlassikerMenu" component={KlassikerMenu} />
        <Stack.Screen name="MiniGamesMenu" component={MiniGamesMenu} />
        <Stack.Screen name="AddPlayer" component={AddPlayer} />
        
        <Stack.Screen 
            name="VorglühenGame" 
            component={KlassikerGame}
            initialParams={{ texts: texts_Vorglühen }} 
        />
        <Stack.Screen 
            name="SchonGutDabeiGame" 
            component={KlassikerGame}
            initialParams={{ texts: texts_SchonGutDabei }} 
        />
        <Stack.Screen 
            name="HeißGame" 
            component={KlassikerGame}
            initialParams={{ texts: texts_Heiß }} 
        />
        <Stack.Screen 
            name="WahrheitOderPflichtGame" 
            component={KlassikerGame}
            initialParams={{ texts: texts_WahrheitOderPflicht }} 
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
      </Stack.Navigator>
    </NavigationContainer>
  </VariablesContext.Provider>
  );
}
