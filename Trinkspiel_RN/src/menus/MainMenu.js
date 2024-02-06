import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView, Dimensions } from 'react-native';
import { appStyles } from '../../styles';
import SettingsButton from './sublements/SettingsButton';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';

function MainMenu({ navigation }) {
  const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

  const windowWidth = Dimensions.get('window').width;
  const backgroundImageWidth = windowWidth * 3; // Angenommen, das Bild ist dreimal so breit wie der Bildschirm

  return (
    <ScrollView
      horizontal={true}
      pagingEnabled={true} // Optional, für ein "Seiten"-ähnliches Scrollen
      showsHorizontalScrollIndicator={false} // Versteckt die horizontale Scroll-Leiste
    >
    
      <ImageBackground source={require("../../assets/images/bar/bar_background_without_bar.png")} 
      style={{height: '100%', flexDirection: 'row'}}
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

              <View style={{ height: '100%', width: windowWidth, alignItems: 'center', justifyContent: 'center' }}>

                

                  <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={[{position: 'absolute', left: '20%', top: '28%', width: '25%', height: '30%', alignItems: 'center', justifyContent: 'bottom' }]} >
                    <Image source={require('../../assets/images/bottles/bottle_001.png')} style={appStyles.bottleButton} />
                    <View style={{ top: '60%', right: '75%' }}>
                      <Text style={appStyles.bottleText}>The One</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={{position: 'absolute', left: '50%', top: '28%', width: '25%', height: '30%', alignItems: 'center', justifyContent: 'bottom' }} disabled={true}>
                    <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                    <View style={{ top: '60%', right: '75%' }}>
                      <Text style={appStyles.bottleText}>Skala</Text>
                    </View>
                  </TouchableOpacity>

                <View style={{ position: 'absolute', left: '0%', top: '58%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                  <Image source={require('../../assets/images/bar/shelf.png')} />
                </View>
                
                  <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={{position: 'absolute', left: '25%', top: '65%', width: '25%', height: '30%', alignItems: 'center', justifyContent: 'bottom' }} disabled={true}>
                    <Image source={require('../../assets/images/bottles/bottle_001_schwarz_weiß.png')} style={appStyles.bottleButton} />
                    {/* HACK: used to position Text properly */}
                    <View style={{ top: '60%', right: '75%' }}>
                      <Text style={appStyles.bottleText}>Top 10</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={{position: 'absolute', left: '85%', top: '65%', width: '25%', height: '30%', alignItems: 'center', justifyContent: 'bottom' }} disabled={true}>
                    <Image source={require('../../assets/images/bottles/bottle_005.png')} style={appStyles.bottleButton} />
                    {/* HACK: used to position Text properly */}
                    <View style={{ top: '50%', right: '75%' }}>
                      <Text style={appStyles.bottleText}>1000 {"\n"} Questions</Text>
                    </View>
                  </TouchableOpacity>


                <View style={{ position: 'absolute', left: '0%', top: '95%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                  <Image source={require('../../assets/images/bar/shelf.png')} />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={{position: 'absolute', left: '10%', top: '118%', width: '20%', height: '20%', alignItems: 'center', justifyContent: 'bottom' }} disabled={true}>
                    <Image source={require('../../assets/images/bottles/bottle_002.png')} style={appStyles.bottleButton} />
                    <View style={{ top: '60%', right: '75%' }}>
                      <Text style={appStyles.bottleText}>Getränkezähler</Text>
                    </View>
                  </TouchableOpacity>

              </View>
              <View style={{ height: '100%', width: windowWidth, alignItems: 'center', justifyContent: 'center' }}>
                
                <View style={{ position: 'absolute', left: '0%', top: '58%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                  <Image source={require('../../assets/images/bar/shelf.png')} />
                </View>


                <View style={{ position: 'absolute', left: '0%', top: '95%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                  <Image source={require('../../assets/images/bar/shelf.png')} />
                </View>

              </View>
              <View style={{ height: '100%', width: windowWidth, alignItems: 'center', justifyContent: 'center' }}>
                
                <View style={{ position: 'absolute', left: '0%', top: '58%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                  <Image source={require('../../assets/images/bar/shelf.png')} />
                </View>

                
                <View style={{ position: 'absolute', left: '0%', top: '95%', width: '100%', height: '1%', alignItems: 'center', justifyContent: 'bottm' }}>
                  <Image source={require('../../assets/images/bar/shelf.png')} />
                </View>

              </View>



              

              

              {/*<View style={{position: 'absolute', top: '15%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.navigate('KlassikerMenu')} style={[appStyles.chalkboardButton, {width: '65%'}]}>
                  {<Text style={appStyles.chalkboardButtonText}>Klassiker</Text>}
                </TouchableOpacity>
              </View>

              <View style={{position: 'absolute', top: '34%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.navigate('CardGamesMenu')} style={[appStyles.chalkboardButton, {width: '65%'}]}>
                  <Text style={appStyles.chalkboardButtonText}>Kartenspiele</Text>
                </TouchableOpacity>
              </View>

              <View style={{position: 'absolute', top: '52%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.navigate('MiniGamesMenu')} style={[appStyles.chalkboardButton, {width: '65%'}]}>
                  <Text style={appStyles.chalkboardButtonText}>Mini Games</Text>
                </TouchableOpacity>
              </View>*/}

              
              
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
  );
}

export default MainMenu;