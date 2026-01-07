const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/misc.json');

// Sonstiges
// Sonstiges: Freestyle-Aufgaben und Fun-Prompts.

const miscPool = buildPoolFromDataset(poolMeta.misc, dataset);

module.exports = { miscPool };
