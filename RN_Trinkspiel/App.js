import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

//Import der Datenbankvorlagen
import { handleSqlRequest } from './src/general';

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
  const [texts_Picolo, setTexts_Picolo] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE NOT(fk_pool = 22)');
      setTexts_Picolo(result);
  };
  fetchData();
  }, []);

  //100.000 Questions
  const [manyQuestions, setManyQuestions] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 22');
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




  //Für Menus
  const Stack = createStackNavigator();
  
  //Globale Variablen aus Context
  const [playerNames, setPlayerNames] = useState([]);
  const [drinkTypes, setDrinkTypes] = useState([]); 


  return (
    <VariablesContext.Provider value={{ playerNames, setPlayerNames, drinkTypes, setDrinkTypes }}>
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
      </Stack.Navigator>
    </NavigationContainer>
  </VariablesContext.Provider>
  );
}
