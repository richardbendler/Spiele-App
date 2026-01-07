const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/everyone-drink.json');

// Alle die …
// Alle die … Prompts

const everyoneDrinkPool = buildPoolFromDataset(poolMeta.everyoneDrink, dataset);

module.exports = { everyoneDrinkPool };
