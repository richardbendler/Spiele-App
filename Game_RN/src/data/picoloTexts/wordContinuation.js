const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/word-chain.json');

// Wort-Fortsetzung
// Wort-Fortsetzung Prompts

const wordContinuationPool = buildPoolFromDataset(poolMeta.wordContinuation, dataset);

module.exports = { wordContinuationPool };
