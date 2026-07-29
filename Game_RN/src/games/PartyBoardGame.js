// Bar-Odyssee: rundenbasiertes Brettspiel im Stil von Mario Party / Wii Party Island.
// Jede Runde beginnt mit einer echten Gruppen-Challenge (aus dem Wettkampf-Pool), die
// Bonusmuenzen und die Zugreihenfolge vergibt. Danach wuerfelt jede Person nacheinander
// und bewegt sich auf einem Rundkurs vorwaerts; das Feld, auf dem sie landet, zieht eine
// zufaellige Karte aus dem passenden Inhalts-Pool (Trinken, 1v1-Duell, Wahrheit oder
// Pflicht, The-One-Aufgabe, Muenzen, Stern-Tausch, Abkuerzung, Ruhepause). Wer zuerst
// eine Ziel-Sternzahl erreicht (oder nach einer Rundenobergrenze die meisten Sterne hat),
// gewinnt.
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { VariablesContext } from "../../VariablesContext";
import { appStyles } from "../../styles";
import InfoText from "./sublements/InfoText";
import InfoHint from './sublements/InfoHint';

const formatTemplate = (template, values = {}) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = values[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
};

const pickRandom = (list, fallback) => {
  if (Array.isArray(list) && list.length > 0) {
    return list[Math.floor(Math.random() * list.length)];
  }
  return fallback;
};

const STAR_COST = 5;
const TARGET_STARS = 5;
const MAX_ROUNDS = 12;

// Reihenfolge der Feldtypen entlang des Rundkurses. Jeder Besuch zieht innerhalb des Typs
// zufaelligen Inhalt, daher fuehlt sich kein Umlauf wie der vorherige an.
const BOARD_TYPES = [
  "start", "bonus", "drink", "truthOrDare", "warpTo9", "duel", "star", "theOne",
  "drink", "bonus", "truthOrDare", "duel", "star", "bonus", "drink", "warpTo20",
  "theOne", "lounge", "duel", "bonus", "star", "drink",
];
const BOARD_LENGTH = BOARD_TYPES.length;
const warpTargetOf = (type) => (type === "warpTo9" ? 9 : type === "warpTo20" ? 20 : null);
const normalizedType = (type) => (type.startsWith("warp") ? "warp" : type);

const BOARD_COLUMNS = 6;
const BOARD_LAYOUT = (() => {
  const layout = [];
  let row = 0;
  let col = 0;
  for (let i = 0; i < BOARD_LENGTH; i += 1) {
    const reversed = row % 2 === 1;
    layout.push({ row, col: reversed ? BOARD_COLUMNS - 1 - col : col });
    col += 1;
    if (col >= BOARD_COLUMNS) {
      col = 0;
      row += 1;
    }
  }
  return layout;
})();

const TYPE_META = {
  start: { icon: "🏁", backgroundColor: "rgba(68, 86, 105, 0.85)", borderColor: "#E5C185" },
  bonus: { icon: "💰", backgroundColor: "rgba(38, 68, 52, 0.85)", borderColor: "rgba(149, 213, 178, 0.8)" },
  drink: { icon: "🍹", backgroundColor: "rgba(125, 53, 62, 0.85)", borderColor: "rgba(249, 144, 155, 0.45)" },
  star: { icon: "⭐", backgroundColor: "rgba(150, 102, 60, 0.85)", borderColor: "rgba(255, 214, 137, 0.5)" },
  warp: { icon: "🌀", backgroundColor: "rgba(46, 70, 100, 0.85)", borderColor: "rgba(147, 206, 255, 0.45)" },
  duel: { icon: "⚔️", backgroundColor: "rgba(92, 60, 112, 0.85)", borderColor: "rgba(214, 154, 255, 0.42)" },
  truthOrDare: { icon: "🎯", backgroundColor: "rgba(72, 52, 92, 0.85)", borderColor: "rgba(204, 153, 255, 0.45)" },
  theOne: { icon: "🃏", backgroundColor: "rgba(54, 66, 105, 0.85)", borderColor: "rgba(124, 167, 255, 0.45)" },
  lounge: { icon: "💺", backgroundColor: "rgba(45, 57, 76, 0.85)", borderColor: "rgba(180, 190, 205, 0.3)" },
  default: { icon: "•", backgroundColor: "rgba(24, 30, 44, 0.85)", borderColor: "rgba(255, 255, 255, 0.08)" },
};

