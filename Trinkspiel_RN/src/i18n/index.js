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
      inputTitle: 'Namen eingeben',
      inputSubtitle: 'Bitte gib die Namen aller Mitspielenden ein!',
      placeholder: 'Hier einen Namen eingeben',
      addButton: 'Hinzufügen',
      listHint:
        'In der Liste könnt ihr markieren, ob Personen Alkohol trinken oder nicht. Wer nicht trinkt, bekommt keine Trinkaufgaben.',
      listHeader: 'Wer ist dabei:',
      sliderCurrent: 'Wie betrunken seid ihr gerade?',
      sliderCurrentLabel: 'Aktuell:',
      sliderDesired: 'Wie betrunken möchtet ihr werden?',
      sliderDesiredLabel: 'Ziel:',
      sliderFamiliarity: 'Wie gut kennt ihr euch schon?',
      sliderFamiliarityLabel: 'Vibe:',
      startButton: 'Spielen',
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
      info:
        'Tippt auf die Karte, um die nächste Aufgabe zu sehen. Die Aufgaben passen sich eurem aktuellen Pegel, eurem Ziel für den Abend und eurem Vibe als Gruppe an. Führt die Aufgabe aus oder trinkt entsprechend und gebt das Handy weiter.',
      noEligiblePrompt:
        'Es gibt aktuell keine Aufgaben, die zu euren Einstellungen passen. Passt die Filter an oder fügt neue Aufgaben hinzu.',
    },
    infoModal: {
      close: 'Schließen',
    },
    startMenu: {
      playButton: 'Spielen',
    },
    mainMenu: {
      modalTitle: 'Spiel starten',
      comingSoon: 'Bald verfügbar',
      games: {
        theOne: {
          title: 'The One',
          parameters: 'Trinklevel: ★★★☆☆ (3/5)\nKennenlernen: ★★★☆☆ (3/5)',
          description:
            'Der einfachste aller Spiele: Macht einfach, was auf dem Bildschirm steht! Ein Mix aus Wahrheit & Pflicht, Wer würde am ehesten, Kategorien und vielem mehr – und natürlich Trinken!',
        },
        skala: {
          title: 'Skala',
          parameters: 'Trinklevel: ★☆☆☆☆ (1/5)\nKennenlernen: ★★★☆☆ (3/5)',
          description:
            'Wo würdest du Monopoly auf einer Skala von „entspannt“ bis „stressig“ einordnen? Spielt in Teams gegeneinander und findet euren gemeinsamen Nenner!',
        },
        kingscup: {
          title: 'Kingscup',
          parameters: 'Trinklevel: ★★★☆☆ (3/5)\nKennenlernen: ★☆☆☆☆ (1/5)',
          description:
            'Kein Kartenspiel dabei? Kein Problem! Jede Karte hat eine eigene Aktion. Einfach starten und reihum aufdecken.',
        },
        schoeneberg: {
          title: 'Schöneberg',
          parameters: 'Trinklevel: ★★★★☆ (4/5)\nKennenlernen: ★☆☆☆☆ (1/5)',
          description:
            'Ausgefallene Bars, Cafés und Geschichten aus Berlins buntestem Kiez. Mehr Infos folgen bald!',
        },
        maexchen: {
          title: 'Mäxchen',
          parameters: 'Trinklevel: ★★★☆☆ (3/5)\nKennenlernen: ★☆☆☆☆ (1/5)',
          description:
            'Der klassische Würfelbluff. Lest die Regeln im Spiel und legt direkt los.',
        },
        spinTheBottle: {
          title: 'Flaschendrehen',
          parameters: 'Trinklevel: ★★★☆☆ (3/5)\nKennenlernen: ★★★☆☆ (3/5)',
          description: 'Das klassische Flaschendrehen neu gemischt mit Wahrheit oder Pflicht.',
        },
        top10: {
          title: 'Top 10',
          parameters: 'Trinklevel: ★☆☆☆☆ (1/5)\nKennenlernen: ★★★☆☆ (3/5)',
          description:
            'Sortiert euch nach abgefahrenen Kategorien – aber eine Person kennt die richtige Reihenfolge bereits.',
        },
        manyQuestions: {
          title: '1000 Questions',
          parameters: 'Trinklevel: ★★★☆☆ (3/5)\nKennenlernen: ★★★☆☆ (3/5)',
          description:
            'Wer würde am ehesten? Gebt das Handy verdeckt weiter und deckt auf, wen ihr wirklich meint.',
        },
        sixBySix: {
          title: 'Six by Six',
          parameters: 'Trinklevel: ★★★★★ (5/5)\nKennenlernen: ★☆☆☆☆ (1/5)',
          description:
            'Würfelt euch über das 6x6-Feld. Landet ihr auf einem Getränk, wird getrunken. Regeln folgen bald.',
        },
        activity: {
          title: 'Activity',
          parameters: 'Trinklevel: ★☆☆☆☆ (1/5)\nKennenlernen: ★★★☆☆ (3/5)',
          description:
            'Erklären, zeichnen, pantomime – Activity für eure Runde, ganz ohne Kartenstapel.',
        },
        horseRace: {
          title: 'Pferderennen',
          parameters: 'Trinklevel: ★★★★☆ (4/5)\nKennenlernen: ★☆☆☆☆ (1/5)',
          description: 'Wettt auf euer Lieblingspferd und feuert es an – Regeln folgen bald.',
        },
        kopfpoker: {
          title: 'Kopfpoker',
          parameters: 'Trinklevel: ★★☆☆☆ (2/5)\nKennenlernen: ★★☆☆☆ (2/5)',
          description: 'Der Klassiker mit Karten auf der Stirn. Bald verfügbar.',
        },
        drinkCounter: {
          title: 'Getränkezähler',
          parameters: 'Praktisches Extra',
          description: 'Behaltet den Überblick darüber, wer wie viele Drinks hatte.',
        },
      },
    },
    manyQuestions: {
      end: 'Ihr seid am Ende der Fragen angekommen!',
      next: 'Nächste Aussage',
      rules:
        'Eine Person startet und liest die Frage leise für sich. Danach gibt sie das Handy verdeckt an die Person weiter, auf die die Aussage am ehesten zutrifft. Die gewählte Person kann überlegen, ob die Aussage auf eine andere Person besser passt. Sobald eine Person akzeptiert oder zum zweiten Mal das Handy hat, muss sie vorlesen und trinken. Danach macht diese Person mit der nächsten Aussage weiter.',
    },
    feedback: {
      prompt: 'Wie findest du diese Frage?',
      positive: 'Danke für dein Feedback!',
      negative: 'Danke für dein Feedback!',
      like: '👍',
      dislike: '👎',
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
      info:
        'Tap the card to reveal the next challenge. The prompts adapt to how tipsy you are now, how bold you want to get, and how well you all know each other. Follow the instruction or drink as indicated, then pass the phone along.',
      noEligiblePrompt:
        'No prompts match your current settings. Adjust the sliders or add more prompts.',
    },
    infoModal: {
      close: 'Close',
    },
    startMenu: {
      playButton: 'Play',
    },
    mainMenu: {
      modalTitle: 'Start game',
      comingSoon: 'Coming soon',
      games: {
        theOne: {
          title: 'The One',
          parameters: 'Drink level: ★★★☆☆ (3/5)\nGetting to know each other: ★★★☆☆ (3/5)',
          description:
            'The simplest party classic: Do whatever the screen says! A mix of truth or dare, “Who is most likely”, categories, and of course, drinking!',
        },
        skala: {
          title: 'Scale',
          parameters: 'Drink level: ★☆☆☆☆ (1/5)\nGetting to know each other: ★★★☆☆ (3/5)',
          description:
            'Where would you put Monopoly on a scale from “relaxed” to “stressful”? Play in teams and try to sync up!',
        },
        kingscup: {
          title: 'Kings Cup',
          parameters: 'Drink level: ★★★☆☆ (3/5)\nGetting to know each other: ★☆☆☆☆ (1/5)',
          description:
            'No physical cards? No problem! Every card has its own action. Just start and reveal cards in turn.',
        },
        schoeneberg: {
          title: 'Schöneberg',
          parameters: 'Drink level: ★★★★☆ (4/5)\nGetting to know each other: ★☆☆☆☆ (1/5)',
          description:
            'Stories and spots from Berlin’s most colourful district. More details coming soon!',
        },
        maexchen: {
          title: 'Mäxchen',
          parameters: 'Drink level: ★★★☆☆ (3/5)\nGetting to know each other: ★☆☆☆☆ (1/5)',
          description:
            'The classic bluffing dice game. Read the rules in-game and start bluffing.',
        },
        spinTheBottle: {
          title: 'Spin the Bottle',
          parameters: 'Drink level: ★★★☆☆ (3/5)\nGetting to know each other: ★★★☆☆ (3/5)',
          description: 'Classic spin the bottle combined with truth or dare.',
        },
        top10: {
          title: 'Top 10',
          parameters: 'Drink level: ★☆☆☆☆ (1/5)\nGetting to know each other: ★★★☆☆ (3/5)',
          description:
            'Line up according to outrageous categories – but one person already knows the right order.',
        },
        manyQuestions: {
          title: '1000 Questions',
          parameters: 'Drink level: ★★★☆☆ (3/5)\nGetting to know each other: ★★★☆☆ (3/5)',
          description:
            '“Who is most likely?”—pass the phone face down and reveal who you really meant.',
        },
        sixBySix: {
          title: 'Six by Six',
          parameters: 'Drink level: ★★★★★ (5/5)\nGetting to know each other: ★☆☆☆☆ (1/5)',
          description:
            'Roll across the 6x6 grid. Land on a drink, take a drink. Rules coming soon.',
        },
        activity: {
          title: 'Activity',
          parameters: 'Drink level: ★☆☆☆☆ (1/5)\nGetting to know each other: ★★★☆☆ (3/5)',
          description:
            'Explain, draw, mime – Activity for your crew, no physical cards needed.',
        },
        horseRace: {
          title: 'Horse Race',
          parameters: 'Drink level: ★★★★☆ (4/5)\nGetting to know each other: ★☆☆☆☆ (1/5)',
          description: 'Bet on your favourite horse and cheer it on – rules coming soon.',
        },
        kopfpoker: {
          title: 'Forehead Poker',
          parameters: 'Drink level: ★★☆☆☆ (2/5)\nGetting to know each other: ★★☆☆☆ (2/5)',
          description: 'The classic card-on-the-forehead bluff. Coming soon.',
        },
        drinkCounter: {
          title: 'Drink Counter',
          parameters: 'Practical extra',
          description: 'Keep track of how many drinks everyone has had.',
        },
      },
    },
    manyQuestions: {
      end: 'You have reached the end of the questions!',
      next: 'Next statement',
      rules:
        'One person starts and reads the statement silently. Pass the phone face down to whoever it fits best. That person can redirect it if it fits someone else better. Once someone accepts or the phone returns to them, they read it aloud, drink, and draw the next statement.',
    },
    feedback: {
      prompt: 'How do you like this question?',
      positive: 'Thanks for your feedback!',
      negative: 'Thanks for your feedback!',
      like: '👍',
      dislike: '👎',
    },
  },
};

const resolveTranslation = (language, path) => {
  const localeTable = translations[language] || translations.de;
  if (!path) {
    return localeTable;
  }
  return path.split('.').reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key];
    }
    return undefined;
  }, localeTable);
};

export const useTranslation = () => {
  const { language } = useContext(VariablesContext);

  const t = useCallback(
    (path, fallback) => {
      const value = resolveTranslation(language, path);
      if (value !== undefined) {
        return value;
      }
      const fallbackValue = resolveTranslation('de', path);
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
      return fallback ?? path;
    },
    [language]
  );

  return { t, language };
};

export default translations;
