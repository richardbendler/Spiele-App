const CATEGORY_COLOR_DEFS = [
  { key: 'truth', color: '#FF6B6B' },
  { key: 'dare', color: '#F06595' },
  { key: 'never-have-i-ever', color: '#FF9F1C' },
  { key: 'category', color: '#FFD166' },
  { key: 'rhyme', color: '#06D6A0' },
  { key: 'duel', color: '#118AB2' },
  { key: 'competition', color: '#5E60CE' },
  { key: 'rule', color: '#F4A259' },
  { key: 'truth-dare-combo', color: '#9B5DE5' },
  { key: 'ffa-best', color: '#EF476F' },
  { key: 'ffa-giveup', color: '#FF6F91' },
  { key: 'vote-minority', color: '#06AED5' },
  { key: 'everyone-drink', color: '#F3722C' },
  { key: 'best-distributor', color: '#90BE6D' },
  { key: 'worst-drinker', color: '#F8961E' },
  { key: 'most-likely', color: '#4D908E' },
  { key: 'buttern', color: '#577590' },
  { key: 'direct-challenge', color: '#3D5A80' },
  { key: 'silent-task', color: '#355070' },
  { key: 'misc', color: '#6D597A' },
  { key: 'chug', color: '#F94144' },
  { key: 'targeted-drink', color: '#EE4266' },
  { key: 'shot-card', color: '#B56576' },
  { key: 'neighbor-action', color: '#43AA8B' },
  { key: 'word-chain', color: '#277DA1' },
  { key: 'timer-countdown', color: '#70C1B3' },
  { key: 'timer-counter', color: '#98C1D9' },
  { key: 'team-battle', color: '#335C67' },
  { key: 'pantomime-teams', color: '#6A4C93' },
  { key: 'pantomime-solo', color: '#C77DFF' },
  { key: 'quiz', color: '#E5989B' },
  { key: 'estimation', color: '#FFD23F' },
  { key: 'fake-news', color: '#FFB5A7' },
  { key: 'virus', color: '#8FB339' },
  { key: 'explain', color: '#3A86FF' },
];

const LEGACY_KEY_ALIASES = {
  truth: 'truth',
  dare: 'dare',
  truthOrDareCombo: 'truth-dare-combo',
  neverHaveIEver: 'never-have-i-ever',
  ffaBest: 'ffa-best',
  ffaGiveUp: 'ffa-giveup',
  voteMinority: 'vote-minority',
  everyoneDrink: 'everyone-drink',
  bestDistributor: 'best-distributor',
  worstDrinker: 'worst-drinker',
  mostLikely: 'most-likely',
  directChallenge: 'direct-challenge',
  silentTask: 'silent-task',
  targetedDrink: 'targeted-drink',
  shotCard: 'shot-card',
  neighborAction: 'neighbor-action',
  wordContinuation: 'word-chain',
  timerCountdown: 'timer-countdown',
  timerCounter: 'timer-counter',
  teamBattle: 'team-battle',
  pantomimeTeams: 'pantomime-teams',
  pantomimeSolo: 'pantomime-solo',
  fakeNews: 'fake-news',
};

const CATEGORY_COLOR_MAP = CATEGORY_COLOR_DEFS.reduce((acc, def) => {
  acc[def.key] = def.color;
  return acc;
}, {});

const CATEGORY_COLOR_PALETTE = CATEGORY_COLOR_DEFS.map((def) => def.color);
const CATEGORY_KEY_SEQUENCE = CATEGORY_COLOR_DEFS.map((def) => def.key);

const normalizeHexColor = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
    return null;
  }
  if (trimmed.length === 4) {
    const expanded =
      '#' +
      trimmed
        .slice(1)
        .split('')
        .map((char) => char + char)
        .join('');
    return expanded.toUpperCase();
  }
  return trimmed.toUpperCase();
};

const normalizeCategoryKey = (key) => {
  if (typeof key !== 'string') {
    return null;
  }
  const trimmed = key.trim();
  if (CATEGORY_COLOR_MAP[trimmed]) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (CATEGORY_COLOR_MAP[lower]) {
    return lower;
  }
  if (LEGACY_KEY_ALIASES[trimmed]) {
    return LEGACY_KEY_ALIASES[trimmed];
  }
  if (LEGACY_KEY_ALIASES[lower]) {
    return LEGACY_KEY_ALIASES[lower];
  }
  return trimmed;
};

const pickPaletteColor = (index = 0) => {
  if (CATEGORY_COLOR_PALETTE.length === 0) {
    return '#2F4F4F';
  }
  const paletteIndex = index % CATEGORY_COLOR_PALETTE.length;
  return CATEGORY_COLOR_PALETTE[paletteIndex];
};

const getCategoryColor = (key, fallbackIndex = 0) => {
  const normalizedKey = normalizeCategoryKey(key);
  const color = normalizedKey ? CATEGORY_COLOR_MAP[normalizedKey] : null;
  if (color) {
    return color;
  }
  return normalizeHexColor(pickPaletteColor(fallbackIndex)) || '#2F4F4F';
};

const getCategoryColorEntries = () => CATEGORY_COLOR_DEFS.map((entry) => ({ ...entry }));

export {
  CATEGORY_COLOR_DEFS,
  CATEGORY_COLOR_MAP,
  CATEGORY_COLOR_PALETTE,
  CATEGORY_KEY_SEQUENCE,
  normalizeCategoryKey,
  getCategoryColor,
  getCategoryColorEntries,
  normalizeHexColor,
  pickPaletteColor,
};
