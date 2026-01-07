const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/pantomime-solo.json');

// Pantomime Solo
// Pantomime Solo Prompts

const pantomimeSoloPool = buildPoolFromDataset(poolMeta.pantomimeSolo, dataset);

module.exports = { pantomimeSoloPool };
