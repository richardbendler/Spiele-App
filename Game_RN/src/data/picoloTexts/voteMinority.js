const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/vote-minority.json');

// Abstimmung
// Abstimmung Prompts

const voteMinorityPool = buildPoolFromDataset(poolMeta.voteMinority, dataset);

module.exports = { voteMinorityPool };
