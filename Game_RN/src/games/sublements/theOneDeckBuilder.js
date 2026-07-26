import { shuffleArrayFisherYates } from './AdjustParamShape.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const normaliseSlider = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return clamp(value / 9, 0, 1);
};

const sliderValue = (value, fallback) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return clamp(fallback, 0, 9);
  }
  return clamp(value, 0, 9);
};

const sliderToLevel10 = (value, fallbackLevel) => {
  const scaled = Math.round((value / 9) * 10);
  return clamp(scaled || fallbackLevel, 1, 10);
};

const derivePreferences = (settings = {}) => {
  const currentSlider = sliderValue(settings.currentDrunkenness, 4);
  const desiredSlider = sliderValue(settings.desiredDrunkenness, 6);
  const familiaritySlider = sliderValue(settings.familiarity, 4);

  const currentLevel = sliderToLevel10(currentSlider, 4);
  const desiredLevel = sliderToLevel10(desiredSlider, 6);
  const diffLevel = clamp(Math.abs(desiredSlider - currentSlider), 0, 9) + 1;
  const familiarityPref = normaliseSlider(familiaritySlider);

  return {
    currentSlider,
    desiredSlider,
    familiaritySlider,
    currentLevel,
    desiredLevel,
    diffLevel,
    familiarityPref,
  };
};

const toBucketKey = (prompt) => {
  const recommended =
    typeof prompt?.metadata?.recommendedDrunkLevel === 'number'
      ? prompt.metadata.recommendedDrunkLevel
      : typeof prompt?.metadata?.intensity === 'number'
        ? prompt.metadata.intensity * 2
        : 5;
  return clamp(Math.round(recommended) || 1, 1, 10);
};

const popMatching = (list, predicate) => {
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const candidate = list[index];
    if (!predicate || predicate(candidate)) {
      list.splice(index, 1);
      return candidate;
    }
  }
  return null;
};

const pickTwoDistinct = (arr) => {
  const list = Array.isArray(arr) ? [...arr] : [];
  if (list.length < 2) return null;
  const aIndex = Math.floor(Math.random() * list.length);
  const a = list.splice(aIndex, 1)[0];
  const b = list[Math.floor(Math.random() * list.length)];
  return [a, b];
};

const buildTeams = (players) => {
  const pool = Array.isArray(players) ? players.slice() : [];
  if (pool.length < 2) return null;
  // shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const mid = Math.ceil(pool.length / 2);
  return [pool.slice(0, mid), pool.slice(mid)];
};

const formatNames = (list, language) => {
  const names = (list || []).map((p) => p?.name).filter(Boolean);
  if (names.length === 0) return language === 'de' ? 'Niemand' : 'Nobody';
  if (names.length === 1) return names[0];
  const last = names.pop();
  const sep = language === 'de' ? ', ' : ', ';
  const andWord = language === 'de' ? ' und ' : ' and ';
  return names.join(sep) + andWord + last;
};

const makeTeamChallenges = (players, language) => {
  const teams = buildTeams(players);
  if (!teams) return [];
  const [teamA, teamB] = teams;
  const A = formatNames(teamA, language);
  const B = formatNames(teamB, language);
  const items = [
    {
      de: `Teamduell: ${A} vs. ${B} — Wer schafft in 30 Sekunden mehr Kniebeugen? Verliererteam trinkt 2 Schlucke.`,
      en: `Team duel: ${A} vs. ${B} — Who does more squats in 30 seconds? Losing team drinks 2 sips.`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Stille Post: In 45 Sekunden ein Wort flüstern bis zum Ende. Mehr richtige Wörter gewinnt.`,
      en: `Team duel: ${A} vs. ${B} — Telephone game: whisper a word down the line in 45 seconds. Most correct wins.`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Schnelles Pantomime: Erklärt abwechselnd Begriffe ohne Worte. 4 richtige vs. 4 richtige? Unentschieden = alle trinken 1 Schluck.`,
      en: `Team duel: ${A} vs. ${B} — Speed charades: act out words without speaking. Tie = everyone drinks 1 sip.`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Wer kann schneller das Alphabet rückwärts aufsagen?`,
      en: `Team duel: ${A} vs. ${B} — Who can say the alphabet backwards faster?`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Beide Teams einigen sich auf einen Zungenbrecher. Wer feuert ihn fehlerfrei raus?`,
      en: `Team duel: ${A} vs. ${B} — Pick a tongue-twister. Which team can say it flawlessly?`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Aus Gegenständen um euch herum: Formt ein Herz. Bestes Herz gewinnt.`,
      en: `Team duel: ${A} vs. ${B} — Use objects around you to build a heart. Best heart wins.`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — 10 Sekunden still stehen. Wer wackelt zuerst?`,
      en: `Team duel: ${A} vs. ${B} — Balance challenge: stand still 10 seconds. First to wobble loses.`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Nennt abwechselnd Städte. Wer stockt oder wiederholt, verliert.`,
      en: `Team duel: ${A} vs. ${B} — Name cities in turn. Hesitate or repeat and your team loses.`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Jeder aus Team A nennt ein Tier, Team B macht die Geräusche. Lacher entscheiden den Sieg.`,
      en: `Team duel: ${A} vs. ${B} — Each from Team A names an animal, Team B does the sounds. Laughter decides the winner.`,
    },
    {
      de: `Teamduell: ${A} vs. ${B} — Papierflieger: Wer fliegt weiter?`,
      en: `Team duel: ${A} vs. ${B} — Paper planes: whose plane flies farther?`,
    },
  ];
  return items.map((it, idx) => ({
    id: `team-${Date.now()}-${idx}`,
    pool: { id: 8, key: 'competition', label: { de: 'Wettkampf', en: 'Competition' }, color: '#228B22' },
    content: it.de,
    content_en: it.en,
    metadata: { intensity: 2, recommendedDrunkLevel: 2, drinkInvolved: true, familiarityFloor: 0.2, tags: ['challenge', 'teams'] },
  }));
};

