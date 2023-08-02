import {StyleSheet} from 'react-native';

const commonStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ecf0f1',
    },
    gameContainer: {
      flex: 1,
      width: '100%',
      position: 'relative',
    },
    addButton: {
      backgroundColor: '#3498db',
      padding: 20,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
    startButton: {
      backgroundColor: '#27ae60',
      padding: 15,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
    },
    exitButton:{
      position: 'absolute',
      top: 60,
      right: 10,
      backgroundColor: 'red', // Customize the button color
      padding: 10,
      borderRadius: 5,
    },
    exitButtonText:{
      color: 'white',
    },
    // ... (other styles)
    
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

export const appStyles = {
    ...commonStyles,
  startContainer: {
    ...commonStyles.container,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: '100%',
  },
  playerList: {
    marginBottom: 20,
  },
}