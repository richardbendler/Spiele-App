import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { VariablesContext } from "../../VariablesContext";
import { appStyles } from "../../styles";
import InfoText from "./sublements/InfoText";
import InfoHint from './sublements/InfoHint';
import { shuffleArrayFisherYates } from "./sublements/AdjustParamShape";

const formatTemplate = (template, values = {}) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = values[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
};

const PARTY_BOARD_COPY = {
  de: {
    title: "Bar-Odyssee",
    subtitle: "Reist durch die Bar-Odyssee, sammelt Muenzen und Sterne und entscheidet jede Runde mit einem Minispiel die Zugreihenfolge.",
    needPlayers: "Fuegt mindestens zwei Spieler*innen hinzu, um loszulegen.",
    addPlayers: "Spieler hinzufuegen",
    roundLabel: "Runde {{round}}",
    miniGame: {
      headline: "Minispiel",
      prompt: "Aktuelles Minispiel: {{name}}",
      description: "{{description}}",
      rewards: "Belohnung: 1. Platz +3, 2. Platz +2, 3. Platz +1 Muenze.",
      ready: "Wenn ihr bereit seid, wertet das Minispiel aus, um die Zugreihenfolge festzulegen.",
    },
    turn: {
      headline: "Zugphase",
      prompt: "{{player}} ist am Zug. Tippt auf Wuerfeln, um euch vorwaerts zu bewegen.",
      lastRoll: "Letzter Wurf: {{value}}",
      waiting: "Kein letzter Wurf. Tippt auf Wuerfeln, um zu starten.",
    },
    buttons: {
      resolveMiniGame: "Minispiel auswerten",
      roll: "Wuerfeln",
      nextRound: "Naechste Runde starten",
    },
    events: {
      roll: "{{player}} wuerfelt eine {{roll}} und landet auf {{space}}.",
      bonus: "{{player}} findet Trinkmarken und erhaelt {{coins}} Muenzen.",
      challenge: "{{player}} startet eine Challenge. Alle anderen trinken einen Schluck.",
      drink: "{{player}} stolpert und verliert {{coins}} Muenzen.",
      shopSuccess: "{{player}} tauscht 5 Muenzen gegen einen Stern.",
      shopFail: "{{player}} braucht mehr Muenzen fuer den Stern.",
      starSpaceSuccess: "{{player}} schnappt sich einen Stern fuer 5 Muenzen.",
      starSpaceFail: "{{player}} steht vor dem Stern, aber es fehlen Muenzen.",
      warp: "{{player}} nimmt die Abkuerzung und springt zu {{space}}.",
      duelWin: "{{player}} gewinnt die Mini-Challenge und nimmt {{target}} eine Muenze ab.",
      lounge: "{{player}} entspannt kurz. Keine Aktion.",
    },
    scoreboard: {
      title: "Rangliste",
      stars: "Sterne",
      coins: "Muenzen",
      position: "Feld {{index}}",
    },
    logTitle: "Ereignisse",
    logEmpty: "Noch keine Ereignisse.",
    legend: {
      title: "Feld-Legende",
      entries: {
        start: { title: "Start", body: "Hier beginnt jede Runde." },
        bonus: { title: "Bonusfeld", body: "Erhalte zusaetzliche Muenzen." },
        challenge: { title: "Challenge", body: "Bestimmt gemeinsam, wer trinken muss." },
        drink: { title: "Drinkzone", body: "Verliert Muenzen oder trinkt." },
        shop: { title: "Stern-Shop", body: "Tauscht 5 Muenzen gegen einen Stern." },
        star: { title: "Sternfeld", body: "Sichert euch einen Stern, wenn ihr 5 Muenzen habt." },
        warp: { title: "Shortcut", body: "Springt direkt auf ein anderes Feld." },
        duel: { title: "Duell", body: "Fordert den reichsten Gegenueber heraus." },
        lounge: { title: "Lounge", body: "Kurze Pause ohne Effekt." },
      },
    },
    board: {
      title: "Bar-Odyssee",
      hint: "Die Farben zeigen den Feldtyp. Initialen markieren, wo die Spieler*innen unterwegs sind.",
    },
    overlays: {
      miniGameBody: "Spielt das Minispiel und legt eure Reihenfolge fest. Danach auf Minispiel auswerten tippen.",
      miniGameButton: "Weiter",
      orderTitle: "Reihenfolge steht!",
      orderBody: "So tretet ihr an:",
      orderButton: "Zur Runde",
      turnBody: "Gebt der aktiven Person den Wuerfel und tippt auf Wuerfeln.",
      turnButton: "Wuerfeln",
    },
    miniGames: [
      {
        name: "Zapf-Meister",
        description: "Stapelt Becher zu einem Turm, ohne dass er faellt. Die stabilsten Haende gewinnen.",
      },
      {
        name: "Quiz-Rausch",
        description: "Beantwortet schnelle Partyfragen. Wer zuerst richtig liegt, sammelt Punkte.",
      },
      {
        name: "Party-Pantomime",
        description: "Stellt Partybegriffe pantomimisch dar. Die meisten Treffer bestimmen die Reihenfolge.",
      },
      {
        name: "Beat Battle",
        description: "Erfindet einen Body-Beat. Die Runde stimmt ab und verteilt die Muenzen.",
      },
    ],
    info: {
      title: "So funktioniert die Bar-Odyssee",
      body:
        "Spielt rundenbasiert: Zu Beginn klaert ein Minispiel die Reihenfolge und schenkt Bonusmuenzen. Danach wuerfelt jede Person und zieht vorwaerts. Felder bringen Drinks, Bonus-Muenzen, Abkuerzungen oder Sterne. Wer genug Muenzen spart, tauscht sie gegen Sterne. Nach der letzten Person startet automatisch das naechste Minispiel.",
    },
  },
  en: {
    title: "Bar Odyssey",
    subtitle: "Roll through the Bar Odyssey, gather coins and stars, and lock in the turn order with a mini game each round.",
    needPlayers: "Add at least two players to get started.",
    addPlayers: "Add players",
    roundLabel: "Round {{round}}",
    miniGame: {
      headline: "Mini Game",
      prompt: "Current mini game: {{name}}",
      description: "{{description}}",
      rewards: "Rewards: 1st +3, 2nd +2, 3rd +1 coin.",
      ready: "When you are ready, resolve the mini game to lock in the order.",
    },
    turn: {
      headline: "Turn Phase",
      prompt: "{{player}} to move. Tap roll to advance.",
      lastRoll: "Last roll: {{value}}",
      waiting: "No roll yet. Tap roll to get going.",
    },
    buttons: {
      resolveMiniGame: "Resolve mini game",
      roll: "Roll the dice",
      nextRound: "Start next round",
    },
    events: {
      roll: "{{player}} rolls a {{roll}} and lands on {{space}}.",
      bonus: "{{player}} finds drink tokens and gains {{coins}} coins.",
      challenge: "{{player}} kicks off a challenge. Everyone else takes a sip.",
      drink: "{{player}} drops their cup and loses {{coins}} coins.",
      shopSuccess: "{{player}} trades 5 coins for a star.",
      shopFail: "{{player}} needs more coins for the star.",
      starSpaceSuccess: "{{player}} grabs a star for 5 coins.",
      starSpaceFail: "{{player}} reaches the star but is short on coins.",
      warp: "{{player}} uses the shortcut and jumps to {{space}}.",
      duelWin: "{{player}} wins the mini challenge and takes a coin from {{target}}.",
      lounge: "{{player}} takes a breather. No effect.",
    },
    scoreboard: {
      title: "Scoreboard",
      stars: "Stars",
      coins: "Coins",
      position: "Space {{index}}",
    },
    logTitle: "Event Log",
    logEmpty: "No events yet.",
    legend: {
      title: "Field legend",
      entries: {
        start: { title: "Start", body: "Where each round begins." },
        bonus: { title: "Bonus", body: "Gain extra coins." },
        challenge: { title: "Challenge", body: "Group decides who drinks." },
        drink: { title: "Drink Zone", body: "Lose coins or take a sip." },
        shop: { title: "Star Shop", body: "Trade 5 coins for a star." },
        star: { title: "Star Field", body: "Take a star if you have 5 coins." },
        warp: { title: "Shortcut", body: "Jump to another space." },
        duel: { title: "Duel", body: "Challenge the richest opponent." },
        lounge: { title: "Lounge", body: "A calm spot with no effect." },
      },
    },
    board: {
      title: "Bar Odyssey",
      hint: "Colors highlight the field type. Initials show where players are on their route.",
    },
    overlays: {
      miniGameBody: "Play the mini game to decide the order. Then tap Resolve mini game.",
      miniGameButton: "Continue",
      orderTitle: "Order Locked In!",
      orderBody: "Play in this order:",
      orderButton: "Start round",
      turnBody: "Hand the dice to the player and tap roll.",
      turnButton: "Roll now",
    },
    miniGames: [
      {
        name: "Tap Master",
        description: "Stack cups into a tall tower before it falls. The steadiest hands win.",
      },
      {
        name: "Quiz Rush",
        description: "Answer quick party trivia. Fastest correct answers earn points.",
      },
      {
        name: "Party Mime",
        description: "Act out party terms. The most correct guesses set the turn order.",
      },
      {
        name: "Beat Battle",
        description: "Create a body beat. The group votes and hands out the coins.",
      },
    ],
    info: {
      title: "How the Bar Odyssey Works",
      body:
        "Play in rounds: a mini game sets the order and awards bonus coins. Each person rolls forward. Spaces grant coins, force drinks, open shortcuts, or sell stars. After the last person moved, a fresh mini game begins automatically.",
    },
  },
};