// Enhanced team challenge generation guided by intensity
const TEAM_CHALLENGE_TEMPLATES = [
  { intensity: 1, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Nennt abwechselnd Städte. Wer stockt oder wiederholt, verliert. Verliererteam trinkt 1 Schluck.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Name cities in turn. Hesitate or repeat and you lose. Losing team drinks 1 sip.` },
  { intensity: 1, de: (A,B)=>`Teamduell: ${A} vs. ${B} — 10 Sekunden still stehen. Wer wackelt zuerst? Verliererteam trinkt 1 Schluck.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Balance 10 seconds. First to wobble loses, losing team drinks 1 sip.` },
  { intensity: 2, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Papierflieger: Wessen Flieger fliegt weiter? Verliererteam trinkt 2 Schlucke.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Paper planes: whose plane flies farther? Losing team drinks 2 sips.` },
  { intensity: 2, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Zungenbrecher: Sagt denselben zweimal fehlerfrei. Besseres Team gewinnt.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Tongue twister: say the same one twice without errors. Best team wins.` },
  { intensity: 3, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Stille Post in 45 Sekunden. Mehr richtige Wörter gewinnt. Verliererteam trinkt 2 Schlucke.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Telephone in 45 seconds. Most correct words wins. Losing team drinks 2 sips.` },
  { intensity: 3, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Schnelles Pantomime: 3 Begriffe erraten. Unentschieden? Alle trinken 1 Schluck.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Speed charades: guess 3 words. Tie? Everyone drinks 1 sip.` },
  { intensity: 4, de: (A,B)=>`Teamduell: ${A} vs. ${B} — In 30 Sekunden mehr Kniebeugen. Verliererteam trinkt 3 Schlucke.`, en: (A,B)=>`Team duel: ${A} vs: ${B} — More squats in 30 seconds. Losing team drinks 3 sips.` },
  { intensity: 4, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Baut aus Dingen um euch ein Herz. Bestes Herz gewinnt.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Build a heart from nearby objects. Best heart wins.` },
  { intensity: 5, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Karaoke‑Linebattle: Jede/r singt eine Zeile. Mehr Applaus gewinnt. Verliererteam trinkt 4 Schlucke.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Karaoke line battle: each sings one line. More applause wins. Losing team drinks 4 sips.` },
  { intensity: 5, de: (A,B)=>`Teamduell: ${A} vs. ${B} — Impro‑Reimduell: Reimt abwechselnd auf ein Wort. Wer stockt, verliert.`, en: (A,B)=>`Team duel: ${A} vs. ${B} — Improv rhyme duel: rhyme on a word in turns. Hesitate and you lose.` },
];

const clampIntensity = (n) => Math.max(1, Math.min(5, Math.round(n || 1)));

const makeTeamCard = (players, language, intensity) => {
  const teams = buildTeams(players);
  if (!teams) return null;
  const [teamA, teamB] = teams;
  const A = formatNames(teamA, language);
  const B = formatNames(teamB, language);
  const target = clampIntensity(intensity);
  const candidates = TEAM_CHALLENGE_TEMPLATES.filter((t) => t.intensity === target);
  const pick = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : TEAM_CHALLENGE_TEMPLATES[0];
  const de = pick.de(A, B);
  const en = pick.en(A, B);
  const rec = target;
  return {
    id: `team-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    pool: { id: 8, key: 'competition', label: { de: 'Wettkampf', en: 'Competition' }, color: '#228B22' },
    content: de,
    content_en: en,
    metadata: { intensity: target, recommendedDrunkLevel: rec, drinkInvolved: true, familiarityFloor: 0.2, tags: ['challenge', 'teams'] },
  };
};

