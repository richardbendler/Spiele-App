import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';
import { appStyles } from '../../styles';

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

const cardMeaningsSimple = {
  '2': ['Two - You!', 'Verteil einen Schluck'], 
  '3': ['Three - Me!', 'Du musst selbst trinken!'], 
  '4': ['Four - Floor!', 'Wer als letzter den Boden berührt, trinkt!'], 
  '5': ['High Five!', 'Die beiden Spieler, die sich zuerst einen High-Five geben, dürfen verteilen!'], 
  '6': ['Six - nix!', 'Wer zuerst lacht, muss trinken!'], 
  '7': ['Seven - Heaven!', 'Wer als letzter die Hände oben hat, trinkt!'], 
  '8': ['Eight - Mate!', 'Wähle einen Trinkbuddy'], 
  '9': ['Nine - Rhyme!', 'Reimen im Uhrzeigersinn, bis einer keinen mehr weiß.'], 
  '10': ['Ten - Kategorie!', 'Nenne eine Kategorie, dann geht es rum, bis keiner mehr was weiß.'], 
  'J': ['Regel!', 'Bestimme eine Regel'], 
  'Q': ['Questionmaster!', 'Niemand darf dir mehr Fragen beantworten bis ein neuer Questionmaster gezogen wird.'], 
  'K': ['Kingscup!', 'Fülle den Kingscup zu einem Drittel! Falls du der Vierte King bist, trink ihn aus und das Spiel ist vorbei!'], 
  'A': ['Wasserfall!', 'Alle setzen gleichzeitig an zu trinken und dürfen nur in Reihenfolge aufhören, jede Person darf sich aber auch Zeit lassen']
};

const cardMeanings = {
  'Hearts': {
    '2': 'Two - You! Verteil einen Schluck', 
    '3': 'Three - Me! - Du musst selbst trinken!', 
    '4': 'Four - Floor! Wer als letzter den Boden berührt, trinkt!', 
    '5': 'Five Guys! Alle Guys trinken', 
    '6': 'Six Chicks! Alle Frauen trinken', 
    '7': 'Seven - Heaven! Wer als letzter die Hände oben hat, trinkt!', 
    '8': 'Eight - Mate! Wähle einen Trinkbuddy', 
    '9': 'Nine - Rime! Reimen im Uhrzeigersinn, bis einer keinen mehr weiß.', 
    '10': 'Ten - Kategorie! Nenne eine Kategorie, dann geht es rum, bis keiner mehr was weiß.', 
    'J': 'Regel! Bestimme eine Regel', 
    'Q': 'Questionmaster! Niemand darf dir mehr Fragen beantworten.', 
    'K': 'Kingscup! Fülle den Kingscup zu einem Drittel! Falls du der Vierte King bist, trink ihn aus und das Spiel ist vorbei!', 
    'A': 'Wasserfall! Alle setzen gleichzeitig an zu trinken und dürfen nur in Reihenfolge aufhören, jede Person darf sich aber auch Zeit lassen'}, 
  'Diamonds': {
    '2': 'Tausche Plätze mit jemandem!', 
    '3': 'Dreimal klatschen oder trinken!', 
    '4': 'Berühre den Boden!', 
    '5': 'Tanze oder trinke!', 
    '6': 'Alle singen ein Lied!', 
    '7': '7 Himmel! Jeder zeigt zum Himmel!', 
    '8': 'Mache einen lustigen Tanz!', 
    '9': 'Sage einen Zungenbrecher!', 
    '10': '10 Sekunden Handstand oder trinken!', 
    'J': 'Mime ein Tier nach!', 
    'Q': 'Sei der König oder die Königin bis zur nächsten Runde!', 
    'K': 'Erzähle einen Witz!', 
    'A': 'Mache einen Zaubertrick!'}, 
  'Clubs': {
    '2': 'Zeige deinen besten Moonwalk!', 
    '3': 'Drehe dich 3 Mal im Kreis!', 
    '4': 'Mache 4 Liegestütze!', 
    '5': 'Sing dein Lieblingslied!', 
    '6': 'Alle springen hoch!', 
    '7': 'Stelle eine Regel auf!', 
    '8': 'Wähle jemanden zum Tanz!', 
    '9': 'Sage ein Geheimnis!', 
    '10': 'Mache 10 Hampelmänner!', 
    'J': 'Erzähle eine lustige Geschichte!', 
    'Q': 'Sei ein Roboter bis zur nächsten Runde!', 
    'K': 'Mache eine Kniebeuge mit jemandem auf dem Rücken!', 
    'A': 'Erzähle ein Märchen!'}, 
  'Spades': {
    '2': 'Wähle jemanden aus, der trinkt!', 
    '3': 'Drehe dich und zeige auf jemanden!', 
    '4': 'Lache laut oder trinke!', 
    '5': 'Erzähle eine Geschichte!', 
    '6': 'Alle stehen auf einem Bein!', 
    '7': 'Jeder sagt einen Fakt über sich!', 
    '8': 'Spiele Luftgitarre!', 
    '9': 'Erzähle einen Witz!', 
    '10': 'Jeder macht ein Tiergeräusch!', 
    'J': 'Wähle einen Joker!', 
    'Q': 'Mache eine Pose!', 
    'K': 'Sei ein König und befehle jemandem!',
     'A': 'Mache einen Zaubertrick!'}
    };

