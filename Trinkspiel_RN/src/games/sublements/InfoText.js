import React, { useState, useContext, useCallback } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, ImageBackground } from 'react-native';
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
            <TouchableWithoutFeedback onPress={() => setInfoVisible(false)}>
                <View style={appStyles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={appStyles.modalView}>

                        <Text style={[appStyles.textHeader2, {marginBottom: 15}]}>{header}</Text>

                        <Text style={[appStyles.textNormal2, {marginBottom: 15}]}>{rules}</Text>
                        
                        

                        <TouchableOpacity
                        style={appStyles.closeButton}
                        onPress={() => setInfoVisible(false)}
                        >
                        <Text style={{color: 'white'}}>✖</Text>
                        </TouchableOpacity>

                    </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>


            
            
        </Modal>
    );

};

export default InfoText;