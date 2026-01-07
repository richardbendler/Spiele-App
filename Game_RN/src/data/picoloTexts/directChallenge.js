const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/direct-challenge.json');

// Herausforderung
// Herausforderung Prompts

const directChallengePool = buildPoolFromDataset(poolMeta.directChallenge, dataset);

module.exports = { directChallengePool };