const BOARD_SPACES = [
  {
    key: "start",
    type: "start",
    label: { de: "Startfeld", en: "Start" },
    description: { de: "Alle starten hier mit 3 Muenzen.", en: "Everyone starts here with 3 coins." },
    position: { row: 0, col: 0 },
  },
  {
    key: "welcomeShots",
    type: "bonus",
    coins: 2,
    label: { de: "Willkommensshots", en: "Welcome Shots" },
    description: { de: "Legt los mit zwei extra Muenzen.", en: "Kick off with two extra coins." },
    position: { row: 0, col: 1 },
  },
  {
    key: "quizCorner",
    type: "challenge",
    label: { de: "Quiz-Ecke", en: "Quiz Corner" },
    description: { de: "Stellt der Runde eine schnelle Quizfrage.", en: "Throw a quick quiz question at the group." },
    position: { row: 0, col: 2 },
  },
  {
    key: "taproom",
    type: "bonus",
    coins: 1,
    label: { de: "Zapfstation", en: "Taproom" },
    description: { de: "Zapft einen Gratisdrink und kassiert 1 Muenze.", en: "Grab a free refill and gain 1 coin." },
    position: { row: 0, col: 3 },
  },
  {
    key: "shotAlley",
    type: "drink",
    coins: 2,
    label: { de: "Shot-Gasse", en: "Shot Alley" },
    description: { de: "Ein verschuetteter Shot kostet bis zu 2 Muenzen.", en: "A spilled shot costs up to 2 coins." },
    position: { row: 1, col: 3 },
  },
  {
    key: "confettiShortcut",
    type: "warp",
    target: 7,
    label: { de: "Konfetti-Shortcut", en: "Confetti Shortcut" },
    description: { de: "Rutscht durch das Konfetti direkt zum Muenzbrunnen.", en: "Slide through confetti straight to the coin fountain." },
    position: { row: 2, col: 3 },
  },
  {
    key: "starLounge",
    type: "star",
    label: { de: "Stern-Lounge", en: "Star Lounge" },
    description: { de: "Fuer 5 Muenzen gibt es hier einen Stern und Applaus.", en: "Trade 5 coins here for a star and a cheer." },
    position: { row: 3, col: 3 },
  },
  {
    key: "coinFountain",
    type: "bonus",
    coins: 3,
    label: { de: "Muenzbrunnen", en: "Coin Fountain" },
    description: { de: "Schopft drei Muenzen aus dem Brunnen.", en: "Scoop three coins from the fountain." },
    position: { row: 3, col: 2 },
  },
  {
    key: "duelStage",
    type: "duel",
    label: { de: "Battle-Buehne", en: "Duel Stage" },
    description: { de: "Fordert die reichste Person zur schnellen Challenge heraus.", en: "Challenge the richest player to a quick duel." },
    position: { row: 3, col: 1 },
  },
  {
    key: "chillCorner",
    type: "lounge",
    label: { de: "Chill-Ecke", en: "Chill Corner" },
    description: { de: "Verschnaufpause ohne Effekt.", en: "Take a breather with no effect." },
    position: { row: 3, col: 0 },
  },
  {
    key: "lostAndFound",
    type: "drink",
    coins: 1,
    label: { de: "Fundkiste", en: "Lost & Found" },
    description: { de: "Der Becher ist weg. Zahlt 1 Muenze in die Kasse.", en: "Your cup is gone. Pay 1 coin back to the stash." },
    position: { row: 2, col: 0 },
  },
  {
    key: "starBazaar",
    type: "shop",
    label: { de: "Stern-Basar", en: "Star Bazaar" },
    description: { de: "Hier gibt es Sterne fuer 5 Muenzen aus der Vitrine.", en: "Buy a displayed star here for 5 coins." },
    position: { row: 1, col: 0 },
  },
  {
    key: "mixMaster",
    type: "challenge",
    label: { de: "Mix-Master", en: "Mix Master" },
    description: { de: "Erfindet einen verrueckten Drink und lasst die Runde urteilen.", en: "Invent a wild drink and let the group judge." },
    position: { row: 1, col: 1 },
  },
  {
    key: "danceFloor",
    type: "bonus",
    coins: 2,
    label: { de: "Tanzflaeche", en: "Dance Floor" },
    description: { de: "Zeigt eure Moves und kassiert 2 Muenzen.", en: "Show your moves and gain 2 coins." },
    position: { row: 1, col: 2 },
  },
  {
    key: "secretStar",
    type: "star",
    label: { de: "Geheimer Stern", en: "Secret Star" },
    description: { de: "Ein verstecktes Sternfeld fuer 5 Muenzen.", en: "A hidden star field worth 5 coins." },
    position: { row: 2, col: 2 },
  },
  {
    key: "serviceTunnel",
    type: "warp",
    target: 11,
    label: { de: "Service-Tunnel", en: "Service Tunnel" },
    description: { de: "Nehmt den Tunnel direkt zum Stern-Shop.", en: "Take the tunnel straight to the star shop." },
    position: { row: 2, col: 1 },
  },
];