const Kingscup = () => {
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardMeaning, setCardMeaning] = useState(["Klicke auf eine Karte um zu starten!", "Um die Spielanleitung zu sehen, klicke oben auf Info."]);

  const [gameStarted, setGameStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

  const [kingCounter, setKingCounter] = useState(0);

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
    
    revealed = newDeck[index].revealed; //Zwischenspeichern für KingCounter unten
    
    newDeck[index].revealed = true;
    
    setDeck(newDeck);
    //setCardMeaning(cardMeanings[selectedCard.suit][selectedCard.value]);
    const card = newDeck[index];
    setSelectedCard(card);
    setCardMeaning(cardMeaningsSimple[card.value]);
    if(!revealed && card.value == 'K'){ //Nur wenn Karte noch nicht aufgedeckt ist
      if(kingCounter==3){
        setFinished(true);
      }else{
        setKingCounter(kingCounter+1);
      }
    }
    
    
  };

  const restartGame = () => {
    setCardMeaning(["Klicke auf eine Karte um zu starten!", "Um die Spielanleitung zu sehen, klicke oben auf Info."]);
    setDeck(shuffleDeck(createDeck()));
    setFinished(false);
    setKingCounter(0);
    setSelectedCard(null)
  };

  if (finished) {
    return (
        <View style={appStyles.winnerScreen}>
            <Text style={appStyles.winnerText}>{`Spiel vorbei!`}</Text>
            <Text style={[appStyles.textNormal1, {fontStyle: 'italic', color: 'black', width:'80%', textAlign: 'center'}]}>Der letzte König wurde aufgedeckt! Die Person, die die Karte gezogen hat, muss nun den Kingscup austrinken!</Text>
            <Text></Text>
            <TouchableOpacity onPress={() => restartGame(deck)} style={appStyles.restartButton}>
                <Text style={appStyles.restartButtonText}>Spiel neustarten</Text>
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

        <InfoText header={"Kingscup!"} rules={"Vorbereitung: Besorgt euch ein leeres Glas. Außerdem sollte jede spielende Person ein Getränk haben. \n\n Jetzt zieht ihr reihum nacheinander eine Karte. Führt die Aktion aus, die unten für die Karte angezeigt wird. Bei Königen wird der Kingscup zu 1/3 gefüllt mit dem eigenen Getränk. Der Vierte König muss austrinken und das Spiel ist vorbei! "}/>
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {top: 20, left: 20}]}>
          <Text style={appStyles.infoButtonText}>ℹ</Text>
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