const FLAVOR = {
  bonus: [
    { de: "{{player}} findet eine Runde Freigetränke und kassiert {{coins}} Münzen.", en: "{{player}} finds a round of free drinks and gains {{coins}} coins." },
    { de: "{{player}} gewinnt an der Losbude {{coins}} Münzen.", en: "{{player}} wins {{coins}} coins at the raffle stand." },
    { de: "{{player}} schnappt sich Trinkgeld vom Tresen: {{coins}} Münzen.", en: "{{player}} grabs a tip off the bar: {{coins}} coins." },
    { de: "{{player}} findet {{coins}} Münzen unter einem Bierdeckel.", en: "{{player}} finds {{coins}} coins under a coaster." },
    { de: "Die Bar spendiert {{player}} {{coins}} Münzen für gute Laune.", en: "The bar treats {{player}} to {{coins}} coins for good vibes." },
  ],
  drink: [
    { de: "{{player}} muss {{sips}} Schluck(e) nehmen — Pech gehabt an der Theke.", en: "{{player}} takes {{sips}} sip(s) — bad luck at the bar." },
    { de: "{{player}} verschüttet den Drink und nimmt zum Trost {{sips}} Schluck(e).", en: "{{player}} spills their drink and takes {{sips}} consolation sip(s)." },
    { de: "{{player}} wird Zeuge eines Trinkspruchs und muss {{sips}} Schluck(e) mitmachen.", en: "{{player}} witnesses a toast and has to join in with {{sips}} sip(s)." },
    { de: "{{player}} landet in der Shot-Gasse: {{sips}} Schluck(e) fällig.", en: "{{player}} lands in Shot Alley: {{sips}} sip(s) due." },
    { de: "{{player}} verliert eine Runde Bier-Pong und trinkt {{sips}} Schluck(e).", en: "{{player}} loses a round of beer pong and drinks {{sips}} sip(s)." },
  ],
  loungeText: [
    { de: "{{player}} setzt sich kurz hin und verschnauft. Keine Aktion.", en: "{{player}} sits down for a breather. No effect." },
    { de: "{{player}} plaudert an der Bar. Nichts weiter passiert.", en: "{{player}} chats at the bar. Nothing else happens." },
    { de: "{{player}} genießt die Musik einen Moment lang. Keine Aktion.", en: "{{player}} enjoys the music for a moment. No effect." },
  ],
  starSuccess: [
    { de: "{{player}} tauscht {{cost}} Münzen gegen einen glitzernden Stern.", en: "{{player}} trades {{cost}} coins for a sparkling star." },
    { de: "{{player}} bekommt für {{cost}} Münzen Applaus und einen Stern.", en: "{{player}} gets applause and a star for {{cost}} coins." },
  ],
  starFail: [
    { de: "{{player}} hat nicht genug Münzen für einen Stern ({{cost}} nötig).", en: "{{player}} doesn't have enough coins for a star ({{cost}} needed)." },
  ],
  warp: [
    { de: "{{player}} nimmt die Abkürzung und springt vor.", en: "{{player}} takes the shortcut and jumps ahead." },
  ],
  start: [
    { de: "{{player}} kommt an der Bar vorbei und kassiert 2 Bonus-Münzen.", en: "{{player}} passes the bar and picks up 2 bonus coins." },
  ],
};

const BASE_COPY = {
  de: {
    title: "Bar-Odyssee",
    subtitle: "Ein rundenbasiertes Partyspiel: Gruppen-Challenge, Würfeln, Feldkarten - wer zuerst 5 Sterne sammelt, gewinnt.",
    needPlayers: "Fügt mindestens zwei Spieler*innen hinzu, um loszulegen.",
    addPlayers: "Spieler hinzufügen",
    roundLabel: "Runde {{round}} / {{maxRound}}",
    miniGame: {
      headline: "Gruppen-Challenge",
      instruction: "Spielt diese Challenge jetzt live in der Runde. Tippt danach auf die Person, die gewonnen hat.",
      reward: "Gewinn: +3 Münzen und startet diese Runde.",
    },
    turn: {
      headline: "{{player}} ist dran",
      body: "Gebt {{player}} das Handy. Tippt auf Würfeln, um euch vorwärts zu bewegen.",
      button: "Würfeln",
      rollResult: "{{player}} würfelt eine {{roll}}!",
    },
    events: {
      truthOrDareChoice: "{{player}}, wählt: Wahrheit oder Pflicht?",
      truthOrDareTruth: "Wahrheit",
      truthOrDareDare: "Pflicht",
      truthOrDareReward: "+1 Münze für erledigt.",
      theOneReward: "+1 Münze für erledigt.",
      duelPrompt: "1v1-Duell: {{player}} gegen {{opponent}}",
      duelQuestion: "Wer hat gewonnen?",
      duelReward: "Gewinn: 2 Münzen von {{opponent}}, Verlierer*in trinkt einen Schluck.",
      done: "Erledigt, weiter",
    },
    buttons: {
      continue: "Weiter",
      newGame: "Neues Spiel starten",
    },
    scoreboard: { title: "Rangliste", stars: "Sterne", coins: "Münzen", position: "Feld {{index}}" },
    logTitle: "Ereignisse",
    logEmpty: "Noch keine Ereignisse.",
    legend: {
      title: "Feld-Legende",
      entries: {
        start: { title: "Start", body: "Hier beginnt der Rundkurs." },
        bonus: { title: "Bonusfeld", body: "Erhaltet zusätzliche Münzen." },
        drink: { title: "Trinkfeld", body: "Nehmt ein paar Schlucke." },
        star: { title: "Sternfeld", body: `Tauscht ${STAR_COST} Münzen gegen einen Stern.` },
        warp: { title: "Shortcut", body: "Springt direkt vorwärts auf dem Rundkurs." },
        duel: { title: "1v1-Duell", body: "Fordert eine zufällige Person zu einer kurzen Challenge heraus." },
        truthOrDare: { title: "Wahrheit oder Pflicht", body: "Wählt Wahrheit oder Pflicht." },
        theOne: { title: "The-One-Karte", body: "Zieht eine Aufgabe aus The One." },
        lounge: { title: "Lounge", body: "Kurze Pause ohne Effekt." },
      },
    },
    board: { title: "Der Rundkurs", hint: "Farben zeigen den Feldtyp, Initialen die Position aller Spieler*innen." },
    finished: {
      title: "Spiel vorbei!",
      winner: "🏆 {{player}} gewinnt mit {{stars}} Sternen!",
      body: "Danke fürs Mitspielen - startet jederzeit eine neue Runde.",
    },
    info: {
      title: "So funktioniert die Bar-Odyssee",
      body: `Jede Runde startet mit einer Gruppen-Challenge (live in der Runde gespielt, ohne Material) - die gewinnende Person bekommt Bonusmünzen und beginnt die Runde. Danach würfelt jede Person nacheinander und zieht vorwärts. Felder bringen Trinken, 1v1-Duelle, Wahrheit-oder-Pflicht, Aufgaben aus The One, Bonusmünzen, Abkürzungen oder Sternfelder (${STAR_COST} Münzen = 1 Stern). Wer zuerst ${TARGET_STARS} Sterne sammelt oder nach ${MAX_ROUNDS} Runden die meisten Sterne hat, gewinnt.`,
    },
  },
  en: {
    title: "Bar Odyssey",
    subtitle: "A round-based party board game: group challenge, dice, tile cards - first to 5 stars wins.",
    needPlayers: "Add at least two players to get started.",
    addPlayers: "Add players",
    roundLabel: "Round {{round}} / {{maxRound}}",
    miniGame: {
      headline: "Group Challenge",
      instruction: "Play this challenge live right now. Then tap whoever won.",
      reward: "Reward: +3 coins and starts this round.",
    },
    turn: {
      headline: "{{player}}'s turn",
      body: "Hand the phone to {{player}}. Tap roll to move forward.",
      button: "Roll the dice",
      rollResult: "{{player}} rolls a {{roll}}!",
    },
    events: {
      truthOrDareChoice: "{{player}}, choose: Truth or Dare?",
      truthOrDareTruth: "Truth",
      truthOrDareDare: "Dare",
      truthOrDareReward: "+1 coin for completing it.",
      theOneReward: "+1 coin for completing it.",
      duelPrompt: "1v1 duel: {{player}} vs {{opponent}}",
      duelQuestion: "Who won?",
      duelReward: "Reward: 2 coins from {{opponent}}, loser takes a sip.",
      done: "Done, continue",
    },
    buttons: {
      continue: "Continue",
      newGame: "Start new game",
    },
    scoreboard: { title: "Scoreboard", stars: "Stars", coins: "Coins", position: "Space {{index}}" },
    logTitle: "Event Log",
    logEmpty: "No events yet.",
    legend: {
      title: "Field legend",
      entries: {
        start: { title: "Start", body: "Where the loop begins." },
        bonus: { title: "Bonus", body: "Gain extra coins." },
        drink: { title: "Drink tile", body: "Take a few sips." },
        star: { title: "Star tile", body: `Trade ${STAR_COST} coins for a star.` },
        warp: { title: "Shortcut", body: "Jump forward along the loop." },
        duel: { title: "1v1 duel", body: "Challenge a random player to a quick contest." },
        truthOrDare: { title: "Truth or Dare", body: "Pick truth or dare." },
        theOne: { title: "The One card", body: "Draw a task from The One." },
        lounge: { title: "Lounge", body: "A calm spot with no effect." },
      },
    },
    board: { title: "The Loop", hint: "Colors show the tile type, initials show where everyone stands." },
    finished: {
      title: "Game Over!",
      winner: "🏆 {{player}} wins with {{stars}} stars!",
      body: "Thanks for playing - start a new round any time.",
    },
    info: {
      title: "How the Bar Odyssey works",
      body: `Each round starts with a group challenge (played live, no materials needed) - the winner gets bonus coins and starts the round. Then everyone rolls in turn and moves forward. Tiles bring drinks, 1v1 duels, truth or dare, The One tasks, bonus coins, shortcuts, or star tiles (${STAR_COST} coins = 1 star). First to ${TARGET_STARS} stars, or the most stars after ${MAX_ROUNDS} rounds, wins.`,
    },
  },
};

