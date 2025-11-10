const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/virus.json');

// Virus
// Virus: Langzeitregeln, die im Spiel bleiben.

const virusPool = buildPoolFromDataset(poolMeta.virus, dataset);

module.exports = { virusPool };
