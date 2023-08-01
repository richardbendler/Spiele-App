import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function App() {
  return (
    <View sytle={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} placeholder="Bitte trag hier was ein"/>
        <Button title="Add Goal"/>
      </View>
      <View></View>
    </View>
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
});
