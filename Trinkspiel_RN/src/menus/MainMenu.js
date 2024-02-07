import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView, Dimensions, Modal, TouchableWithoutFeedback  } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function MainMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [gameDescription, setGameDescription] = useState('');
  const [navigateAction, setNavigateAction] = useState('');

  const gameDescriptions = {
    'The One': { description: 'Beschreibung für The One...', navigateTo: 'AddPlayer' },
    'Kingscup': { description: 'Beschreibung für Kingscup...', navigateTo: 'GameScreen' },
    // Weitere Spiele hier hinzufügen
  };

  const openModalWithGame = (gameKey) => {
    const game = gameDescriptions[gameKey];
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
                    <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={{position: 'absolute', left: '16%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Skala</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={[{position: 'absolute', left: '29%', top: '32%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }]} >
                      <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Kingscup</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Kingscup')} style={{position: 'absolute', left: '45%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Schöneberg</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('MaexchenGame')} style={[{position: 'absolute', left: '56%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }]} >
                      <Image source={require('../../assets/images/bottles/bottle_004.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '5%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Mäxchen</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('SpinTheBottle')} style={{position: 'absolute', left: '68%', top: '32%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }} >
                      <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Flaschendrehen</Text>
                      </View>
                    </TouchableOpacity>

                    

                  <View style={{ position: 'absolute', left: '0%', top: '62%', alignItems: 'center', justifyContent: 'bottm' }}>
                    <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                  </View>
                  
                    <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={{position: 'absolute', left: '7%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Top 10</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ManyQuestionsGame')} style={{position: 'absolute', left: '20%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '1%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>1000 {"\n"} Questions</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('HorseRace')} style={{position: 'absolute', left: '35%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>6 by 6</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Activity')} style={{position: 'absolute', left: '60%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Activity</Text>
                      </View>
                    </TouchableOpacity>


                  <View style={{ position: 'absolute', left: '0%', top: '100%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                    <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                  </View>

                    <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={{position: 'absolute', left: '7%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Getränkezähler</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('HorseRace')} style={{position: 'absolute', left: '39%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Pferderennen</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('HorseRace')} style={{position: 'absolute', left: '55%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
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
                    <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>{gameDescription}</Text>
                          <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                              setModalVisible(!modalVisible);
                              navigation.navigate(navigateAction);
                            }}
                          >
                            <Text style={styles.textStyle}>Spiel starten</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                          >
                            <Text style={styles.textStyle}>X</Text>
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

const styles = StyleSheet.create({
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
  },
  textStyle: {
    color: '#333', // Dunklere Farbe für den Text, um Kontrast zu schaffen
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#555', // Sanfte Textfarbe
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10, // Etwas Abstand zum Text oben
  },
  buttonClose: {
    backgroundColor: '#2196F3', // Farbige Schaltfläche zum Starten des Spiels
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent', // Kein Hintergrund für ein subtiles Aussehen
    padding: 5,
  },
});



export default MainMenu;