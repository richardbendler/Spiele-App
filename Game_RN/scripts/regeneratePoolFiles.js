const fs = require("fs");
const path = require("path");
const { poolMeta } = require("../src/data/picoloTexts/poolMeta");

const buildFileContent = (key, dataset, meta) => {
  const description = (dataset._meta && dataset._meta.description) || `${meta.name} Prompts`;
  return `const { poolMeta } = require('./poolMeta');\nconst { buildPoolFromDataset } = require('./datasetBuilder');\nconst dataset = require('./datasets/${meta.key}.json');\n\n// ${meta.name}\n// ${description}\n\nconst ${key}Pool = buildPoolFromDataset(poolMeta.${key}, dataset);\n\nmodule.exports = { ${key}Pool };\n`;
};

Object.entries(poolMeta).forEach(([key, meta]) => {
  const datasetPath = path.join(__dirname, `../src/data/picoloTexts/datasets/${meta.key}.json`);
  if (!fs.existsSync(datasetPath)) {
    console.warn('Missing dataset for', key, meta.key);
    return;
  }
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  const targetPath = path.join(__dirname, `../src/data/picoloTexts/${key}.js`);
  const content = buildFileContent(key, dataset, meta);
  fs.writeFileSync(targetPath, content, 'utf8');
});

console.log('Pool files regenerated.');
