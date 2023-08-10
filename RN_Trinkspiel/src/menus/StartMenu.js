import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { appStyles } from '../../styles';
import { VariablesContext } from '../../VariablesContext';
import SettingsButton from './sublements/SettingsButton';

const StartMenu = ({ navigation }) => {
  return (
    <View style={appStyles.pageContainer}>
        <View style={appStyles.smallPageContainer}>
            <View style={appStyles.menuContainer}>
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
            <SettingsButton/>
        </View>
    </View>
  );
};

export default StartMenu;
