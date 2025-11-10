const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const toExposure = (drunkLevel) => {
  const normalized = typeof drunkLevel === 'number' ? drunkLevel : 5;
  return clamp(Math.round(normalized / 2), 1, 5);
};

const toFamiliarity = (deepness) => {
  if (typeof deepness !== 'number') {
    return undefined;
  }
  return clamp(deepness / 10, 0, 1);
};

const mapItemToPrompt = (item = {}) => {
  const content = normalizeText(item.de);
  if (!content) {
    return null;
  }

  const english = normalizeText(item.en);
  const drunkLevel = clamp(Math.round(typeof item.drunkLevel === 'number' ? item.drunkLevel : 5), 1, 10);
  const deepness = typeof item.deepness === 'number' ? item.deepness : undefined;

  const drinkingFlag =
    typeof item.drinking === 'boolean' ? item.drinking : Boolean(item.drink);

  const prompt = {
    content,
    content_en: english || content,
    exposure: toExposure(item.intensity ?? drunkLevel),
    drunk_level: drunkLevel,
    familiarityFloor: toFamiliarity(deepness),
    bool_drink: drinkingFlag ? 1 : 0,
  };

  if (Array.isArray(item.tags) && item.tags.length > 0) {
    prompt.custom_tags = item.tags;
  }

  if (item.payload && typeof item.payload === 'object') {
    prompt.custom_payload = item.payload;
  } else if (item.customPayload && typeof item.customPayload === 'object') {
    prompt.custom_payload = item.customPayload;
  }

  if (item.gating && typeof item.gating === 'object') {
    prompt.gating = item.gating;
  }

  if (typeof item.author === 'string') {
    prompt.author = item.author;
  }

  if (typeof item.drinkIcon === 'string') {
    prompt.custom_payload = {
      ...(prompt.custom_payload || {}),
      drinkIcon: item.drinkIcon,
    };
  }

  return prompt;
};

const buildPoolFromDataset = (pool, dataset = {}) => {
  const items = Array.isArray(dataset.items) ? dataset.items : [];
  const prompts = items
    .map((item) => mapItemToPrompt(item))
    .filter((entry) => entry !== null);

  return {
    pool: {
      ...pool,
      description: dataset?._meta?.description,
    },
    prompts,
  };
};

module.exports = { buildPoolFromDataset };