const getInitials = (name, fallback) => {
  if (!name || typeof name !== "string") return fallback;
  const trimmed = name.trim();
  if (trimmed.length === 0) return fallback;
  const parts = trimmed.split(/\s+/);
  return parts.map((part) => part[0]).join("").slice(0, 2).toUpperCase();
};

const PartyBoardGame = ({ navigation }) => {
  const { players, language, approvedTheOnePrompts, theOnePrompts, spinTheBottleTruths, spinTheBottleDares } =
    useContext(VariablesContext);
  const lang = language === "en" ? "en" : "de";
  const copy = useMemo(() => BASE_COPY[lang], [lang]);

  const rawTheOnePrompts = useMemo(() => {
    if (Array.isArray(approvedTheOnePrompts) && approvedTheOnePrompts.length > 0) return approvedTheOnePrompts;
    return Array.isArray(theOnePrompts) ? theOnePrompts : [];
  }, [approvedTheOnePrompts, theOnePrompts]);

  const duelPool = useMemo(() => rawTheOnePrompts.filter((p) => p?.pool?.key === "duel"), [rawTheOnePrompts]);
  const groupChallengePool = useMemo(
    () => rawTheOnePrompts.filter((p) => ["competition", "ffa-best", "ffa-giveup"].includes(p?.pool?.key)),
    [rawTheOnePrompts]
  );
  // Duell/Wettkampf-Pools bleiben den dedizierten Duel-/Gruppen-Challenge-Feldern vorbehalten,
  // damit ein "The One"-Feld sich inhaltlich von den anderen Feldtypen abhebt.
  const theOneFlavorPool = useMemo(
    () =>
      rawTheOnePrompts.filter(
        (p) =>
          p &&
          !p.custom_payload &&
          typeof p.content === "string" &&
          !["duel", "competition", "ffa-best", "ffa-giveup"].includes(p?.pool?.key)
      ),
    [rawTheOnePrompts]
  );
  const truthPool = useMemo(() => (Array.isArray(spinTheBottleTruths) ? spinTheBottleTruths : []), [spinTheBottleTruths]);
  const darePool = useMemo(() => (Array.isArray(spinTheBottleDares) ? spinTheBottleDares : []), [spinTheBottleDares]);

  const promptText = useCallback((entry, fallback) => {
    if (!entry) return fallback;
    return (lang === "en" && entry.content_en ? entry.content_en : entry.content) || fallback;
  }, [lang]);

  const [positions, setPositions] = useState(() => players.map(() => 0));
  const [scores, setScores] = useState(() => players.map(() => ({ stars: 0, coins: 3 })));
  const [eventLog, setEventLog] = useState([]);
  const [round, setRound] = useState(1);
  const [order, setOrder] = useState(() => players.map((_, index) => index));
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState("setup"); // setup | minigame | turn | event | finished
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);

  const addLogEntry = useCallback((message) => {
    setEventLog((prev) => [message, ...prev].slice(0, 12));
  }, []);

  const drawGroupChallenge = useCallback(() => {
    const entry = pickRandom(groupChallengePool, null);
    setCurrentChallenge(entry);
  }, [groupChallengePool]);

  const resetGame = useCallback(() => {
    setPositions(players.map(() => 0));
    setScores(players.map(() => ({ stars: 0, coins: 3 })));
    setEventLog([]);
    setRound(1);
    setOrder(players.map((_, index) => index));
    setActiveIndex(0);
    setPendingEvent(null);
    setWinnerIndex(null);
    if (players.length >= 2) {
      drawGroupChallenge();
      setPhase("minigame");
    } else {
      setPhase("setup");
    }
  }, [players, drawGroupChallenge]);

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players.length]);

  const playerName = useCallback(
    (idx) => {
      const raw = players[idx]?.name;
      return typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : `P${idx + 1}`;
    },
    [players]
  );

  const finishGame = useCallback(() => {
    let bestIdx = 0;
    scores.forEach((score, idx) => {
      const best = scores[bestIdx] ?? { stars: 0, coins: 0 };
      if ((score?.stars ?? 0) > (best.stars ?? 0) || ((score?.stars ?? 0) === (best.stars ?? 0) && (score?.coins ?? 0) > (best.coins ?? 0))) {
        bestIdx = idx;
      }
    });
    setWinnerIndex(bestIdx);
    setPhase("finished");
  }, [scores]);

  const startNextRound = useCallback(() => {
    if (round + 1 > MAX_ROUNDS) {
      finishGame();
      return;
    }
    setRound((prev) => prev + 1);
    drawGroupChallenge();
    setPhase("minigame");
  }, [round, drawGroupChallenge, finishGame]);

  const advanceTurn = useCallback(() => {
    const nextIndex = activeIndex + 1;
    if (nextIndex >= order.length) {
      startNextRound();
    } else {
      setActiveIndex(nextIndex);
      setPhase("turn");
    }
  }, [activeIndex, order.length, startNextRound]);

  const pickMiniGameWinner = useCallback(
    (winnerGlobalIndex) => {
      setScores((prev) => {
        const next = [...prev];
        const current = next[winnerGlobalIndex] ?? { stars: 0, coins: 0 };
        next[winnerGlobalIndex] = { ...current, coins: current.coins + 3 };
        return next;
      });
      setOrder((prev) => [winnerGlobalIndex, ...prev.filter((idx) => idx !== winnerGlobalIndex)]);
      addLogEntry(
        formatTemplate(lang === "en" ? "{{player}} wins the group challenge (+3 coins) and starts this round." : "{{player}} gewinnt die Gruppen-Challenge (+3 Münzen) und startet diese Runde.", {
          player: playerName(winnerGlobalIndex),
        })
      );
      setActiveIndex(0);
      setPhase("turn");
    },
    [addLogEntry, lang, playerName]
  );

  const rollDice = useCallback(() => {
    const activePlayerIdx = order[activeIndex];
    const roll = Math.floor(Math.random() * 6) + 1;
    const oldPos = positions[activePlayerIdx] ?? 0;
    let newPos = oldPos + roll;
    let lapped = false;
    if (newPos >= BOARD_LENGTH) {
      newPos -= BOARD_LENGTH;
      lapped = true;
    }
    setPositions((prev) => {
      const next = [...prev];
      next[activePlayerIdx] = newPos;
      return next;
    });
    if (lapped) {
      setScores((prev) => {
        const next = [...prev];
        const current = next[activePlayerIdx] ?? { stars: 0, coins: 0 };
        next[activePlayerIdx] = { ...current, coins: current.coins + 2 };
        return next;
      });
      addLogEntry(formatTemplate(pickRandom(FLAVOR.start, FLAVOR.start[0])[lang], { player: playerName(activePlayerIdx) }));
    }
    addLogEntry(formatTemplate(copy.turn.rollResult, { player: playerName(activePlayerIdx), roll }));

    const rawType = BOARD_TYPES[newPos];
    const type = normalizedType(rawType);
    const opponents = order.filter((idx) => idx !== activePlayerIdx);

    switch (type) {
      case "bonus": {
        const coins = 2 + Math.floor(Math.random() * 2);
        setPendingEvent({ type: "bonus", playerIndex: activePlayerIdx, coins, flavor: pickRandom(FLAVOR.bonus, FLAVOR.bonus[0]) });
        break;
      }
      case "drink": {
        const sips = 1 + Math.floor(Math.random() * 3);
        setPendingEvent({ type: "drink", playerIndex: activePlayerIdx, sips, flavor: pickRandom(FLAVOR.drink, FLAVOR.drink[0]) });
        break;
      }
      case "star": {
        setPendingEvent({ type: "star", playerIndex: activePlayerIdx });
        break;
      }
      case "warp": {
        const target = warpTargetOf(rawType) ?? newPos;
        setPendingEvent({ type: "warp", playerIndex: activePlayerIdx, target, flavor: pickRandom(FLAVOR.warp, FLAVOR.warp[0]) });
        break;
      }
      case "duel": {
        const opponentIdx = pickRandom(opponents, null);
        if (opponentIdx === null) {
          setPendingEvent({ type: "lounge", playerIndex: activePlayerIdx, flavor: pickRandom(FLAVOR.loungeText, FLAVOR.loungeText[0]) });
          break;
        }
        const challenge = pickRandom(duelPool, null);
        setPendingEvent({ type: "duel", playerIndex: activePlayerIdx, opponentIndex: opponentIdx, challenge });
        break;
      }
      case "truthOrDare": {
        setPendingEvent({ type: "truthOrDare", playerIndex: activePlayerIdx, stage: "choice" });
        break;
      }
      case "theOne": {
        const entry = pickRandom(theOneFlavorPool, null);
        setPendingEvent({ type: "theOne", playerIndex: activePlayerIdx, entry });
        break;
      }
      case "lounge":
      case "start":
      default: {
        setPendingEvent({ type: "lounge", playerIndex: activePlayerIdx, flavor: pickRandom(FLAVOR.loungeText, FLAVOR.loungeText[0]) });
        break;
      }
    }
    setPhase("event");
  }, [order, activeIndex, positions, copy, lang, playerName, addLogEntry, duelPool, theOneFlavorPool]);

  const finishEvent = useCallback(() => {
    setPendingEvent(null);
    const anyStarWinner = scores.some((score) => (score?.stars ?? 0) >= TARGET_STARS);
    if (anyStarWinner) {
      finishGame();
    } else {
      advanceTurn();
    }
  }, [scores, finishGame, advanceTurn]);

  const resolveBonus = useCallback(() => {
    if (!pendingEvent) return;
    const { playerIndex, coins, flavor } = pendingEvent;
    setScores((prev) => {
      const next = [...prev];
      const current = next[playerIndex] ?? { stars: 0, coins: 0 };
      next[playerIndex] = { ...current, coins: current.coins + coins };
      return next;
    });
    addLogEntry(formatTemplate(flavor[lang], { player: playerName(playerIndex), coins }));
    finishEvent();
  }, [pendingEvent, addLogEntry, lang, playerName, finishEvent]);

  const resolveDrink = useCallback(() => {
    if (!pendingEvent) return;
    const { playerIndex, sips, flavor } = pendingEvent;
    addLogEntry(formatTemplate(flavor[lang], { player: playerName(playerIndex), sips }));
    finishEvent();
  }, [pendingEvent, addLogEntry, lang, playerName, finishEvent]);

  const resolveLounge = useCallback(() => {
    if (!pendingEvent) return;
    addLogEntry(formatTemplate(pendingEvent.flavor[lang], { player: playerName(pendingEvent.playerIndex) }));
    finishEvent();
  }, [pendingEvent, addLogEntry, lang, playerName, finishEvent]);

  const resolveStar = useCallback(() => {
    if (!pendingEvent) return;
    const { playerIndex } = pendingEvent;
    // Direkte Lese-dann-Schreib-Aktualisierung statt Updater-Funktion, damit der frisch
    // vergebene Stern SOFORT (im selben Tick) fuer die Sieg-Pruefung sichtbar ist - ueber
    // eine Updater-Funktion waere der neue Wert erst im naechsten Render lesbar und ein
    // Sieg beim entscheidenden Stern wuerde einen Zug zu spaet erkannt.
    const current = scores[playerIndex] ?? { stars: 0, coins: 0 };
    let reachedTarget = false;
    if (current.coins >= STAR_COST) {
      const newStars = current.stars + 1;
      const next = [...scores];
      next[playerIndex] = { stars: newStars, coins: current.coins - STAR_COST };
      setScores(next);
      addLogEntry(formatTemplate(pickRandom(FLAVOR.starSuccess, FLAVOR.starSuccess[0])[lang], { player: playerName(playerIndex), cost: STAR_COST }));
      reachedTarget = newStars >= TARGET_STARS;
    } else {
      addLogEntry(formatTemplate(FLAVOR.starFail[0][lang], { player: playerName(playerIndex), cost: STAR_COST }));
    }
    setPendingEvent(null);
    if (reachedTarget) {
      setWinnerIndex(playerIndex);
      setPhase("finished");
    } else {
      advanceTurn();
    }
  }, [pendingEvent, scores, addLogEntry, lang, playerName, advanceTurn]);

  const resolveWarp = useCallback(() => {
    if (!pendingEvent) return;
    const { playerIndex, target } = pendingEvent;
    setPositions((prev) => {
      const next = [...prev];
      next[playerIndex] = target;
      return next;
    });
    addLogEntry(formatTemplate(pendingEvent.flavor[lang], { player: playerName(playerIndex) }));
    finishEvent();
  }, [pendingEvent, addLogEntry, lang, playerName, finishEvent]);

  const chooseTruthOrDare = useCallback(
    (kind) => {
      if (!pendingEvent) return;
      const pool = kind === "truth" ? truthPool : darePool;
      const entry = pickRandom(pool, null);
      setPendingEvent((prev) => ({ ...prev, stage: "reveal", kind, entry }));
    },
    [pendingEvent, truthPool, darePool]
  );

  const resolveTruthOrDare = useCallback(() => {
    if (!pendingEvent) return;
    const { playerIndex } = pendingEvent;
    setScores((prev) => {
      const next = [...prev];
      const current = next[playerIndex] ?? { stars: 0, coins: 0 };
      next[playerIndex] = { ...current, coins: current.coins + 1 };
      return next;
    });
    finishEvent();
  }, [pendingEvent, finishEvent]);

  const resolveTheOne = useCallback(() => {
    if (!pendingEvent) return;
    const { playerIndex } = pendingEvent;
    setScores((prev) => {
      const next = [...prev];
      const current = next[playerIndex] ?? { stars: 0, coins: 0 };
      next[playerIndex] = { ...current, coins: current.coins + 1 };
      return next;
    });
    finishEvent();
  }, [pendingEvent, finishEvent]);

  const resolveDuel = useCallback(
    (winnerIsActivePlayer) => {
      if (!pendingEvent) return;
      const { playerIndex, opponentIndex } = pendingEvent;
      const winnerIdx = winnerIsActivePlayer ? playerIndex : opponentIndex;
      const loserIdx = winnerIsActivePlayer ? opponentIndex : playerIndex;
      setScores((prev) => {
        const next = [...prev];
        const winnerScore = next[winnerIdx] ?? { stars: 0, coins: 0 };
        const loserScore = next[loserIdx] ?? { stars: 0, coins: 0 };
        const stake = Math.min(2, loserScore.coins);
        next[winnerIdx] = { ...winnerScore, coins: winnerScore.coins + stake };
        next[loserIdx] = { ...loserScore, coins: loserScore.coins - stake };
        return next;
      });
      addLogEntry(
        formatTemplate(
          lang === "en" ? "{{winner}} wins the duel against {{loser}} and takes 2 coins." : "{{winner}} gewinnt das Duell gegen {{loser}} und nimmt 2 Münzen.",
          { winner: playerName(winnerIdx), loser: playerName(loserIdx) }
        )
      );
      finishEvent();
    },
    [pendingEvent, addLogEntry, lang, playerName, finishEvent]
  );

  const boardGrid = useMemo(() => {
    const maxRow = Math.max(...BOARD_LAYOUT.map((p) => p.row));
    const grid = Array.from({ length: maxRow + 1 }, () => Array(BOARD_COLUMNS).fill(null));
    BOARD_TYPES.forEach((type, index) => {
      const { row, col } = BOARD_LAYOUT[index];
      grid[row][col] = { type: normalizedType(type), index };
    });
    return grid;
  }, []);

  const occupantsBySpace = useMemo(() => {
    const map = new Map();
    positions.forEach((spaceIndex, playerIndex) => {
      const target = typeof spaceIndex === "number" ? spaceIndex : 0;
      if (!map.has(target)) map.set(target, []);
      map.get(target).push(playerIndex);
    });
    return map;
  }, [positions]);

  if (players.length < 2) {
    return (
      <ImageBackground source={require("../../assets/images/bar/table.png")} style={{ flex: 1 }}>
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyTitle}>{copy.title}</Text>
          <Text style={styles.emptySubtitle}>{copy.needPlayers}</Text>
          <TouchableOpacity style={[appStyles.chalkboardButton, { marginTop: 24 }]} onPress={() => navigation.navigate("AddPlayer")}>
            <Text style={appStyles.chalkboardButtonText}>{copy.addPlayers}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  const activePlayerIndex = order[activeIndex] ?? 0;

  const renderModal = () => {
    if (phase === "minigame") {
      return (
        <ModalCard>
          <Text style={styles.overlayTitle}>{copy.miniGame.headline}</Text>
          <Text style={styles.overlaySubtitle}>{promptText(currentChallenge, copy.miniGame.instruction)}</Text>
          <Text style={styles.overlayBody}>{copy.miniGame.instruction}</Text>
          <Text style={styles.overlayFootnote}>{copy.miniGame.reward}</Text>
          <View style={styles.playerButtonWrap}>
            {order.map((idx) => (
              <TouchableOpacity key={idx} style={styles.playerButton} onPress={() => pickMiniGameWinner(idx)}>
                <Text style={styles.playerButtonText}>{playerName(idx)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ModalCard>
      );
    }

    if (phase === "turn") {
      return (
        <ModalCard>
          <Text style={styles.overlayTitle}>{formatTemplate(copy.turn.headline, { player: playerName(activePlayerIndex) })}</Text>
          <Text style={styles.overlayBody}>{formatTemplate(copy.turn.body, { player: playerName(activePlayerIndex) })}</Text>
          <TouchableOpacity style={styles.overlayButton} onPress={rollDice}>
            <Text style={styles.overlayButtonText}>{copy.turn.button}</Text>
          </TouchableOpacity>
        </ModalCard>
      );
    }

    if (phase === "event" && pendingEvent) {
      const p = pendingEvent;
      if (p.type === "bonus") {
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>{TYPE_META.bonus.icon} {copy.legend.entries.bonus.title}</Text>
            <Text style={styles.overlayBody}>{formatTemplate(p.flavor[lang], { player: playerName(p.playerIndex), coins: p.coins })}</Text>
            <TouchableOpacity style={styles.overlayButton} onPress={resolveBonus}>
              <Text style={styles.overlayButtonText}>{copy.buttons.continue}</Text>
            </TouchableOpacity>
          </ModalCard>
        );
      }
      if (p.type === "drink") {
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>{TYPE_META.drink.icon} {copy.legend.entries.drink.title}</Text>
            <Text style={styles.overlayBody}>{formatTemplate(p.flavor[lang], { player: playerName(p.playerIndex), sips: p.sips })}</Text>
            <TouchableOpacity style={styles.overlayButton} onPress={resolveDrink}>
              <Text style={styles.overlayButtonText}>{copy.buttons.continue}</Text>
            </TouchableOpacity>
          </ModalCard>
        );
      }
      if (p.type === "star") {
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>{TYPE_META.star.icon} {copy.legend.entries.star.title}</Text>
            <Text style={styles.overlayBody}>{copy.legend.entries.star.body}</Text>
            <TouchableOpacity style={styles.overlayButton} onPress={resolveStar}>
              <Text style={styles.overlayButtonText}>{copy.buttons.continue}</Text>
            </TouchableOpacity>
          </ModalCard>
        );
      }
      if (p.type === "warp") {
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>{TYPE_META.warp.icon} {copy.legend.entries.warp.title}</Text>
            <Text style={styles.overlayBody}>{formatTemplate(p.flavor[lang], { player: playerName(p.playerIndex) })}</Text>
            <TouchableOpacity style={styles.overlayButton} onPress={resolveWarp}>
              <Text style={styles.overlayButtonText}>{copy.buttons.continue}</Text>
            </TouchableOpacity>
          </ModalCard>
        );
      }
      if (p.type === "lounge") {
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>{TYPE_META.lounge.icon} {copy.legend.entries.lounge.title}</Text>
            <Text style={styles.overlayBody}>{formatTemplate(p.flavor[lang], { player: playerName(p.playerIndex) })}</Text>
            <TouchableOpacity style={styles.overlayButton} onPress={resolveLounge}>
              <Text style={styles.overlayButtonText}>{copy.buttons.continue}</Text>
            </TouchableOpacity>
          </ModalCard>
        );
      }
      if (p.type === "theOne") {
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>{TYPE_META.theOne.icon} {copy.legend.entries.theOne.title}</Text>
            <Text style={styles.overlaySubtitle}>{playerName(p.playerIndex)}</Text>
            <Text style={styles.overlayBody}>{promptText(p.entry, "—")}</Text>
            <Text style={styles.overlayFootnote}>{copy.events.theOneReward}</Text>
            <TouchableOpacity style={styles.overlayButton} onPress={resolveTheOne}>
              <Text style={styles.overlayButtonText}>{copy.events.done}</Text>
            </TouchableOpacity>
          </ModalCard>
        );
      }
      if (p.type === "truthOrDare") {
        if (p.stage === "choice") {
          return (
            <ModalCard>
              <Text style={styles.overlayTitle}>{TYPE_META.truthOrDare.icon} {copy.legend.entries.truthOrDare.title}</Text>
              <Text style={styles.overlayBody}>{formatTemplate(copy.events.truthOrDareChoice, { player: playerName(p.playerIndex) })}</Text>
              <View style={styles.playerButtonWrap}>
                <TouchableOpacity style={styles.playerButton} onPress={() => chooseTruthOrDare("truth")}>
                  <Text style={styles.playerButtonText}>{copy.events.truthOrDareTruth}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.playerButton} onPress={() => chooseTruthOrDare("dare")}>
                  <Text style={styles.playerButtonText}>{copy.events.truthOrDareDare}</Text>
                </TouchableOpacity>
              </View>
            </ModalCard>
          );
        }
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>
              {TYPE_META.truthOrDare.icon} {p.kind === "truth" ? copy.events.truthOrDareTruth : copy.events.truthOrDareDare}
            </Text>
            <Text style={styles.overlaySubtitle}>{playerName(p.playerIndex)}</Text>
            <Text style={styles.overlayBody}>{promptText(p.entry, "—")}</Text>
            <Text style={styles.overlayFootnote}>{copy.events.truthOrDareReward}</Text>
            <TouchableOpacity style={styles.overlayButton} onPress={resolveTruthOrDare}>
              <Text style={styles.overlayButtonText}>{copy.events.done}</Text>
            </TouchableOpacity>
          </ModalCard>
        );
      }
      if (p.type === "duel") {
        return (
          <ModalCard>
            <Text style={styles.overlayTitle}>{TYPE_META.duel.icon} {formatTemplate(copy.events.duelPrompt, { player: playerName(p.playerIndex), opponent: playerName(p.opponentIndex) })}</Text>
            <Text style={styles.overlayBody}>{promptText(p.challenge, "—")}</Text>
            <Text style={styles.overlayFootnote}>{formatTemplate(copy.events.duelReward, { opponent: playerName(p.opponentIndex) })}</Text>
            <Text style={[styles.overlayBody, { marginTop: 12 }]}>{copy.events.duelQuestion}</Text>
            <View style={styles.playerButtonWrap}>
              <TouchableOpacity style={styles.playerButton} onPress={() => resolveDuel(true)}>
                <Text style={styles.playerButtonText}>{playerName(p.playerIndex)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.playerButton} onPress={() => resolveDuel(false)}>
                <Text style={styles.playerButtonText}>{playerName(p.opponentIndex)}</Text>
              </TouchableOpacity>
            </View>
          </ModalCard>
        );
      }
    }

    if (phase === "finished") {
      const winnerScore = scores[winnerIndex] ?? { stars: 0 };
      return (
        <ModalCard>
          <Text style={styles.overlayTitle}>{copy.finished.title}</Text>
          <Text style={styles.overlaySubtitle}>{formatTemplate(copy.finished.winner, { player: playerName(winnerIndex ?? 0), stars: winnerScore.stars ?? 0 })}</Text>
          <Text style={styles.overlayBody}>{copy.finished.body}</Text>
          <TouchableOpacity style={styles.overlayButton} onPress={resetGame}>
            <Text style={styles.overlayButtonText}>{copy.buttons.newGame}</Text>
          </TouchableOpacity>
        </ModalCard>
      );
    }

    return null;
  };

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={appStyles.textHeader1}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>

        <View style={styles.roundBadge}>
          <Text style={styles.roundText}>{formatTemplate(copy.roundLabel, { round, maxRound: MAX_ROUNDS })}</Text>
        </View>

        <View style={[styles.card, styles.boardCard]}>
          <Text style={styles.cardTitle}>{copy.board.title}</Text>
          <Text style={styles.boardHint}>{copy.board.hint}</Text>
          <View style={styles.boardGrid}>
            {boardGrid.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.boardRow}>
                {row.map((cell, colIndex) => {
                  if (!cell) return <View key={`empty-${rowIndex}-${colIndex}`} style={styles.boardCellEmpty} />;
                  const theme = TYPE_META[cell.type] ?? TYPE_META.default;
                  const occupantIndices = occupantsBySpace.get(cell.index) ?? [];
                  const isActiveSpace = occupantIndices.includes(activePlayerIndex);
                  return (
                    <View
                      key={cell.index}
                      style={[
                        styles.boardCell,
                        { backgroundColor: theme.backgroundColor, borderColor: theme.borderColor },
                        isActiveSpace ? styles.boardCellActive : null,
                      ]}
                    >
                      <Text style={styles.boardIndex}>{String(cell.index + 1).padStart(2, "0")}</Text>
                      <View style={styles.boardSymbolWrap}>
                        <Text style={styles.boardSymbol}>{theme.icon}</Text>
                      </View>
                      <View style={styles.boardOccupants}>
                        {occupantIndices.length === 0 ? (
                          <Text style={styles.boardEmptySlot}>-</Text>
                        ) : (
                          occupantIndices.map((playerIndex) => (
                            <View key={`${cell.index}-${playerIndex}`} style={styles.token}>
                              <Text style={styles.tokenText}>{getInitials(playerName(playerIndex), `P${playerIndex + 1}`)}</Text>
                            </View>
                          ))
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{copy.legend.title}</Text>
          {Object.entries(copy.legend.entries).map(([type, item]) => {
            const theme = TYPE_META[type] ?? TYPE_META.default;
            return (
              <View key={type} style={styles.legendRow}>
                <View style={[styles.legendSwatch, { backgroundColor: theme.backgroundColor, borderColor: theme.borderColor }]}>
                  <Text style={styles.legendIcon}>{theme.icon}</Text>
                </View>
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
          {[...order]
            .sort((a, b) => (scores[b]?.stars ?? 0) - (scores[a]?.stars ?? 0) || (scores[b]?.coins ?? 0) - (scores[a]?.coins ?? 0))
            .map((index) => {
              const score = scores[index];
              const positionIndex = positions[index] ?? 0;
              const isPlayerActive = index === activePlayerIndex && (phase === "turn" || phase === "event");
              return (
                <View key={index} style={[styles.scoreRow, isPlayerActive ? styles.scoreRowActive : null]}>
                  <View style={styles.scoreNameColumn}>
                    <Text style={styles.scoreName}>{playerName(index)}</Text>
                    <Text style={styles.scorePosition}>{formatTemplate(copy.scoreboard.position, { index: positionIndex + 1 })}</Text>
                  </View>
                  <View style={styles.scoreValueColumn}>
                    <Text style={styles.scoreValue}>⭐ {score?.stars ?? 0}</Text>
                    <Text style={styles.scoreValue}>💰 {score?.coins ?? 0}</Text>
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

      {renderModal()}

      <InfoText header={copy.info.title} rules={copy.info.body} />
      <InfoHint />
    </ImageBackground>
  );
};

function ModalCard({ children }) {
  return (
    <View style={styles.overlayBackdrop}>
      <ScrollView contentContainerStyle={styles.overlayScroll}>
        <View style={styles.overlayCard}>{children}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingBottom: 80 },
  centeredContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyTitle: { fontSize: 32, fontWeight: "700", color: "#FFFFFF", marginBottom: 12 },
  emptySubtitle: { fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "center" },
  header: { marginTop: 32, marginBottom: 12 },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 8, lineHeight: 20 },
  roundBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(229,193,133,0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  roundText: { color: "#E5C185", fontWeight: "600", fontSize: 14 },
  card: {
    backgroundColor: "rgba(18, 22, 32, 0.85)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  boardCard: { paddingBottom: 20 },
  boardHint: { color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 4, lineHeight: 18 },
  boardGrid: { marginTop: 12 },
  boardRow: { flexDirection: "row", marginBottom: 6 },
  boardCell: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 6, marginHorizontal: 3, minHeight: 64 },
  boardCellEmpty: { flex: 1, marginHorizontal: 3, minHeight: 64, opacity: 0, backgroundColor: "transparent" },
  boardIndex: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "600" },
  boardSymbolWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  boardSymbol: { fontSize: 20 },
  boardOccupants: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, justifyContent: "center" },
  boardEmptySlot: { color: "rgba(255,255,255,0.4)", fontSize: 10, textAlign: "center" },
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
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(229,193,133,0.28)",
    borderWidth: 1,
    borderColor: "rgba(229,193,133,0.6)",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  tokenText: { color: "#F8E5C5", fontWeight: "700", fontSize: 10 },
  legendRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  legendSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  legendIcon: { fontSize: 15 },
  legendTextBlock: { flex: 1 },
  legendTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  legendBody: { color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 18, marginTop: 2 },
  scoreCard: {
    backgroundColor: "rgba(12,16,26,0.9)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 18,
    marginBottom: 18,
  },
  scoreTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  scoreRowActive: { backgroundColor: "rgba(229,193,133,0.12)", borderRadius: 12, borderBottomWidth: 0, paddingHorizontal: 12 },
  scoreNameColumn: { flex: 1 },
  scoreValueColumn: { alignItems: "flex-end" },
  scoreName: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  scorePosition: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
  scoreValue: { color: "rgba(229,193,133,0.85)", fontSize: 13 },
  logCard: {
    backgroundColor: "rgba(12,16,26,0.9)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 18,
    marginBottom: 42,
  },
  logEntry: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 6 },
  logEmpty: { color: "rgba(255,255,255,0.45)", fontSize: 13 },
  overlayBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(8,12,20,0.85)",
    justifyContent: "center",
  },
  overlayScroll: { paddingHorizontal: 24, paddingVertical: 40, flexGrow: 1, justifyContent: "center" },
  overlayCard: {
    width: "100%",
    backgroundColor: "rgba(24,30,44,0.97)",
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(229,193,133,0.4)",
  },
  overlayTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 8 },
  overlaySubtitle: { color: "#E5C185", fontSize: 15, fontWeight: "600", marginBottom: 10 },
  overlayBody: { color: "rgba(255,255,255,0.88)", fontSize: 15, lineHeight: 21, marginBottom: 4 },
  overlayFootnote: { marginTop: 10, color: "rgba(229,193,133,0.85)", fontSize: 12 },
  overlayButton: { marginTop: 20, backgroundColor: "#E5C185", borderRadius: 18, paddingVertical: 12, alignItems: "center" },
  overlayButtonText: { color: "#1F1712", fontSize: 16, fontWeight: "700" },
  playerButtonWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
  playerButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(229,193,133,0.5)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  playerButtonText: { color: "#F5E9D7", fontSize: 14, fontWeight: "700" },
});

export default PartyBoardGame;
