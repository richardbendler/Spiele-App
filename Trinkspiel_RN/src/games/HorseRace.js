import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const createDeck = () => {
  const suits = ['♦', '♥', '♠', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
};

const initialField = () => {
  let field = new Array(24).fill(null);
  field[20] = { suit: '♦', value: 'A' };
  field[21] = { suit: '♥', value: 'A' };
  field[22] = { suit: '♠', value: 'A' };
  field[23] = { suit: '♣', value: 'A' };
  return field;
};

const App = () => {
  const [deck, setDeck] = useState(createDeck());
  const [field, setField] = useState(initialField());
  const [discardPile, setDiscardPile] = useState([]);

  const moveAceUp = (suit) => {
    const newField = [...field];
    for (let i = 0; i < newField.length; i++) {
      if (newField[i] && newField[i].suit === suit && newField[i].value === 'A') {
        if (i >= 4 && !newField[i - 4]) { // Check if there is space above to move
          newField[i - 4] = { ...newField[i] }; // Move the ace up
          newField[i] = null; // Clear the current space
        }
        break; // Exit the loop once the ace is moved
      }
    }
    setField(newField);
  };  

  const drawCard = () => {
    if (deck.length === 0) return;
    const randomIndex = Math.floor(Math.random() * deck.length);
    const [drawnCard] = deck.splice(randomIndex, 1);
    setDeck([...deck]);
    setDiscardPile([drawnCard, ...discardPile]);
    moveAceUp(drawnCard.suit); // Call the function to move the ace up
  };

  return (
    <View style={styles.container}>
      <View style={styles.deckArea}>
        <TouchableOpacity style={styles.deck} onPress={drawCard}>
          <Text style={styles.deckText}>Deck</Text>
        </TouchableOpacity>
        {discardPile.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardText}>{discardPile[0].value + discardPile[0].suit}</Text>
          </View>
        )}
      </View>
      <View style={styles.field}>
        {field.map((card, index) => (
          <View key={index} style={card ? styles.card : styles.emptyCard}>
            {card && <Text style={styles.cardText}>{card.value + card.suit}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 50,
  },
  deckArea: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deck: {
    width: 80,
    height: 100,
    backgroundColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 20,
  },
  deckText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  field: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 360, // Adjusted width
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 100,
    backgroundColor: 'white',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
  emptyCard: {
    width: 80,
    height: 100,
    backgroundColor: '#D3D3D3',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
  cardText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default App;
