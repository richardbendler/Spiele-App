import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { appStyles } from '../../../styles';
import { VariablesContext } from '../../../VariablesContext';
import { useTranslation } from '../../i18n';

const InfoText = ({ header, rules }) => {
  const { infoVisible, setInfoVisible } = useContext(VariablesContext);
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={infoVisible}
      onRequestClose={() => setInfoVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setInfoVisible(false)}>
        <View style={appStyles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={appStyles.modalView}>
              <Text style={[appStyles.textHeader2, { marginBottom: 15 }]}>{header}</Text>

              <Text style={[appStyles.textNormal2, { marginBottom: 15 }]}>{rules}</Text>

              <TouchableOpacity style={appStyles.closeButton} onPress={() => setInfoVisible(false)}>
                <Text style={{ color: 'white' }}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InfoText;
