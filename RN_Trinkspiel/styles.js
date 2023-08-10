import {StyleSheet, useState} from 'react-native';

const colorSchemeArray = [
  ['#1E3D59','#BFC0C0','#D4AF37'],
  ['#4169E1','#48D1CC','#FFA500'],
  ['#48A9A6','#D4AC0D','#E56B6F'],
]

const colorChoice = 2

const primaryColor = colorSchemeArray[colorChoice][0]//'#1E3D59';//'#008b8b';
const secondaryColor = colorSchemeArray[colorChoice][1]//'#BFC0C0';//'#ff7474';
const tertiaryColor = colorSchemeArray[colorChoice][2]//'#D4AF37'

const menuStyles = StyleSheet.create({
  //Bereich für MenüButtons
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor, 
  },
  //Bereich, der genutzt werden soll
  smallPageContainer: {
    //flex: 1,
    width: '90%',
    height: '95%',
    position: 'relative',
    //justifyContent: 'flex-end',
    //alignItems: 'center',
    backgroundColor: primaryColor, 
  },
  //Umfasst die gesamte Seite
  pageContainer: {
    //flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    position: 'relative',
    alignItems: 'center',       // Horizontale Zentrierung
    justifyContent: 'center',   // Vertikale Zentrierung
    backgroundColor: primaryColor, 
  }

  
});

const gameStyles = StyleSheet.create({
  completeScreenGameContainer:{
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  gameContainer: {
    backgroundColor: primaryColor, 
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlyTextBasedGameText: {
    fontSize: 30,
    textAlign: 'center',
    padding: 20,
  },
});

const buttonStyles = StyleSheet.create({
  //Menu
  menuButton: {
    backgroundColor: secondaryColor,
    padding: 13,
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
    fontWeight: 'bold',
    //textTransform: 'uppercase', //
  },
  //Submit
  submitButton: {
    backgroundColor: secondaryColor,
    padding: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
  //Settings Button
  //Submit
  settingsButton: {
    backgroundColor: tertiaryColor,
    padding: 5,
    borderRadius: 50, // Setzen Sie dies auf die Hälfte der Breite und Höhe, um den Button rund zu machen
    width: 70, // Breite des Buttons
    height: 70, // Höhe des Buttons
    alignItems: 'center',
    justifyContent: 'center', // Zentrierung des Emojis
  },
  settingsButtonText: {
    color: 'white',
  },
});

const fontStyles = StyleSheet.create({
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
});


export const appStyles = {
  ...menuStyles,
  ...gameStyles,
  ...buttonStyles, 
  ...fontStyles,  
}