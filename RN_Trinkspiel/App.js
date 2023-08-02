import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const showNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };
  
  
  return (
    <View style={styles.container}>
      {gameStarted ? (
        <TouchableOpacity onPress={showNextQuestion}>
          <Question question={questions[questionIndex]} />
        </TouchableOpacity>
      ) : (
        <Button onPress={startGame} title="Start Game" />
      )}
    </View>
    /*<View sytle={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} placeholder="Bitte trag hier was ein"/>
        <Button title="Add Goal"/>
      </View>
      <View></View>
  </View>*/
  );
}

const styles = StyleSheet.create({
  appContainer:{
    padding:50
  },
  inputContainer:{
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textInput:{
    borderWidth:1,
    borderColor: "blue",
    width:"80%",
    marginRight: 8,
    padding: 8
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
});
