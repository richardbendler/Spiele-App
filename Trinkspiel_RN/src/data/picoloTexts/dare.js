const { poolMeta } = require('./poolMeta');
const { createPrompts } = require('./helpers');

const darePromptGroups = createPrompts([
  {
    exposure: 1,
    drunk: 1,
    familiarity: 0.15,
    texts: [
      'Sprich für eine Runde nur in Fragen.',
      'Mach dein bestes Tiergeräusch und halte dabei Augenkontakt zu jemandem.',
      'Tausche für fünf Minuten ein Accessoire mit der Person links von dir.',
      'Zeig deinen aktuellen Lieblings-Tanzmove.',
      'Erfinde einen neuen Spitznamen für dich und stell dich damit vor.',
      'Halte eine dramatische Oscar-Dankesrede für etwas komplett Banales.',
      'Summ ein Lied bis es jemand errät.',
      'Schreibe mit dem Finger ein Wort in die Luft – wer es erkennt, bekommt einen High-Five.',
      'Sprich 30 Sekunden lang wie ein Podcast-Host.',
      'Mach ein Selfie mit deinem lustigsten Filter und zeig es der Runde.',
    ],
  },
  {
    exposure: 2,
    drunk: 2,
    familiarity: 0.3,
    texts: [
      { content: 'Mische einen improvisierten Drink aus zwei vorhandenen Zutaten und koste ihn.', bool_drink: 1 },
      'Lies die dritte Nachricht in deinem Handy laut vor (Namen dürfen geschwärzt werden).',
      'Mach zehn Kniebeugen, während du ein Lied rapst.',
      'Tausche den Platz mit jemandem und imitiere sie oder ihn für eine Runde.',
      'Lass dir von der Person rechts ein neues Emoji auf die Hand malen.',
      'Erfinde einen Werbespot für den Drink der Runde.',
      'Iss eine ungewöhnliche Snack-Kombi, die die Runde auswählt.',
      'Schick einer Person ein Sprachnotiz mit „Ich hab gerade die beste Idee ever“ – ohne Kontext.',
      'Zieh ein Kleidungsstück verkehrt herum an, bis du wieder dran bist.',
      'Stell den Lieblingsfilm der Runde in 20 Sekunden pantomimisch dar.',
    ],
  },
  {
    exposure: 3,
    drunk: 3,
    familiarity: 0.5,
    texts: [
      'Lass die Gruppe entscheiden, zu welchem Song du 30 Sekunden lang Lipsyncst.',
      'Poste eine Story nur mit Emojis und zeig den Beweis.',
      'Scroll zufällig durch deine Chats und lies den ersten alten Satz laut vor (nur deinen Teil).',
      'Mach einer Person im Raum ein ehrlich flirtiges Kompliment.',
      { content: 'Trink zwei Schlucke ohne deine Hände zu benutzen.', bool_drink: 1 },
      'Lauf den Raum als improvisierte Fashion-Show entlang.',
      'Ruf jemanden an und frag nach seinem besten Party-Tipp.',
      'Imitiere das Lieblingstier der Gruppe inklusive Laufstil.',
      'Lass dir von zwei Leuten gleichzeitig ein Selfie posieren.',
      { content: 'Erfinde einen neuen Toast und lass alle anstoßen.', bool_drink: 1 },
    ],
  },
  {
    exposure: 4,
    drunk: 4,
    familiarity: 0.7,
    texts: [
      'Tausche für drei Runden dein Oberteil (über etwas drüberziehen) mit einer Person deiner Wahl.',
      'Lies deine letzten drei gesendeten Emojis laut vor und erklär sie.',
      'Nimm einen Eiswürfel in den Mund und gib ihn via Löffel an jemanden weiter.',
      'Lass dir einen Satz auf den Arm schreiben, den du 30 Minuten trägst.',
      'Stell eine Filmszene nach, in der leidenschaftlich geküsst wird – ohne echten Kuss.',
      { content: 'Trink drei Schlucke, während die Runde versucht dich zum Lachen zu bringen.', bool_drink: 1 },
      'Setz dich auf den Schoß einer Person und erzähl ihr ein Geheimnis.',
      'Führe einen verführerischen Tanz für jemanden deiner Wahl auf.',
      'Schreib einer Person aus deiner Kontaktliste „Ich träume noch von gestern“. Foto als Beweis.',
      'Lass die Runde eine Notiz in deine Bio diktieren und lass sie zehn Minuten online.',
    ],
  },
  {
    exposure: 5,
    drunk: 5,
    familiarity: 0.85,
    texts: [
      'Tausche mit jemandem ein Kleidungsstück deiner Wahl – egal welches.',
      { content: 'Lass dir einen Shot mixen und kipp ihn sofort.', bool_drink: 1 },
      'Schick deinem letzten Date eine Sprachnachricht mit „Wir sollten das wiederholen“. Screenshot!',
      'Lass dir einen Flirttext diktieren und sende ihn sofort.',
      'Setz dich zwischen zwei Leute und beschreibe deinen Lieblingskuss.',
      { content: 'Mach mit einer freiwilligen Person einen Bodyshot (Wasser zählt).', bool_drink: 1 },
      'Tanze 20 Sekunden lang nur für die Person gegenüber.',
      'Beschreibe detailliert, wie ein erstes Date mit jemandem hier aussehen würde.',
      'Aktiviere für zehn Minuten deine Dating-App und zeig den ersten Chat.',
      'Lass die Runde bestimmen, wer heute deine letzte Nachricht bekommt und kündige das laut an.',
    ],
  },
]);

const darePool = {
  pool: poolMeta.dare,
  prompts: darePromptGroups,
};

module.exports = { darePool };