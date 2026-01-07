const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/ffa-best.json');

// Alle gegen alle – Beste Person
// Alle gegen alle – Beste Person Prompts

const ffaBestPool = buildPoolFromDataset(poolMeta.ffaBest, dataset);

module.exports = { ffaBestPool };
