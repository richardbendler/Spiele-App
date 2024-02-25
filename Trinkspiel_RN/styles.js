import {StyleSheet, useState} from 'react-native';

const colorSchemeArray = [
  ['#1E3D59','#BFC0C0','#D4AF37'],
  ['#4169E1','#48D1CC','#FFA500'],
  ['#48A9A6','#D4AC0D','#E56B6F'],
]

const font1 = "Quicksand_300Light";
const font1_bold = "Quicksand_300Bold";
//const fontx = "Raleway_200ExtraLight";

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
  
});

const buttonStyles = StyleSheet.create({
  //Menu
  smallMenuButton: { //Wird in Settings genutzt
    backgroundColor: secondaryColor,
    padding: 20,
    borderRadius: 15,
    margin: 30,
    width: '80%',
    alignItems: 'center',
  },
  chalkboardButton: { //Wird in Menüs benutzt
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Halbtransparentes Schwarz
    borderRadius: 10,  // Abgerundete Ecken
    padding: 5,  // Innenabstand
  },
  chalkboardButtonPrimaryColor: { //Wird in Menüs benutzt
    backgroundColor: primaryColor,
    borderRadius: 10,  // Abgerundete Ecken
    padding: 5,  // Innenabstand
  },
  chalkboardButtonGrey: { //Wird in Menüs benutzt
    backgroundColor: 'grey', 
    borderRadius: 10,  // Abgerundete Ecken
    padding: 5,  // Innenabstand
  },

  //Settings Button
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
  settingsCloseButton: {
    position: 'absolute',
    top: 20,         // Abstand vom linken Rand des Containers
    right: 20,       // Abstand vom unteren Rand des Containers
    backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Halbtransparentes Schwarz //tertiaryColor,
    padding: 5,
    borderRadius: 50, // Setzen Sie dies auf die Hälfte der Breite und Höhe, um den Button rund zu machen
    width: 40, // Breite des Buttons
    height: 40, // Höhe des Buttons
    alignItems: 'center',
    justifyContent: 'center', // Zentrierung des Emojis
  },
  
  //Bottle Buttons
  imageWithTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%', 
    height: '20%',
    
  },
  bottleButton: {
    position: 'absolute',
    resizeMode: 'contain', // Damit das Bild korrekt skaliert wird
    alignItems: 'center',
    height: '100%',
    width: '100%', 
  },
  
  //Submit
  submitButton: {
    backgroundColor: secondaryColor,
    padding: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },

  //InGame
  gameActionButton: { //Wird in Menüs benutzt
    backgroundColor: '#228B22', //green
    borderRadius: 10,  // Abgerundete Ecken
    padding: 10,  // Innenabstand
    margin: 10,  // Außenabstand
  },
  
  //Game Info Button -> Zeigt Spielerklärungen an
  infoButton: {
    position: 'absolute',
    left: 20,         // Abstand vom linken Rand des Containers
    bottom: 20,       // Abstand vom unteren Rand des Containers
    backgroundColor: secondaryColor,
    padding: 5,
    borderRadius: 50, // Setzen Sie dies auf die Hälfte der Breite und Höhe, um den Button rund zu machen
    width: 50, // Breite des Buttons
    height: 50, // Höhe des Buttons
    alignItems: 'center',
    justifyContent: 'center', // Zentrierung des Emojis
  },

  //Restart Button von Winnerpage
  restartButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#D84315',  // Use a color that stands out
  },
});

//Modal für die Spielbeschreibungen bevor man Spiel startet
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dunkler Hintergrund für den Blur-Effekt
  },
  modalView: {
    margin: 20,
    backgroundColor: '#F0F0F0', // Weiche, neutrale Hintergrundfarbe
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Stellt sicher, dass das Modal nicht zu breit ist
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalTextTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white', // Sanfte Textfarbe
    fontSize: 25,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white', // Sanfte Textfarbe
  },
  modalTextParameters: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white', // Sanfte Textfarbe
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent', // Kein Hintergrund für ein subtiles Aussehen
    padding: 5,
  },
});


