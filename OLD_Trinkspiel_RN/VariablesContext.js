import React from 'react';

export const VariablesContext = React.createContext({
  playerNames: [],
  setPlayerNames: () => {},
  drinkTypes: [], // Initialisieren mit leerem Array
  setDrinkTypes: () => {},
});

