import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const MaxchenGame = () => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  //const [playerScores, setPlayerScores] = useState({});
  //const [currentRoll, setCurrentRoll] = useState(0);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setCurrentRoll(roll);
  };

  /*const nextPlayer = () => {
    const nextPlayerNumber = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayerNumber);
    setCurrentRoll(0);
  };

  const updateScores = () => {
    const updatedScores = { ...playerScores };
    updatedScores[currentPlayer] = currentRoll;
    setPlayerScores(updatedScores);
    nextPlayer();
  };

  const determineWinner = () => {
    if (Object.keys(playerScores).length !== 2) {
      return '';
    }

    const player1Score = playerScores[1];
    const player2Score = playerScores[2];

    if (player1Score === player2Score) {
      return 'Unentschieden!';
    } else if (player1Score > player2Score) {
      return 'Spieler 1 gewinnt!';
    } else {
      return 'Spieler 2 gewinnt!';
    }
  };*/
    /*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Aktueller Spieler: Spieler {currentPlayer}</Text>
      <Text>Aktueller Wurf: {currentRoll}</Text>
      {currentRoll === 0 ? (
        <Button title="Würfeln" onPress={rollDice} />
      ) : (
        <>
          <Button title="Weiter" onPress={updateScores} />
          <Button title="Würfeln" onPress={rollDice} />
        </>
      )}
      <Text>{determineWinner()}</Text>
      </View>*/
  return (
    <Text>Test</Text>
  );
};

export default MaxchenGame;
