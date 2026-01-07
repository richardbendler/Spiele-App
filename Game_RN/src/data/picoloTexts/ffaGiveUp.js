const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/ffa-giveup.json');

// Alle gegen alle – Gibt auf
// Alle gegen alle – Gibt auf Prompts

const ffaGiveUpPool = buildPoolFromDataset(poolMeta.ffaGiveUp, dataset);

module.exports = { ffaGiveUpPool };
