import React, { useState, useEffect } from 'react';
import { appStyles } from './styles';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Button from './src/Button';
import Question from './src/Question';
//import manyQuestions from './src/local_questions';

//import db from './src/Database'; 
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
      case "None":
        setCurrentScreen(ScreenTypes.None);
        break;
    }
  }

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
  //SQL REQUEST
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
    return ret;
  };
  const [sqlResponseVorglühen, setSqlResponseVorglühen] = useState(handleSqlRequest('SELECT * FROM `game_simple_questions`'));
  const [vorglühenQuestions, setVorglühenQuestions] = useState([]);

  const [sqlResponseManyQuestions, setSqlResponseManyQuestions] = useState(handleSqlRequest('SELECT * FROM `game_simple_questions`'));
  const [manyQuestions, setManyQuestions] = useState([]);


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
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setVorglühenGameStarted(true);
        break;
      case "schonGutDabei":
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setSchonGutDabeiGameStarted(true); 
        break;
      case "heiß":
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setHeißGameStarted(true); 
        break;
      case "wahrheitOderPflicht":
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setwahrheitOderPflichtGameStarted(true);
        break;
      case "manyquestions":
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        //console.log(sqlResponseManyQuestions["_z"].map(row=>row.content))
        setManyQuestionsStarted(true);
        break;
      case "kingscup":
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setKingsCupGameStarted(true);
        break;
      case "klatschen": 
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setklatschenGameStarted(true);
        break;
      case "mäxxchen":
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setMäxxchenGameStarted(true);
        break;
      case "activity":
        //TODO: Austauschen
        setManyQuestions(sqlResponseManyQuestions["_z"].map(row=>row.content));
        setActivityGameStarted(true);
        break;
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
        <TouchableOpacity /*onPress={() => handleButtonClick("game","kingscup")}*/ style={appStyles.menuButton}>
          <Text>Kings Cup / Klatschen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonClick("menu","minigames")} style={appStyles.menuButton}>
          <Text>Mini Games</Text>
        </TouchableOpacity>
        <TouchableOpacity /*onPress={() => handleButtonClick("game","activity")}*/ style={appStyles.menuButton}>
          <Text>Activity / Scharade</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const printKlassikerMenu = () => {
    return(
      <View>
        <TouchableOpacity /*onPress={() => handleButtonClick("game","vorglühen")}*/ style={appStyles.menuButton}>
          <Text>Vorglühen</Text>
        </TouchableOpacity>
        <TouchableOpacity /*onPress={() => handleButtonClick("game","schonGutDabei")}*/ style={appStyles.menuButton}>
          <Text>Schon gut dabei</Text>
        </TouchableOpacity>
        <TouchableOpacity /*onPress={() => handleButtonClick("game","heiß")}*/ style={appStyles.menuButton}>
          <Text>Heiß</Text>
        </TouchableOpacity>
        <TouchableOpacity /*onPress={() => handleButtonClick("game","wahrheitOderPflicht")}*/ style={appStyles.menuButton}>
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
        <TouchableOpacity /*onPress={() => handleButtonClick("menu","mäxxchen")}*/ style={appStyles.menuButton}>
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
      
      {/*<View>
        <Text>Aus der Datenbank abgerufene Daten:</Text>
        {data.map((item) => (
          <Text key = {item.id}>{item.content}</Text>
        ))}
      </View>
      <View>
        <TextInput
          placeholder="Name"
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
        />
        <TextInput
          placeholder="E-Mail"
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
        />
        <Button title="Daten speichern" onPress={handleSaveData} />
        </View>*/}

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
      <View style={{absolute:"relative",top:0, left:50}}>
        <TextInput
          placeholder="Text eingeben"
          value={text}
          onChangeText={setText}
        />
        <Button title="Text senden" onPress={handleSendText} />
        <Text>{response}</Text>
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
