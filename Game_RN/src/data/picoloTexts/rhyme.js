const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/rhyme.json');

// Reimen
// Reimen: Schlagfertige Wortketten für schnelle Zungen.

const rhymePool = buildPoolFromDataset(poolMeta.rhyme, dataset);

module.exports = { rhymePool };
