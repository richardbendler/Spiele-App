const { truthOrDareComboPool } = require('./truthOrDareCombo');
const { neverHaveIEverPool } = require('./neverHaveIEver');
const { categoryPool } = require('./category');
const { rhymePool } = require('./rhyme');
const { duelPool } = require('./duel');
const { competitionPool } = require('./competition');
const { rulePool } = require('./rule');
const { ffaBestPool } = require('./ffaBest');
const { ffaGiveUpPool } = require('./ffaGiveUp');
const { voteMinorityPool } = require('./voteMinority');
const { everyoneDrinkPool } = require('./everyoneDrink');
const { bestDistributorPool } = require('./bestDistributor');
const { worstDrinkerPool } = require('./worstDrinker');
const { mostLikelyPool } = require('./mostLikely');
const { butternPool } = require('./buttern');
const { directChallengePool } = require('./directChallenge');
const { silentTaskPool } = require('./silentTask');
const { miscPool } = require('./misc');
const { chugPool } = require('./chug');
const { targetedDrinkPool } = require('./targetedDrink');
const { shotCardPool } = require('./shotCard');
const { neighborActionPool } = require('./neighborAction');
const { wordContinuationPool } = require('./wordContinuation');
const { timerCountdownPool } = require('./timerCountdown');
const { timerCounterPool } = require('./timerCounter');
const { teamBattlePool } = require('./teamBattle');
const { pantomimeTeamsPool } = require('./pantomimeTeams');
const { pantomimeSoloPool } = require('./pantomimeSolo');
const { quizPool } = require('./quiz');
const { estimationPool } = require('./estimation');
const { fakeNewsPool } = require('./fakeNews');
const { virusPool } = require('./virus');
const { explainPool } = require('./explain');

// -----------------------------------------------------------------------------
// Erweiterungstipps:
// 1. Lege pro Pool eine eigene Datei an (siehe truth.js). Exportiere ein Objekt
//    mit `pool` (Metadaten) und `prompts` (Array aus createPrompts).
// 2. Nutze `helpers.js#createPrompts`, damit Exposure (Intensität), drunk_level
//    und optionale familiarityFloor sauber gesetzt werden.
// 3. Eine neue Frage = neuer String im passenden Intensitätsblock. Achte darauf,
//    dass für jede Slider-Stufe (1–5) ausreichend Items existieren.
// -----------------------------------------------------------------------------

const poolModules = [
  truthOrDareComboPool,
  neverHaveIEverPool,
  categoryPool,
  rhymePool,
  duelPool,
  competitionPool,
  rulePool,
  ffaBestPool,
  ffaGiveUpPool,
  voteMinorityPool,
  everyoneDrinkPool,
  bestDistributorPool,
  worstDrinkerPool,
  mostLikelyPool,
  butternPool,
  directChallengePool,
  silentTaskPool,
  miscPool,
  chugPool,
  targetedDrinkPool,
  shotCardPool,
  neighborActionPool,
  wordContinuationPool,
  timerCountdownPool,
  timerCounterPool,
  teamBattlePool,
  pantomimeTeamsPool,
  pantomimeSoloPool,
  quizPool,
  estimationPool,
  fakeNewsPool,
  virusPool,
  explainPool,
];

const pools = poolModules.reduce((acc, entry) => {
  acc[entry.pool.key] = entry.pool;
  return acc;
}, {});

const promptGroups = poolModules.reduce((acc, entry) => {
  acc[entry.pool.key] = entry.prompts;
  return acc;
}, {});

