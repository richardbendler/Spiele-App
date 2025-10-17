import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';
import { appStyles } from '../../styles';
import { useTranslation } from '../i18n';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = 50;
const CARD_HEIGHT = 70;
const HORIZONTAL_RADIUS = Math.min(width, height) * 0.3;
const VERTICAL_RADIUS = Math.min(width, height) * 0.6;
const OFFSET = CARD_WIDTH + 10;

const suitImages = {
  Hearts: require('../../assets/images/icons/cards/Hearts.png'),
  Diamonds: require('../../assets/images/icons/cards/Diamonds.png'),
  Clubs: require('../../assets/images/icons/cards/Clubs.png'),
  Spades: require('../../assets/images/icons/cards/Spades.png'),
};

const kingscupCopyByLanguage = {
  de: {
    infoHeader: 'Kingscup!',
    rules:
      'Vorbereitung: Besorgt euch ein leeres Glas. Ausserdem sollte jede spielende Person ein Getraenk haben.\n\nJetzt zieht ihr reihum nacheinander eine Karte. Fuehrt die Aktion aus, die unten fuer die Karte angezeigt wird. Bei Koenigen wird der Kingscup zu einem Drittel mit dem eigenen Getraenk gefuellt. Der vierte Koenig muss austrinken - das Spiel ist vorbei!',
    startPromptTitle: 'Tippe auf eine Karte, um zu starten!',
    startPromptSubtitle: 'Tippe oben links auf Info, um die Spielanleitung zu lesen.',
    fallbackTitle: 'Kingscup',
    fallbackSubtitle: 'Keine Aktion fuer diese Karte gefunden.',
    winnerTitle: 'Spiel vorbei!',
    winnerDescription: 'Der letzte Koenig wurde aufgedeckt. Die Person, die die Karte gezogen hat, muss nun den Kingscup austrinken.',
    restartLabel: 'Spiel neustarten',
  },
  en: {
    infoHeader: 'Kings Cup!',
    rules:
      'Setup: Grab an empty glass and make sure everyone has a drink.\n\nTake turns drawing cards and carry out the action shown below. Each king fills one third of the Kings Cup with their own drink. Whoever draws the fourth king drinks the cup and the game ends!',
    startPromptTitle: 'Tap a card to start!',
    startPromptSubtitle: 'Tap the info button in the top left to read the rules.',
    fallbackTitle: 'Kings Cup',
    fallbackSubtitle: 'No action found for this card.',
    winnerTitle: 'Game over!',
    winnerDescription: 'The final king was drawn. Whoever revealed it now drinks the Kings Cup.',
    restartLabel: 'Restart game',
  },
};

const cardMeaningsSimpleByLanguage = {
  de: {
    '2': { title: 'Two - You!', description: 'Verteile einen Schluck.' },
    '3': { title: 'Three - Me!', description: 'Du musst selbst trinken.' },
    '4': { title: 'Four - Floor!', description: 'Wer als Letzte*r den Boden beruehrt, trinkt.' },
    '5': { title: 'High Five!', description: 'Die ersten beiden zum High-Five duerfen verteilen.' },
    '6': { title: 'Six - nix!', description: 'Wer zuerst lacht, muss trinken.' },
    '7': { title: 'Seven - Heaven!', description: 'Wer als Letzte*r die Haende hebt, trinkt.' },
    '8': { title: 'Eight - Mate!', description: 'Waehle einen Trinkbuddy.' },
    '9': { title: 'Nine - Rhyme!', description: 'Reimt im Uhrzeigersinn, bis jemand keinen mehr weiss.' },
    '10': { title: 'Ten - Kategorie!', description: 'Nenne eine Kategorie, dann geht es reihum weiter.' },
    'J': { title: 'Regel!', description: 'Bestimme eine neue Regel.' },
    'Q': { title: 'Questionmaster!', description: 'Niemand darf dir antworten, bis ein neuer Questionmaster gezogen wird.' },
    'K': { title: 'Kingscup!', description: 'Fuelle den Kingscup zu einem Drittel. Der vierte Koenig trinkt ihn aus.' },
    'A': { title: 'Wasserfall!', description: 'Startet einen Wasserfall - aufhoeren duerft ihr in Reihenfolge.' },
  },
  en: {
    '2': { title: 'Two - You!', description: 'Give out one sip.' },
    '3': { title: 'Three - Me!', description: 'You drink!' },
    '4': { title: 'Four - Floor!', description: 'Last person touching the floor drinks.' },
    '5': { title: 'High Five!', description: 'First pair to high-five hands out drinks.' },
    '6': { title: 'Six - nix!', description: 'First person to laugh drinks.' },
    '7': { title: 'Seven - Heaven!', description: 'Last person with hands raised drinks.' },
    '8': { title: 'Eight - Mate!', description: 'Pick a drinking buddy.' },
    '9': { title: 'Nine - Rhyme!', description: 'Go around with rhymes until someone gets stuck.' },
    '10': { title: 'Ten - Category!', description: 'Name a category; continue around until someone fails.' },
    'J': { title: 'Rule!', description: 'Make a new rule.' },
    'Q': { title: 'Questionmaster!', description: 'No one may answer your questions until a new one is drawn.' },
    'K': { title: 'Kings Cup!', description: 'Fill the cup by one third. The fourth king drinks it and ends the game.' },
    'A': { title: 'Waterfall!', description: 'Start a waterfall - stop only when the person before you does.' },
  },
};

