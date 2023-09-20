import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Pferderennen = () => {
  const [currentCard, setCurrentCard] = useState(null);
  const [winner, setWinner] = useState(null);

  const horses = ['♠️', '♣️', '♦️', '♥️'];
  const suits = ['♠️', '♣️', '♦️', '♥️'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deckInit = [];
  suits.forEach(suit => {
    values.forEach(value => {
      deckInit.push(value + suit);
    });
  });

  const [deck, setDeck] = useState(deckInit);

  useEffect(() => {
    setDeck(prevDeck => {
      return [...prevDeck].sort(() => Math.random() - 0.5);
    });
  }, []);

  const [positions, setPositions] = useState({
    '♠️': 0,
    '♣️': 0,
    '♦️': 0,
    '♥️': 0,
  });

  const drawCard = () => {
    if (deck.length === 0) {
      alert('Kartenstapel ist leer!');
      return;
    }

    const drawnCard = deck[0];
    setCurrentCard(drawnCard);
    setDeck(prevDeck => prevDeck.slice(1));

    const suitOfDrawnCard = drawnCard.slice(-1);

    setPositions(prevPositions => {
      let newPosition = prevPositions[suitOfDrawnCard] + 1;
      return {
        ...prevPositions,
        [suitOfDrawnCard]: newPosition,
      };
    });

    if (positions[suitOfDrawnCard] === 9) {
      setWinner(suitOfDrawnCard);
    }
  };

  return (
    <View style={styles.container}>
      {horses.map((horse, index) => (
        <View key={index} style={styles.column}>
          {[...Array(10)].map((_, cardIndex) => (
            <View
              key={cardIndex}
              style={[
                styles.card,
                {
                  backgroundColor: positions[horse] > cardIndex ? '#E5E5E5' : '#F8F8F8',
                },
              ]}
            />
          ))}
          <Text style={[styles.horse, {bottom: 35 * positions[horse]}]}>{horse}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={drawCard} style={styles.drawCardContainer}>
        <Text style={styles.drawCard}>Karte ziehen ({deck.length} übrig)</Text>
        <Text style={styles.drawnCard}>{currentCard}</Text>
      </TouchableOpacity>
      {winner && (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>Gewinner: {winner}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  column: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    marginHorizontal: 20,
    position: 'relative',
  },
  horse: {
    fontSize: 30,
    position: 'absolute',
    zIndex: 10,
    left: 10,
  },
  card: {
    width: 40,
    height: 60,
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  drawCardContainer: {
    position: 'absolute',
    top: 30,
    left: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  drawCard: {
    fontSize: 18,
  },
  drawnCard: {
    fontSize: 25,
    marginTop: 10,
  },
  winnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  winnerText: {
    fontSize: 40,
    color: 'white',
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 15,
  },
});

export default Pferderennen;
