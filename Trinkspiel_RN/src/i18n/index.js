import { useCallback, useContext } from 'react';
import { VariablesContext } from '../../VariablesContext';

const translations = {
  de: {
    common: {
      rules: 'Regeln',
      close: 'Schließen',
      remove: 'Entfernen',
      startGame: 'Spiel starten',
      comingSoon: 'Bald verfügbar',
      loading: 'Lädt...',
      players: 'Spieler*innen',
    },
    addPlayer: {
      screenTitle: 'Spieler hinzufügen',
      inputTitle: 'Namen eingeben',
      inputSubtitle: 'Bitte gib die Namen aller Mitspielenden ein!',
      placeholder: 'Hier einen Namen eingeben',
      addButton: 'Hinzufügen',
      listHint:
        'In der Liste könnt ihr markieren, ob Personen Alkohol trinken oder nicht. Wer nicht trinkt, bekommt keine Trinkaufgaben.',
      listHeader: 'Wer ist dabei:',
      sliderCurrent: 'Wie betrunken seid ihr gerade?',
      sliderCurrentLabel: 'Aktüll:',
      sliderDesired: 'Wie betrunken möchtet ihr werden?',
      sliderDesiredLabel: 'Ziel:',
      sliderFamiliarity: 'Wie gut kennt ihr euch schon?',
      sliderFamiliarityLabel: 'Vibe:',
      startButton: 'Spielen',
      clearAll: 'Alle löschen',
      alertTitle: 'Zu wenig Spieler',
      alertMessage: 'Um dieses Spiel zu starten, braucht ihr mindestens zwei Personen.',
    },
    scales: {
      drunkenness: [
        'Stocknüchtern',
        'Gerade angefangen',
        'Erste Wirkung',
        'Leicht angetrunken',
        'Schon gut drauf',
        'Doller angetrunken',
        'Ziemlich angetrunken',
        'Wackelige Knie',
        'Richtig betrunken',
        'Kurz vorm Filmriss',
      ],
      familiarity: [
        'Gerade kennengelernt',
        'Nur flüchtig bekannt',
        'Schon ein paar Gespräche',
        'Kennen uns ganz gut',
        'Regelmäßig unterwegs',
        'Enge Freund*innen',
        'Sehr vertraut',
        'Beste Freund*innen',
        'Fast Familie',
        'Unzertrennlich',
      ],
    },
    nameContainer: {
      drinks: 'Trinkt Alkohol',
      noDrinks: 'Kein Alkohol',
      remove: 'Entfernen',
    },
    theOne: {
      infoTitle: 'The One!',
      info:
        'Bestimmt eine Moderatorin oder einen Moderator. Diese Person behält das Handy, liest jede Aufgabe vor und tippt auf Weiter. Die Karten passen sich wie gewohnt eurem Pegel, Ziel und Vibe an.',
      nöligiblePrompt:
        'Es gibt aktüll keine Aufgaben, die zu euren Einstellungen passen. Passt die Filter an oder fügt neü Aufgaben hinzu.',
      revealHint: 'Tippe, um die Karte aufzudecken.',
    },
    infoModal: {
      close: 'Schließen',
    },
    startMenu: {
      playButton: 'Spielen',
      disclaimer: 'Achtung: Alkohol ist erst ab 18 Jahren erlaubt. Trink verantwortungsvoll und kenn deine Grenzen.',
    },
    mainMenu: {
      modalTitle: 'Spiel starten',
      comingSoon: 'Bald verfügbar',
      games: {
        theOne: {
          title: 'The One',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Der einfachste aller Spiele: Macht einfach, was auf dem Bildschirm steht! Ein Mix aus Wahrheit & Pflicht, Wer würde am ehesten, Kategorien und vielem mehr â?" und natürlich Trinken!',
        },
        skala: {
          title: 'Skala',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Wo würdest du Monopoly auf einer Skala von â?zentspanntâ?o bis â?zstressigâ?o einordnen? Spielt in Teams gegeneinander und findet euren gemeinsamen Nenner!',
        },
        kingscup: {
          title: 'Kingscup',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Kein Kartenspiel dabei? Kein Problem! Jede Karte hat eine eigene Aktion. Einfach starten und reihum aufdecken.',
        },
        schöneberg: {
          title: 'Schöneberg',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Ausgefallene Bars, Cafés und Geschichten aus Berlins buntestem Kiez. Mehr Infos folgen bald!',
        },
        mäxchen: {
          title: 'Mäxchen',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Der klassische Würfelbluff. Lest die Regeln im Spiel und legt direkt los.',
        },
        spinTheBottle: {
          title: 'Flaschendrehen',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Das klassische Flaschendrehen neu gemischt mit Wahrheit oder Pflicht.',
        },
        top10: {
          title: 'Top 10',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Sortiert euch nach abgefahrenen Kategorien â?" aber eine Person kennt die richtige Reihenfolge bereits.',
        },
        whoWould: {
          title: 'Wer würde am ehesten?',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Wer würde am ehesten? Gebt das Handy verdeckt weiter und deckt auf, wen ihr wirklich meint.',
        },
        neverHaveIEver: {
          title: 'Ich hab noch nie',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Zieh eine Aussage und wer es schon gemacht hat, trinkt. Einfache, schnelle Runden f\\u00fcr zwischendurch.',
        },
        sixBySix: {
          title: 'Six by Six',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Würfelt euch über das 6x6-Feld. Landet ihr auf einem Getränk, wird getrunken. Regeln folgen bald.',
        },
        activity: {
          title: 'Activity',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description:
            'Erklären, zeichnen, pantomime â?" Activity für eure Runde, ganz ohne Kartenstapel.',
        },
        horseRace: {
          title: 'Pferderennen',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Wettt auf eür Lieblingspferd und feürt es an â?" Regeln folgen bald.',
        },
        kopfpoker: {
          title: 'Kopfpoker',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Der Klassiker mit Karten auf der Stirn. Bald verfügbar.',
        },
        partyBoard: {
          title: 'Bar-Odyssee',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Reist durch die Bar-Odyssee, sammelt Münzen und Sterne und entscheidet mit Minispielen die Reihenfolge.',
        },
        secretMission: {
          title: 'Geheime Mission',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Jede Person zieht verdeckt eine leichte, lustige Mission für den Abend - aufdecken, merken, wieder verdecken.'
        },
        drinkCounter: {
          title: 'Getränkezähler',
          parameters: 'Praktisches Extra',
          description: 'Behalte deinen eigenen Konsum im Blick, logge Drinks schnell und erhalte eine Promille-Schätzung.',
        },
      },
    },
    spinTheBottleGame: {
      initialPrompt: 'Dreh die Flasche mit dem Finger! (Tippen reicht auch)',
      infoHeader: 'Flaschendrehen!',
      rules:
        'Dreht die Flasche! (Tippen reicht auch.) Auf wen die Flasche zeigt, muss die angezeigte Aktion ausführen. So einfach ist es...',
      sipsLabel: 'Schlucke!',
      truthLabel: 'Wahrheit!',
      dareLabel: 'Pflicht!',
    },
    manyQuestions: {
      infoTitle: '100 Fragen!',
      end: 'Ihr seid am Ende der Fragen angekommen!',
      next: 'Nächste Aussage',
      rules:
        'Eine Person startet und liest die Frage leise für sich. Danach gibt sie das Handy verdeckt an die Person weiter, auf die die Aussage am ehesten zutrifft. Die gewählte Person kann überlegen, ob die Aussage auf eine andere Person besser passt. Sobald eine Person akzeptiert oder zum zweiten Mal das Handy hat, muss sie vorlesen und trinken. Danach macht diese Person mit der nächsten Aussage weiter.',
    },
    picoloGame: {
      nextButton: 'Moderator: Nächste Karte',
      infoTitle: 'The One!',
      revealHint: 'Tippe auf die Karte, um sie aufzudecken.',
    },
    whoWould: {
      infoTitle: 'Wer würde am ehesten?',
      info:
        'Lest die Aussage laut vor. Zählt gemeinsam bis drei und zeigt gleichzeitig auf die Person, auf die sie am ehesten zutrifft. Wer die meisten Stimmen bekommt, trinkt â?" oder denkt sich eine kleine Aufgabe für die Runde aus. Wechselt reihum, wer vorliest.',
      next: 'Nächste Aussage',
      end: 'Ihr habt alle Aussagen durch!',
      restart: 'Neü Runde mischen',
    },
    neverHaveIEver: {
      infoTitle: 'Ich hab noch nie',
      info:
        'Lest die Aussage laut vor. Wer es schon einmal gemacht hat, trinkt. Tippt auf Weiter, um die Nächste Aussage zu sehen.',
      next: 'Nächste Aussage',
      end: 'Ihr habt alle Aussagen durch!',
      restart: 'Neü Runde mischen',
    },
    feedback: {
      prompt: 'Wie findest du diese Frage?',
      positive: 'Danke für dein Feedback!',
      negative: 'Danke für dein Feedback!',
      like: 'Like',
      dislike: 'Dislike',
    },
  },
  en: {
    common: {
      rules: 'Rules',
      close: 'Close',
      remove: 'Remove',
      startGame: 'Start game',
      comingSoon: 'Coming soon',
      loading: 'Loading...',
      players: 'Players',
    },
    addPlayer: {
      screenTitle: 'Add Players',
      inputTitle: 'Enter names',
      inputSubtitle: 'Please enter the names of everyone who is playing!',
      placeholder: 'Type a name',
      addButton: 'Add',
      listHint:
        'Use the list to mark who drinks alcohol. Players who opt out will not receive drink tasks.',
      listHeader: 'Who is playing:',
      sliderCurrent: 'How tipsy are you right now?',
      sliderCurrentLabel: 'Current:',
      sliderDesired: 'How bold do you want the night to get?',
      sliderDesiredLabel: 'Goal:',
      sliderFamiliarity: 'How well do you know each other?',
      sliderFamiliarityLabel: 'Vibe:',
      startButton: 'Start game',
      clearAll: 'Clear all',
      alertTitle: 'Not enough players',
      alertMessage: 'You need at least two players to start this game.',
    },
    scales: {
      drunkenness: [
        'Stone sober',
        'Just getting started',
        'Starting to feel it',
        'Lightly buzzed',
        'Nicely buzzed',
        'Getting tipsy',
        'Pretty tipsy',
        'Wobbly legs',
        'Properly drunk',
        'On the brink',
      ],
      familiarity: [
        'Just met tonight',
        'Barely acquainted',
        'Talked a few times',
        'Know each other fairly well',
        'Hang out regularly',
        'Close friends',
        'Very close',
        'Best friends',
        'Almost family',
        'Inseparable',
      ],
    },
    nameContainer: {
      drinks: 'Drinks alcohol',
      noDrinks: 'No alcohol',
      remove: 'Remove',
    },
    theOne: {
      infoTitle: 'The One!',
      info:
        'Choose one moderator who keeps the phone, reads each prompt aloud, and taps Next. The prompts still adapt to how tipsy you are, your target level, and how well you all know each other.',
      nöligiblePrompt:
        'No prompts match your current settings. Adjust the sliders or add more prompts.',
      revealHint: 'Tap to flip the next card.',
    },
    infoModal: {
      close: 'Close',
    },
    startMenu: {
      playButton: 'Play',
      disclaimer: 'Heads up: Alcohol is 18+. Drink responsibly and know your limits.',
    },
    mainMenu: {
      modalTitle: 'Start game',
      comingSoon: 'Coming soon',
      games: {
        theOne: {
          title: 'The One',
          parameters: 'Drink level: â~.â~.â~.â~?â~? (3/5)\nGetting to know each other: â~.â~.â~.â~?â~? (3/5)',
          description:
            'The simplest party classic: Do whatever the screen says! A mix of truth or dare, â?oWho is most likelyâ?, categories, and of course, drinking!',
        },
        skala: {
          title: 'Scale',
          parameters: 'Drink level: â~.â~?â~?â~?â~? (1/5)\nGetting to know each other: â~.â~.â~.â~?â~? (3/5)',
          description:
            'Where would you put Monopoly on a scale from â?orelaxedâ? to â?ostressfulâ?? Play in teams and try to sync up!',
        },
        kingscup: {
          title: 'Kings Cup',
          parameters: 'Drink level: â~.â~.â~.â~?â~? (3/5)\nGetting to know each other: â~.â~?â~?â~?â~? (1/5)',
          description:
            'No physical cards? No problem! Every card has its own action. Just start and reveal cards in turn.',
        },
        schöneberg: {
          title: 'Schöneberg',
          parameters: 'Drink level: â~.â~.â~.â~.â~? (4/5)\nGetting to know each other: â~.â~?â~?â~?â~? (1/5)',
          description:
            'Stories and spots from Berlinâ?Ts most colourful district. More details coming soon!',
        },
        mäxchen: {
          title: 'Mäxchen',
          parameters: 'Drink level: â~.â~.â~.â~?â~? (3/5)\nGetting to know each other: â~.â~?â~?â~?â~? (1/5)',
          description:
            'The classic bluffing dice game. Read the rules in-game and start bluffing.',
        },
        spinTheBottle: {
          title: 'Spin the Bottle',
          parameters: 'Drink level: â~.â~.â~.â~?â~? (3/5)\nGetting to know each other: â~.â~.â~.â~?â~? (3/5)',
          description: 'Classic spin the bottle combined with truth or dare.',
        },
        top10: {
          title: 'Top 10',
          parameters: 'Drink level: â~.â~?â~?â~?â~? (1/5)\nGetting to know each other: â~.â~.â~.â~?â~? (3/5)',
          description:
            'Line up according to outrageous categories â?" but one person already knows the right order.',
        },
        whoWould: {
          title: 'Wer würde am ehesten?',
          parameters: 'Drink level: â~.â~.â~.â~?â~? (3/5)\nGetting to know each other: â~.â~.â~.â~?â~? (3/5)',
          description:
            'â?oWho is most likely?â?â?"pass the phone face down and reveal who you really meant.',
        },
        sixBySix: {
          title: 'Six by Six',
          parameters: 'Drink level: â~.â~.â~.â~.â~. (5/5)\nGetting to know each other: â~.â~?â~?â~?â~? (1/5)',
          description:
            'Roll across the 6x6 grid. Land on a drink, take a drink. Rules coming soon.',
        },
        activity: {
          title: 'Activity',
          parameters: 'Drink level: â~.â~?â~?â~?â~? (1/5)\nGetting to know each other: â~.â~.â~.â~?â~? (3/5)',
          description:
            'Explain, draw, mime â?" Activity for your crew, no physical cards needed.',
        },
        horseRace: {
          title: 'Horse Race',
          parameters: 'Drink level: â~.â~.â~.â~.â~? (4/5)\nGetting to know each other: â~.â~?â~?â~?â~? (1/5)',
          description: 'Bet on your favourite horse and cheer it on â?" rules coming soon.',
        },
        kopfpoker: {
          title: 'Forehead Poker',
          parameters: 'Drink level: â~.â~.â~?â~?â~? (2/5)\nGetting to know each other: â~.â~.â~?â~?â~? (2/5)',
          description: 'The classic card-on-the-forehead bluff. Coming soon.',
        },
        partyBoard: {
          title: 'Bar-Odyssee',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Reist durch die Bar-Odyssee, sammelt Münzen und Sterne und entscheidet mit Minispielen die Reihenfolge.',
        },
        secretMission: {
          title: 'Geheime Mission',
          parameters: 'Trinklevel: ????? (2/5)\\nKennenlernen: ????? (3/5)',
          description: 'Jede Person zieht verdeckt eine leichte, lustige Mission für den Abend - aufdecken, merken, wieder verdecken.'
        },
        drinkCounter: {
          title: 'Drink Counter',
          parameters: 'Practical extra',
          description: 'Stay on top of your own drinks, log them quickly and get a promille estimate.',
        },
      },
    },
    spinTheBottleGame: {
      initialPrompt: 'Spin the bottle with your finger! (Tapping works too)',
      infoHeader: 'Spin the Bottle!',
      rules:
        'Spin the bottle! (Tapping works too.) Whöver it points to has to do the action that appears. That\'s all there is to it...',
      sipsLabel: 'Sips!',
      truthLabel: 'Truth!',
      dareLabel: 'Dare!',
    },
    manyQuestions: {
      infoTitle: '100 Fragen!',
      end: 'You have reached the end of the qüstions!',
      next: 'Next statement',
      rules:
        'One person starts and reads the statement silently. Pass the phone face down to whöver it fits best. That person can redirect it if it fits someone else better. Once someone accepts or the phone returns to them, they read it aloud, drink, and draw the next statement.',
    },
    picoloGame: {
      nextButton: 'Moderator: Next card',
      infoTitle: 'The One!',
      revealHint: 'Tap to reveal the card.',
    },
    whoWould: {
      infoTitle: 'Who Would Most Likely?',
      info:
        'Read the prompt aloud. Count down from three and point at the person it fits best. Whöver gets the most votes drinks â?" or sets a fun mini challenge. Rotate who reads the next card.',
      next: 'Next prompt',
      end: 'You reached the end!',
      restart: 'Shuffle again',
    },
    neverHaveIEver: {
      infoTitle: 'Never have I ever',
      info:
        'Read the prompt aloud. Anyone who has done it takes a sip. Tap Next to see the following prompt.',
      next: 'Next statement',
      end: 'You reached the end!',
      restart: 'Shuffle again',
    },
    feedback: {
      prompt: 'How do you like this qüstion?',
      positive: 'Thanks for your feedback!',
      negative: 'Thanks for your feedback!',
      like: 'Like',
      dislike: 'Dislike',
    },
  },
};

const resolveTranslation = (language, path) => {
  const localeTable = translations[language] || translations.de;
  if (!path) {
    return localeTable;
  }
  return path.split('.').reduce((valü, key) => {
    if (valü && Object.prototype.hasOwnProperty.call(valü, key)) {
      return valü[key];
    }
    return undefined;
  }, localeTable);
};

export const useTranslation = () => {
  const { language } = useContext(VariablesContext);

  const t = useCallback(
    (path, fallback) => {
      const valü = resolveTranslation(language, path);
      if (valü !== undefined) {
        return valü;
      }
      const fallbackValü = resolveTranslation('de', path);
      if (fallbackValü !== undefined) {
        return fallbackValü;
      }
      return fallback ?? path;
    },
    [language]
  );

  return { t, language };
};

export default translations;














