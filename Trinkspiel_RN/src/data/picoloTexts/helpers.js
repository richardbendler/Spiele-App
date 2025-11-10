// Shared helpers for building Picolo style prompt payloads.
// Keep prompts declarative so they stay easy to review and extend.

const createPrompts = (groups) => {
  if (!Array.isArray(groups)) {
    return [];
  }
  return groups.flatMap((group) => {
    const {
      texts = [],
      exposure = 1,
      drunk = exposure,
      familiarity = null,
      drink = false,
      extras = {},
    } = group || {};

    return texts
      .map((entry) => (typeof entry === 'string' ? { content: entry } : entry))
      .filter((entry) => typeof entry?.content === 'string' && entry.content.trim().length > 0)
      .map((entry) => ({
        content: entry.content,
        content_en: entry.content_en,
        exposure,
        drunk_level: typeof entry.drunk_level === 'number' ? entry.drunk_level : drunk,
        familiarityFloor:
          typeof entry.familiarityFloor === 'number'
            ? entry.familiarityFloor
            : typeof familiarity === 'number'
              ? familiarity
              : undefined,
        bool_drink: typeof entry.bool_drink === 'number' ? entry.bool_drink : drink ? 1 : 0,
        ...extras,
        ...(entry.extras || {}),
      }));
  });
};

const tagPrompt = (prompt, overrides = {}) => ({
  ...prompt,
  ...overrides,
});

module.exports = { createPrompts, tagPrompt };