const buildPrompt = (() => {
  let nextQuestionId = 1;
  return (poolKey, template) => {
    const pool = pools[poolKey];
    if (!pool) {
      throw new Error(`Unknown pool: ${poolKey}`);
    }

    const questionId = nextQuestionId;
    nextQuestionId += 1;

    const content = typeof template.content === 'string' ? template.content : '';
    const contentEn =
      typeof template.content_en === 'string' && template.content_en.length > 0
        ? template.content_en
        : content;
    const exposureLevel =
      typeof template.exposure === 'number'
        ? template.exposure
        : typeof template.exposure_level === 'number'
          ? template.exposure_level
          : 1;
    const drunkLevel =
      typeof template.drunk_level === 'number'
        ? template.drunk_level
        : typeof template.drunk === 'number'
          ? template.drunk
          : exposureLevel;
    const boolDrink = template.bool_drink ? 1 : 0;
    const familiarityFloor =
      typeof template.familiarityFloor === 'number'
        ? template.familiarityFloor
        : undefined;
    const customPayload =
      template.custom_payload && typeof template.custom_payload === 'object'
        ? template.custom_payload
        : undefined;
    const gating =
      template.gating && typeof template.gating === 'object' ? template.gating : undefined;
    const customTags = Array.isArray(template.tags)
      ? template.tags.filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
      : undefined;

    return {
      question_id: questionId,
      fk_pool: pool.id,
      pool_name: pool.name,
      pool_color: pool.color,
      pool_comment: '',
      pool_fk_game: 2,
      pool_id: pool.id,
      activation: 1,
      author: template.author || '',
      content,
      content_en: contentEn,
      drunk_level: drunkLevel,
      exposure_level: exposureLevel,
      bool_drink: boolDrink,
      popularity: 0,
      timestamp: 0,
      familiarity_floor: familiarityFloor,
      custom_payload: customPayload,
      gating,
      custom_tags: customTags,
    };
  };
})();

const rawTheOnePromptsData = Object.entries(promptGroups).flatMap((entry) => {
  const [poolKey, prompts] = entry;
  return prompts.map((template) => buildPrompt(poolKey, template));
});

const poolDictionary = Object.values(pools).reduce((acc, pool) => {
  acc[pool.name] = { key: pool.key, label: pool.label };
  return acc;
}, {});

const poolTags = Object.values(pools).reduce((acc, pool) => {
  acc[pool.name] = [pool.key];
  return acc;
}, {});

poolTags['Ich hab noch nie'].push('drink-round');
poolTags['Regel'].push('house-rule');
poolTags['Wettkampf'].push('challenge');
poolTags['Wettkampf 1v1'].push('challenge');
poolTags['Reimen'].push('word-play');

const deriveFamiliarityFloorFromIntensity = (exposureLevel) => {
  if (typeof exposureLevel !== 'number') {
    return 0;
  }
  if (exposureLevel >= 5) {
    return 0.85;
  }
  if (exposureLevel === 4) {
    return 0.7;
  }
  if (exposureLevel === 3) {
    return 0.5;
  }
  if (exposureLevel === 2) {
    return 0.3;
  }
  return 0.1;
};

const buildTags = (entry) => {
  const tags = [];
  if (entry.bool_drink) {
    tags.push('drink');
  }
  const extra = poolTags[entry.pool_name];
  if (Array.isArray(extra)) {
    extra.forEach((tag) => tags.push(tag));
  }
  if (Array.isArray(entry.custom_tags)) {
    entry.custom_tags.forEach((tag) => tags.push(tag));
  }
  return tags;
};

const toPrompt = (entry) => {
  const poolBase =
    poolDictionary[entry.pool_name] || {
      key: 'mixed',
      label: { de: entry.pool_name || 'Mix', en: entry.pool_name || 'Mix' },
    };

  const intensity = typeof entry.exposure_level === 'number' ? entry.exposure_level : 0;
  const recommendedDrunkLevel = typeof entry.drunk_level === 'number' ? entry.drunk_level : 0;
  const familiarityFloor =
    typeof entry.familiarity_floor === 'number'
      ? entry.familiarity_floor
      : deriveFamiliarityFloorFromIntensity(intensity);
  const customPayload =
    entry.custom_payload && typeof entry.custom_payload === 'object'
      ? entry.custom_payload
      : undefined;
  const gating = entry.gating && typeof entry.gating === 'object' ? entry.gating : undefined;

  return {
    id: entry.question_id,
    question_id: entry.question_id,
    pool: {
      id: entry.fk_pool,
      key: poolBase.key,
      label: poolBase.label,
      color: entry.pool_color,
    },
    content: entry.content,
    content_en: entry.content_en || entry.content,
    metadata: {
      intensity,
      recommendedDrunkLevel,
      drinkInvolved: Boolean(entry.bool_drink),
      familiarityFloor,
      tags: buildTags(entry),
      customPayload,
      gating,
    },
    raw: {
      activation: entry.activation,
      author: entry.author,
      popularity: entry.popularity,
      timestamp: entry.timestamp,
      poolComment: entry.pool_comment,
      poolGame: entry.pool_fk_game,
    },
  };
};

const theOneSamplePrompts = rawTheOnePromptsData.map(toPrompt);
const rawTheOnePrompts = rawTheOnePromptsData;

module.exports = { rawTheOnePromptsData, theOneSamplePrompts, rawTheOnePrompts };