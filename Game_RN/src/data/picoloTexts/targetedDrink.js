const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/targeted-drink.json');

// Person trinkt x
// Person trinkt x Prompts

const targetedDrinkPool = buildPoolFromDataset(poolMeta.targetedDrink, dataset);

module.exports = { targetedDrinkPool };
