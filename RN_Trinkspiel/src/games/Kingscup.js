import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

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

const Kingscup = () => {
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [selectedCard, setSelectedCard] = useState(null);

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
    const newDeck = [...deck];
    newDeck[index].revealed = true;
    setDeck(newDeck);
    setSelectedCard(newDeck[index]);
  };

  return (
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
        {selectedCard && (
          <View style={styles.centerCard}>
            <Text style={styles.centerCardValue}>{selectedCard.value}</Text>
            <Image style={styles.centerSuitIcon} source={suitImages[selectedCard.suit]} />
          </View>
        )}
      </View>
      <View style={styles.description}>
        {selectedCard && <Text>{`Bedeutung der Karte ${selectedCard.value} of ${selectedCard.suit}`}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2e2e2e',
  },
  deck: {
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
    width: 20,
    height: 20,
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
    width: 40,
    height: 40,
  },
  description: {
    padding: 20,
    backgroundColor: '#e0e0e0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

export default Kingscup;