const Kingscup = () => {
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [selectedCard, setSelectedCard] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const { infoVisible, setInfoVisible, language } = useContext(VariablesContext);
  const { t } = useTranslation();
  const lang = language === 'en' ? 'en' : 'de';
  const kingscupCopy = kingscupCopyByLanguage[lang];
  const simpleMeanings = cardMeaningsSimpleByLanguage[lang];

  const [cardMeaning, setCardMeaning] = useState([kingscupCopy.startPromptTitle, kingscupCopy.startPromptSubtitle]);
  const [kingCounter, setKingCounter] = useState(0);

  useEffect(() => {
    if (selectedCard) {
      const meaningEntry = simpleMeanings[selectedCard.value];
      if (meaningEntry) {
        setCardMeaning([meaningEntry.title, meaningEntry.description]);
      } else {
        setCardMeaning([kingscupCopy.fallbackTitle, kingscupCopy.fallbackSubtitle]);
      }
    } else {
      setCardMeaning([kingscupCopy.startPromptTitle, kingscupCopy.startPromptSubtitle]);
    }
  }, [kingscupCopy, selectedCard, simpleMeanings]);

  function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    suits.forEach(suit => {
      values.forEach(value => {
        deck.push({ suit, value, revealed: false });
      });
    });

    return deck;
  }

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  const revealCard = (index) => {
    setGameStarted(true);
    const newDeck = [...deck];
    
    const wasRevealed = newDeck[index].revealed; //Zwischenspeichern fuer KingCounter unten
    
    newDeck[index].revealed = true;
    
    setDeck(newDeck);
    //setCardMeaning(cardMeanings[selectedCard.suit][selectedCard.value]);
    const card = newDeck[index];
    setSelectedCard(card);
    const meaningEntry = simpleMeanings[card.value];
    if (meaningEntry) {
      setCardMeaning([meaningEntry.title, meaningEntry.description]);
    } else {
      setCardMeaning([kingscupCopy.fallbackTitle, kingscupCopy.fallbackSubtitle]);
    }
    if(!wasRevealed && card.value == 'K'){ //Nur wenn Karte noch nicht aufgedeckt ist
      if(kingCounter==3){
        setFinished(true);
      }else{
        setKingCounter(kingCounter+1);
      }
    }
    
    
  };

  const restartGame = () => {
    setDeck(shuffleDeck(createDeck()));
    setSelectedCard(null);
    setCardMeaning([kingscupCopy.startPromptTitle, kingscupCopy.startPromptSubtitle]);
    setFinished(false);
    setKingCounter(0);
  };

  if (finished) {
    return (
        <View style={appStyles.winnerScreen}>
            <Text style={appStyles.winnerText}>{kingscupCopy.winnerTitle}</Text>
            <Text style={[appStyles.textNormal1, {fontStyle: 'italic', color: 'black', width:'80%', textAlign: 'center'}]}>
              {kingscupCopy.winnerDescription}
            </Text>
            <Text></Text>
            <TouchableOpacity onPress={restartGame} style={appStyles.restartButton}>
                <Text style={appStyles.restartButtonText}>{kingscupCopy.restartLabel}</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>

        <View style={styles.deck}>
          {deck.map((card, index) => {
            const angle = (index / deck.length) * 360;
            const offset = card.revealed ? OFFSET : 0;
            const cardX = (HORIZONTAL_RADIUS + offset) * Math.sin((angle * Math.PI) / 180);
            const cardY = -(VERTICAL_RADIUS + offset) * Math.cos((angle * Math.PI) / 180);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cardContainer,
                  {
                    transform: [
                      { translateX: cardX },
                      { translateY: cardY },
                      { rotate: `${angle}deg` },
                    ],
                  },
                ]}
                onPress={() => revealCard(index)}
              >
                {card.revealed ? (
                  <View style={styles.card}>
                    <Text style={styles.cardValue}>{card.value}</Text>
                    <Image style={styles.suitIcon} source={suitImages[card.suit]} />
                  </View>
                ) : (
                  <Image style={styles.cardBack} source={require('../../assets/images/icons/cards/card-back.png')} />
                )}
              </TouchableOpacity>
            );
          })}
          {selectedCard ? (
            <View style={styles.centerCard}>
              <Text style={styles.centerCardValue}>{selectedCard.value}</Text>
              <Image style={styles.centerSuitIcon} source={suitImages[selectedCard.suit]} />
            </View>
          ) : null}

        </View>
        
        <View style={styles.descriptionWindow}>
          <View style={{alignItems: 'center',justifyContent: 'center',}}>
            {<Text style={[appStyles.textHeader3, {color: 'black', textAlign: 'center'}]}>{cardMeaning[0]}</Text>}
            {<Text style={{fontSize: 10}}></Text>}
            {<Text style={[appStyles.textNormal2, {color: 'black', fontStyle: 'italic', textAlign: 'center'}]}>{cardMeaning[1]}</Text>}
          </View>
        </View>

        <InfoText header={kingscupCopy.infoHeader} rules={kingscupCopy.rules} />
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {top: 20, left: 20}]}>
          <Text style={appStyles.infoButtonText}>{t('common.rules')}</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //backgroundColor: '#2e2e2e',
  },
  deck: {
    height: '70%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  suitIcon: {
    width: '45%',
    height: '30%',
  },
  cardBack: {
    width: '100%',
    height: '100%',
  },
  centerCard: {
    position: 'absolute',
    width: 100,
    height: 140,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  centerSuitIcon: {
    width: '45%',
    height: '30%',
  },
  descriptionWindow: {
    //position: 'absolute',
    height: '20%',
    width: '100%',
    
    bottom: 30,
    padding: 20,
    backgroundColor: '#e0e0e0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },



  
});

export default Kingscup;

