import {StyleSheet, useState} from 'react-native';

const primaryColor = '#008b8b';
const secondaryColor = '#ff7474';


const pageStyles = StyleSheet.create({
  pageContainer: {
    backgroundColor: primaryColor, 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const menuStyles = StyleSheet.create({
  menuContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: primaryColor, 
    },
  menuButton: {
    backgroundColor: secondaryColor,
    padding: 40,
    borderRadius: 15,
    margin: 20,
    width: '90%',
    alignItems: 'center',
  },
  menuButtonText:{
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: 0,
    textTransform: 'uppercase', //
  },
});

const gameStyles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },

  manyquestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manyQuestionsText: {
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
  },
});

const commonStyles = StyleSheet.create({    
  exitButton:{
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: secondaryColor, // Customize the button color
    padding: 10,
    borderRadius: 5,
  },
  exitButtonText:{
    color: 'white',
  },

  
    addButton: {
      backgroundColor: secondaryColor,
      padding: 20,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
    startButton: {
      backgroundColor: secondaryColor,
      padding: 15,
      borderRadius: 5,
    },
    buttonText: {
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
      borderColor: secondaryColor,
      width:"80%",
      marginRight: 8,
      padding: 8
    },
    
  });

export const appStyles = {
    ...commonStyles,
    ...menuStyles,
    ...pageStyles,
    ...gameStyles,
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