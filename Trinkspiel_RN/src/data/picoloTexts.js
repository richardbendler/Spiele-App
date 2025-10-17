// Sample fallback data for the Picolo style game.
// This file is used while the remote API is offline.

const pools = {
  "truth": {
    "key": "truth",
    "id": 2,
    "name": "Wahrheit",
    "color": "#00CED1",
    "label": {
      "de": "Wahrheit",
      "en": "Truth"
    }
  },
  "dare": {
    "key": "dare",
    "id": 3,
    "name": "Pflicht",
    "color": "#A52A2A",
    "label": {
      "de": "Pflicht",
      "en": "Dare"
    }
  },
  "neverHaveIEver": {
    "key": "never-have-i-ever",
    "id": 4,
    "name": "Ich hab noch nie",
    "color": "#EE7621",
    "label": {
      "de": "Ich hab noch nie",
      "en": "Never Have I Ever"
    }
  },
  "category": {
    "key": "category",
    "id": 5,
    "name": "Kategorie",
    "color": "#2F4F4F",
    "label": {
      "de": "Kategorie",
      "en": "Category"
    }
  },
  "rhyme": {
    "key": "rhyme",
    "id": 6,
    "name": "Reimen",
    "color": "#6A5ACD",
    "label": {
      "de": "Reimen",
      "en": "Rhyme"
    }
  },
  "duel": {
    "key": "duel",
    "id": 7,
    "name": "Wettkampf 1v1",
    "color": "#FF6347",
    "label": {
      "de": "Wettkampf 1v1",
      "en": "Duel"
    }
  },
  "competition": {
    "key": "competition",
    "id": 8,
    "name": "Wettkampf",
    "color": "#228B22",
    "label": {
      "de": "Wettkampf",
      "en": "Competition"
    }
  },
  "rule": {
    "key": "rule",
    "id": 9,
    "name": "Regel",
    "color": "#FFD700",
    "label": {
      "de": "Regel",
      "en": "Rule"
    }
  }
};

