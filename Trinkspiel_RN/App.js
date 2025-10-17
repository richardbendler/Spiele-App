import React, { useState, useEffect, useContext, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

//Import der Datenbankvorlagen
// import { getGameData } from './src/general'; // API_RESTORE_STEP: uncomment to fetch texts from the server again
import { theOneSamplePrompts } from './src/data/picoloTexts';
import { spinTheBottleTruthTexts } from './src/data/spinTheBottleTruth';
import { spinTheBottleDareTexts } from './src/data/spinTheBottleDare';
import { manyQuestionsSampleTexts } from './src/data/manyQuestionsTexts';
import { activitySampleWords } from './src/data/activityWords';

//Import der Menus
import StartMenu from './src/menus/StartMenu';
import MainMenu from './src/menus/MainMenu';
import AddPlayer from './src/menus/AddPlayer';

//Import der Spiele
import PicoloGame from './src/games/PicoloGame';
import ManyQuestionsGame from './src/games/ManyQuestions';
import Kingscup from './src/games/Kingscup';
import MaexchenGame from './src/games/Maexchen';
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
// import {db_backup_texts_Picolo} from './src/db_backup'; // API_RESTORE_STEP: uncomment when switching back to API data
// import {db_backup_textsWahrheitSpinTheBottle} from './src/db_backup';
// import {db_backup_textsPflichtSpinTheBottle} from './src/db_backup';
// import {db_backup_manyQuestions} from './src/db_backup';
// import {db_backup_words} from './src/db_backup';


export default function App() {
  const [theOnePrompts, setTheOnePrompts] = useState(() => [...theOneSamplePrompts]); // LOCAL_TEXTS: seeded from hardcoded sample file
  const [textsWahrheitSpinTheBottle, setTextsWahrheitSpinTheBottle] = useState(() => [...spinTheBottleTruthTexts]);
  const [textsPflichtSpinTheBottle, setTextsPflichtSpinTheBottle] = useState(() => [...spinTheBottleDareTexts]);
  const [manyQuestions, setManyQuestions] = useState(() => [...manyQuestionsSampleTexts]);
  const [words, setWords] = useState(() => [...activitySampleWords]);
  const [theOneSettings, setTheOneSettings] = useState({
    currentDrunkenness: 4,
    desiredDrunkenness: 6,
    familiarity: 5,
  });

  ////////////////////////////////////////////////////////
  /////////// Daten aus db_backup.js  ////////////////////
  ////////////////////////////////////////////////////////
  // API_DISABLED: state is now seeded from ./src/data sample files while the API is offline.
  /* API_RESTORE_STEP: Remove this comment block to hydrate state from db_backup when re-enabling the API.
  useEffect(() => {
    setTheOnePrompts(db_backup_texts_Picolo)
    setTextsWahrheitSpinTheBottle(db_backup_textsWahrheitSpinTheBottle)
    setTextsPflichtSpinTheBottle(db_backup_textsPflichtSpinTheBottle)
    setManyQuestions(db_backup_manyQuestions)
    setWords(db_backup_words)
  }, []) // Das leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgefâ”œâ•hrt wird
  */

  ////////////////////////////////////////////////////////
  /////////// Daten aus lokalem Speicher holen  //////////
  ////////////////////////////////////////////////////////

  //Allgemeine Funktion zum Laden aus dem Gerâ”œÃ±tespeicher
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

  //Relikt zum Lâ”œÃ‚schen der Items: AsyncStorage.setItem("drinkTypes", JSON.stringify([]));

  const [drinkTypes, setDrinkTypes] = useState([]); 
  useEffect(() => {
    loadFromDisk(setDrinkTypes, "drinkTypes");
    //TODO: Wird hier nicht â”œâ•berschrieben falls DB-Anfrage zu lange dauert?
    loadFromDisk(setTheOnePrompts, "texts_Picolo");
    loadFromDisk(setTextsWahrheitSpinTheBottle, "textsWahrheitSpinTheBottle");
    loadFromDisk(setTextsPflichtSpinTheBottle, "textsPflichtSpinTheBottle");
    loadFromDisk(setManyQuestions, "manyQuestions");
    loadFromDisk(setWords, "words");
  }, []) // Das leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgefâ”œâ•hrt wird


  
  ////////////////////////////////////////////////////////
  ///////////////////// SQL-ABFRAGEN  ////////////////////
  ////////////////////////////////////////////////////////
  
  //LOAD FROM API and SAFE TO DISK
  // API_DISABLED: remote fetches are paused while local sample texts are active.
  /* API_RESTORE_STEP: Remove this comment block to fetch texts from the API again.
  useEffect(() => {
    // new API routes
    getGameData("texts_Picolo", setTheOnePrompts, "theOne");
    getGameData("textsWahrheitSpinTheBottle", setTextsWahrheitSpinTheBottle, "bottleSpinTruth");
    getGameData("textsPflichtSpinTheBottle", setTextsPflichtSpinTheBottle, "bottleSpinDare");
    getGameData("manyQuestions", setManyQuestions, "manyQuestions");
    getGameData("words", setWords, "activity")
  }, []) // Das leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgefâ”œâ•hrt wird
  */

  //TODO: Falls API nicht erreichbar: Daten aus lokalem Gerâ”œÃ±tespeicher holen
  // -> Vielleicht auch einfach immer?
  //TODO: Initial-Arrays im Code in extra Datei hinterlegen falls beim ersten Start kein Internet da ist


  //Fâ”œâ•r Menus
  const Stack = createStackNavigator();
  
  //Globale Variablen aus Context
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [players, setPlayers] = useState([]);  
  const [language, setLanguage] = useState('de');

  const shuffledManyQuestions = useMemo(() => shuffleArrayFisherYates([...manyQuestions]), [manyQuestions]);

  return (
    <VariablesContext.Provider
      value={{
        settingsVisible,
        setSettingsVisible,
        drinkTypes,
        setDrinkTypes,
        infoVisible,
        setInfoVisible,
        players,
        setPlayers,
        language,
        setLanguage,
        theOneSettings,
        setTheOneSettings,
        theOnePrompts,
        setTheOnePrompts,
      }}
    >
      <View style={{ flex: 1 }}>
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
              initialParams={{ theOneData: theOnePrompts }} 
          />
          <Stack.Screen 
              name="ManyQuestionsGame" 
              component={ManyQuestionsGame}
              initialParams={{ manyQuestionsData: shuffledManyQuestions }} 
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
      <LanguageToggle />
      </View>
    </VariablesContext.Provider>
  );
}

const LanguageToggle = () => {
  const { language, setLanguage } = useContext(VariablesContext);
  const toggleLanguage = () => setLanguage(prev => (prev === 'de' ? 'en' : 'de'));
  return (
    <TouchableOpacity style={languageStyles.toggle} onPress={toggleLanguage} activeOpacity={0.8}>
      <Text style={languageStyles.toggleLabel}>{language === 'de' ? 'DE' : 'EN'}</Text>
    </TouchableOpacity>
  );
};

const languageStyles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  toggleLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});

