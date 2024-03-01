import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView, Dimensions, Modal, TouchableWithoutFeedback  } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function MainMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gameParameters, setGameParameters] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [navigateAction, setNavigateAction] = useState('');

  const gameDescriptions = {
    'The One': { title: 'The One', parameters: 'Trinklevel: ⚪⚪⚪⚫⚫ (3/5) \n Kennenlernen: ⚪⚪⚪⚫⚫ (3/5)', description: 'Hier könnt ihr den klassischen Trinkspielmodus spielen, bei dem Fragen und Aussagen vorgelesen werden, die bestimmen wer trinkt oder z.B. eine Aufgabe erfüllen muss. Hier müsst ihr euch um nichts kümmern, außer die Namen der Mitspielenden einzutragen.', navigateTo: 'AddPlayer' },
    'Skala': { title: 'Skala', parameters: 'Trinklevel: ⚪⚫⚫⚫⚫ (1/5) \n Kennenlernen: ⚪⚪⚪⚫⚫ (3/5)', description: 'Wo würdest du Monopoly auf einer Skala von "entspannt" bis "stressig" einordnen? Bei diesem Spiel könnt ihr in Teams gegeneinander antreten um zu versuchen, den gleichen Wert auf der Skala zu finden.', navigateTo: '' },
    'Kingscup': { title: 'Kingscup', parameters: 'Trinklevel: ⚪⚪⚪⚫⚫ (3/5) \n Kennenlernen: ⚪⚫⚫⚫⚫ (1/5)', description: 'Kein Kartenspiel dabei und ihr wollt trotzdem Kingscup spielen? Hier könnt ihr das tun. \n Jede Karte hat eine eigene Funktion, die beim Aufdecken ausgeführt werden muss. Hier könnt ihr ohne große Regeln einfach starten und reihum aufdecken.', navigateTo: 'Kingscup' },
    'Schöneberg': { title: 'Schöneberg', parameters: 'Trinklevel: ⚪⚪⚪⚪⚫ (4/5) \n Kennenlernen: ⚪⚫⚫⚫⚫ (1/5)', description: 'Im unkonventionellen Schöneberg sprechen die Geschäfte und Cafés in der Motzstraße und um den Viktoria-Luise-Platz die große Gay-Community der Gegend an. Das riesige Kaufhaus des Westens, auch KaDeWe genannt, zieht anspruchsvolle Shoppende sowie Feinschmecker mit einer Feinkostabteilung an. Originelle Galerien, türkische Lokale und Lebensmittelgeschäfte sind in der Potsdamer Straße zu finden. Familien spazieren durch das weitläufige Schöneberger Südgelände, das sich auf der Anlage eines früheren Rangierbahnhofs befindet.', navigateTo: '' },
    'MaexchenGame': { title: 'Mäxchen', parameters: 'Trinklevel: ⚪⚪⚪⚫⚫ (3/5) \n Kennenlernen: ⚪⚫⚫⚫⚫ (1/5)', description: 'Mäxchen ist ein klassisches Würfelspiel, das auf dem Prinzip von Lügen basiert. Die genauen Regeln könnt ihr nach Spielstart unter dem Infobutton lesen.', navigateTo: 'MaexchenGame' },
    'SpinTheBottle': { title: 'Flaschendrehen', parameters: 'Trinklevel: ⚪⚪⚪⚫⚫ (3/5) \n Kennenlernen: ⚪⚪⚪⚫⚫ (3/5)', description: 'Das klassiche Flaschendrehen kombiniert mit Wahrheit oder Pflicht.', navigateTo: 'SpinTheBottle' },
    'Top10': { title: 'Top 10', parameters: 'Trinklevel: ⚪⚫⚫⚫⚫ (1/5) \n Kennenlernen: ⚪⚪⚪⚫⚫ (3/5)', description: 'Jede Person muss eine Antwort zu einer bestimmten Frage finden, die sich auf einer Skala (z.B. langweilige Trinkspiele bis spannende Trinkspiele) befindet. Eine Person hat aber eine andere Aufgabe: nämlich, alle anderen in die richtige Reihenfolge zu bringen.', navigateTo: '' },
    'ManyQuestionsGame': { title: '1000 Questions', parameters: 'Trinklevel: ⚪⚪⚪⚫⚫ (3/5) \n Kennenlernen: ⚪⚪⚪⚫⚫ (3/5)', description: 'Hier spielt ihr "Wer würde am ehesten", aber verdeckt! Das Handy wird vredeckt ohne vorzulesen an die Person weitergegeben, auf die die Aussage eurer Meinung nach am ehsten zutrifft. Die genaueren Regeln könnt ihr im Spiel lesen.', navigateTo: 'ManyQuestionsGame' },
    '6by6': { title: 'Six by Six', parameters: 'Trinklevel: ⚪⚪⚪⚪⚪ (5/5) \n Kennenlernen: ⚪⚫⚫⚫⚫ (1/5)', description: 'Achtung: Mathematik! Würfelt mit zwei (digitalen) Würfeln um die x- & y-Koordinate auf dem 6x6-Feld zu bestimmen. Befindet sich ein (virtuelles) Getränk auf der Karte, müsst ihr trinken! Die kompletten Regeln gibt es im Spiel.', navigateTo: '' },
    'Activity': { title: 'Activity', parameters: 'Trinklevel: ⚪⚫⚫⚫⚫ (1/5) \n Kennenlernen: ⚪⚪⚫⚫⚫ (2/5)', description: 'Activity ist das klassische Scharade/Pantomime/Zeichnen, das ihr mit den hier generierten Wörtern spielen könnt.', navigateTo: '' },
    'Getränkezähler': { title: 'Getränkezähler', parameters: '🍻🍻🍻', description: 'Du verlierst schnell mal den Überblick über deinen Alkoholkonosum? Hier ist die Lösung für dich! \n Tracke ganz einfach, wie viel du über den Abend hinweg oder auch auf das Jahr gerechnet, so zu dir nimmst.', navigateTo: '' },
    'HorseRace': { title: 'Pferderennen', parameters: 'Trinklevel: ⚪⚪⚪⚫⚫ (3/5) \n Kennenlernen: ⚪⚫⚫⚫⚫ (1/5)', description: 'Glücksspiel ist natürlich eigentlich nicht cool... außer wenn es ums Trinken geht! Setzt eure Einsätze (Schlücke) auf eins der Pferde (Asse) und verteilt bei Gewinn eures Pferdes das Doppelte!', navigateTo: 'HorseRace' },
    'Kopfpoker': { title: 'Kopfpoker', parameters: 'Trinklevel: ⚪⚪⚪⚫⚫ (3/5) \n Kennenlernen: ⚪⚫⚫⚫⚫ (1/5) \n 📱Jede spielende Person braucht hier die App', description: 'Jede Person hält sich ihr Handy an die Stirn, sodass die anderen die zufällig generierte Karte sehen können. Nun setzt ihr Schlucke darauf, ob ihr denkt, dass ihr unter den niedrigsten zwei Karten sein werdet! Genauer könnt ihr die Regeln im Spiel lesen.', navigateTo: '' },
  };

  const openModalWithGame = (gameKey) => {
    const game = gameDescriptions[gameKey];
    setGameTitle(game.title);
    setGameParameters(game.parameters)
    setGameDescription(game.description);
    setNavigateAction(game.navigateTo);
    setModalVisible(true);
  };



  const [backgroundAspectRatio, setBackgroundAspectRatio] = useState(100); // Standardwert ist 1
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handleImageLoad = (e) => {
    const { width, height } = e.nativeEvent.source;
    const aspectRatio = width / height;
    setBackgroundAspectRatio(aspectRatio);
  };

  // Berechnen der Breite des Hintergrundbildes basierend auf dem Seitenverhältnis
  const backgroundImageWidth = windowHeight * backgroundAspectRatio;

  return (
    <View style={{alignItems: 'flex-start'}}>
      <ScrollView
        horizontal={true}
        pagingEnabled={false} // Optional, für ein "Seiten"-ähnliches Scrollen
        showsHorizontalScrollIndicator={false} // Versteckt die horizontale Scroll-Leiste
      >
      
        <ImageBackground source={require("../../assets/images/bar/bar_background_without_bar.png")} 
        style={{ height: windowHeight, width: backgroundImageWidth }}
        onLoad={handleImageLoad}
        >
        <View style={appStyles.pageContainer}>
          <View style={[appStyles.smallPageContainer, {height: '100%', width: '100%', justifyContent: 'top'}]}>
            
            {/*<View style={appStyles.menuContainer}>*/}
              
              <View style={{
                width: backgroundImageWidth, // Stellt sicher, dass die Menü-Container die gleiche Breite wie das Hintergrundbild haben
                flexDirection: 'row',
                justifyContent: 'space-around', // Anpassen nach Bedarf für die Platzierung der Menübuttons
                alignItems: 'center', // Zentriert die Menübuttons vertikal
              }}>
                <Settings/>

                <View style={{ height: '100%', width: backgroundImageWidth, alignItems: 'center', justifyContent: 'center' }}>

                  

                    <TouchableOpacity onPress={() => openModalWithGame('The One')} /*onPress={() => navigation.navigate('AddPlayer')}*/ style={[{position: 'absolute', left: '5%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }]} >
                      <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>The One</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModalWithGame('ManyQuestionsGame')} style={{position: 'absolute', left: '16%', top: '32%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '1%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>1000 {"\n"} Questions</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Schöneberg')} style={{position: 'absolute', left: '30%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Schöneberg</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Skala')} style={{position: 'absolute', left: '44%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Skala</Text>
                      </View>
                    </TouchableOpacity>

                    
                    

                    
                    

                    

                  <View style={{ position: 'absolute', left: '0%', top: '62%', alignItems: 'center', justifyContent: 'bottm' }}>
                    <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                  </View>
                  
                  <TouchableOpacity onPress={() => openModalWithGame('Kingscup')} style={[{position: 'absolute', left: '5%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }]} >
                      <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Kingscup</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('HorseRace')} style={{position: 'absolute', left: '20%', top: '70%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Pferderennen</Text>
                      </View>
                    </TouchableOpacity>
                    
                    

                    

                    <TouchableOpacity onPress={() => openModalWithGame('6by6')} style={{position: 'absolute', left: '35%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>6 by 6</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Activity')} style={{position: 'absolute', left: '47%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Activity</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Top10')} style={{position: 'absolute', left: '56%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Top 10</Text>
                      </View>
                    </TouchableOpacity>


                  <View style={{ position: 'absolute', left: '0%', top: '100%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                    <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                  </View>

                    <TouchableOpacity onPress={() => openModalWithGame('SpinTheBottle')} style={{position: 'absolute', left: '3%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }} >
                      <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Flaschendrehen</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('MaexchenGame')} style={[{position: 'absolute', left: '17%', top: '106%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }]} >
                      <Image source={require('../../assets/images/bottles/bottle_004.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '5%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Mäxchen</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => openModalWithGame('Getränkezähler')} style={{position: 'absolute', left: '30%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Getränkezähler</Text>
                      </View>
                    </TouchableOpacity>

                    

                    <TouchableOpacity onPress={() => openModalWithGame('Kopfpoker')} style={{position: 'absolute', left: '48%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Kopfpoker</Text>
                      </View>
                    </TouchableOpacity>


                </View>


                {/* Modal für Spielbeschreibungen */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={appStyles.modalOverlay}>
                      <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={appStyles.modalView}>

                          <Text style={appStyles.modalTextTitle}>{gameTitle}</Text>

                          <Text style={appStyles.modalTextParameters}>{gameParameters}</Text>
                          <Text style={appStyles.modalText}>{gameDescription}</Text>
                          
                          {navigateAction !== '' ? (
                            <TouchableOpacity
                              style={[appStyles.chalkboardButtonPrimaryColor]}
                              onPress={() => {
                                setModalVisible(!modalVisible);
                                navigation.navigate(navigateAction);
                              }}
                            >
                              <Text style={[appStyles.chalkboardButtonText, {fontSize: 20}]}>Spiel starten</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={[appStyles.chalkboardButtonGrey]}
                              onPress={() => {
                                setModalVisible(!modalVisible);
                                navigation.navigate(navigateAction);
                              }}
                              disabled={true}
                            >
                              <Text style={[appStyles.chalkboardButtonText, {fontSize: 20, fontStyle: 'italic', color: 'white'}]}>Bald verfügbar</Text>
                            </TouchableOpacity>
                            
                          )}

                          <TouchableOpacity
                            style={appStyles.closeButton}
                            onPress={() => setModalVisible(false)}
                          >
                            <Text style={{color: 'white'}}>✖</Text>
                          </TouchableOpacity>

                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>

                </Modal>
                
              </View>  
            {/*</View>*/}

            {/*SettingsButton*/}
            {/*<TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
                <Text style={appStyles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>*/}
          </View>
        </View>
        </ImageBackground>

      </ScrollView>
    </View>
  );
}





export default MainMenu;