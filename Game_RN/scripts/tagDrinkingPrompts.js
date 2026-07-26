const fs = require('fs');
const path = require('path');

const datasetDir = path.join(__dirname, '../src/data/picoloTexts/datasets');
const files = fs.readdirSync(datasetDir).filter((file) => file.endsWith('.json'));

const keywordPatterns = [
  /\btrink/i,
  /\bschluck/i,
  /shot/i,
  /sip/i,
  /exe/i,
  /prosit/i,
  /prost/i,
  /glas/i,
  /drink/i,
  /chug/i,
];

const hasDrinkTag = (item) => {
  if (!item || typeof item !== 'object') {
    return false;
  }
  if (item.drinking === true) {
    return true;
  }
  if (item.drink === true) {
    return true;
  }
  if (Array.isArray(item.tags) && item.tags.some((tag) => /drink|shot|heavy/.test(tag))) {
    return true;
  }
  if (item.payload) {
    if (item.payload.drinkScaling || item.payload.forceDrink) {
      return true;
    }
    const tpl = item.payload.template;
    if (tpl && (keywordPatterns.some((pattern) => pattern.test(tpl.de || '')) || keywordPatterns.some((pattern) => pattern.test(tpl.en || '')))) {
      return true;
    }
    if (item.payload.type === 'targetedAction' && item.payload.target && item.payload.target.requireDrinker) {
      return true;
    }
  }
  const texts = [item.de, item.en, item.content].filter(Boolean).join(' ');
  if (keywordPatterns.some((pattern) => pattern.test(texts))) {
    return true;
  }
  return false;
};

let updatedFiles = 0;
for (const file of files) {
  const fullPath = path.join(datasetDir, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse', file, error);
    continue;
  }
  if (!Array.isArray(data.items)) {
    continue;
  }
  let changed = false;
  data.items = data.items.map((item) => {
    const drinking = Boolean(hasDrinkTag(item));
    if (item.drinking !== drinking) {
      changed = true;
    }
    return { ...item, drinking };
  });
  if (changed) {
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    updatedFiles += 1;
  }
}

console.log(`Updated drinking flags in ${updatedFiles} dataset files.`);