const buttonTextStyles = StyleSheet.create({
  menuButtonText:{ //wird in Settings genutzt
    fontFamily: font1,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: 0,
    fontWeight: 'bold',
    //textTransform: 'uppercase', //
  },

  chalkboardButtonText: {
    fontFamily: font1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: 33,  // oder eine andere passende Größe
    textShadowColor: 'rgba(0, 0, 0, 0.7)',  // Textschatten
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    //fontFamily: 'MyHandwritingFont',
  },
  bottleText: {
    fontFamily: font1,
    position: 'absolute',
    color: 'white',  // Oder eine andere gewünschte Farbe
    fontSize: 17,    // Oder eine andere gewünschte Schriftgröße
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',  // Optional: leichter Schatten für bessere Lesbarkeit
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    top: '63%',
    width: '150%',
    textAlign: 'center',
  },
  submitButtonText: {
    fontFamily: font1,
    color: 'white',
  },

  //InGame
  gameActionButtonText: {
    fontFamily: font1,
    textAlign: 'center',
    color: 'white',
    fontSize: 25,  // oder eine andere passende Größe
    textShadowColor: 'rgba(0, 0, 0, 0.7)',  // Textschatten
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    //fontFamily: 'MyHandwritingFont',
  },

  //Buttons wie Info und Einstellungen die nur ein i oder x enthalten
  settingsButtonText: {
    fontFamily: font1,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  infoButtonText: {
    fontFamily: font1,
    color: 'white',
    fontSize: 30,
  },

  //Restart Button von Winnerpage
  restartButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FAD02E',
  },
  
});

const fontStyles = StyleSheet.create({
  //Headers
  textHeader1:{
    fontWeight: 'bold',
    fontFamily: font1,
    color: 'white',
    fontSize: 40,
  },
  textHeader2:{
    fontWeight: 'bold',
    fontFamily: font1,
    color: 'white',
    fontSize: 30,
  },
  textHeader3:{
    fontWeight: 'bold',
    fontFamily: font1,
    color: 'white',
    fontSize: 25,
  },
  textHeader4:{
    fontWeight: 'bold',
    fontFamily: font1,
    color: 'white',
    fontSize: 15,
  },
  //Texts
  textNormal1:{
    fontFamily: font1,
    color: 'white',
    fontSize: 18,
  },
  textNormal2:{
    fontFamily: font1,
    color: 'white',
    fontSize: 15,
  },
  textNormal3:{
    fontFamily: font1,
    color: 'white',
    fontSize: 14,
  },
  textNormal4:{
    fontFamily: font1,
    color: 'white',
    fontSize: 12,
  },

  //Spziell für Picolo und andere Spiele die sich nur um Text drehen
  onlyTextBasedGameText: {
    fontFamily: font1,
    fontSize: 30,
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },

  //Winnerpage
  winnerText: {
      fontFamily: font1,
      fontSize: 40,
      fontWeight: 'bold',
      color: '#D84315',
      marginBottom: 20,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10
  },
  
  //Speziell für Picolo und Getränkecounter, wo es Eingabefelder gibt
  input: {
    fontFamily: font1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: '100%',
    color: 'white',
  },
  playerList: {
    fontFamily: font1,
    marginBottom: 20,
  },
  playerListText: {
    fontFamily: font1,
    color: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 8,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row', 
    alignItems: 'center',    
  },
  playerlistContainer: {
    fontFamily: font1,
    maxHeight: 300,  // oder die gewünschte Höhe
    width: '90%',
    alignSelf: 'center',
    color: 'white',
    borderWidth: 2,
    borderColor: 'white' // Farbe des Rahmens

  },
});



const backgroundStyles = StyleSheet.create({
  //Winnerpage
  winnerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAD02E',  // You can use a gradient or image
  },

  imageBackgroundStyle: {
    width: '100%',  // Füllt die gesamte Breite des übergeordneten Containers aus
    height: '100%', // Füllt die gesamte Höhe des übergeordneten Containers aus
    alignItems: 'center',
    justifyContent: 'center',
},

});


export const appStyles = {
  ...menuStyles,
  ...gameStyles,
  ...buttonStyles, 
  ...buttonTextStyles,
  ...fontStyles,  
  ...backgroundStyles,
  ...modalStyles,
}