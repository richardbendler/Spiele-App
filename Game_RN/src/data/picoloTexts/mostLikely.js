const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/most-likely.json');

// Wer würde…
// Wer würde… Prompts

const mostLikelyPool = buildPoolFromDataset(poolMeta.mostLikely, dataset);

module.exports = { mostLikelyPool };