const promptGroups = {
  "truth": [
    {
      "content": "Erzaehle von deinem letzten grossen Aha Erlebnis.",
      "content_en": "Tell everyone about your most recent aha moment.",
      "exposure": 2
    },
    {
      "content": "Welches kleine Geheimnis behaeltst du normalerweise fuer dich?",
      "content_en": "What little secret do you usually keep to yourself?",
      "exposure": 3
    },
    {
      "content": "Was motiviert dich an einem schlechten Tag trotzdem aufzustehen?",
      "content_en": "What pushes you to get up even on a bad day?",
      "exposure": 2
    },
    {
      "content": "Wen wuerdest du sofort anrufen, wenn du gute Nachrichten bekommst?",
      "content_en": "Who would you call first when you receive great news?",
      "exposure": 1
    },
    {
      "content": "Welcher Teil deines Alltags braucht dringend mehr Abenteuer?",
      "content_en": "Which part of your daily routine needs more adventure?",
      "exposure": 2
    },
    {
      "content": "Wann hast du zuletzt etwas zum allerersten Mal ausprobiert?",
      "content_en": "When did you last try something for the very first time?",
      "exposure": 3
    },
    {
      "content": "Welche Angewohnheit nervt dich an dir selbst im Moment am meisten?",
      "content_en": "Which habit of yours annoys you the most right now?",
      "exposure": 3
    },
    {
      "content": "Welche Serie hast du heimlich in Rekordzeit durchgeschaut?",
      "content_en": "Which series did you secretly binge in record time?",
      "exposure": 2
    },
    {
      "content": "Von welcher Entscheidung aus deiner Jugend bekommst du noch Bauchweh?",
      "content_en": "Which decision from your youth still makes you cringe?",
      "exposure": 4
    },
    {
      "content": "Wer im Raum kennt dich am besten und warum?",
      "content_en": "Who in the room knows you best and why?",
      "exposure": 3
    },
    {
      "content": "Welche App solltest du eigentlich viel seltener oeffnen?",
      "content_en": "Which app should you open far less often?",
      "exposure": 2
    },
    {
      "content": "Welche mutige Idee willst du in den naechsten Monaten angehen?",
      "content_en": "Which bold idea do you want to tackle in the coming months?",
      "exposure": 2
    }
  ],
  "dare": [
    {
      "content": "Mach der Person links von dir ein uebertrieben ernstes Kompliment.",
      "content_en": "Give the person to your left an overly serious compliment.",
      "exposure": 2,
      "drunk": 1
    },
    {
      "content": "Erfinde einen zehn Sekunden Werbespot fuer deinen Lieblingssnack.",
      "content_en": "Create a ten second commercial for your favourite snack.",
      "exposure": 1,
      "drunk": 1
    },
    {
      "content": "Sprich fuer zwei Runden nur im Dialekt deiner Wahl.",
      "content_en": "Speak in a dialect of your choice for two rounds.",
      "exposure": 3,
      "drunk": 2
    },
    {
      "content": "Singe den Refrain eines Songs, den die Gruppe aussucht.",
      "content_en": "Sing the chorus of a song chosen by the group.",
      "exposure": 3,
      "drunk": 2
    },
    {
      "content": "Fuehre einen eigenen Tanzmove vor und alle muessen ihn nachmachen.",
      "content_en": "Show off your own dance move and everyone has to copy it.",
      "exposure": 2,
      "drunk": 2
    },
    {
      "content": "Erzaehle dramatisch, was du heute gefruehstueckt hast.",
      "content_en": "Retell what you had for breakfast in dramatic fashion.",
      "exposure": 1,
      "drunk": 1
    },
    {
      "content": "Imitiere fuer eine Runde die Lache einer Person im Raum.",
      "content_en": "Imitate someone in the room's laugh for one round.",
      "exposure": 2,
      "drunk": 2
    },
    {
      "content": "Schreibe mit der Nase ein Wort in die Luft, bis jemand es erraten hat.",
      "content_en": "Write a word in the air with your nose until someone guesses it.",
      "exposure": 2,
      "drunk": 1
    },
    {
      "content": "Tausche fuer zwei Runden deinen Platz mit jemand anderem.",
      "content_en": "Swap your seat with someone else for two rounds.",
      "exposure": 1,
      "drunk": 1
    },
    {
      "content": "Sprich fuer eine Runde nur in Fragen.",
      "content_en": "Speak only in questions for one round.",
      "exposure": 2,
      "drunk": 1
    },
    {
      "content": "Beatboxe zehn Sekunden lang und kuendige den naechsten Song an.",
      "content_en": "Beatbox for ten seconds and announce the next track.",
      "exposure": 2,
      "drunk": 2
    },
    {
      "content": "Balanciere fuer eine Runde ein imaginaeres Buch auf deinem Kopf.",
      "content_en": "Balance an imaginary book on your head for one round.",
      "exposure": 1,
      "drunk": 1
    }
  ],
  "neverHaveIEver": [
    {
      "content": "Ich hab noch nie ein peinliches Video gepostet und sofort wieder geloescht.",
      "content_en": "Never have I ever posted an embarrassing video and deleted it right away.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie ein Taxi bestellt und sofort wieder abgesagt.",
      "content_en": "Never have I ever ordered a taxi and cancelled it immediately.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie im falschen Chat ueber jemanden geschrieben.",
      "content_en": "Never have I ever talked about someone in the wrong chat.",
      "exposure": 4,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie aus Versehen das Essen eines Mitbewohners gegessen.",
      "content_en": "Never have I ever accidentally eaten a housemate's food.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie einen Flirt komplett falsch verstanden.",
      "content_en": "Never have I ever misread a flirt completely.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie so getan als waere ich am Telefon, um jemanden zu ignorieren.",
      "content_en": "Never have I ever faked a phone call to ignore someone.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie eine wichtige Frist verschlafen.",
      "content_en": "Never have I ever slept through an important deadline.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie im Zug in die falsche Richtung gesessen.",
      "content_en": "Never have I ever sat in the wrong direction on a train.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie einen Streich gespielt, der nach hinten losging.",
      "content_en": "Never have I ever pulled a prank that backfired.",
      "exposure": 4,
      "bool_drink": true
    },
    {
      "content": "Ich hab noch nie mir selbst einen Geburtstagskuchen gekauft.",
      "content_en": "Never have I ever bought myself a birthday cake.",
      "exposure": 2,
      "bool_drink": true
    }
  ],
  "category": [
    {
      "content": "Brettspiele mit Wuerfeln.",
      "content_en": "Board games that use dice.",
      "exposure": 1
    },
    {
      "content": "Serien mit nur einer Staffel.",
      "content_en": "TV shows that only have one season.",
      "exposure": 1
    },
    {
      "content": "Snacks, die knuspern.",
      "content_en": "Snacks that crunch.",
      "exposure": 1
    },
    {
      "content": "Dinge, die gruen sind.",
      "content_en": "Things that are green.",
      "exposure": 1
    },
    {
      "content": "Woerter, die auf ung enden.",
      "content_en": "Words that end with 'ung'.",
      "exposure": 1
    },
    {
      "content": "Lieder mit Farben im Titel.",
      "content_en": "Songs that mention a colour in the title.",
      "exposure": 1
    },
    {
      "content": "Dinge, die man in den Urlaub mitnimmt.",
      "content_en": "Things you pack for a vacation.",
      "exposure": 1
    },
    {
      "content": "Tiere mit mehr als vier Buchstaben.",
      "content_en": "Animals with more than four letters.",
      "exposure": 1
    },
    {
      "content": "Geschaefte, die sonntags geschlossen sind.",
      "content_en": "Shops that are closed on Sundays.",
      "exposure": 1
    },
    {
      "content": "Sportarten ohne Ball.",
      "content_en": "Sports that do not use a ball.",
      "exposure": 1
    },
    {
      "content": "Begriffe aus dem Buero.",
      "content_en": "Terms you hear in an office.",
      "exposure": 1
    },
    {
      "content": "Cocktail Klassiker.",
      "content_en": "Classic cocktails.",
      "exposure": 1
    }
  ],
  "rhyme": [
    {
      "content": "Starte mit dem Wort Haus und jeder nennt reihum einen Reim darauf.",
      "content_en": "Start with the word house and everyone adds a rhyming word in turn.",
      "exposure": 2
    },
    {
      "content": "Beginne mit dem Wort Kaffee und sammelt Reime, bis jemand stockt.",
      "content_en": "Begin with the word coffee and keep rhyming until someone hesitates.",
      "exposure": 2
    },
    {
      "content": "Das Startwort lautet Nacht. Wer keinen Reim findet, verliert.",
      "content_en": "The starting word is night. Whoever fails to rhyme loses.",
      "exposure": 2
    },
    {
      "content": "Startwort Licht. Sagt der Reihe nach Woerter, die sich reimen.",
      "content_en": "Starting word light. Go around saying words that rhyme.",
      "exposure": 2
    },
    {
      "content": "Das Wort Reise wird vorgegeben. Reimt, bis jemand wiederholt.",
      "content_en": "The word trip is set. Rhyme until someone repeats.",
      "exposure": 2
    },
    {
      "content": "Nutzt das Wort Kater als Vorlage und findet passende Reime.",
      "content_en": "Use the word hangover and find matching rhymes.",
      "exposure": 2
    },
    {
      "content": "Mit dem Wort Flamme geht es los. Wer patzt, trinkt.",
      "content_en": "Start with the word flame. Whoever fails drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Startet mit Himmel und haltet die Reimkette am Laufen.",
      "content_en": "Start with sky and keep the rhyme chain alive.",
      "exposure": 2
    }
  ],
  "duel": [
    {
      "content": "Fordere eine Person zu Schere Stein Papier best of three heraus. Verlierer trinkt.",
      "content_en": "Challenge someone to rock paper scissors best of three. Loser drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Daumenkrieg gegen eine Person deiner Wahl. Wer verliert, trinkt.",
      "content_en": "Thumb war against a player of your choice. Losing thumb drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Blickduell ohne zu blinzeln. Erste Person, die nachgibt, trinkt.",
      "content_en": "Staring contest without blinking. First to give in drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Wer tippt schneller drei verschiedene Emojis? Verlierer trinkt.",
      "content_en": "Who types three different emojis faster? Loser drinks.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Mini Liegestuetz Battle best of five. Wer aufgibt, trinkt.",
      "content_en": "Mini push up battle best of five. Whoever quits drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Duell im Zungenbrecher sagen. Schnellerer gewinnt, anderer trinkt.",
      "content_en": "Tongue twister duel. Faster player wins, other drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Wer kann laenger auf einem Bein stehen? Wer kippt, trinkt.",
      "content_en": "Who can stand on one leg longer? Whoever wobbles drinks.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Armdruecken fuer zehn Sekunden. Unterlegene Person trinkt.",
      "content_en": "Arm wrestle for ten seconds. The weaker arm drinks.",
      "exposure": 3,
      "bool_drink": true
    }
  ],
  "competition": [
    {
      "content": "Alle machen gleichzeitig ein Tiergeraeusch. Die laengste Pause trinkt.",
      "content_en": "Everyone makes an animal sound at once. The longest pause drinks.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Wer zuerst einen Gegenstand mit dem Buchstaben B bringt, verteilt einen Schluck.",
      "content_en": "First person to bring an item starting with B hands out a sip.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Baut in 20 Sekunden einen Turm aus dem was herumliegt. Kleinster Turm trinkt.",
      "content_en": "Build a tower from whatever is around in 20 seconds. Shortest tower drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Alle muessen blinzeln vermeiden. Erste Person, die blinzelt, trinkt.",
      "content_en": "Nobody may blink. The first person who does drinks.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Wer als letztes aufsteht, trinkt doppelt.",
      "content_en": "Last person to stand up drinks twice.",
      "exposure": 1,
      "bool_drink": true
    },
    {
      "content": "Alle sagen gleichzeitig einen Wochentag. Doppelungen trinken.",
      "content_en": "Everyone says a weekday at once. Duplicates drink.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Wer zuerst einen Reim auf Party ruft, verteilt zwei Schluenke.",
      "content_en": "First player to shout a rhyme for party hands out two sips.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Alle tippen eine Zahl zwischen eins und zehn. Wer allein ist, verteilt Schluenke.",
      "content_en": "Everyone picks a number between one and ten. Anyone with a unique number hands out drinks.",
      "exposure": 2,
      "bool_drink": true
    }
  ],
  "rule": [
    {
      "content": "Erfinde eine neue Regel: Niemand darf Vornamen sagen. Wer es vergisst, trinkt.",
      "content_en": "Create a new rule: nobody may say a first name. Slip ups drink.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Bestimme, dass alle vor dem Reden einmal schnipsen muessen.",
      "content_en": "Set a rule: players must snap their fingers before speaking.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Fuege eine Regel hinzu: Wer lacht, sagt sofort Cheers und trinkt.",
      "content_en": "Add a rule: anyone who laughs says cheers and drinks.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Neue Regel: Statt Ja sagen alle Jup. Falsches Wort bedeutet trinken.",
      "content_en": "New rule: instead of yes everyone says yup. Wrong word means drink.",
      "exposure": 3,
      "bool_drink": true
    },
    {
      "content": "Waehle eine Handbewegung, die vor jedem Schluck gemacht werden muss.",
      "content_en": "Pick a hand gesture that must be done before any sip.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Alle muessen beim Namen eines Spielers auf den Tisch tippen.",
      "content_en": "Everyone has to tap the table whenever a player name is said.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Neue Regel: Fragen sind verboten. Wer fragt, trinkt.",
      "content_en": "New rule: questions are forbidden. Ask one and drink.",
      "exposure": 2,
      "bool_drink": true
    },
    {
      "content": "Lege fest, dass jede Runde mit einem Toast startet.",
      "content_en": "Set that every round starts with a toast.",
      "exposure": 2,
      "bool_drink": true
    }
  ]
};

