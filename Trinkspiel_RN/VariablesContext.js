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
});
