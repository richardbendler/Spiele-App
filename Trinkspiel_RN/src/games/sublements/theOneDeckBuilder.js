import { shuffleArrayFisherYates } from './AdjustParamShape.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const normaliseSlider = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return clamp(value / 9, 0, 1);
};

const intensityFromSlider = (normalised) => 1 + normalised * 4;

const toBucketKey = (prompt) => {
  const intensity = typeof prompt?.metadata?.intensity === 'number' ? prompt.metadata.intensity : 0;
  const recommended =
    typeof prompt?.metadata?.recommendedDrunkLevel === 'number'
      ? prompt.metadata.recommendedDrunkLevel
      : intensity;
  const combined = Math.max(intensity, recommended);
  return clamp(Math.round(combined) || 1, 1, 5);
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

const popFromOverflow = (overflowPool, predicate, fallbackPredicate) => {
  if (!Array.isArray(overflowPool) || overflowPool.length === 0) {
    return null;
  }
  const candidate = popMatching(overflowPool, predicate);
  if (candidate) {
    return candidate;
  }
  if (typeof fallbackPredicate === 'function') {
    const fallbackCandidate = popMatching(overflowPool, fallbackPredicate);
    if (fallbackCandidate) {
      return fallbackCandidate;
    }
  }
  return overflowPool.pop() ?? null;
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

  const current = normaliseSlider(settings?.currentDrunkenness ?? 4);
  const desired = normaliseSlider(settings?.desiredDrunkenness ?? 6);
  const familiarity = normaliseSlider(settings?.familiarity ?? 5);
  const drinkingPlayers = Array.isArray(options.players)
    ? options.players.filter((player) => player?.drinks)
    : [];

  const startIntensity = clamp(Math.round(intensityFromSlider(current)), 1, 5);
  const maxTarget = clamp(Math.round(intensityFromSlider(Math.max(current, desired))), 1, 5);
  const familiarityCap = clamp(intensityFromSlider(familiarity) + 0.5, 1, 5);
  const curveExponent = clamp(1.6 - desired * 0.8, 0.45, 1.8);

  const buckets = new Map();
  for (let key = 1; key <= 5; key += 1) {
    buckets.set(key, []);
  }

  const overflowPool = [];
  prompts.forEach((prompt) => {
    if (!prompt) {
      return;
    }

    if (prompt?.metadata?.drinkInvolved && drinkingPlayers.length === 0) {
      return;
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
    const effectiveFamiliarity = clamp(familiarity + progress * 0.5, 0, 1);
    const rawIntensity =
      startIntensity + (maxTarget - startIntensity) * Math.pow(progress, curveExponent);
    const cappedIntensity = Math.min(rawIntensity, familiarityCap + progress * 0.5);
    const desiredBucket = clamp(Math.round(cappedIntensity) || startIntensity, 1, 5);

    const predicate = (prompt) => {
      const familiarityFloor =
        typeof prompt?.metadata?.familiarityFloor === 'number'
          ? prompt.metadata.familiarityFloor
          : 0;
      return familiarityFloor <= effectiveFamiliarity + 0.15;
    };

    const lastPoolId = deck.length > 0 ? deck[deck.length - 1]?.pool?.id ?? null : null;
    const preferDifferentPool =
      lastPoolId == null
        ? predicate
        : (candidate) => predicate(candidate) && candidate?.pool?.id !== lastPoolId;

    const tryBucket = (bucketKey) => {
      const bucket = buckets.get(bucketKey);
      if (!bucket) {
        return null;
      }
      let candidate = popMatching(bucket, preferDifferentPool);
      if (!candidate && lastPoolId != null) {
        candidate = popMatching(bucket, predicate);
      }
      return candidate;
    };

    let chosen = tryBucket(desiredBucket);

    if (!chosen) {
      for (let offset = 1; offset < 5 && !chosen; offset += 1) {
        const lower = desiredBucket - offset;
        if (lower >= 1) {
          chosen = tryBucket(lower);
        }
        if (!chosen) {
          const higher = desiredBucket + offset;
          if (higher <= 5) {
            chosen = tryBucket(higher);
          }
        }
      }
    }

    if (!chosen) {
      chosen = popFromOverflow(overflowPool, preferDifferentPool, predicate);
    } else {
      const overflowIndex = overflowPool.indexOf(chosen);
      if (overflowIndex !== -1) {
        overflowPool.splice(overflowIndex, 1);
      }
    }

    if (!chosen) {
      break;
    }

    deck.push(chosen);
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
      const current = normaliseSlider(settings?.currentDrunkenness ?? 4);
      const desired = normaliseSlider(settings?.desiredDrunkenness ?? 6);
      const startIntensity = clamp(Math.round(intensityFromSlider(current)), 1, 5);
      const maxTarget = clamp(Math.round(intensityFromSlider(Math.max(current, desired))), 1, 5);
      const curveExponent = clamp(1.6 - desired * 0.8, 0.45, 1.8);
      const rawIntensity = startIntensity + (maxTarget - startIntensity) * Math.pow(progress, curveExponent);
      const teamCard = makeTeamCard(options.players || [], language, rawIntensity);
      if (teamCard) result.push(teamCard);
    }
  }
  return result;
};

