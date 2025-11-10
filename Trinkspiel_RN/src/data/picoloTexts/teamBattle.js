const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/team-battle.json');

// Wettkampf Teams
// Wettkampf Teams Prompts

const teamBattlePool = buildPoolFromDataset(poolMeta.teamBattle, dataset);

module.exports = { teamBattlePool };