const enrichDuelIfNeeded = (entry, players, language) => {
  try {
    const isChallenge = Array.isArray(entry?.metadata?.tags) && entry.metadata.tags.includes('challenge');
    const isDuelPool = entry?.pool?.key === 'duel' || entry?.pool?.id === 7;
    if (!isChallenge && !isDuelPool) return entry;
    const pair = pickTwoDistinct(players);
    if (!pair) return entry;
    const [p1, p2] = pair;
    const name1 = p1?.name || (language === 'de' ? 'Spieler A' : 'Player A');
    const name2 = p2?.name || (language === 'de' ? 'Spieler B' : 'Player B');
    const prefix = language === 'de' ? `Duell: ${name1} vs. ${name2} — ` : `Duel: ${name1} vs. ${name2} — `;
    const suffix = language === 'de' ? ' (Nur diese beiden treten an.)' : ' (Only these two take part.)';
    const newDe = (prefix + (entry.content || '')).replace(/\.$/, '') + suffix;
    const baseEn = entry.content_en || entry.content || '';
    const newEn = (prefix + baseEn).replace(/\.$/, '') + suffix;
    return { ...entry, content: newDe, content_en: newEn };
  } catch {
    return entry;
  }
};

export const buildTheOneDeck = (prompts, settings, options = {}) => {
  if (!Array.isArray(prompts) || prompts.length === 0) {
    return [];
  }

  const preferences = derivePreferences(settings);
  const rawCurrentSlider = preferences.currentSlider;
  const rawDesiredSlider = preferences.desiredSlider;
  const rawFamiliaritySlider = preferences.familiaritySlider;
  const familiarityPref = preferences.familiarityPref;
  const drinkingPlayers = Array.isArray(options.players)
    ? options.players.filter((player) => player?.drinks)
    : [];
  const playerCount = Array.isArray(options.players) ? options.players.length : 0;
  const RECENT_POOL_WINDOW = 3;
  const usageToleranceSteps = [0, 1, 2];
  const poolUsage = new Map();
  const recentPools = [];

  const getLowestUsage = () => {
    if (poolUsage.size === 0) {
      return 0;
    }
    let min = Infinity;
    poolUsage.forEach((value) => {
      if (value < min) {
        min = value;
      }
    });
    return min === Infinity ? 0 : min;
  };

  const isPoolRecent = (poolId) => {
    if (!poolId) {
      return false;
    }
    return recentPools.includes(poolId);
  };

  const recordPoolSelection = (poolId) => {
    if (!poolId) {
      return;
    }
    const next = (poolUsage.get(poolId) ?? 0) + 1;
    poolUsage.set(poolId, next);
    recentPools.unshift(poolId);
    if (recentPools.length > RECENT_POOL_WINDOW) {
      recentPools.pop();
    }
  };

  const isPoolBalanced = (candidate, tolerance, allowRecent) => {
    const poolId = candidate?.pool?.id ?? null;
    if (!poolId) {
      return true;
    }
    if (!allowRecent && isPoolRecent(poolId)) {
      return false;
    }
    const usage = poolUsage.get(poolId) ?? 0;
    const lowestUsage = getLowestUsage();
    return usage <= lowestUsage + tolerance;
  };

  const popFairCandidate = (list, predicate, allowRecentFallback = true) => {
    if (!Array.isArray(list) || list.length === 0) {
      return null;
    }
    for (const tolerance of usageToleranceSteps) {
      const candidate = popMatching(
        list,
        (entry) => predicate(entry) && isPoolBalanced(entry, tolerance, false),
      );
      if (candidate) {
        return candidate;
      }
      if (allowRecentFallback) {
        const relaxed = popMatching(
          list,
          (entry) => predicate(entry) && isPoolBalanced(entry, tolerance, true),
        );
        if (relaxed) {
          return relaxed;
        }
      }
    }
    return null;
  };

  const currentLevel = preferences.currentLevel;
  const desiredLevel = preferences.desiredLevel;
  const drunkIntent = preferences.diffLevel;

  const buckets = new Map();
  for (let level = 1; level <= 10; level += 1) {
    buckets.set(level, []);
  }

  const overflowPool = [];
  prompts.forEach((prompt) => {
    if (!prompt) {
      return;
    }

    if (prompt?.metadata?.drinkInvolved && drinkingPlayers.length === 0) {
      return;
    }

    const gating = prompt?.metadata?.gating;
    if (gating) {
      if (typeof gating.desiredMin === 'number' && rawDesiredSlider < gating.desiredMin) {
        return;
      }
      if (typeof gating.desiredMax === 'number' && rawDesiredSlider > gating.desiredMax) {
        return;
      }
      if (typeof gating.currentMin === 'number' && rawCurrentSlider < gating.currentMin) {
        return;
      }
      if (typeof gating.currentMax === 'number' && rawCurrentSlider > gating.currentMax) {
        return;
      }
      if (typeof gating.familiarityMin === 'number' && rawFamiliaritySlider < gating.familiarityMin) {
        return;
      }
      if (typeof gating.familiarityMax === 'number' && rawFamiliaritySlider > gating.familiarityMax) {
        return;
      }
      if (typeof gating.requiresPlayers === 'number' && playerCount < gating.requiresPlayers) {
        return;
      }
      if (gating.requireDrinkers && drinkingPlayers.length === 0) {
        return;
      }
      if (typeof gating.rareChance === 'number') {
        const chance = clamp(gating.rareChance, 0, 1);
        if (Math.random() > chance) {
          return;
        }
      }
    }

    const bucketKey = toBucketKey(prompt);
    const bucket = buckets.get(bucketKey);
    if (bucket) {
      bucket.push(prompt);
    } else {
      overflowPool.push(prompt);
    }
  });

  buckets.forEach((bucket) => {
    shuffleArrayFisherYates(bucket);
    bucket.forEach((item) => overflowPool.push(item));
  });
  shuffleArrayFisherYates(overflowPool);

  const deck = [];
  const total = overflowPool.length;

  for (let index = 0; index < total; index += 1) {
    const progress = total > 1 ? index / (total - 1) : 0;
    const blendedLevel = currentLevel + (desiredLevel - currentLevel) * progress;
    const targetLevel = clamp(
      Math.round(drunkIntent * (1 - progress) + blendedLevel * progress),
      1,
      10,
    );
    const effectiveFamiliarity = clamp(familiarityPref + progress * 0.2, 0, 1);
    const desiredBucket = clamp(targetLevel, 1, 10);

    const predicate = (prompt) => {
      const familiarityFloor =
        typeof prompt?.metadata?.familiarityFloor === 'number'
          ? prompt.metadata.familiarityFloor
          : 0;
      return familiarityFloor <= effectiveFamiliarity + 0.15;
    };

    const lastPoolId = deck.length > 0 ? deck[deck.length - 1]?.pool?.id ?? null : null;
    const makeBucketPredicate = (respectLastPool) => (candidate) => {
      if (!predicate(candidate)) {
        return false;
      }
      if (respectLastPool && lastPoolId != null && candidate?.pool?.id === lastPoolId) {
        return false;
      }
      return true;
    };

    let chosenFromBucket = false;
    const tryBucket = (bucketKey) => {
      const bucket = buckets.get(bucketKey);
      if (!bucket) {
        return null;
      }
      let candidate = popFairCandidate(bucket, makeBucketPredicate(true));
      if (!candidate && lastPoolId != null) {
        candidate = popFairCandidate(bucket, makeBucketPredicate(false));
      }
      if (candidate) {
        chosenFromBucket = true;
      }
      return candidate;
    };

    let chosen = tryBucket(desiredBucket);

    if (!chosen) {
      for (let offset = 1; offset < 10 && !chosen; offset += 1) {
        const lower = desiredBucket - offset;
        if (lower >= 1) {
          chosen = tryBucket(lower);
        }
        if (!chosen) {
          const higher = desiredBucket + offset;
          if (higher <= 10) {
            chosen = tryBucket(higher);
          }
        }
      }
    }

    if (!chosen) {
      chosen = popFairCandidate(overflowPool, makeBucketPredicate(true));
      if (!chosen) {
        chosen = popFairCandidate(overflowPool, makeBucketPredicate(false));
      }
    } else if (chosenFromBucket) {
      const overflowIndex = overflowPool.indexOf(chosen);
      if (overflowIndex !== -1) {
        overflowPool.splice(overflowIndex, 1);
      }
    }

    if (!chosen) {
      break;
    }

    deck.push(chosen);
    recordPoolSelection(chosen?.pool?.id ?? null);
  }

  // Enrich challenge/duel prompts with player names
  const language = options?.language || 'de';
  const enriched = deck.map((e) => enrichDuelIfNeeded(e, options.players || [], language));
  // Interleave dynamic team cards guided by slider intensity
  const result = [];
  const interval = 8;
  for (let i = 0; i < enriched.length; i++) {
    result.push(enriched[i]);
    if ((i + 1) % interval === 0) {
      const progress = enriched.length > 1 ? (i + 1) / (enriched.length - 1) : 0;
      const blendedLevel = currentLevel + (desiredLevel - currentLevel) * progress;
      const targetLevel = clamp(
        Math.round(drunkIntent * (1 - progress) + blendedLevel * progress),
        1,
        10,
      );
      const teamIntensity = clamp(Math.round(targetLevel / 2), 1, 5);
      const teamCard = makeTeamCard(options.players || [], language, teamIntensity);
      if (teamCard) result.push(teamCard);
    }
  }
  return result;
};
