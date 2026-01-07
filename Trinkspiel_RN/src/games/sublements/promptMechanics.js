import { shuffleArrayFisherYates } from './AdjustParamShape';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const sanitizePlayers = (players, { requireDrinker = false } = {}) => {
  if (!Array.isArray(players)) {
    return [];
  }
  return players.filter((player) => {
    if (!player || typeof player.name !== 'string' || player.name.trim().length === 0) {
      return false;
    }
    if (requireDrinker && player.drinks === false) {
      return false;
    }
    return true;
  });
};

const fallbackName = (language) => (language === 'de' ? 'jemand' : 'someone');

export const formatPlayerList = (list, language = 'de') => {
  const names = Array.isArray(list) ? list.filter(Boolean) : [];
  if (names.length === 0) {
    return fallbackName(language);
  }
  if (names.length === 1) {
    return names[0];
  }
  if (language === 'de') {
    return `${names.slice(0, -1).join(', ')} und ${names[names.length - 1]}`;
  }
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
};

export const pickRandomPlayer = (players, language = 'de', options = {}) => {
  const pool = sanitizePlayers(players, options);
  if (pool.length === 0) {
    return { name: fallbackName(language), player: null };
  }
  const index = Math.floor(Math.random() * pool.length);
  return { name: pool[index].name, player: pool[index] };
};

export const pickMultiplePlayers = (players, language = 'de', count = 2, options = {}) => {
  const pool = sanitizePlayers(players, options);
  if (pool.length === 0) {
    return {
      names: [fallbackName(language)],
      players: [],
    };
  }
  const working = shuffleArrayFisherYates([...pool]);
  const selected = working.slice(0, Math.min(count, working.length));
  const names = selected.map((entry) => entry.name);
  return { names, players: selected };
};

export const pickNeighborTargets = (players, language = 'de') => {
  const pool = sanitizePlayers(players);
  if (pool.length === 0) {
    const name = fallbackName(language);
    return {
      anchor: name,
      left: name,
      right: name,
    };
  }
  if (pool.length === 1) {
    return {
      anchor: pool[0].name,
      left: pool[0].name,
      right: pool[0].name,
    };
  }
  const index = Math.floor(Math.random() * pool.length);
  const anchor = pool[index];
  const left = pool[(index - 1 + pool.length) % pool.length];
  const right = pool[(index + 1) % pool.length];
  return {
    anchor: anchor.name,
    left: left.name,
    right: right.name,
  };
};

export const splitIntoTeams = (players) => {
  const pool = sanitizePlayers(players);
  if (pool.length < 2) {
    return null;
  }
  const shuffled = shuffleArrayFisherYates([...pool]);
  const midpoint = Math.ceil(shuffled.length / 2);
  return [shuffled.slice(0, midpoint), shuffled.slice(midpoint)];
};

const pluraliseUnit = (unit, amount, language) => {
  switch (unit) {
    case 'shot':
      if (language === 'de') {
        return amount === 1 ? '1 Shot' : `${amount} Shots`;
      }
      return amount === 1 ? '1 shot' : `${amount} shots`;
    case 'gulp':
      if (language === 'de') {
        return amount === 1 ? '1 großer Schluck' : `${amount} große Schlucke`;
      }
      return amount === 1 ? '1 big sip' : `${amount} big sips`;
    case 'sip':
    default:
      if (language === 'de') {
        return amount === 1 ? '1 Schluck' : `${amount} Schlucke`;
      }
      return amount === 1 ? '1 sip' : `${amount} sips`;
  }
};

export const computeDrinkAmount = (settings = {}, config = {}, language = 'de') => {
  const sliderKey = config.sliderKey === 'current' ? 'currentDrunkenness' : 'desiredDrunkenness';
  const sliderValueRaw =
    typeof settings[sliderKey] === 'number' ? clamp(settings[sliderKey], 0, 9) : 5;
  const min = Number.isFinite(config.min) ? config.min : 1;
  const max = Number.isFinite(config.max) ? config.max : min;
  const scaled = min + (max - min) * (sliderValueRaw / 9);
  const value = clamp(Math.round(scaled), min, max);
  const unit = config.unit || 'sip';
  const label = pluraliseUnit(unit, value, language);
  return { value, unit, label };
};

export const renderTemplateText = (template, variables = {}) => {
  if (typeof template !== 'string' || template.length === 0) {
    return '';
  }
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const replacement = variables[key];
    if (replacement == null) {
      return `{{${key}}}`;
    }
    return String(replacement);
  });
};