const SPACE_THEMES = {
  start: { backgroundColor: "rgba(68, 86, 105, 0.85)", borderColor: "#E5C185" },
  bonus: { backgroundColor: "rgba(38, 68, 52, 0.85)", borderColor: "rgba(149, 213, 178, 0.8)" },
  challenge: { backgroundColor: "rgba(72, 52, 92, 0.85)", borderColor: "rgba(204, 153, 255, 0.45)" },
  drink: { backgroundColor: "rgba(125, 53, 62, 0.85)", borderColor: "rgba(249, 144, 155, 0.45)" },
  shop: { backgroundColor: "rgba(54, 66, 105, 0.85)", borderColor: "rgba(124, 167, 255, 0.45)" },
  star: { backgroundColor: "rgba(150, 102, 60, 0.85)", borderColor: "rgba(255, 214, 137, 0.5)" },
  warp: { backgroundColor: "rgba(46, 70, 100, 0.85)", borderColor: "rgba(147, 206, 255, 0.45)" },
  duel: { backgroundColor: "rgba(92, 60, 112, 0.85)", borderColor: "rgba(214, 154, 255, 0.42)" },
  lounge: { backgroundColor: "rgba(45, 57, 76, 0.85)", borderColor: "rgba(180, 190, 205, 0.3)" },
  default: { backgroundColor: "rgba(24, 30, 44, 0.85)", borderColor: "rgba(255, 255, 255, 0.08)" },
};
const MINI_GAME_REWARDS = [3, 2, 1];

