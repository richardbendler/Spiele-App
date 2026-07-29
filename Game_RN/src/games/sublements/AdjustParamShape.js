export const replaceHashtagsWithoutDuplicates = (inputString, options = {}) => {
  try {
    const text = typeof inputString === 'string' ? inputString : '';
    if (!text) {
      return '';
    }

    const allPlayers = Array.isArray(options.players) ? options.players : [];
    const language = typeof options.language === 'string' ? options.language : 'de';
    const requireDrinkingPlayers = Boolean(options.requireDrinkingPlayers);

    const drinkersOnly = allPlayers.filter((player) => player?.drinks !== false);
    const playerPool =
      requireDrinkingPlayers && drinkersOnly.length > 0 ? drinkersOnly : allPlayers;
    const playerNames = playerPool.map((player) => player?.name).filter(Boolean);
    const fallbackNames = allPlayers.map((player) => player?.name).filter(Boolean);

    const hasInitialPool = playerNames.length > 0;
    let availableNames = hasInitialPool ? [...playerNames] : [...fallbackNames];

    if (availableNames.length === 0) {
      const fallbackLabel = language === 'en' ? 'player' : 'Spieler*in';
      return text.replace(/#/g, fallbackLabel);
    }

    return text.replace(/#/g, () => {
      if (availableNames.length === 0) {
        availableNames = playerNames.length > 0 ? [...playerNames] : [...fallbackNames];
      }
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      const name = availableNames[randomIndex];
      availableNames.splice(randomIndex, 1);
      return name;
    });
  } catch (error) {
    console.log(error);
    return typeof inputString === 'string' ? inputString : '';
  }
};

// Entfernt ein uebrig gebliebenes "#"-Platzhalterzeichen (das eigentliche Zeichen, das
// replaceHashtagsWithoutDuplicates durch Spielernamen ersetzt) samt folgendem Leerzeichen,
// falls Text mal ungefiltert angezeigt wird. Die vorherige Regex verlangte "#" + ein Zeichen +
// Komma + Leerzeichen - ein Muster, das in echten Inhalten praktisch nie vorkam.
export const deleteHashtags = (inputString) => {
  return (inputString || '').replace(/#\s*/g, '');
};

export const shuffleArrayFisherYates = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
