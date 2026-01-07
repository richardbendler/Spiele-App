const { poolMeta } = require('./poolMeta');
const { buildPoolFromDataset } = require('./datasetBuilder');
const dataset = require('./datasets/quiz.json');

// Quiz
// Quiz: Fixe Fragen mit richtigen Antworten.

const quizPool = buildPoolFromDataset(poolMeta.quiz, dataset);

module.exports = { quizPool };
