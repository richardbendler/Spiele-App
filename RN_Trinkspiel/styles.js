import {StyleSheet, useState} from 'react-native';

const colorSchemeArray = [
  ['#1E3D59','#BFC0C0','#D4AF37'],
  ['#4169E1','#48D1CC','#FFA500'],
  ['#48A9A6','#D4AC0D','#E56B6F'],
]

const colorChoice = 2;

const primaryColor = colorSchemeArray[colorChoice][0]//'#1E3D59';//'#008b8b';
const secondaryColor = colorSchemeArray[colorChoice][1]//'#BFC0C0';//'#ff7474';
const tertiaryColor = colorSchemeArray[colorChoice][2]//'#D4AF37'

const menuStyles = StyleSheet.create({
  //Umfasst die gesamte Seite
  pageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',       // Horizontale Zentrierung
    justifyContent: 'center',   // Vertikale Zentrierung
    //backgroundColor: primaryColor, 
  },
  flexiblePageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    //backgroundColor: primaryColor, 
  },
  //Bereich, der genutzt werden soll
  smallPageContainer: {
    //flex: 1,
    width: '90%',
    height: '95%',
    position: 'relative',
    //justifyContent: 'flex-end',
    //alignItems: 'center',
    //backgroundColor: primaryColor, 
  },
  //Bereich für MenüButtons
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: primaryColor, 
  },
  settingsContainer: {
    width: '100%',
    height: '90%',
    alignItems: 'center',       // Horizontale Zentrierung
    justifyContent: 'center',   // Vertikale Zentrierung
    //backgroundColor: primaryColor, 
  },
  smallSettingsContainer: {
    width: '90%',
    height: '90%',
    alignItems: 'center',       // Horizontale Zentrierung
    justifyContent: 'center',   // Vertikale Zentrierung
    //backgroundColor: primaryColor, 
  },

  
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
    //backgroundColor: primaryColor, 
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
    color: 'white',
  },
});

const buttonStyles = StyleSheet.create({
  //Menu
  bigMenuButton: {
    backgroundColor: secondaryColor,
    padding: 40,
    borderRadius: 15,
    margin: 30,
    width: '90%',
    alignItems: 'center',
  },
  smallMenuButton: {
    backgroundColor: secondaryColor,
    padding: 20,
    borderRadius: 15,
    margin: 30,
    width: '80%',
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
  //Tafel-Buttons
  chalkboardButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Halbtransparentes Schwarz
    borderRadius: 10,  // Abgerundete Ecken
    padding: 10,  // Innenabstand
    margin: 50,  // Außenabstand
  },
  chalkboardButtonText: {
    color: 'white',
    fontSize: 40,  // oder eine andere passende Größe
    textShadowColor: 'rgba(0, 0, 0, 0.7)',  // Textschatten
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    //fontFamily: 'MyHandwritingFont',
  },
  //Bottle Buttons
  imageWithTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  bottleButton: {
    position: 'absolute',
    
    width: 180,  // Breite des Flaschenbilds
    height: 230, // Höhe des Flaschenbilds
    resizeMode: 'contain', // Damit das Bild korrekt skaliert wird
    alignItems: 'center',
  },
  bottleText: {
    position: 'absolute',
    color: 'white',  // Oder eine andere gewünschte Farbe
    fontSize: 15,    // Oder eine andere gewünschte Schriftgröße
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',  // Optional: leichter Schatten für bessere Lesbarkeit
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
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
    position: 'absolute',
    left: 20,         // Abstand vom linken Rand des Containers
    bottom: 0,       // Abstand vom unteren Rand des Containers
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
  settingsCloseButton: {
    position: 'absolute',
    top: 20,         // Abstand vom linken Rand des Containers
    right: 20,       // Abstand vom unteren Rand des Containers
    backgroundColor: tertiaryColor,
    padding: 5,
    borderRadius: 50, // Setzen Sie dies auf die Hälfte der Breite und Höhe, um den Button rund zu machen
    width: 70, // Breite des Buttons
    height: 70, // Höhe des Buttons
    alignItems: 'center',
    justifyContent: 'center', // Zentrierung des Emojis
  },
});

const fontStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: '100%',
    color: 'white',
  },
  playerList: {
    marginBottom: 20,
  },
  playerListText: {
    color: 'white',
  },
  playerlistContainer: {
    maxHeight: 300,  // oder die gewünschte Höhe
    width: '90%',
    alignSelf: 'center',
    color: 'white',
    borderWidth: 2,
    borderColor: 'white' // Farbe des Rahmens

  }
  

});

const backgroundStyles = StyleSheet.create({

  imageBackgroundStyle: {
    width: '100%',  // Füllt die gesamte Breite des übergeordneten Containers aus
    height: '100%', // Füllt die gesamte Höhe des übergeordneten Containers aus
}

});


export const appStyles = {
  ...menuStyles,
  ...gameStyles,
  ...buttonStyles, 
  ...fontStyles,  
  ...backgroundStyles,
}