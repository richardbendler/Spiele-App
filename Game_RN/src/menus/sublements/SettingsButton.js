import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { appStyles } from "../../../styles";

const SettingsButton = ({ onPress, visible = true }) => {
  if (!visible) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress} style={appStyles.settingsButton}>
      <Text style={appStyles.settingsButtonText}>Settings</Text>
    </TouchableOpacity>
  );
};

export default SettingsButton;