let nextQuestionId = 5000;

const buildPrompt = (poolKey, template) => {
  const pool = pools[poolKey];
  if (!pool) {
    throw new Error('Unknown pool key: ' + String(poolKey));
  }

  nextQuestionId += 1;
  const questionId = nextQuestionId;
  const content = typeof template.content === 'string' ? template.content : '';
  const contentEn = typeof template.content_en === 'string' && template.content_en.length > 0
    ? template.content_en
    : content;
  const exposureLevel = typeof template.exposure === 'number' ? template.exposure :
    (typeof template.exposure_level === 'number' ? template.exposure_level : 1);
  const drunkLevel = typeof template.drunk === 'number' ? template.drunk :
    (typeof template.drunk_level === 'number' ? template.drunk_level : 1);
  const boolDrink = template.bool_drink ? 1 : 0;
  const author = typeof template.author === 'string' ? template.author : '';

  return {
    question_id: questionId,
    fk_pool: pool.id,
    pool_name: pool.name,
    pool_color: pool.color,
    pool_comment: '',
    pool_fk_game: 2,
    pool_id: pool.id,
    activation: 1,
    author,
    content,
    content_en: contentEn,
    drunk_level: drunkLevel,
    exposure_level: exposureLevel,
    bool_drink: boolDrink,
    popularity: 0,
    timestamp: 0,
  };
};

