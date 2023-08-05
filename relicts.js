//GET
const [data, setData] = useState([]);
useEffect(() => {
  fetchDataFromServer();
}, []);
const fetchDataFromServer = async () => {
  try {
    const response = await fetch('http://45.9.63.16:3000/api/getUserData');
    if (response.ok) {
      const responseData = await response.json();
      setData(responseData);
    } else {
      console.error('Fehler beim Abrufen der Daten.');
    }
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
};

return (
  <View>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="MainMenu">
          <Stack.Screen name="MainMenu" component={MainMenu} />
          <Stack.Screen name="KlassikerMenu" component={KlassikerMenu} />
          <Stack.Screen name="MiniGamesMenu" component={MiniGamesMenu} />
          
          {/* Fügen Sie hier weitere Screens hinzu... */}
        </Stack.Navigator>
      </NavigationContainer>

    <View style={appStyles.pageContainer}>
      
      


      {manyQuestionsGameStarted 
      ? ( manyQuestionsGame() )
      : null}
      {mäxchenGameStarted 
      ? ( <MaexchenGame/> )
      : null}
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
      
      {currentScreen != ScreenTypes.None ?
        <View style={appStyles.menuContainer}>
          {/*{currentScreen == ScreenTypes.mainMenu 
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
          :(null)}*/}
          
        </View>
      :(null)}
      
      {currentScreen != ScreenTypes.mainMenu ?
      <TouchableOpacity onPress={endAnyGame} style={appStyles.exitButton}>
        <Text style={appStyles.exitButtonText}>Back</Text>
      </TouchableOpacity>
      :(null)}
      {/*<View style={{absolute:"relative",top:0, left:50}}>
        <TextInput
          placeholder="Text eingeben"
          value={text}
          onChangeText={setText}
        />
        <Button title="Text senden" onPress={handleSendText} />
        <Text>{response}</Text>
        </View>*/}

      
      

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
    {/*<View sytle={appStyles.appContainer}>
      <View style={appStyles.inputContainer}>
        <TextInput style={appStyles.textInput} placeholder="Bitte trag hier was ein"/>
        <Button title="Add Goal"/>
      </View>
      <View></View>
    </View>*/}
  </View>
);
