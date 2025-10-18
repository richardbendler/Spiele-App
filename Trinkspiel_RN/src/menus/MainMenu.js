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
  WerWuerde: 'whoWould',
  '6by6': 'sixBySix',
  Activity: 'activity',
  Getraenkezaehler: 'drinkCounter',
  HorseRace: 'horseRace',
  Kopfpoker: 'kopfpoker',
  PartyBoardGame: 'partyBoard',
};

const navigationMap = {
  'The One': 'AddPlayer',
  Kingscup: 'Kingscup',
  MaexchenGame: 'MaexchenGame',
  SpinTheBottle: 'SpinTheBottle',
  ManyQuestionsGame: 'ManyQuestionsGame',
  WerWuerde: 'WhoWouldLikelyGame',
  Getraenkezaehler: 'DrinkCounter',
  HorseRace: 'HorseRace',
  PartyBoardGame: 'AddPlayer',
};

const nextGameMap = {
  'The One': { nextGame: 'PicoloGame', showScales: true },
  PartyBoardGame: { nextGame: 'PartyBoardGame', showScales: false },
};

import { useTranslation } from '../i18n';

function MainMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible, language } = useContext(VariablesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gameParameters, setGameParameters] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [navigateAction, setNavigateAction] = useState('');
  const [navigateParams, setNavigateParams] = useState(null);

  const { t } = useTranslation();

  const commonCopy = useMemo(() => t('common'), [t]);
  const newBadgeLabel = language === 'de' ? 'NEU' : 'NEW';
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
    const config = nextGameMap[gameKey];
    setNavigateParams(config ? { ...config } : null);
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

  // Berechnen der Breite des Hintergrundbildes basierend auf dem Seitenverh+-ltnis
  const backgroundImageWidth = windowHeight * backgroundAspectRatio;

  return (
    <View style={{alignItems: 'flex-start'}}>
      <ScrollView
        horizontal={true}
        pagingEnabled={false} // Optional, f+-+r ein "Seiten"-+-hnliches Scrollen
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
                width: backgroundImageWidth, // Stellt sicher, dass die Men+-+-Container die gleiche Breite wie das Hintergrundbild haben
                flexDirection: 'row',
                justifyContent: 'space-around', // Anpassen nach Bedarf f+-+r die Platzierung der Men+-+buttons
                alignItems: 'center', // Zentriert die Men+-+buttons vertikal
              }}>
                <Settings/>

                <View style={{ height: '100%', width: backgroundImageWidth, alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ position: 'absolute', left: '0%', top: '62%', alignItems: 'center', justifyContent: 'bottm' }}>
                      <Image source={require('../../assets/images/bar/shelf.png')} style={{width: backgroundImageWidth}}/>
                    </View>

                    

                    <TouchableOpacity onPress={() => openModalWithGame('The One')} style={{position: 'absolute', left: '6%', top: '32%', width: '15%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['The One'].title}</Text>
                      </View>
                    </TouchableOpacity>
                    

                    <TouchableOpacity onPress={() => openModalWithGame('ManyQuestionsGame')} style={{position: 'absolute', left: '24%', top: '32%', width: '15%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['ManyQuestionsGame'].title}</Text>
                      </View>
                    </TouchableOpacity>

                    

                    <TouchableOpacity onPress={() => openModalWithGame('Schoeneberg')} style={{position: 'absolute', left: '50%', top: '36%', width: '15%', height: '26%'}}>
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

                    <TouchableOpacity onPress={() => openModalWithGame('Skala')} style={{position: 'absolute', left: '68%', top: '32%', width: '15%', height: '30%'}}>
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
                    

                  
                  
                    

                    <TouchableOpacity onPress={() => openModalWithGame('Kingscup')} style={{position: 'absolute', left: '6%', top: '70%', width: '15%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Kingscup'].title}</Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openModalWithGame('HorseRace')} style={{position: 'absolute', left: '24%', top: '75%', width: '18%', height: '25%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/horse.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['HorseRace'].title}</Text>
                      </View>
                    </TouchableOpacity>
                    
                    

                    

                    

                    <TouchableOpacity onPress={() => openModalWithGame('6by6')} style={{position: 'absolute', left: '54%', top: '70%', width: '15%', height: '30%'}}>
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

                    

                    <TouchableOpacity onPress={() => openModalWithGame('Activity')} style={{position: 'absolute', left: '74%', top: '70%', width: '15%', height: '30%'}}>
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

                  

                    

                    <TouchableOpacity onPress={() => openModalWithGame('SpinTheBottle')} style={{position: 'absolute', left: '4%', top: '106%', width: '15%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_003.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}><Text style={appStyles.bottleText}>{gameDescriptions['SpinTheBottle'].title}</Text></View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openModalWithGame('MaexchenGame')} style={{position: 'absolute', left: '20%', top: '106%', width: '15%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_010.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['MaexchenGame'].title}</Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openModalWithGame('PartyBoardGame')} style={{position: 'absolute', left: '36%', top: '106%', width: '15%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_016.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['PartyBoardGame'].title}</Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openModalWithGame('WerWuerde')} style={{position: 'absolute', left: '52%', top: '106%', width: '15%', height: '30%'}}>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_015.png')} style={appStyles.bottleButton} />
                      </View>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={appStyles.bottleText}>{gameDescriptions['WerWuerde'].title}</Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openModalWithGame('Top10')} style={{position: 'absolute', left: '68%', top: '106%', width: '15%', height: '30%'}}>
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


                    <TouchableOpacity onPress={() => openModalWithGame('Getraenkezaehler')} style={{position: 'absolute', left: '4%', top: '170%', width: '15%', height: '25%'}}>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={[appStyles.bottleText, { fontSize: 10, color: '#E5C185', letterSpacing: 1 }]}>{newBadgeLabel}</Text>
                        <Text style={appStyles.bottleText}>{gameDescriptions['Getraenkezaehler'].title}</Text>
                      </View>
                      <View style={{height:'100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Image source={require('../../assets/images/bottles/bottle_014.png')} style={appStyles.bottleButton} />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openModalWithGame('Kopfpoker')} style={{position: 'absolute', left: '84%', top: '106%', width: '15%', height: '30%'}}>
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
                    


                </View>


                {/* Modal f+-+r Spielbeschreibungen */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    setNavigateParams(null);
                  }}
                >
                  <TouchableWithoutFeedback onPress={() => {
                    setModalVisible(false);
                    setNavigateParams(null);
                  }}>
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
                                navigation.navigate(navigateAction, navigateParams ?? undefined);
                                setNavigateParams(null);
                              }}
                            >
                              <Text style={[appStyles.chalkboardButtonText, {fontSize: 20}]}>{commonCopy.startGame}</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={[appStyles.chalkboardButtonGrey]}
                              onPress={() => {
                                setModalVisible(!modalVisible);
                                navigation.navigate(navigateAction, navigateParams ?? undefined);
                                setNavigateParams(null);
                              }}
                              disabled={true}
                            >
                              <Text style={[appStyles.chalkboardButtonText, {fontSize: 20, fontStyle: 'italic', color: 'white'}]}>{commonCopy.comingSoon}</Text>
                            </TouchableOpacity>
                            
                          )}

                          <TouchableOpacity
                            style={appStyles.closeButton}
                            onPress={() => {
                              setModalVisible(false);
                              setNavigateParams(null);
                            }}
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
                <Text style={appStyles.settingsButtonText}>+++--</Text>
            </TouchableOpacity>*/}
          </View>
        </View>
        </ImageBackground>

      </ScrollView>
    </View>
  );
}





export default MainMenu;











