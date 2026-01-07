const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/fake-news.json');

// Fake News
// Fake News Prompts

const fakeNewsPool = buildPoolFromDataset(poolMeta.fakeNews, dataset);

module.exports = { fakeNewsPool };
