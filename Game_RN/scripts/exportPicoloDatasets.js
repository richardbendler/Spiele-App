const fs = require("fs");
const path = require("path");
const { rawTheOnePrompts } = require("../src/data/picoloTexts");
const { poolMeta } = require("../src/data/picoloTexts/poolMeta");

const outputDir = path.join(__dirname, "../src/data/picoloTexts/datasets");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const descriptions = {
  truth: "Wahrheit: ehrliche Fragen zwischen wholesome und spicy.",
  dare: "Pflicht: kleine und große Aufgaben für Mutige.",
  neverHaveIEver: "Ich hab noch nie: Geständnisse aus allen Lebenslagen.",
  category: "Kategorie: Reihum Begriffe nennen bis jemand hängenbleibt.",
  rhyme: "Reimen: Schlagfertige Wortketten für schnelle Zungen.",
  duel: "Wettkampf 1v1: Direktes Battle zwischen zwei Personen.",
  competition: "Wettkampf: Gruppen-Challenges für alle gleichzeitig.",
  rule: "Regel: Hausregeln und neue Mechaniken für die Runde.",
  truthOrDareCombo: "Truth or Dare Buttons mit individuellem Reveal.",
  ffaBest: "Alle gegen alle – Beste Person: Wer liefert am meisten?",
  ffaGiveUp: "Alle gegen alle – Wer gibt zuerst auf?",
  voteMinority: "Abstimmung: Die Minderheit trinkt oder verteilt.",
  everyoneDrink: "Alle die … : schnelles Aussieben mit Schlückchen.",
  bestDistributor: "Beste verteilt: Wer gewinnt, darf Drinks verteilen.",
  worstDrinker: "Schlechteste trinkt: Kleine Fail-Challenges.",
  mostLikely: "Wer würde … ? Abstimmungen mit Augenzwinkern.",
  buttern: "Buttern: Begriffe in unterschiedlichen Schwierigkeitsgraden runterrattern.",
  directChallenge: "Direkte Herausforderung: Eine Person bekommt eine Aufgabe.",
  silentTask: "Nicht vorlesen: Geheimaufträge für die Moderation.",
  misc: "Sonstiges: Freestyle-Aufgaben und Fun-Prompts.",
  chug: "Ex dein Glas: Shots und große Schlucke in kurzer Zeit.",
  targetedDrink: "Person trinkt x: zielgerichtete Drink-Verteilung.",
  shotCard: "Shot Karte: Mini-Spiele rund um kurze Getränke.",
  neighborAction: "Links/Rechts: Aktionen mit direkten Nachbar*innen.",
  wordContinuation: "Wort-Fortsetzung: Geschichten oder Begriffe weitergeben.",
  timerCountdown: "Timer Countdown: Aufgaben gegen die Uhr.",
  timerCounter: "Timer Zähler: Hochzählen, bis jemand versagt.",
  teamBattle: "Team Battle: Zwei Lager, ein Sieg.",
  pantomimeTeams: "Pantomime Teams: Begriffe ohne Worte darstellen.",
  pantomimeSolo: "Pantomime Solo: Eine Person spielt alles.",
  quiz: "Quiz: Fixe Fragen mit richtigen Antworten.",
  estimation: "Schätzen: Wer kommt einer Zahl am nächsten?",
  fakeNews: "Fake News: Fakten vs. Phantasie erraten.",
  virus: "Virus: Langzeitregeln, die im Spiel bleiben.",
  explain: "Erklären: Dinge beschreiben, nachmachen, deuten.",
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const poolsByName = Object.values(poolMeta).reduce((acc, meta) => {
  acc[meta.name] = meta;
  return acc;
}, {});

const grouped = {};
for (const prompt of rawTheOnePrompts) {
  const key = prompt.pool_name;
  if (!grouped[key]) {
    grouped[key] = [];
  }
  grouped[key].push(prompt);
}

Object.entries(grouped).forEach(([poolName, entries]) => {
  const meta = poolsByName[poolName];
  if (!meta) {
    console.warn(`No meta for pool ${poolName}`);
    return;
  }
  const items = entries.map((entry) => {
    const drunk = clamp(Math.round((entry.drunk_level || entry.exposure_level || 1) * 2), 1, 10);
    const familiarity = typeof entry.familiarity_floor === "number" ? clamp(Math.round(entry.familiarity_floor * 10), 1, 10) : undefined;
    const item = {
      de: entry.content,
      en: entry.content_en || entry.content,
      drunkLevel: drunk,
    };
    if (familiarity) {
      item.deepness = familiarity;
    }
    if (entry.bool_drink) {
      item.drink = true;
    }
    if (entry.custom_tags && entry.custom_tags.length) {
      item.tags = entry.custom_tags;
    }
    if (entry.custom_payload) {
      item.payload = entry.custom_payload;
    }
    if (entry.gating) {
      item.gating = entry.gating;
    }
    return item;
  });
  const dataset = {
    _meta: {
      description: descriptions[meta.key] || `${meta.name} Prompts`,
    },
    poolKey: meta.key,
    items,
  };
  const targetPath = path.join(outputDir, `${meta.key}.json`);
  fs.writeFileSync(targetPath, JSON.stringify(dataset, null, 2), "utf8");
});

console.log("Datasets exported to", outputDir);
