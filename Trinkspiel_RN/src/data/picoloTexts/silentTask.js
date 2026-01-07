const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/silent-task.json');

// Nicht vorlesen
// Nicht vorlesen Prompts

const silentTaskPool = buildPoolFromDataset(poolMeta.silentTask, dataset);

module.exports = { silentTaskPool };
