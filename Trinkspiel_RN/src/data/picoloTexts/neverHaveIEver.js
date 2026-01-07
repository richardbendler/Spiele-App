const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/never-have-i-ever.json');

// Ich hab noch nie
// Ich hab noch nie Prompts

const neverHaveIEverPool = buildPoolFromDataset(poolMeta.neverHaveIEver, dataset);

module.exports = { neverHaveIEverPool };
