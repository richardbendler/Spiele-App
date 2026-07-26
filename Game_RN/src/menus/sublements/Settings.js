import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { appStyles } from '../../../styles';
import { VariablesContext } from '../../../VariablesContext';

const Settings = ({ navigation }) => {
    const { settingsVisible, setSettingsVisible } = useContext(VariablesContext);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={settingsVisible}
            onRequestClose={() => setSettingsVisible(false)}
            >
            <View style={{position: 'relative', alignItems: 'center', justifyContent: 'center',}}>
                <View style={appStyles.settingsContainer} >
                <ImageBackground source={require("../../../assets/images/bar/settings_tafel.png")} style={appStyles.imageBackgroundStyle} resizeMode="contain">
                    
                    <View style={appStyles.settingsContainer} >
                        <TouchableOpacity onPress={() => {/* Navigate to Account Management */}} style={appStyles.smallMenuButton}>
                        <Text style={appStyles.menuButtonText}>(Account verwalten)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {/*navigation.navigate('AddPlayer')*/}} style={appStyles.smallMenuButton}>
                        <Text style={appStyles.menuButtonText}>(Spieler verwalten)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {/* Navigate to General Settings */}} style={appStyles.smallMenuButton}>
                        <Text style={appStyles.menuButtonText}>(Allgemeine Einstellungen)</Text>
                        </TouchableOpacity>
                            
                        <TouchableOpacity onPress={() => setSettingsVisible(false)} style={appStyles.settingsCloseButton}>
                            <Text style={appStyles.settingsButtonText}>✖</Text>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>
                </View>
            </View>
            
        </Modal>
    );

};

export default Settings;
