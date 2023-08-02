import React, { useState } from 'react';
import { appStyles } from './styles';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Button from './src/Button';
import Question from './src/Question';
// Similar to Question.js, adjust styling if needed:
//import WeatherButton from './src/WeatherButton';
//import WeatherQuestion from './src/WeatherQuestion';

export default function App() {
  //Games started bools
  const [vorglühenGameStarted, setVorglühenGameStarted] = useState(false);
  const [schonGutDabeiGameStarted, setSchonGutDabeiGameStarted] = useState(false);
  const [heißGameStarted, setHeißGameStarted] = useState(false);
  const [wahrheitOderPflichtGameStarted, setwahrheitOderPflichtGameStarted] = useState(false);
  const [manyQuestionsGameStarted, setManyQuestionsStarted] = useState(false);
  const [kingsCupGameStarted, setKingsCupGameStarted] = useState(false);
  const [klatschenGameStarted, setklatschenGameStarted] = useState(false);
  const [mäxxchenGameStarted, setMäxxchenGameStarted] = useState(false);
  const [activityGameStarted, setActivityGameStarted] = useState(false);

  //Menus
  const ScreenTypes =  {
    mainMenu: 'mainMenu',
    klassikerMenu: 'klassikerMenu',
    miniGamesMenu: 'miniGamesMenu',
    settingsMenu: 'settingsMenu',
    addingPlayerMenu: 'addingPlayerMenu',
    profileMenu: 'profileMenu',
    None: 'None',
  }
  const [currentScreen, setCurrentScreen] = useState(ScreenTypes.mainMenu)
  const openMenu = (menu) => {
    
    switch(menu){
      case "mainMenu":
        setCurrentScreen(ScreenTypes.mainMenu);
        break;
      case "klassiker":
        setCurrentScreen(ScreenTypes.klassikerMenu);  
        break;
      case "minigames":
        setCurrentScreen(ScreenTypes.miniGamesMenu); 
        break;
      case "settingsMenu":
        setCurrentScreen(ScreenTypes.settingsMenu);
        break;
      case "addingPlayerMenu":
        setCurrentScreen(ScreenTypes.addingPlayerMenu);  
        break;
      case "profileMenu":
        setCurrentScreen(ScreenTypes.profileMenu); 
        break;
    }
  }


  const [playerNames, setPlayerNames] = useState([]);
  const [currentName, setCurrentName] = useState('');

  const [generalGameStarted, setGeneralGameStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [weatherGameStarted, setWeatherGameStarted] = useState(false);
  const [weatherQuestionIndex, setWeatherQuestionIndex] = useState(0);
  
  
  const startGame = (game) => {
    setCurrentScreen(ScreenTypes.None)
    switch(game){
      case "vorglühen":
        setVorglühenGameStarted(true);
      case "schonGutDabei":
        setSchonGutDabeiGameStarted(true); 
      case "heiß":
        setHeißGameStarted(true); 
      case "wahrheitOderPflicht":
        setwahrheitOderPflichtGameStarted(true);
      case "manyquestions":
        setManyQuestionsStarted(true);
      case "kingscup":
        setKingsCupGameStarted(true);
      case "manyquestions":
        setklatschenGameStarted(true);
      case "mäxxchen":
        setMäxxchenGameStarted(true);
      case "activity":
        setActivityGameStarted(true);
    }
  };

  const manyQuestionsGame = () => {
    return(
      <View>
        <TouchableOpacity onPress={showNextQuestion}>
          <Question question={manyQuestions[questionIndex]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
          <Text style={appStyles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    )
  }

  
  
  const manyQuestions = [
    'What is the capital of France?',
    'What is the largest mammal?',
    'Who wrote the play "Romeo and Juliet"?',
    // Add more general questions here
  ];
  
  const weatherQuestions = [
    'What causes rain?',
    'What is a tornado?',
    'How is temperature measured?',
    // Add more weather-related questions here
  ];

  const endAnyGame = () => {
    setCurrentScreen(ScreenTypes.mainMenu);
    //end all games
    setVorglühenGameStarted(false);
    setSchonGutDabeiGameStarted(false);
    setHeißGameStarted(false);
    setwahrheitOderPflichtGameStarted(false);
    setManyQuestionsStarted(false);
    setKingsCupGameStarted(false);
    setklatschenGameStarted(false);
    setMäxxchenGameStarted(false);
    setActivityGameStarted(false);
  };
  
  const showNextQuestion = () => {
    if (questionIndex < manyQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const showNextWeatherQuestion = () => {
    if (weatherQuestionIndex < weatherQuestions.length - 1) {
      setWeatherQuestionIndex(weatherQuestionIndex + 1);
    }
  };

  const handleAddPlayer = () => {
    if (currentName.trim() !== '') {
      setPlayerNames([...playerNames, currentName]);
      setCurrentName('');
    }
  };

  //Handles any clicked button
  const handleButtonClick = (type, content) => {
    if(type == "menu"){
      openMenu(content);
    }
    if(type == "game"){
      startGame(content);
    }
  };

  
  const printMainMenu = () => {
    return(
      <View>
        <TouchableOpacity onPress={() => handleButtonClick("menu","klassiker")} style={appStyles.menuButton}>
          <Text>Klassiker</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("game","manyquestions")} style={appStyles.menuButton}>
          <Text>100.000 Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("game","kingscup")} style={appStyles.menuButton}>
          <Text>Kings Cup / Klatschen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("menu","minigames")} style={appStyles.menuButton}>
          <Text>Mini Games</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("game","activity")} style={appStyles.menuButton}>
          <Text>Activity / Scharade</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const printKlassikerMenu = () => {
    return(
      <View>
        <TouchableOpacity onPress={() => handleButtonClick("game","vorglühen")} style={appStyles.menuButton}>
          <Text>Vorglühen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("game","schonGutDabei")} style={appStyles.menuButton}>
          <Text>Schon gut dabei</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("game","heiß")} style={appStyles.menuButton}>
          <Text>Heiß</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("game","wahrheitOderPflicht")} style={appStyles.menuButton}>
          <Text>Wahrheit oder Pflicht</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
            <Text style={appStyles.exitButtonText}>Back</Text>
          </TouchableOpacity>
      </View>
    );
  };
  const printMiniGamesMenu = () => {
    return(
      <View>
        <TouchableOpacity onPress={() => handleButtonClick("menu","mäxxchen")} style={appStyles.menuButton}>
          <Text>Mäxchen</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
            <Text style={appStyles.exitButtonText}>Back</Text>
          </TouchableOpacity>
      </View>
    );
  };
  
  const printAddPlayer = () => {
    <>
      <Text style={appStyles.title}>Enter Player Names</Text>
      <TextInput
        placeholder="Enter a name"
        value={currentName}
        onChangeText={text => setCurrentName(text)}
        style={appStyles.input}
      />
      <TouchableOpacity onPress={handleAddPlayer} style={appStyles.addButton}>
        <Text style={appStyles.buttonText}>Add Player</Text>
      </TouchableOpacity>
      <FlatList
        data={playerNames}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        style={appStyles.playerList}
      />
    </>
  }
  
  return (
    <View style={appStyles.pageContainer}>
      {/* Hide all start buttons once any game starts */}
      <View style={appStyles.menuContainer}>
        {currentScreen == ScreenTypes.mainMenu 
        ?<View>{printMainMenu()}</View>
        :(null)}
        {currentScreen == ScreenTypes.klassikerMenu 
        ?<View>{printKlassikerMenu()}</View> //TODO: Funktionen schreiben
        :(null)}
        {currentScreen == ScreenTypes.miniGamesMenu 
        ?<View>{printMiniGamesMenu()}</View>
        :(null)}
        {currentScreen == ScreenTypes.settingsMenu 
        ?<View>{printMainMenu()}</View>
        :(null)}
        {currentScreen == ScreenTypes.addingPlayerMenu 
        ?<View>{printMainMenu()}</View>
        :(null)}
        {currentScreen == ScreenTypes.profileMenu 
        ?<View>{printMainMenu()}</View>
        :(null)}
      </View>

      {manyQuestionsGameStarted 
      ? ( manyQuestionsGame() )
      : null}


      {false ? (
          <View>{printAddPlayer()}</View>
      ) : null}

      
      {/*{generalGameStarted ? (
        <>
          <TouchableOpacity onPress={showNextQuestion}>
            <Question question={manyQuestions[questionIndex]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
            <Text style={appStyles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {weatherGameStarted ? (
        <>
          <TouchableOpacity onPress={showNextWeatherQuestion}>
            <Question question={weatherQuestions[weatherQuestionIndex]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
            <Text style={appStyles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </>
      ) : null}*/}

      
    </View>
    /*<View sytle={appStyles.appContainer}>
      <View style={appStyles.inputContainer}>
        <TextInput style={appStyles.textInput} placeholder="Bitte trag hier was ein"/>
        <Button title="Add Goal"/>
      </View>
      <View></View>
  </View>*/
  );
}
