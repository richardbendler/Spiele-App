const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/timer-counter.json');

// Timer Zähler
// Timer Zähler Prompts

const timerCounterPool = buildPoolFromDataset(poolMeta.timerCounter, dataset);

module.exports = { timerCounterPool };
