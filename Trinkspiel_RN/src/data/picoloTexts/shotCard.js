const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/shot-card.json');

// Shot Karte
// Shot Karte Prompts

const shotCardPool = buildPoolFromDataset(poolMeta.shotCard, dataset);

module.exports = { shotCardPool };
