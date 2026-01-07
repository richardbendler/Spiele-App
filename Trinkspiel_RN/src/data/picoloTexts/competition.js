const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/competition.json');

// Wettkampf
// Wettkampf: Gruppen-Challenges für alle gleichzeitig.

const competitionPool = buildPoolFromDataset(poolMeta.competition, dataset);

module.exports = { competitionPool };
