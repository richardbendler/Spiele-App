import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

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
  
  //Database
  //POST AND RESPONSE
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
  

  //HANDLE SQL REQUESTS
  const handleSqlRequest = async (sqlRequest) => {
    const token = "Bearer "+"REDACTED_JWT"; // Token generieren und hier einfügen
    ret = '';
    try {
      const response = await fetch('http://45.9.63.16:3000/api/sqlRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ sqlRequest }),
      });

      if (response.ok) {
        const responseText = await response.text();
        ret = JSON.parse(responseText);
      } else {
        console.error('Fehler beim Senden des Texts.');
      }
    } catch (error) {
      console.error('Ein Fehler ist aufgetreten:', error);
    }
    //console.log(ret);
    return ret;
  };


  ////////////////////////////////////////////////////////
  ///////////////////// SQL-ABFRAGEN  ////////////////////
  ////////////////////////////////////////////////////////

  //Klassiker: Vorglühen
  const [texts_Vorglühen, setTexts_Vorglühen] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 1');
      setTexts_Vorglühen((result.map(row => row.content)));
  };
  fetchData();
  }, []);
  //Klassiker: Schon gut dabei
  const [texts_SchonGutDabei, setTexts_SchonGutDabei] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 2');
      setTexts_SchonGutDabei((result.map(row => row.content)));
  };
  fetchData();
  }, []);
  //Klassiker: Heiß
  const [texts_Heiß, setTexts_Heiß] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 3');
      setTexts_Heiß((result.map(row => row.content)));
  };
  fetchData();
  }, []);
  //Klassiker: Wahrheit oder Pflicht
  const [texts_WahrheitOderPflicht, setTexts_WahrheitOderPflicht] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 4');
      setTexts_WahrheitOderPflicht((result.map(row => row.content)));
  };
  fetchData();
  }, []);

  //100.000 Questions
  const [manyQuestions, setManyQuestions] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 6');
      setManyQuestions((result.map(row => row.content)));
  };
  fetchData();
  }, []);

  //Activity
  const [words, setWords] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleSqlRequest('SELECT * FROM `game_simple_questions` WHERE fk_pool = 9 OR fk_pool = 10');
      setWords((result.map(row => row.content)));
  };
  fetchData();
  }, []);




  //Für Menus
  const Stack = createStackNavigator();
  
  //Globale Variablen aus Context
  const [playerNames, setPlayerNames] = useState([]);
  const [drinkTypes, setDrinkTypes] = useState([]); 

  //const names = ["Alice", "Bob", "Charlie", "David"];
  function replaceHashtagsWithoutDuplicates(inputArray) {
    // Kopie des Namensarrays erstellen, um Manipulationen vorzunehmen
    let availableNames = [...playerNames];
  
    return inputArray.map((string) => {
      return string.replace(/#[a-zA-Z0-9_]+/g, () => {
        if (availableNames.length === 0) {
          // Wenn alle Namen verwendet wurden, setze die Liste zurück
          availableNames = [...playerNames];
        }
  
        // Zufälligen Index aus den verfügbaren Namen auswählen
        const randomIndex = Math.floor(Math.random() * availableNames.length);
        const selectedName = availableNames[randomIndex];
  
        // Den ausgewählten Namen aus den verfügbaren Namen entfernen
        availableNames.splice(randomIndex, 1);
  
        return selectedName;
      });
    });
  }

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
            initialParams={{ texts: replaceHashtagsWithoutDuplicates(texts_Vorglühen) }} 
        />
        <Stack.Screen 
            name="SchonGutDabeiGame" 
            component={KlassikerGame}
            initialParams={{ texts: replaceHashtagsWithoutDuplicates(texts_SchonGutDabei) }} 
        />
        <Stack.Screen 
            name="HeißGame" 
            component={KlassikerGame}
            initialParams={{ texts: replaceHashtagsWithoutDuplicates(texts_Heiß) }} 
        />
        <Stack.Screen 
            name="WahrheitOderPflichtGame" 
            component={KlassikerGame}
            initialParams={{ texts: replaceHashtagsWithoutDuplicates(texts_WahrheitOderPflicht) }} 
        />
        <Stack.Screen 
            name="ManyQuestionsGame" 
            component={ManyQuestionsGame}
            initialParams={{ manyQuestions: replaceHashtagsWithoutDuplicates(manyQuestions) }} 
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
