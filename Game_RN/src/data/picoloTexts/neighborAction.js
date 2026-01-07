const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/neighbor-action.json');

// Links/Rechts
// Links/Rechts Prompts

const neighborActionPool = buildPoolFromDataset(poolMeta.neighborAction, dataset);

module.exports = { neighborActionPool };
