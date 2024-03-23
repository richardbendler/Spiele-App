import React, { useState } from 'react';

/* 
players: {
  id: int
  name: String,
  drinks: bool
}
*/

export const VariablesContext = React.createContext({
  /*playerNames: [],
  setPlayerNames: () => {},
  drinkTypes: [], // Initialisieren mit leerem Array
  setDrinkTypes: () => {},
  */
 players: [],
 setPlayers: () => {},
});

