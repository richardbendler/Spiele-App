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

  return deck;
};

