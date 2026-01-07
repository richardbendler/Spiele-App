const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/category.json');

// Kategorie
// Kategorie: Reihum Begriffe nennen bis jemand hängenbleibt.

const categoryPool = buildPoolFromDataset(poolMeta.category, dataset);

module.exports = { categoryPool };
