import React, { useState, useContext, useCallback, useMemo } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView, Dimensions, Modal, TouchableWithoutFeedback  } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

const translationKeyMap = {
  'The One': 'theOne',
  Skala: 'skala',
  Kingscup: 'kingscup',
  Schoeneberg: 'schoeneberg',
  MaexchenGame: 'maexchen',
  SpinTheBottle: 'spinTheBottle',
  Top10: 'top10',
  ManyQuestionsGame: 'manyQuestions',
  '6by6': 'sixBySix',
  Activity: 'activity',
  Getraenkezaehler: 'drinkCounter',
  HorseRace: 'horseRace',
  Kopfpoker: 'kopfpoker',
};

const navigationMap = {
  'The One': 'AddPlayer',
  Kingscup: 'Kingscup',
  MaexchenGame: 'MaexchenGame',
  SpinTheBottle: 'SpinTheBottle',
  ManyQuestionsGame: 'ManyQuestionsGame',
};

import { useTranslation } from '../i18n';

function MainMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gameParameters, setGameParameters] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [navigateAction, setNavigateAction] = useState('');

  const { t } = useTranslation();

  const commonCopy = useMemo(() => t('common'), [t]);
  const gamesCopy = useMemo(() => t('mainMenu.games'), [t]);

  const gameDescriptions = useMemo(() => {
    const entries = {};
    Object.entries(translationKeyMap).forEach(([legacyKey, translationKey]) => {
      const copy = gamesCopy?.[translationKey] ?? {};
      entries[legacyKey] = {
        title: copy.title ?? legacyKey,
        parameters: copy.parameters ?? '',
        description: copy.description ?? '',
        navigateTo: navigationMap[legacyKey] ?? '',
      };
    });
    return entries;
  }, [gamesCopy]);



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

  // Berechnen der Breite des Hintergrundbildes basierend auf dem SeitenverhÃ¤ltnis
  const backgroundImageWidth = windowHeight * backgroundAspectRatio;

  return (
    <View style={{alignItems: 'flex-start'}}>
      <ScrollView
        horizontal={true}
        pagingEnabled={false} // Optional, fÃ¼r ein "Seiten"-Ã¤hnliches Scrollen
        showsHorizontalScrollIndicator={true} // Versteckt die horizontale Scroll-Leiste
      >
        <ImageBackground source={require("../../assets/images/bar/bar_background.png")} 
        style={{ height: windowHeight, width: backgroundImageWidth }}
        onLoad={handleImageLoad}
        >
          <View style={appStyles.pageContainer}>
            <View style={[appStyles.smallPageContainer, {height: '100%', width: '100%', justifyContent: 'top'}]}>
            
            {/*<View style={appStyles.menuContainer}>*/}
              
              <View style={{
                width: backgroundImageWidth, // Stellt sicher, dass die MenÃ¼-Container die gleiche Breite wie das Hintergrundbild haben
                flexDirection: 'row',
                justifyContent: 'space-around', // Anpassen nach Bedarf fÃ¼r die Platzierung der MenÃ¼buttons
                alignItems: 'center', // Zentriert die MenÃ¼buttons vertikal
              }}>
                <Settings/>

                <View style={{ height: '100%', width: backgroundImageWidth, alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ position: 'absolute', left: '0%', top: '62%', alignItems: 'center', justifyContent: 'bottm' }}>
                      <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                    </View>

                    

                    <TouchableOpacity onPress={() => openModalWithGame('The One')} style={{position: 'absolute', left: '10%', top: '32%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['The One'].title}</Text>
                      </View>
                    </TouchableOpacity>
                    

                    <TouchableOpacity onPress={() => openModalWithGame('ManyQuestionsGame')} style={{position: 'absolute', left: '30%', top: '32%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['ManyQuestionsGame'].title}</Text>
                      </View>
                    </TouchableOpacity>

                    

                    <TouchableOpacity onPress={() => openModalWithGame('Schoeneberg')} style={{position: 'absolute', left: '55%', top: '36%', width: '17%', height: '26%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_011.png')} style={appStyles.bottleButton} />
                        <View style={appStyles.bottleButtonComingSoonBadge}>
                          <Text style={[appStyles.bottleText,{fontSize: 12}]}>{commonCopy.comingSoon}</Text>
                        </View>
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Schoeneberg'].title}</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Skala')} style={{position: 'absolute', left: '77%', top: '32%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_004.png')} style={appStyles.bottleButton} />
                        <View style={appStyles.bottleButtonComingSoonBadge}>

                          <Text style={[appStyles.bottleText,{fontSize: 12}]}>{commonCopy.comingSoon}</Text>
                        </View>
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Skala'].title}</Text>
                      </View>
                    </TouchableOpacity>

                    
                    

                    
                    
                  <View style={{ position: 'absolute', left: '0%', top: '100%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                    <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                  </View>
                    

                  
                  
                    

                    <TouchableOpacity onPress={() => openModalWithGame('Kingscup')} style={{position: 'absolute', left: '3%', top: '70%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Kingscup'].title}</Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openModalWithGame('HorseRace')} style={{position: 'absolute', left: '25%', top: '75%', width: '18%', height: '25%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/horse.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['HorseRace'].title}</Text>
                      </View>
                    </TouchableOpacity>
                    
                    

                    

                    

                    <TouchableOpacity onPress={() => openModalWithGame('6by6')} style={{position: 'absolute', left: '50%', top: '70%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_006.png')} style={appStyles.bottleButton} />
                        <View style={appStyles.bottleButtonComingSoonBadge}>

                          <Text style={[appStyles.bottleText,{fontSize: 12}]}>{commonCopy.comingSoon}</Text>
                        </View>
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['6by6'].title}</Text>
                      </View>
                    </TouchableOpacity>

                    

                    <TouchableOpacity onPress={() => openModalWithGame('Activity')} style={{position: 'absolute', left: '73%', top: '70%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_007.png')} style={appStyles.bottleButton} />
                        <View style={appStyles.bottleButtonComingSoonBadge}>

                          <Text style={[appStyles.bottleText,{fontSize: 12}]}>{commonCopy.comingSoon}</Text>
                        </View>
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Activity'].title}</Text>
                      </View>
                    </TouchableOpacity>

                  


                    
                    {/* ------------------------------ THIRD LEVEL ------------------------------ */}

                  

                    

                    <TouchableOpacity onPress={() => openModalWithGame('SpinTheBottle')} style={{position: 'absolute', left: '10%', top: '106%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['SpinTheBottle'].title}</Text>
                      </View>
                    </TouchableOpacity>

                    

                    <TouchableOpacity onPress={() => openModalWithGame('MaexchenGame')} style={{position: 'absolute', left: '34%', top: '106%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_010.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['MaexchenGame'].title}</Text>

                      </View>
                    </TouchableOpacity>
                    

                    <TouchableOpacity onPress={() => openModalWithGame('Kopfpoker')} style={{position: 'absolute', left: '57%', top: '106%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_012.png')} style={appStyles.bottleButton} />
                        <View style={appStyles.bottleButtonComingSoonBadge}>

                          <Text style={[appStyles.bottleText,{fontSize: 12}]}>{commonCopy.comingSoon}</Text>
                        </View>
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Kopfpoker'].title}</Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openModalWithGame('Top10')} style={{position: 'absolute', left: '79%', top: '106%', width: '17%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_008.png')} style={appStyles.bottleButton} />
                        <View style={appStyles.bottleButtonComingSoonBadge}>

                          <Text style={[appStyles.bottleText,{fontSize: 12}]}>{commonCopy.comingSoon}</Text>
                        </View>
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Top10'].title}</Text>
                      </View>
                    </TouchableOpacity>



                    {/* ------------------------------ EXTRA ------------------------------- */}


                    <TouchableOpacity onPress={() => openModalWithGame('Getraenkezaehler')} style={{position: 'absolute', left: '3%', top: '170%', width: '17%', height: '25%'}}>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Getraenkezaehler'].title}</Text>
                      </View>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_014.png')} style={appStyles.bottleButton} />
                        <View style={appStyles.bottleButtonComingSoonBadge}>
                          <Text style={[appStyles.bottleText,{fontSize: 9}]}>{commonCopy.comingSoon}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    


                </View>


                {/* Modal fÃ¼r Spielbeschreibungen */}
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
                              <Text style={[appStyles.chalkboardButtonText, {fontSize: 20}]}>{commonCopy.startGame}</Text>
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
                              <Text style={[appStyles.chalkboardButtonText, {fontSize: 20, fontStyle: 'italic', color: 'white'}]}>{commonCopy.comingSoon}</Text>
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
                <Text style={appStyles.settingsButtonText}>âš™ï¸</Text>
            </TouchableOpacity>*/}
          </View>
        </View>
        </ImageBackground>

      </ScrollView>
    </View>
  );
}





export default MainMenu;




