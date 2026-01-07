const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/buttern.json');

// Buttern
// Buttern: Begriffe in unterschiedlichen Schwierigkeitsgraden runterrattern.

const butternPool = buildPoolFromDataset(poolMeta.buttern, dataset);

module.exports = { butternPool };