export const rawTheOnePromptsData = Object.entries(promptGroups).flatMap((entry) => {
  const [poolKey, prompts] = entry;
  return prompts.map((template) => buildPrompt(poolKey, template));
});

const poolDictionary = Object.values(pools).reduce((acc, pool) => {
  acc[pool.name] = { key: pool.key, label: pool.label };
  return acc;
}, {});

const poolTags = Object.values(pools).reduce((acc, pool) => {
  acc[pool.name] = [pool.key];
  return acc;
}, {});

poolTags['Ich hab noch nie'].push('drink-round');
poolTags['Regel'].push('house-rule');
poolTags['Wettkampf'].push('challenge');
poolTags['Wettkampf 1v1'].push('challenge');
poolTags['Reimen'].push('word-play');

const deriveFamiliarityFloor = (exposureLevel) => {
  if (typeof exposureLevel !== 'number') {
    return 0;
  }
  if (exposureLevel >= 5) {
    return 0.85;
  }
  if (exposureLevel === 4) {
    return 0.7;
  }
  if (exposureLevel === 3) {
    return 0.5;
  }
  if (exposureLevel === 2) {
    return 0.3;
  }
  return 0.1;
};

const buildTags = (entry) => {
  const tags = [];
  if (entry.bool_drink) {
    tags.push('drink');
  }
  const extra = poolTags[entry.pool_name];
  if (Array.isArray(extra)) {
    extra.forEach((tag) => tags.push(tag));
  }
  return tags;
};

