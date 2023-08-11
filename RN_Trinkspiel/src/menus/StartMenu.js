import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import SettingsButton from './sublements/SettingsButton';

const StartMenu = ({ navigation }) => {
    const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={appStyles.pageContainer}>
        <View style={appStyles.smallPageContainer}>
            <View style={appStyles.menuContainer}>
                
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={settingsVisible}
                    onRequestClose={() => setSettingsVisible(false)}
                    >
                    <View style={appStyles.settingsContainer}>
                        <View style={appStyles.smallSettingsContainer}>
                            <TouchableOpacity onPress={() => {/* Navigate to Account Management */}} style={appStyles.menuButton}>
                            <Text style={appStyles.menuButtonText}>Account verwalten</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')} style={appStyles.menuButton}>
                            <Text style={appStyles.menuButtonText}>Spieler verwalten</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {/* Navigate to General Settings */}} style={appStyles.menuButton}>
                            <Text style={appStyles.menuButtonText}>Allgemeine Einstellungen</Text>
                            </TouchableOpacity>
                            <Button title="Schließen" onPress={() => setSettingsVisible(false)} />
                        </View>
                    </View>
                </Modal>


                <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
                    <Text style={appStyles.menuButtonText}>Spielen</Text>
                </TouchableOpacity>
                <TouchableOpacity /*onPress={() => navigation.navigate('MainMenu')}*/ style={appStyles.menuButton}>
                    <Text style={appStyles.menuButtonText}>Custom Game</Text>
                </TouchableOpacity>
                <TouchableOpacity /*onPress={() => navigation.navigate('MainMenu')}*/ style={appStyles.menuButton}>
                    <Text style={appStyles.menuButtonText}>Eigene Karten</Text>
                </TouchableOpacity>

                
            </View>
            <TouchableOpacity onPress={() => setSettingsVisible(true)} style={appStyles.settingsButton}>
                <Text style={appStyles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default StartMenu;
