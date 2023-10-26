import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { appStyles } from '../../styles';
import InfoText from './sublements/InfoText';
import { VariablesContext } from '../../VariablesContext';

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

const initialField = (deck) => {
  const height = 6; //height of field

  let field = new Array(5).fill(0);
  
  //Die Karten am linken Seitenrand
  field[0] = new Array(7).fill(null);
  let deckCopy = [...deck];
  for (let i = 1; i < 7; i++) {
      let randomIndex = Math.floor(Math.random() * deckCopy.length);
      let card = deckCopy[randomIndex];
      deckCopy.splice(randomIndex, 1);  // Remove the card from the temporary deck
      field[0][i] = { ...card, isHidden: true };
  }

  field[1] = new Array(7).fill(null);
  field[2] = new Array(7).fill(null);
  field[3] = new Array(7).fill(null);
  field[4] = new Array(7).fill(null);

  field[1][height] = { suit: '♦', value: 'A' };
  field[2][height] = { suit: '♥', value: 'A' };
  field[3][height] = { suit: '♠', value: 'A' };
  field[4][height] = { suit: '♣', value: 'A' }; 

  return field;
};

const App = () => {
  const [deck, setDeck] = useState(createDeck());
  const [field, setField] = useState(initialField(deck));
  const [discardPile, setDiscardPile] = useState([]);
  const [winner, setWinner] = useState(null);

  const { infoVisible, setInfoVisible } = useContext(VariablesContext);

  const restartGame = () => {
    setDeck(createDeck());
    setField(initialField(deck));
    setDiscardPile([]);
    setWinner(null);
  };

  // Funktion läuft alle Zeilen ab und checkt ob Seitenkarte aufgedeckt werden soll
  const checkIfSideCardShouldBeDiscovered = () => {
    const height = field[0].length-1; //height of field

    for (let row = height; row>0; row--){ //Zeile
      emptyRow = true;
      isAlreadyRevealed = false;
      for (let column = 1; column < 5; column++){ // Spalte
        if(field[column][row] != null){
          emptyRow = false;
        }
        if(field[0][row].isHidden == false){
          isAlreadyRevealed = true;
        }
      }
      if(emptyRow && !isAlreadyRevealed){
        //Reveales the card
        field[0][row].isHidden = false;
        //Move the appropriate ace down
        moveAceUp(field[0][row].suit, -1); //-1 for direction down
      }
      if(!emptyRow){
        break;
      }
    }
  }

  const moveAceUp = (suit, direction) => { //directions: 1 for up, -1 for down
    const newField = [...field];
    let column = 5;
    switch(suit){
      case '♦':
        column = 1;
        break;
      case '♥':
        column = 2;
        break;
      case '♠':
        column = 3;
        break;
      case '♣':
        column = 4;
        break;
    }
    for (let i = 0; i < newField[column].length; i++) {
      if (newField[column][i] && newField[column][i].suit === suit && newField[column][i].value === 'A') {
        if (!newField[column][i-direction]) { // Check if there is space above to move
          newField[column][i-direction] = { ...newField[column][i] }; // Move the ace up
          newField[column][i] = null; // Clear the current space
        }
        break; // Exit the loop once the ace is moved
      }
    }
    setField(newField);
  };  

  //Funktion die beim Klicken des Aufdecken-Buttons ausgeführt wird
  const drawCard = () => {
    if (deck && deck.length === 0 || winner) return;
    const randomIndex = Math.floor(Math.random() * deck.length);
    const [drawnCard] = deck.splice(randomIndex, 1);
    setDeck([...deck]);
    setDiscardPile([drawnCard, ...discardPile]);
    moveAceUp(drawnCard.suit, 1); //1 for direction up
    checkIfSideCardShouldBeDiscovered();
    checkWinner();
  };

  const checkWinner = () => {
    const topFields = new Array(4).fill(null); //field.slice(0, 4);
    topFields[0] = field[1][0];
    topFields[1] = field[2][0];
    topFields[2] = field[3][0];
    topFields[3] = field[4][0];
    const winningAce = topFields.find(card => card && card.value === 'A');
    if (winningAce) {
      setWinner(winningAce);
    }
  };

  if (winner) {
    return (
        <View style={styles.winnerScreen}>
            <Text style={styles.winnerText}>{`Gewinner: ${winner.suit}A`}</Text>
            <TouchableOpacity onPress={() => restartGame(deck)} style={styles.restartButton}>
                <Text style={styles.buttonText}>Spiel neustarten</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>

        <InfoText header={"Pferderennen!"} rules={"Bei Spielstart kann jede Person auf ein Pferd (Ass) eine bestimmte Schluckzahl setzen, z.B. '5 Schlucke auf Herz'. Diese Schlücke müsst ihr direkt selbst trinken. \n\n Jetzt könnt ihr nacheinander Karten aufdecken, das entsprechende Pferd zieht nach vorne. Sind alle Pferde an einer Karte an der Seite vorbei, wird diese aufgedeckt und das entsprechende Pferd muss ein Feld zurück. Sobald ein Pferd die Ziellinie erreicht, dürfen alle Personen, die richtig lagen, das dopppelte ihrer Schluckanzahl verteilen."}/>

        <View style={styles.field}>
          <View style={styles.column}>
            {field[0].map((card, index) => {
              // Skip the first element
              if (index === 0) return null;
              return(
              <View key={index} style={card ? styles.card : styles.emptyCard}>
                {card && !card.isHidden && <Text style={styles.cardText}>{card.value + card.suit}</Text>}
                {card && card.isHidden && <Image style={styles.cardBack} source={require('../../assets/images/icons/cards/card-back.png')} />}
              </View>)
            })}
          </View>
          <View style={styles.column}>
            {field[1].map((card, index) => {
              // Skip the first element
              if (index === 0) return null;
              return(
              <View key={index} style={card ? styles.card : styles.emptyCard}>
                {card && <Text style={styles.cardText}>{card.value + card.suit}</Text>}
              </View>)
            })}
          </View>
          <View style={styles.column}>
            {field[2].map((card, index) => {
              // Skip the first element
              if (index === 0) return null;
              return(
              <View key={index} style={card ? styles.card : styles.emptyCard}>
                {card && <Text style={styles.cardText}>{card.value + card.suit}</Text>}
              </View>)
            })}
          </View>
          <View style={styles.column}>
            {field[3].map((card, index) => {
              // Skip the first element
              if (index === 0) return null;
              return(
              <View key={index} style={card ? styles.card : styles.emptyCard}>
                {card && <Text style={styles.cardText}>{card.value + card.suit}</Text>}
              </View>)
            })}
          </View>
          <View style={styles.column}>
            {field[4].map((card, index) => {
              // Skip the first element
              if (index === 0) return null;
              return(
              <View key={index} style={card ? styles.card : styles.emptyCard}>
                {card && <Text style={styles.cardText}>{card.value + card.suit}</Text>}
              </View>)
            })}
          </View>
        </View>
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
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={[appStyles.infoButton, {}]}>
          <Text style={appStyles.infoButtonText}>ℹ</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    
    
    alignItems: 'center',
    justifyContent: 'center',
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
    height: windowHeight * 0.115,
    margin: windowWidth * 0.01,
    backgroundColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: windowWidth * 0.01,
    borderRadius: 8,
  },
  deckText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  field: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: windowWidth * 1,// * 360 / 100, // Adjusted width
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: windowWidth * 0.19,// * 360 / 100, // Adjusted width
    justifyContent: 'center',
  },
  card: {
    width: windowWidth * 0.17,
    height: windowHeight * 0.115,
    backgroundColor: 'white',
    margin: windowWidth * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
  cardBack: {
    width: '100%',
    height: '100%',
  },
  emptyCard: {
    width: windowWidth * 0.17,
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
