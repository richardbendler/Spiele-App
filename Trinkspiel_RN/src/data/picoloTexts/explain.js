const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/explain.json');

// Erklären
// Erklären: Dinge beschreiben, nachmachen, deuten.

const explainPool = buildPoolFromDataset(poolMeta.explain, dataset);

module.exports = { explainPool };
