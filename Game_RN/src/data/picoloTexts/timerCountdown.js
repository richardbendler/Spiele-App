const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/timer-countdown.json');

// Timer Countdown
// Timer Countdown Prompts

const timerCountdownPool = buildPoolFromDataset(poolMeta.timerCountdown, dataset);

module.exports = { timerCountdownPool };
