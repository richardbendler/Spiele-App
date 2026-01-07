const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/worst-drinker.json');

// Schlechteste trinkt
// Schlechteste trinkt Prompts

const worstDrinkerPool = buildPoolFromDataset(poolMeta.worstDrinker, dataset);

module.exports = { worstDrinkerPool };
