const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/rule.json');

// Regel
// Regel: Hausregeln und neue Mechaniken für die Runde.

const rulePool = buildPoolFromDataset(poolMeta.rule, dataset);

module.exports = { rulePool };
