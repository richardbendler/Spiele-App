import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

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
  const [winner, setWinner] = useState(null);

  const restartGame = () => {
    setDeck(createDeck());
    setField(initialField());
    setDiscardPile([]);
    setWinner(null);
  };

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
    if (deck.length === 0 || winner) return;
    const randomIndex = Math.floor(Math.random() * deck.length);
    const [drawnCard] = deck.splice(randomIndex, 1);
    setDeck([...deck]);
    setDiscardPile([drawnCard, ...discardPile]);
    moveAceUp(drawnCard.suit);
    checkWinner();
  };

  const checkWinner = () => {
    const topField = field.slice(0, 4);
    const winningAce = topField.find(card => card && card.value === 'A');
    if (winningAce) {
      setWinner(winningAce);
    }
  };

  if (winner) {
    return (
        <View style={styles.winnerScreen}>
            <Text style={styles.winnerText}>{`Gewinner: ${winner.suit}A`}</Text>
            <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
                <Text style={styles.buttonText}>Spiel neustarten</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.deckArea}>
          <TouchableOpacity style={styles.deck} onPress={drawCard}>
            <Text style={styles.deckText}>Aufdecken</Text>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: 'center',
    paddingTop: windowWidth * 0.05,
  },
  deckArea: {
    flexDirection: 'row',
    marginBottom: windowWidth * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deck: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.1,
    backgroundColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: windowWidth * 0.01,
  },
  deckText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  field: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: windowWidth * 0.90,// * 360 / 100, // Adjusted width
    justifyContent: 'center',
  },
  card: {
    width: windowWidth * 0.2,
    height: windowHeight * 0.115,
    backgroundColor: 'white',
    margin: windowWidth * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
  emptyCard: {
    width: windowWidth * 0.2,
    height: windowHeight * 0.115,
    backgroundColor: '#D3D3D3',
    margin: windowWidth * 0.01,
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
  winnerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAD02E',  // You can use a gradient or image
  },
  winnerText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#D84315',
      marginBottom: 20,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10
  },
  restartButton: {
      padding: 15,
      borderRadius: 8,
      backgroundColor: '#D84315',  // Use a color that stands out
  },
  buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FAD02E',
  }
});

export default App;
