const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/pantomime-teams.json');

// Pantomime Teams
// Pantomime Teams Prompts

const pantomimeTeamsPool = buildPoolFromDataset(poolMeta.pantomimeTeams, dataset);

module.exports = { pantomimeTeamsPool };