const toPrompt = (entry) => {
  const poolBase =
    poolDictionary[entry.pool_name] || {
      key: 'mixed',
      label: { de: entry.pool_name || 'Mix', en: entry.pool_name || 'Mix' },
    };

  const intensity =
    typeof entry.exposure_level === 'number' ? entry.exposure_level : 0;
  const recommendedDrunkLevel =
    typeof entry.drunk_level === 'number' ? entry.drunk_level : 0;

  return {
    id: entry.question_id,
    question_id: entry.question_id,
    pool: {
      id: entry.fk_pool,
      key: poolBase.key,
      label: poolBase.label,
      color: entry.pool_color,
    },
    content: entry.content,
    content_en: entry.content_en || entry.content,
    metadata: {
      intensity,
      recommendedDrunkLevel,
      drinkInvolved: Boolean(entry.bool_drink),
      familiarityFloor: deriveFamiliarityFloor(intensity),
      tags: buildTags(entry),
    },
    raw: {
      activation: entry.activation,
      author: entry.author,
      popularity: entry.popularity,
      timestamp: entry.timestamp,
      poolComment: entry.pool_comment,
      poolGame: entry.pool_fk_game,
    },
  };
};

export const theOneSamplePrompts = rawTheOnePromptsData.map(toPrompt);
export const rawTheOnePrompts = rawTheOnePromptsData;
