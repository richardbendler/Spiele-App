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
  
});

const gameStyles = StyleSheet.create({
  
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

  
    
    startButton: {
      backgroundColor: secondaryColor,
      padding: 15,
      borderRadius: 5,
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
  
  
  
}