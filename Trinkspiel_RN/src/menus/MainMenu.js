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
    'Skala': { description: 'Beschreibung für Skala...', navigateTo: '' },
    'Kingscup': { description: 'Beschreibung für Kingscup...', navigateTo: 'Kingscup' },
    'Schöneberg': { description: 'Beschreibung für Schöneberg...', navigateTo: '' },
    'MaexchenGame': { description: 'Beschreibung für MaexchenGame...', navigateTo: 'MaexchenGame' },
    'SpinTheBottle': { description: 'Beschreibung für SpinTheBottle...', navigateTo: 'SpinTheBottle' },
    'Top10': { description: 'Beschreibung für Top10...', navigateTo: '' },
    'ManyQuestionsGame': { description: 'Beschreibung für ManyQuestionsGame...', navigateTo: 'ManyQuestionsGame' },
    '6by6': { description: 'Beschreibung für 6by6...', navigateTo: '' },
    'Activity': { description: 'Beschreibung für Activity...', navigateTo: '' },
    'Getränkezähler': { description: 'Beschreibung für Getränkezähler...', navigateTo: '' },
    'HorseRace': { description: 'Beschreibung für HorseRace...', navigateTo: 'HorseRace' },
    'Kopfpoker': { description: 'Beschreibung für Kopfpoker...', navigateTo: '' },
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
                    <TouchableOpacity onPress={() => openModalWithGame('Skala')} style={{position: 'absolute', left: '16%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Skala</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Kingscup')} style={[{position: 'absolute', left: '29%', top: '32%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }]} >
                      <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Kingscup</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModalWithGame('Schöneberg')} style={{position: 'absolute', left: '45%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Schöneberg</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('MaexchenGame')} style={[{position: 'absolute', left: '56%', top: '32%', width: '7%', height: '30%', alignItems: 'center', justifyContent: 'center' }]} >
                      <Image source={require('../../assets/images/bottles/bottle_004.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '5%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Mäxchen</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModalWithGame('SpinTheBottle')} style={{position: 'absolute', left: '68%', top: '32%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }} >
                      <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Flaschendrehen</Text>
                      </View>
                    </TouchableOpacity>

                    

                  <View style={{ position: 'absolute', left: '0%', top: '62%', alignItems: 'center', justifyContent: 'bottm' }}>
                    <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                  </View>
                  
                    <TouchableOpacity onPress={() => openModalWithGame('Top10')} style={{position: 'absolute', left: '7%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Top 10</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('ManyQuestionsGame')} style={{position: 'absolute', left: '20%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '1%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>1000 {"\n"} Questions</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('6by6')} style={{position: 'absolute', left: '35%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>6 by 6</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Activity')} style={{position: 'absolute', left: '60%', top: '70%', width: '8%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                      {/* HACK: used to position Text properly */}
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Activity</Text>
                      </View>
                    </TouchableOpacity>


                  <View style={{ position: 'absolute', left: '0%', top: '100%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                    <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                  </View>

                    <TouchableOpacity onPress={() => openModalWithGame('Getränkezähler')} style={{position: 'absolute', left: '7%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Getränkezähler</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('HorseRace')} style={{position: 'absolute', left: '39%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      <View style={{ top: '10%', right: '75%' }}>
                        <Text style={appStyles.bottleText}>Pferderennen</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Kopfpoker')} style={{position: 'absolute', left: '55%', top: '106%', width: '9%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
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
                              <Text style={[appStyles.chalkboardButtonText, {fontSize: 15, fontStyle: 'italic', color: 'white'}]}>Dieses Spiel ist noch in Arbeit</Text>
                            </TouchableOpacity>
                            
                          )}

                          <TouchableOpacity
                            style={appStyles.closeButton}
                            onPress={() => setModalVisible(false)}
                          >
                            <Text style={{color: 'white'}}>X</Text>
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