const PartyBoardGame = ({ navigation }) => {
  const { players, infoVisible, setInfoVisible, language } = useContext(VariablesContext);
  const copy = useMemo(() => PARTY_BOARD_COPY[language === "en" ? "en" : "de"], [language]);

  const [positions, setPositions] = useState(() => players.map(() => 0));
  const [scores, setScores] = useState(() => players.map(() => ({ stars: 0, coins: 3 })));
  const [eventLog, setEventLog] = useState([]);
  const [round, setRound] = useState(1);
  const [order, setOrder] = useState(() => players.map((_, index) => index));
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState("setup"); // setup | minigame | turn | waiting
  const [currentMiniGame, setCurrentMiniGame] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const pendingActionRef = useRef(null);
  const miniGamePromptKeyRef = useRef(null);
  const lastTurnPromptRef = useRef(null);

  const confirmOverlay = useCallback(() => {
    if (!overlay) {
      return;
    }
    const handler = overlay.onConfirm;
    setOverlay(null);
    if (typeof handler === "function") {
      handler();
    }
  }, [overlay]);

  const resetGameState = useCallback(() => {
    setPositions(players.map(() => 0));
    setScores(players.map(() => ({ stars: 0, coins: 3 })));
    setEventLog([]);
    setRound(1);
    setOrder(players.map((_, index) => index));
    setActiveIndex(0);
    setOverlay(null);
    pendingActionRef.current = null;
    miniGamePromptKeyRef.current = null;
    lastTurnPromptRef.current = null;
    if (players.length >= 2) {
      prepareMiniGame(true);
    } else {
      setPhase("waiting");
    }
  }, [players]);

  useEffect(() => {
    resetGameState();
  }, [players, resetGameState]);

  const addLogEntry = useCallback(
    (message) => {
      setEventLog((prev) => [message, ...prev].slice(0, 12));
    },
    []
  );

  const prepareMiniGame = useCallback(
    (initial = false) => {
      if (players.length < 2) {
        setPhase("waiting");
        return;
      }
      const games = copy.miniGames;
      const nextMini = games[Math.floor(Math.random() * games.length)];
      setCurrentMiniGame(nextMini);
      setPhase(initial ? "minigame" : "minigame");
    },
    [players.length, copy]
  );

  const resolveMiniGame = useCallback(() => {
    if (players.length < 2) {
      return;
    }
    const shuffled = shuffleArrayFisherYates(players.map((_, index) => index));
    setOrder(shuffled);
    const updates = [...scores];
    shuffled.forEach((playerIndex, rank) => {
      const reward = MINI_GAME_REWARDS[rank] ?? 0;
      if (reward > 0) {
        updates[playerIndex] = {
          ...updates[playerIndex],
          coins: updates[playerIndex].coins + reward,
        };
      }
    });
    setScores(updates);
    const rankingNames = shuffled.map((idx) => {
      const raw = players[idx]?.name;
      if (typeof raw === "string" && raw.trim().length > 0) {
        return raw.trim();
      }
      return `P${idx + 1}`;
    });
    addLogEntry(`${copy.miniGame.headline}: ${rankingNames.join(" > ")}`);
    setActiveIndex(0);
    setPhase("turn");
    setLastRoll(null);
    lastTurnPromptRef.current = null;
    setOverlay({
      type: "order",
      title: formatTemplate(copy.roundLabel, { round }),
      subtitle: copy.overlays.orderTitle,
      body: copy.overlays.orderBody,
      list: rankingNames.length > 0 ? rankingNames.map((name, idx) => `${idx + 1}. ${name}`) : [],
      buttonLabel: copy.overlays.orderButton,
    });
  }, [players, scores, addLogEntry, copy, round]);

  useEffect(() => {
    if (phase !== "minigame") {
      miniGamePromptKeyRef.current = null;
      return;
    }
    if (!currentMiniGame) {
      return;
    }
    lastTurnPromptRef.current = null;
    const promptKey = `${round}-${currentMiniGame.name ?? ""}`;
    if (overlay || miniGamePromptKeyRef.current === promptKey) {
      return;
    }
    miniGamePromptKeyRef.current = promptKey;
    const descriptionCopy = formatTemplate(copy.miniGame.description, { description: currentMiniGame.description });
    setOverlay({
      type: "minigame",
      title: formatTemplate(copy.roundLabel, { round }),
      subtitle: formatTemplate(copy.miniGame.prompt, { name: currentMiniGame.name }),
      bodyLines: [descriptionCopy, copy.overlays.miniGameBody],
      footnote: copy.miniGame.rewards,
      buttonLabel: copy.overlays.miniGameButton,
    });
  }, [phase, currentMiniGame, overlay, copy, round]);

  useEffect(() => {
    if (phase !== "turn") {
      pendingActionRef.current = null;
    }
  }, [phase]);

  const handleSpaceEffect = useCallback(
    (playerIndex, space, playerName) => {
      let extraPosition = null;
      const scoreUpdates = [...scores];
      const currentScore = scoreUpdates[playerIndex] ?? { stars: 0, coins: 0 };
      switch (space.type) {
        case "bonus": {
          const coins = space.coins ?? 2;
          scoreUpdates[playerIndex] = { ...currentScore, coins: currentScore.coins + coins };
          addLogEntry(formatTemplate(copy.events.bonus, { player: playerName, coins }));
          break;
        }
        case "challenge": {
          addLogEntry(formatTemplate(copy.events.challenge, { player: playerName }));
          break;
        }
        case "drink": {
          const loss = Math.min(space.coins ?? 1, currentScore.coins);
          scoreUpdates[playerIndex] = { ...currentScore, coins: currentScore.coins - loss };
          addLogEntry(formatTemplate(copy.events.drink, { player: playerName, coins: loss }));
          break;
        }
        case "shop": {
          if (currentScore.coins >= 5) {
            scoreUpdates[playerIndex] = {
              stars: currentScore.stars + 1,
              coins: currentScore.coins - 5,
            };
            addLogEntry(formatTemplate(copy.events.shopSuccess, { player: playerName }));
          } else {
            addLogEntry(formatTemplate(copy.events.shopFail, { player: playerName }));
          }
          break;
        }
        case "star": {
          if (currentScore.coins >= 5) {
            scoreUpdates[playerIndex] = {
              stars: currentScore.stars + 1,
              coins: currentScore.coins - 5,
            };
            addLogEntry(formatTemplate(copy.events.starSpaceSuccess, { player: playerName }));
          } else {
            addLogEntry(formatTemplate(copy.events.starSpaceFail, { player: playerName }));
          }
          break;
        }
        case "warp": {
          if (typeof space.target === "number") {
            extraPosition = Math.max(0, Math.min(space.target, BOARD_SPACES.length - 1));
            addLogEntry(
              formatTemplate(copy.events.warp, {
                player: playerName,
                space: BOARD_SPACES[extraPosition].label[language === "en" ? "en" : "de"],
              })
            );
          }
          break;
        }
        case "duel": {
          const opponents = scores
            .map((score, idx) => ({ idx, coins: score?.coins ?? 0 }))
            .filter((entry) => entry.idx !== playerIndex && entry.coins > 0);
          if (opponents.length > 0) {
            opponents.sort((a, b) => b.coins - a.coins);
            const target = opponents[0];
            scoreUpdates[playerIndex] = {
              ...currentScore,
              coins: currentScore.coins + 1,
            };
            const targetScore = scores[target.idx] ?? { coins: 0, stars: 0 };
            scoreUpdates[target.idx] = {
              ...targetScore,
              coins: targetScore.coins - 1,
            };
            const targetName = players[target.idx]?.name ?? "?";
            addLogEntry(formatTemplate(copy.events.duelWin, { player: playerName, target: targetName }));
          } else {
            addLogEntry(formatTemplate(copy.events.lounge, { player: playerName }));
          }
          break;
        }
        case "lounge": {
          addLogEntry(formatTemplate(copy.events.lounge, { player: playerName }));
          break;
        }
        default:
          break;
      }
      setScores(scoreUpdates);
      return extraPosition;
    },
    [scores, copy, addLogEntry, players, language]
  );

  const advanceTurn = useCallback(
    (nextPhase = "turn") => {
      const nextIndex = activeIndex + 1;
      if (nextIndex >= order.length) {
        setRound((prev) => prev + 1);
        setLastRoll(null);
        prepareMiniGame();
      } else {
        setLastRoll(null);
        setActiveIndex(nextIndex);
        setPhase(nextPhase);
      }
    },
    [activeIndex, order.length, prepareMiniGame]
  );

  const rollDice = useCallback(() => {
    if (phase !== "turn" || players.length === 0) {
      pendingActionRef.current = null;
      return;
    }
    const playerGlobalIndex = order[activeIndex];
    const playerName = players[playerGlobalIndex]?.name ?? `P${playerGlobalIndex + 1}`;
    const roll = Math.floor(Math.random() * 6) + 1;
    setLastRoll(roll);
    let targetIndex = 0;
    setPositions((prev) => {
      const next = [...prev];
      const currentPos = next[playerGlobalIndex] ?? 0;
      targetIndex = currentPos + roll;
      if (targetIndex >= BOARD_SPACES.length) {
        targetIndex = BOARD_SPACES.length - 1;
      }
      next[playerGlobalIndex] = targetIndex;
      return next;
    });
    const landingSpace = BOARD_SPACES[targetIndex];
    addLogEntry(
      formatTemplate(copy.events.roll, {
        player: playerName,
        roll,
        space: landingSpace.label[language === "en" ? "en" : "de"],
      })
    );
    const extraPosition = handleSpaceEffect(playerGlobalIndex, landingSpace, playerName);
    if (typeof extraPosition === "number") {
      setPositions((prev) => {
        const next = [...prev];
        next[playerGlobalIndex] = extraPosition;
        return next;
      });
    }
    pendingActionRef.current = null;
    advanceTurn("turn");
  }, [
    phase,
    players,
    order,
    activeIndex,
    copy.events,
    language,
    handleSpaceEffect,
    addLogEntry,
    advanceTurn,
  ]);

  useEffect(() => {
    if (phase !== "turn") {
      lastTurnPromptRef.current = null;
      return;
    }
    if (overlay || pendingActionRef.current) {
      return;
    }
    const playerGlobalIndex = order[activeIndex];
    if (typeof playerGlobalIndex !== "number" || playerGlobalIndex < 0) {
      return;
    }
    const promptKey = `${round}-${playerGlobalIndex}-${positions[playerGlobalIndex] ?? 0}`;
    if (lastTurnPromptRef.current === promptKey) {
      return;
    }
    lastTurnPromptRef.current = promptKey;
    const playerName = players[playerGlobalIndex]?.name ?? `P${playerGlobalIndex + 1}`;
    setOverlay({
      type: "turn",
      title: formatTemplate(copy.roundLabel, { round }),
      subtitle: formatTemplate(copy.turn.prompt, { player: playerName }),
      body: copy.overlays.turnBody,
      buttonLabel: copy.overlays.turnButton,
      onConfirm: () => {
        pendingActionRef.current = "rolling";
        rollDice();
      },
    });
  }, [phase, overlay, order, activeIndex, positions, players, copy, round, rollDice]);

  const formatPositionLabel = useCallback(
    (index) => {
      const space = BOARD_SPACES[index];
      if (!space) {
        return copy.scoreboard.position.replace("{{index}}", index + 1);
      }
      return space.label[language === "en" ? "en" : "de"];
    },
    [language, copy.scoreboard.position]
  );

  const boardGrid = useMemo(() => {
    const maxRow = Math.max(...BOARD_SPACES.map((space) => space.position.row));
    const maxCol = Math.max(...BOARD_SPACES.map((space) => space.position.col));
    const grid = Array.from({ length: maxRow + 1 }, () => Array(maxCol + 1).fill(null));
    BOARD_SPACES.forEach((space, index) => {
      const { row, col } = space.position;
      if (grid[row]) {
        grid[row][col] = { ...space, index };
      }
    });
    return grid;
  }, []);

  const occupantsBySpace = useMemo(() => {
    const map = new Map();
    positions.forEach((spaceIndex, playerIndex) => {
      const target = typeof spaceIndex === "number" ? spaceIndex : 0;
      if (!map.has(target)) {
        map.set(target, []);
      }
      map.get(target).push(playerIndex);
    });
    return map;
  }, [positions]);

  const getInitials = useCallback((name, fallback) => {
    if (!name || typeof name !== "string") {
      return fallback;
    }
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return fallback;
    }
    const parts = trimmed.split(/\s+/);
    const initials = parts.map((part) => part[0]).join("");
    return initials.slice(0, 2).toUpperCase();
  }, []);

  if (players.length < 2) {
    return (
      <ImageBackground source={require("../../assets/images/bar/table.png")} style={{ flex: 1 }}>
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyTitle}>{copy.title}</Text>
          <Text style={styles.emptySubtitle}>{copy.needPlayers}</Text>
          <TouchableOpacity
            style={[appStyles.chalkboardButton, { marginTop: 24 }]}
            onPress={() => navigation.navigate("AddPlayer")}
          >
            <Text style={appStyles.chalkboardButtonText}>{copy.addPlayers}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  const activePlayerIndex = order[activeIndex] ?? 0;
  const activePlayerName = players[activePlayerIndex]?.name ?? `P${activePlayerIndex + 1}`;

  const TYPE_ABBREV = {
    start: '⭘',
    bonus: 'B',
    challenge: 'C',
    drink: 'D',
    shop: '$',
    star: '★',
    warp: '↗',
    duel: '⚔',
    lounge: '☕',
    default: '•',
  };

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={appStyles.textHeader1}>{copy.title}</Text>
          <View style={styles.headerTips}>
            <View style={styles.tipChip}><Text style={styles.tipText}>{language === 'de' ? '🎯 Minispiel legt Reihenfolge fest' : '🎯 Mini game sets the order'}</Text></View>
            <View style={styles.tipChip}><Text style={styles.tipText}>{language === 'de' ? '🎲 Zieh vor, folge dem Feld' : '🎲 Move forward, follow the tile'}</Text></View>
            <View style={styles.tipChip}><Text style={styles.tipText}>{language === 'de' ? '⭐ 5 Münzen = 1 Stern' : '⭐ 5 coins = 1 star'}</Text></View>
          </View>
        </View>

        <View style={styles.roundBadge}>
          <Text style={styles.roundText}>{formatTemplate(copy.roundLabel, { round })}</Text>
        </View>

        {phase === "minigame" && currentMiniGame ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{copy.miniGame.headline}</Text>
            <Text style={styles.cardSubtitle}>
              {formatTemplate(copy.miniGame.prompt, { name: currentMiniGame.name })}
            </Text>
            <Text style={styles.cardBody}>{formatTemplate(copy.miniGame.description, { description: currentMiniGame.description })}</Text>
            <Text style={styles.cardBody}>{copy.miniGame.rewards}</Text>
            <Text style={[styles.cardBody, { marginTop: 8 }]}>{copy.miniGame.ready}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={resolveMiniGame}>
              <Text style={styles.primaryButtonText}>{copy.buttons.resolveMiniGame}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {phase === "turn" ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{copy.turn.headline}</Text>
            <Text style={styles.cardSubtitle}>
              {formatTemplate(copy.turn.prompt, { player: activePlayerName })}
            </Text>
            {lastRoll != null ? (
              <Text style={styles.cardBody}>
                {formatTemplate(copy.turn.lastRoll, { value: lastRoll })}
              </Text>
            ) : (
              <Text style={styles.cardBody}>{copy.turn.waiting}</Text>
            )}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                pendingActionRef.current = "rolling";
                rollDice();
              }}
            >
              <Text style={styles.primaryButtonText}>{copy.buttons.roll}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[styles.card, styles.boardCard]}>
          <Text style={styles.cardTitle}>{copy.board.title}</Text>
          <Text style={styles.boardHint}>{copy.board.hint}</Text>
          <View style={styles.boardGrid}>
            {boardGrid.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.boardRow}>
                {row.map((space, colIndex) => {
                  if (!space) {
                    return <View key={`empty-${rowIndex}-${colIndex}`} style={styles.boardCellEmpty} />;
                  }
                  const theme = SPACE_THEMES[space.type] ?? SPACE_THEMES.default;
                  const occupantIndices = occupantsBySpace.get(space.index) ?? [];
                  const typeLegend = copy.legend.entries[space.type];
                  const typeTitle =
                    typeLegend?.title ?? space.type.charAt(0).toUpperCase() + space.type.slice(1);
                  const description =
                    space.description?.[language === "en" ? "en" : "de"] ?? typeLegend?.body ?? "";
                  const isActiveSpace = occupantIndices.includes(activePlayerIndex);
                  return (
                    <TouchableOpacity
                      key={space.key}
                      style={[
                        styles.boardCell,
                        { backgroundColor: theme.backgroundColor, borderColor: theme.borderColor },
                        isActiveSpace ? styles.boardCellActive : null,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => {
                        setOverlay({
                          title: typeTitle,
                          subtitle: space.label[language === 'en' ? 'en' : 'de'],
                          body: description,
                          buttonLabel: language === 'en' ? 'OK' : 'OK',
                        });
                      }}
                    >
                      <View style={styles.boardCellHeaderSmall}>
                        <Text style={styles.boardIndex}>{String(space.index + 1).padStart(2, '0')}</Text>
                      </View>
                      <View style={styles.boardSymbolWrap}>
                        <Text style={styles.boardSymbol}>{TYPE_ABBREV[space.type] ?? TYPE_ABBREV.default}</Text>
                      </View>
                      <View style={styles.boardOccupants}>
                        {occupantIndices.length === 0 ? (
                          <Text style={styles.boardEmptySlot}>-</Text>
                        ) : (
                          occupantIndices.map((playerIndex) => {
                            const playerName = players[playerIndex]?.name ?? `P${playerIndex + 1}`;
                            return (
                              <View key={`${space.key}-${playerIndex}`} style={styles.token}>
                                <Text style={styles.tokenText}>
                                  {getInitials(playerName, `P${playerIndex + 1}`)}
                                </Text>
                              </View>
                            );
                          })
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{copy.legend.title}</Text>
          {Object.entries(copy.legend.entries).map(([type, item]) => {
            const theme = SPACE_THEMES[type] ?? SPACE_THEMES.default;
            return (
              <View key={type} style={styles.legendRow}>
                <View
                  style={[
                    styles.legendSwatch,
                    { backgroundColor: theme.backgroundColor, borderColor: theme.borderColor },
                  ]}
                />
                <View style={styles.legendTextBlock}>
                  <Text style={styles.legendTitle}>{item.title}</Text>
                  <Text style={styles.legendBody}>{item.body}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>{copy.scoreboard.title}</Text>
          {scores.map((score, index) => {
            const player = players[index];
            const positionIndex = positions[index] ?? 0;
            const positionCopy = formatTemplate(copy.scoreboard.position, { index: positionIndex + 1 });
            const positionLabel = formatPositionLabel(positionIndex);
            const isPlayerActive = index === activePlayerIndex;
            return (
              <View
                key={player?.name ?? index}
                style={[styles.scoreRow, isPlayerActive ? styles.scoreRowActive : null]}
              >
                <View style={styles.scoreNameColumn}>
                  <Text style={styles.scoreName}>{player?.name ?? `P${index + 1}`}</Text>
                  <Text style={styles.scorePosition}>{positionCopy}</Text>
                  <Text style={styles.scoreSpaceLabel}>{positionLabel}</Text>
                </View>
                <View style={styles.scoreValueColumn}>
                  <Text style={styles.scoreValue}>
                    {copy.scoreboard.stars}: {score?.stars ?? 0}
                  </Text>
                  <Text style={styles.scoreValue}>
                    {copy.scoreboard.coins}: {score?.coins ?? 0}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>


        <View style={styles.logCard}>
          <Text style={styles.scoreTitle}>{copy.logTitle}</Text>
          {eventLog.length === 0 ? (
            <Text style={styles.logEmpty}>{copy.logEmpty}</Text>
          ) : (
            eventLog.map((entry, idx) => (
              <Text key={`${entry}-${idx}`} style={styles.logEntry}>
                {entry}
              </Text>
            ))
          )}
        </View>
      </ScrollView>

      <OverlayPrompt overlay={overlay} onConfirm={confirmOverlay} language={language} />

      <InfoText header={copy.info.title} rules={copy.info.body} />
      <InfoHint />
      {/** Regeln-Button entfernt (Tutorials ersetzen ihn) */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  headerTips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  tipChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)'
  },
  tipText: {
    color: '#F5E9D7',
    fontSize: 12,
    fontWeight: '600'
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  header: {
    marginTop: 32,
    marginBottom: 12,
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  roundBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(229,193,133,0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  roundText: {
    color: "#E5C185",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "rgba(18, 22, 32, 0.85)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 15,
    color: "rgba(229,193,133,0.85)",
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
    marginBottom: 4,
  },
  primaryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#E5C185",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: "#1F1712",
    fontSize: 15,
    fontWeight: "600",
  },
  boardCard: {
    paddingBottom: 20,
  },
  boardHint: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  boardGrid: {
    marginTop: 12,
  },
  boardRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  boardCell: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    marginHorizontal: 3,
    minHeight: 64,
  },
  boardCellEmpty: {
    flex: 1,
    marginHorizontal: 3,
    minHeight: 64,
    opacity: 0,
    backgroundColor: "transparent",
  },
  boardCellHeaderSmall: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  boardIndex: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    fontWeight: "600",
  },
  boardSymbolWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  boardSymbol: { color: '#F6D58C', fontSize: 18, fontWeight: '800' },
  boardOccupants: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  boardEmptySlot: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
  },
  boardCellActive: {
    borderColor: "#F6D58C",
    borderWidth: 2,
    shadowColor: "#F6D58C",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  token: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(229,193,133,0.28)",
    borderWidth: 1,
    borderColor: "rgba(229,193,133,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  tokenText: {
    color: "#F8E5C5",
    fontWeight: "700",
    fontSize: 12,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  legendSwatch: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  legendTextBlock: {
    flex: 1,
  },
  legendTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  legendBody: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  overlayBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(8,12,20,0.82)",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayCard: {
    width: "100%",
    backgroundColor: "rgba(24,30,44,0.96)",
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(229,193,133,0.4)",
  },
  overlayTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  overlaySubtitle: {
    color: "#E5C185",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  overlayBody: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  overlayList: {
    marginTop: 8,
  },
  overlayListItem: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 20,
  },
  overlayFootnote: {
    marginTop: 12,
    color: "rgba(229,193,133,0.85)",
    fontSize: 12,
  },
  overlayButton: {
    marginTop: 20,
    backgroundColor: "#E5C185",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
  },
  overlayButtonText: {
    color: "#1F1712",
    fontSize: 16,
    fontWeight: "700",
  },
  scoreCard: {
    backgroundColor: "rgba(12,16,26,0.9)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 18,
    marginBottom: 18,
  },
  scoreTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  scoreRowActive: {
    backgroundColor: "rgba(229,193,133,0.12)",
    borderRadius: 12,
    borderBottomWidth: 0,
    paddingHorizontal: 12,
  },
  scoreNameColumn: {
    flex: 1,
  },
  scoreValueColumn: {
    alignItems: "flex-end",
  },
  scoreName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  scorePosition: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 2,
  },
  scoreSpaceLabel: {
    color: "rgba(229,193,133,0.85)",
    fontSize: 12,
    marginTop: 2,
  },
  scoreValue: {
    color: "rgba(229,193,133,0.85)",
    fontSize: 13,
  },
  logCard: {
    backgroundColor: "rgba(12,16,26,0.9)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 18,
    marginBottom: 42,
  },
  logEntry: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginBottom: 6,
  },
  logEmpty: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
  },
});

function OverlayPrompt({ overlay, onConfirm, language }) {
  if (!overlay) {
    return null;
  }
  const buttonLabel =
    overlay.buttonLabel ?? (language === "en" ? "Continue" : "Weiter");
  const bodyLines = overlay.bodyLines ?? (overlay.body ? [overlay.body] : []);
  const filteredBodyLines = bodyLines.filter(
    (line) => typeof line === "string" && line.trim().length > 0
  );
  const listItems = (overlay.list ?? []).filter(
    (item) => typeof item === "string" && item.trim().length > 0
  );

  return (
    <View style={styles.overlayBackdrop}>
      <View style={styles.overlayCard}>
        {overlay.title ? <Text style={styles.overlayTitle}>{overlay.title}</Text> : null}
        {overlay.subtitle ? (
          <Text style={styles.overlaySubtitle}>{overlay.subtitle}</Text>
        ) : null}
        {filteredBodyLines.map((line, idx) => (
          <Text key={`body-${idx}`} style={styles.overlayBody}>
            {line}
          </Text>
        ))}
        {listItems.length > 0 ? (
          <View style={styles.overlayList}>
            {listItems.map((item, idx) => (
              <Text key={`item-${idx}`} style={styles.overlayListItem}>
                {item}
              </Text>
            ))}
          </View>
        ) : null}
        {overlay.footnote ? (
          <Text style={styles.overlayFootnote}>{overlay.footnote}</Text>
        ) : null}
        <TouchableOpacity style={styles.overlayButton} onPress={onConfirm}>
          <Text style={styles.overlayButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PartyBoardGame;

















