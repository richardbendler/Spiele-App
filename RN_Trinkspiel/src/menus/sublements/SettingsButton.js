import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { appStyles } from '../../../styles';

const SettingsButton = () => {
    return(
        <TouchableOpacity /*onPress={() => navigation.navigate('MainMenu')}*/ style={appStyles.settingsButton}>
            <Text style={appStyles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
    )
}

export default SettingsButton;