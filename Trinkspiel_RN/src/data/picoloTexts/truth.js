const { poolMeta } = require('./poolMeta');
const { createPrompts } = require('./helpers');

// Wahrheitspool: 5 Intensitätsstufen, jeweils 10 Fragen.
const truthPromptGroups = createPrompts([
  {
    exposure: 1,
    drunk: 1,
    familiarity: 0.1,
    texts: [
      'Erzähl von einem Ritual, das dir sofort gute Laune macht.',
      'Welche Kleinigkeit rettet dir jeden Morgen?',
      'Was ist dein Lieblings-Insiderwitz mit dieser Runde?',
      'Welches Lied kannst du im Schlaf mitsingen?',
      'Welche Angewohnheit von dir ist eigentlich ziemlich wholesome?',
      'Welchen Snack bringst du immer zu Spieleabenden mit?',
      'Was ist dein aktuelles Comfort-Game oder Film?',
      'Welche App öffnest du nach dem Aufwachen als erstes?',
      'Welche Person würdest du sofort zu einem spontanen Ausflug einladen?',
      'Welches Geräusch erinnert dich sofort an zuhause?',
    ],
  },
  {
    exposure: 2,
    drunk: 2,
    familiarity: 0.25,
    texts: [
      'Welcher Moment hat dich zuletzt positiv überrascht?',
      'Welche frühere Entscheidung würdest du heute anders treffen?',
      'Welche Eigenschaft an dir ist unterschätzt?',
      'Was würdest du deinem 16-jährigen Ich gern erzählen?',
      'Mit wem möchtest du dringend mal Kaffee trinken und warum?',
      'Welche Sprache würdest du sofort lernen wollen?',
      'Welche Challenge hast du dieses Jahr noch auf der Liste?',
      'Was war dein letzter kleiner Mutmoment?',
      'Welche Wahrheit sagst du selten laut aus?',
      'Worin bist du heimlich ein Nerd?',
    ],
  },
  {
    exposure: 3,
    drunk: 3,
    familiarity: 0.45,
    texts: [
      'Was war deine chaotischste Reise-Story?',
      'Welche Freundschaft hast du unterschätzt, bis sie plötzlich wichtig wurde?',
      'Welche Erinnerung lässt dich gleichzeitig lachen und cringen?',
      'Welchen Crush erwähnst du normalerweise nicht?',
      'Wann hast du zuletzt eine Grenze für dich gesetzt?',
      'Welches Risiko hat sich trotz Bauchweh gelohnt?',
      'Was würdest du gern öfter über deine Familie erzählen?',
      'Welcher Konflikt spukt dir noch im Kopf herum?',
      'Was ist dein unpopulärster Life-Hack?',
      'Welche Nachricht würdest du gerade gerne erhalten?',
    ],
  },
  {
    exposure: 4,
    drunk: 4,
    familiarity: 0.65,
    texts: [
      'Welche Frage hast du deiner letzten Affäre nie gestellt, obwohl du es wolltest?',
      'Was ist dein dramatischster Screenshot auf dem Handy?',
      'Welche Gewohnheit versteckst du vor Dates?',
      'Wann hast du zuletzt jemanden geghostet und warum?',
      'Welche Wahrheit über Liebe fällt dir schwer laut zu sagen?',
      'Was ist dir mal im Bett absurd Peinliches passiert?',
      'Mit wem hattest du das chaotischste On-Off?',
      'Welches Geheimnis hast du für eine Freundin aufbewahrt?',
      'Was war dein wildester Spontankauf nach Mitternacht?',
      'Welche Grenze würdest du nie wieder für jemanden überschreiten?',
    ],
  },
  {
    exposure: 5,
    drunk: 5,
    familiarity: 0.8,
    texts: [
      'Welche Person im Raum hat dir schon mal eindeutig heiße Vibes gegeben?',
      'Was ist deine krasseste Fantasie, die du noch niemandem erzählt hast?',
      'Mit wem hättest du gern eine unverbindliche Sommeraffäre?',
      'Welche Nachricht in deinen DMs dürfte niemand sehen?',
      'Was war deine intensivste Friends-with-benefits-Regel?',
      'Wessen Blick macht dich hier sofort schwach?',
      'Welche Tabuzone würdest du gern heute brechen?',
      'Welche Person hast du zuletzt bewusst verführt?',
      'Welches Date-Experiment würdest du sofort starten, wenn niemand urteilt?',
      'Was ist dein wildester Kink, den du ausprobieren möchtest?',
    ],
  },
]);

const truthPool = {
  pool: poolMeta.truth,
  prompts: truthPromptGroups,
};

module.exports = { truthPool };