import React from 'react';

export const VariablesContext = React.createContext({
  settingsVisible: false,
  setSettingsVisible: () => {},
  infoVisible: false,
  setInfoVisible: () => {},
  drinkTypes: [],
  setDrinkTypes: () => {},
  players: [],
  setPlayers: () => {},
  language: 'de',
  setLanguage: () => {},
  theOneSettings: {
    currentDrunkenness: 4,
    desiredDrunkenness: 6,
    familiarity: 5,
  },
  setTheOneSettings: () => {},
  theOnePrompts: [],
  setTheOnePrompts: () => {},
});
