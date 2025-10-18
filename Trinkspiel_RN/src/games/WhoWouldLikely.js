import React, { useMemo, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';
import { useTranslation } from '../i18n';
import { whoWouldMostLikelyQuestions } from '../data/whoWouldMostLikelyQuestions';
import { shuffleArrayFisherYates } from './sublements/AdjustParamShape';

const WhoWouldLikelyGame = () => {
  const { infoVisible, setInfoVisible } = useContext(VariablesContext);
  const { t, language } = useTranslation();

  const copy = useMemo(() => t('whoWould'), [t]);

  const [deck, setDeck] = useState(() => shuffleArrayFisherYates([...whoWouldMostLikelyQuestions]));
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentCard = finished ? null : deck[index] ?? null;
  const questionText = currentCard ? (language === 'en' ? currentCard.content_en : currentCard.content) : '';

  const advance = () => {
    if (finished) {
      setDeck(shuffleArrayFisherYates([...whoWouldMostLikelyQuestions]));
      setIndex(0);
      setFinished(false);
      return;
    }
    if (index < deck.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const buttonLabel = finished ? copy.restart : copy.next;

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={{ flex: 1 }}>
      <View style={appStyles.completeScreenGameContainer}>
        <View style={appStyles.gameContainer}>
          {finished ? (
            <View style={styles.finishedCard}>
              <Text style={styles.finishedText}>{copy.end}</Text>
            </View>
          ) : (
            <View style={styles.questionWrapper}>
              <Text style={styles.questionText}>{questionText}</Text>
            </View>
          )}
          <TouchableOpacity onPress={advance} style={[appStyles.gameActionButton, { marginTop: 16 }]}>
            <Text style={appStyles.gameActionButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>

        <InfoText header={copy.infoTitle} rules={copy.info} />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, { top: 20, left: 20 }]}>
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  questionWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  questionText: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
  },
  finishedCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  finishedText: {
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 34,
    color: 'white',
    fontFamily: 'Quicksand_300Bold',
  },
});

export default WhoWouldLikelyGame;

