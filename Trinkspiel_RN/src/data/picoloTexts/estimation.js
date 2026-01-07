const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/estimation.json');

// Schätzen
// Schätzen: Wer kommt einer Zahl am nächsten?

const estimationPool = buildPoolFromDataset(poolMeta.estimation, dataset);

module.exports = { estimationPool };
