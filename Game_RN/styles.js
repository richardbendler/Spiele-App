import {StyleSheet} from 'react-native';

const colorSchemeArray = [
  ['#1E3D59','#BFC0C0','#D4AF37'],
  ['#4169E1','#48D1CC','#FFA500'],
  ['#48A9A6','#D4AC0D','#E56B6F'],
]

const font1 = "Quicksand_300Light";
const font1_bold = "Quicksand_300Bold";
const font2= "Caveat_400Regular";
//const fontx = "Raleway_200ExtraLight";

const colorChoice = 2;

const primaryColor = colorSchemeArray[colorChoice][0]//'#1E3D59';//'#008b8b';
const secondaryColor = colorSchemeArray[colorChoice][1]//'#BFC0C0';//'#ff7474';

const menuStyles = StyleSheet.create({
  //Umfasst die gesamte Seite
  pageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',       // Horizontale Zentrierung
    justifyContent: 'center',   // Vertikale Zentrierung
  },
  flexiblePageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  chalkboardButton: { //Wird in Menüs benutzt
    backgroundColor: 'rgba(0, 0, 0, 0.8)',  // Halbtransparentes Schwarz
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

  bottleButtonComingSoonBadge: {
    top: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: '30%',
    padding: 10, // Fügt ein bisschen Platz um den Text hinzu
    borderRadius: 5, // Ecken des Hintergrunds abrunden
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
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  
  //Game Info Button -> Zeigt Spielerklärungen an
  infoButton: {
    position: 'absolute',
    backgroundColor: secondaryColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Stellt sicher, dass das Modal nicht zu breit ist
    // Maximal teiltransparentes Popup
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalTextTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white', // Sanfte Textfarbe
    fontSize: 34,
    lineHeight: 40,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white', // Sanfte Textfarbe
    fontSize: 20,
    lineHeight: 26,
  },
  modalTextParameters: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white', // Sanfte Textfarbe
    fontSize: 18,
    lineHeight: 24,
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
    color: 'white',  // Oder eine andere gewünschte Farbe
    fontSize: 14,    // Oder eine andere gewünschte Schriftgröße
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',  // Optional: leichter Schatten für bessere Lesbarkeit
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
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

  //Buttons wie Info die nur ein i enthalten
  infoButtonText: {
    fontFamily: font1,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
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
