const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/best-distributor.json');

// Beste verteilt
// Beste verteilt Prompts

const bestDistributorPool = buildPoolFromDataset(poolMeta.bestDistributor, dataset);

module.exports = { bestDistributorPool };
