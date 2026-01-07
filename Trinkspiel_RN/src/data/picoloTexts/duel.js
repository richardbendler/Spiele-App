const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/duel.json');

// Wettkampf 1v1
// Wettkampf 1v1: Direktes Battle zwischen zwei Personen.

const duelPool = buildPoolFromDataset(poolMeta.duel, dataset);

module.exports = { duelPool };
