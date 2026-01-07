const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/chug.json');

// Ex dein Glas
// Ex dein Glas: Shots und große Schlucke in kurzer Zeit.

const chugPool = buildPoolFromDataset(poolMeta.chug, dataset);

module.exports = { chugPool };
