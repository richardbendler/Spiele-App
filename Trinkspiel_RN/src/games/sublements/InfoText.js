import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../../styles';
import { VariablesContext } from '../../../VariablesContext';

const InfoText = ({ navigation, header, rules}) => {
    const { infoVisible, setInfoVisible } = useContext(VariablesContext);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={infoVisible}
            onRequestClose={() => setInfoVisible(false)}
            >
            <View style={{position: 'relative', alignItems: 'center', justifyContent: 'center',}}>
                <View style={appStyles.settingsContainer} >
                <ImageBackground source={require("../../../assets/images/bar/settings_tafel.png")} style={appStyles.imageBackgroundStyle} resizeMode="contain">
                    
                    <View style={{width:'65%', height:"90%", alignItems: 'center', justifyContent: 'center'}} >
                        <Text style={appStyles.textHeader2}>{header}</Text>
                        <Text> </Text>

                        <Text style={appStyles.textNormal2}>{rules}</Text>

                        <TouchableOpacity onPress={() => setInfoVisible(false)} style={appStyles.settingsCloseButton}>
                            <Text style={appStyles.settingsButtonText}>✖</Text>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>
                </View>
            </View>
            
        </Modal>
    );

};

export default InfoText;