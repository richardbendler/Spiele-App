const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/truth-dare-combo.json');

// Wahrheit oder Pflicht
// Wahrheit oder Pflicht Prompts

const truthOrDareComboPool = buildPoolFromDataset(poolMeta.truthOrDareCombo, dataset);

module.exports = { truthOrDareComboPool };
