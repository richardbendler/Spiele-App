import React, { useContext, useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TextInput,
  Modal,
  BackHandler,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VariablesContext } from "../../VariablesContext";
import InfoText from "./sublements/InfoText";
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { appStyles } from "../../styles";
import { useTranslation } from "../i18n";

const ALCOHOL_DENSITY = 0.789; // g/ml
const METABOLISM_PER_HOUR = 0.012; // g/dL per hour (~0.12 promille/h elimination)
const BODY_WATER = 0.68; // average distribution ratio
const BODY_WEIGHT_KG = 75; // average adult weight

const COLOR_PALETTE = ["#F5C26B", "#D26B6B", "#8BC6B9", "#A37ACC", "#F7A0AE", "#6CD0C7", "#F3CE8B"];
const METABOLISM_PER_HOUR_PROMILLE = METABOLISM_PER_HOUR * 10;
const TIMELINE_WINDOW_HOURS = 24;
const TIMELINE_POINTS = 12;
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

const isFabric = global?.nativeFabricUIManager != null;

if (!isFabric && Platform.OS === "android" && typeof UIManager.setLayoutAnimationEnabledExperimental === "function") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DEFAULT_ICON = "\uD83E\uDD64";
const ICON_BY_ID = { "beer-500": "\uD83C\uDF7A", "beer-330": "\uD83C\uDF7A", "radler-500": "\uD83C\uDF7A", "wine-150": "\uD83C\uDF77", "shot-40": "\uD83E\uDD43", "cocktail-250": "\uD83C\uDF79", "water-500": "\uD83D\uDCA7", "sekt-100": "\uD83E\uDD42", "gin-tonic-250": "\uD83C\uDF78", "cola-330": "\uD83E\uDD64", "energy-250": "\u26A1", "cider-330": "\uD83C\uDF4F", "weinschorle-300": "\uD83C\uDF77", "vodka-shot-20": "\uD83E\uDD43" };

const NAME_ICON_SUGGESTIONS = [ { pattern: /bier/i, icon: '\uD83C\uDF7A' }, { pattern: /wein|rose|rosé/i, icon: '\uD83C\uDF77' }, { pattern: /shot|schnaps|whisky|whiskey|bourbon|vodka|rum/i, icon: '\uD83E\uDD43' }, { pattern: /cocktail|spritz|mai tai|colada|mojito|martini/i, icon: '\uD83C\uDF79' }, { pattern: /sekt|prosecco|champagner/i, icon: '\uD83E\uDD42' }, { pattern: /biermix|radler|shandy/i, icon: '\uD83C\uDF7A' }, { pattern: /alkoholfrei|wasser|soft|saft|juice/i, icon: '\uD83D\uDCA7' } ];
const EMOJI_CHOICES = ['\uD83C\uDF7A','\uD83C\uDF77','\uD83C\uDF79','\uD83E\uDD43','\uD83C\uDF78','\uD83E\uDD42','\uD83E\uDD64','\uD83D\uDCA7','\u26A1','\u2728','\u2615','\uD83C\uDF75','\uD83E\uDDC3','\uD83E\uDDC9','\uD83E\uDD5B','\uD83C\uDF4F','\uD83C\uDF6B','\uD83C\uDF6A'];

const PROMILLE_MESSAGE_BANDS = {
  de: [
    {
      max: 0.2,
      messages: [
        "Glasklar unterwegs – Wasser dazu passt perfekt.",
        "Noch nüchtern? Dann genieß den Überblick!",
      ],
    },
    {
      max: 0.5,
      messages: [
        "Leicht beschwingt – vielleicht kurz durchschnaufen?",
        "Der Abend rollt langsam los. Schnapp dir einen Snack!",
      ],
    },
    {
      max: 0.8,
      messages: [
        "Jetzt gut hydratisiert bleiben, dann bleibt’s entspannt.",
        "Laune top, Pegel steigt – Wasser nicht vergessen.",
      ],
    },
    {
      max: 1.2,
      messages: [
        "Ganz schön auf Tour! Mach mal kurz Pause und atme durch.",
        "Zeit für eine Runde Wasser und frische Luft.",
      ],
    },
    {
      max: Infinity,
      messages: [
        "Achtung, sehr hoch! Couch, Wasser und Snacks sind jetzt deine Crew.",
        "Alarmstufe Rot – gönn dir eine längere Pause und viel Wasser.",
      ],
    },
  ],
  en: [
    {
      max: 0.2,
      messages: [
        "Crystal clear – water on the side fits perfectly.",
        "Still sober? Enjoy the overview!",
      ],
    },
    {
      max: 0.5,
      messages: [
        "Lightly buzzing – maybe take a short breather?",
        "The night is just starting. Grab a snack!",
      ],
    },
    {
      max: 0.8,
      messages: [
        "Stay hydrated now to keep things relaxed.",
        "Mood is great, buzz is rising – don't forget water.",
      ],
    },
    {
      max: 1.2,
      messages: [
        "Pretty far along! Take a short break and breathe.",
        "Time for some water and fresh air.",
      ],
    },
    {
      max: Infinity,
      messages: [
        "Careful, that's high! Couch time with water and snacks.",
        "Red alert – treat yourself to a longer break and lots of water.",
      ],
    },
  ],
};

const formatDateKey = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekdayLabel = (date, language) => {
  const labels = language === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  return labels[date.getDay()];
};

const DrinkCounter = () => {
  const { drinkCatalog, setDrinkCatalog, drinkLog, setDrinkLog, infoVisible, setInfoVisible, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { language } = useTranslation();
  const translate = useCallback((deText, enText) => (language === "en" ? enText : deText), [language]);
  const promilleBands = useMemo(() => PROMILLE_MESSAGE_BANDS[language] ?? PROMILLE_MESSAGE_BANDS.de, [language]);
  const [statsVisible, setStatsVisible] = useState(false);
  const [manageExpanded, setManageExpanded] = useState(false);
  const [form, setForm] = useState({ name: "", abv: "5", volume: "500", quick: true, icon: "" });
  const [editRecent, setEditRecent] = useState(false);
  const [bacDetailsOpen, setBacDetailsOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [tutorialStep, setTutorialStep] = useState(0);

  const closeStats = useCallback(() => {
    setStatsVisible(false);
    setEditRecent(false);
    setBacDetailsOpen(false);
  }, []);

  const guessIconForName = useCallback((name) => {
    if (!name) {
      return DEFAULT_ICON;
    }
    for (const candidate of NAME_ICON_SUGGESTIONS) {
      if (candidate.pattern.test(name)) {
        return candidate.icon;
      }
    }
    const emojiCandidate = Array.from(name).find((char) => EMOJI_REGEX.test(char));
    return emojiCandidate || DEFAULT_ICON;
  }, []);

  const resolveIcon = useCallback(
    (drink) => {
      if (!drink) return DEFAULT_ICON;
      // If a valid emoji is already stored and not the old placeholder, keep it
      if (drink.icon && drink.icon !== "??" && EMOJI_REGEX.test(drink.icon)) {
        return drink.icon;
      }
      // Otherwise prefer a curated icon by id
      if (ICON_BY_ID[drink.id]) {
        return ICON_BY_ID[drink.id];
      }
      // Fallback: guess from name or default
      const guessed = guessIconForName(drink.name);
      return guessed || DEFAULT_ICON;
    },
    [guessIconForName]
  );

  const persistCatalog = useCallback(
    async (catalog) => {
      setDrinkCatalog(catalog);
      try {
        await AsyncStorage.setItem("drinkCounter_catalog", JSON.stringify(catalog));
      } catch (error) {
        console.error("Fehler beim Speichern der Getränkeauswahl", error);
      }
    },
    [setDrinkCatalog]
  );

  const persistLog = useCallback(
    async (log) => {
      setDrinkLog(log);
      setNow(Date.now()); // ensure BAC calculations include the latest entries immediately
      try {
        await AsyncStorage.setItem("drinkCounter_log", JSON.stringify(log));
      } catch (error) {
        console.error("Fehler beim Speichern der Getränkeliste", error);
      }
    },
    [setDrinkLog, setNow]
  );

  useEffect(() => {
    let changed = false;
    const normalized = drinkCatalog.map((entry, index) => {
      const next = { ...entry };
      const ensuredIcon = resolveIcon(entry);
      if (next.icon !== ensuredIcon) {
        next.icon = ensuredIcon;
        changed = true;
      }
      if (!next.color) {
        next.color = COLOR_PALETTE[index % COLOR_PALETTE.length];
        changed = true;
      }
      if (typeof next.quick !== "boolean") {
        next.quick = false;
        changed = true;
      }
      if (typeof next.isHidden !== "boolean") {
        next.isHidden = false;
        changed = true;
      }
      if (next.id === "cocktail-250" && !next.isHidden && !next.quick) {
        next.quick = true;
        changed = true;
      }
      return next;
    });

    if (changed) {
      persistCatalog(normalized);
    }
  }, [drinkCatalog, persistCatalog, resolveIcon]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!statsVisible && editRecent) {
      setEditRecent(false);
    }
  }, [statsVisible, editRecent]);

  useEffect(() => {
    if (drinkLog.length === 0 && bacDetailsOpen) {
      setBacDetailsOpen(false);
    }
  }, [drinkLog, bacDetailsOpen]);

  useEffect(() => {
    if (!statsVisible) {
      return undefined;
    }
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      closeStats();
      return true;
    });
    return () => subscription.remove();
  }, [statsVisible, closeStats]);
  const drinkCounts = useMemo(() => {
    const counts = {};
    drinkLog.forEach((entry) => {
      counts[entry.drinkId] = (counts[entry.drinkId] || 0) + 1;
    });
    return counts;
  }, [drinkLog]);

  const quickDrinks = useMemo(() => drinkCatalog.filter((drink) => drink.quick && !drink.isHidden), [drinkCatalog]);
  const sortedCatalog = useMemo(() => {
    return [...drinkCatalog].sort((a, b) => {
      if (a.isHidden === b.isHidden) {
        return a.name.localeCompare(b.name);
      }
      return a.isHidden ? 1 : -1;
    });
  }, [drinkCatalog]);

  const calculatePromilleDetails = useCallback(
    (timestampMs) => {
      const details = {
        currentPromille: 0,
        totalRawPromille: 0,
        totalEliminatedPromille: 0,
        entries: [],
        timestamp: timestampMs,
        firstDrinkTimestamp: null,
        lastDrinkTimestamp: null,
      };

      if (!drinkLog.length) {
        return details;
      }

      const weightGrams = BODY_WEIGHT_KG * 1000;

      drinkLog.forEach((entry) => {
        const entryTime = new Date(entry.timestamp).getTime();
        if (Number.isNaN(entryTime) || entryTime > timestampMs) {
          return;
        }
        details.firstDrinkTimestamp =
          details.firstDrinkTimestamp == null ? entryTime : Math.min(details.firstDrinkTimestamp, entryTime);
        details.lastDrinkTimestamp =
          details.lastDrinkTimestamp == null ? entryTime : Math.max(details.lastDrinkTimestamp, entryTime);

        const hoursSince = Math.max((timestampMs - entryTime) / (1000 * 60 * 60), 0);
        const gramsOfAlcohol = entry.volumeMl * (entry.abv / 100) * ALCOHOL_DENSITY;
        const rawBac = (gramsOfAlcohol / (BODY_WATER * weightGrams)) * 100; // g/dL
        const eliminationBac = Math.min(rawBac, hoursSince * METABOLISM_PER_HOUR);
        const remainingBac = Math.max(rawBac - eliminationBac, 0);

        const rawPromille = rawBac * 10;
        const eliminatedPromille = eliminationBac * 10;
        const remainingPromille = remainingBac * 10;

        details.totalRawPromille += rawPromille;
        details.totalEliminatedPromille += eliminatedPromille;
        details.currentPromille += remainingPromille;

        details.entries.push({
          id: entry.id ?? `${entry.drinkId}-${entry.timestamp}`,
          drinkId: entry.drinkId,
          name: entry.name,
          icon: entry.icon,
          timestamp: entryTime,
          hoursSince,
          gramsOfAlcohol,
          rawPromille,
          eliminatedPromille,
          remainingPromille,
        });
      });

      details.entries.sort((a, b) => b.timestamp - a.timestamp);
      return details;
    },
    [drinkLog]
  );

  const computePromilleAt = useCallback(
    (timestampMs) => calculatePromilleDetails(timestampMs).currentPromille,
    [calculatePromilleDetails]
  );

  const bacSummary = useMemo(
    () => calculatePromilleDetails(now),
    [calculatePromilleDetails, now]
  );

  const estimatedPromille = bacSummary.currentPromille;

  const totalAlcoholGrams = useMemo(() => {
    return bacSummary.entries.reduce((sum, entry) => sum + entry.gramsOfAlcohol, 0);
  }, [bacSummary]);

  const promilleTimeline = useMemo(() => {
    if (drinkLog.length === 0) {
      return [];
    }
    const sorted = [...drinkLog].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const currentTimestamp = now;
    const earliest = new Date(sorted[0].timestamp).getTime();
    const windowStart = Math.max(earliest, currentTimestamp - TIMELINE_WINDOW_HOURS * 60 * 60 * 1000);
    const duration = Math.max(currentTimestamp - windowStart, 60 * 60 * 1000);
    const step = duration / TIMELINE_POINTS;

    const points = [];
    for (let i = 0; i <= TIMELINE_POINTS; i += 1) {
      const time = Math.min(windowStart + step * i, currentTimestamp);
      points.push({ time, value: computePromilleAt(time) });
    }
    return points;
  }, [computePromilleAt, drinkLog, now]);

  const timelineMax = useMemo(() => {
    if (promilleTimeline.length === 0) {
      return 0;
    }
    return promilleTimeline.reduce((maxValue, current) => Math.max(maxValue, current.value), 0);
  }, [promilleTimeline]);

  const timelineTrend = useMemo(() => {
    if (promilleTimeline.length < 2) {
      return 0;
    }
    const first = promilleTimeline[0];
    const last = promilleTimeline[promilleTimeline.length - 1];
    return last.value - first.value;
  }, [promilleTimeline]);

  const promillePeak = timelineMax;

  const calendarData = useMemo(() => {
    const buckets = new Map();
    drinkLog.forEach((entry) => {
      const key = formatDateKey(entry.timestamp);
      const bucket = buckets.get(key) || { drinks: 0, grams: 0 };
      bucket.drinks += 1;
      bucket.grams += entry.volumeMl * (entry.abv / 100) * ALCOHOL_DENSITY;
      buckets.set(key, bucket);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - offset);
      const key = formatDateKey(day);
      const bucket = buckets.get(key) || { drinks: 0, grams: 0 };
      days.push({
        key,
        date: day,
        drinks: bucket.drinks,
        grams: bucket.grams,
      });
    }
    return days;
  }, [drinkLog]);

  const drinkBreakdown = useMemo(() => {
    const counts = {};
    drinkLog.forEach((entry) => {
      counts[entry.drinkId] = (counts[entry.drinkId] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([drinkId, count]) => {
        const catalogEntry = drinkCatalog.find((drink) => drink.id === drinkId);
        const fallback = catalogEntry || {
          id: drinkId,
          name: drinkLog.find((entry) => entry.drinkId === drinkId)?.name || translate("Unbekannt", "Unknown"),
          icon: drinkLog.find((entry) => entry.drinkId === drinkId)?.icon,
        };
        return {
          id: drinkId,
          name: fallback.name,
          icon: resolveIcon({ ...fallback, id: drinkId }),
          color: catalogEntry?.color || "#E5C185",
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [drinkCatalog, drinkLog, resolveIcon]);

  const breakdownMax = drinkBreakdown.length ? drinkBreakdown[0].count : 1;

  const averageIntervalMinutes = useMemo(() => {
    if (drinkLog.length < 2) {
      return null;
    }
    const sorted = [...drinkLog].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let totalDiff = 0;
    for (let index = 1; index < sorted.length; index += 1) {
      const currentTime = new Date(sorted[index].timestamp).getTime();
      const previousTime = new Date(sorted[index - 1].timestamp).getTime();
      totalDiff += currentTime - previousTime;
    }
    return totalDiff / (sorted.length - 1) / (1000 * 60);
  }, [drinkLog]);

  const topDrink = drinkBreakdown[0] || null;

  const todayStats = useMemo(() => {
    const todayKey = formatDateKey(Date.now());
    return calendarData.find((day) => day.key === todayKey) || { drinks: 0, grams: 0 };
  }, [calendarData]);

  const firstDrinkTime = bacSummary.firstDrinkTimestamp;
  const lastDrinkTime = bacSummary.lastDrinkTimestamp;
  const timeSinceFirstDrink = firstDrinkTime ? now - firstDrinkTime : null;
  const timeSinceLastDrink = lastDrinkTime ? now - lastDrinkTime : null;
  const projectedSoberDurationMs =
    estimatedPromille > 0 ? (estimatedPromille / METABOLISM_PER_HOUR_PROMILLE) * 60 * 60 * 1000 : 0;
  const projectedSoberTimestamp = projectedSoberDurationMs ? now + projectedSoberDurationMs : null;

  const bacHintMessage = useMemo(() => {
    if (estimatedPromille <= 0) {
      return translate("Aktuell alles nüchtern – cheers mit Wasser!", "All clear for now – cheers with water!");
    }
    const band = promilleBands.find((entry) => estimatedPromille <= entry.max) || promilleBands[promilleBands.length - 1];
    if (!band || !band.messages || band.messages.length === 0) {
      return "";
    }
    const rotationIndex = Math.abs(Math.floor(now / 60000)) % band.messages.length;
    return band.messages[rotationIndex];
  }, [estimatedPromille, now, promilleBands, translate]);

  const rawPromille = bacSummary.totalRawPromille;
  const eliminatedPromille = bacSummary.totalEliminatedPromille;
  const remainingPromille = bacSummary.currentPromille;
  const remainingPercentage = rawPromille > 0 ? (remainingPromille / rawPromille) * 100 : 0;
  const eliminatedPercentage = rawPromille > 0 ? 100 - remainingPercentage : 0;
  const recentPromilleEntries = useMemo(() => bacSummary.entries.slice(0, 3), [bacSummary]);

  const toggleBacDetails = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBacDetailsOpen((prev) => !prev);
  }, []);

  const handleLogDrink = (drink) => {
    const entry = {
      id: `log-${Date.now()}`,
      drinkId: drink.id,
      name: drink.name,
      abv: drink.abv,
      volumeMl: drink.volumeMl,
      timestamp: new Date().toISOString(),
      icon: resolveIcon(drink),
    };
    persistLog([...drinkLog, entry]);
  };

  const handleAddDrink = () => {
    const name = form.name.trim();
    const abv = parseFloat(form.abv.replace(',', '.'));
    const volume = parseFloat(form.volume.replace(',', '.'));

    if (!name) {
      return;
    }
    if (Number.isNaN(abv) || abv <= 0 || abv > 96) {
      return;
    }
    if (Number.isNaN(volume) || volume <= 0 || volume > 2000) {
      return;
    }

    const color = COLOR_PALETTE[drinkCatalog.length % COLOR_PALETTE.length];
    const providedIcon = (form.icon || '').trim();
    const icon = EMOJI_REGEX.test(providedIcon) ? providedIcon : guessIconForName(name);
    const newDrink = {
      id: `custom-${Date.now()}`,
      name,
      abv,
      volumeMl: volume,
      // Always add new custom drinks to quick access
      quick: true,
      isHidden: false,
      color,
      icon,
    };

    persistCatalog([...drinkCatalog, newDrink]);
    setForm({ name: "", abv: "5", volume: "500", quick: true, icon: "" });
  };

  const toggleQuickAccess = (drink) => {
    const updated = drinkCatalog.map((entry) =>
      entry.id === drink.id ? { ...entry, quick: !entry.quick } : entry
    );
    persistCatalog(updated);
  };

  const toggleVisibility = (drink) => {
    const updated = drinkCatalog.map((entry) => {
      if (entry.id !== drink.id) return entry;
      const wasHidden = entry.isHidden;
      return {
        ...entry,
        isHidden: !entry.isHidden,
        quick: wasHidden ? true : entry.quick,
      };
    });
    persistCatalog(updated);
  };

  const removeDrink = (drink) => {
    const updatedCatalog = drinkCatalog.filter((entry) => entry.id !== drink.id);
    persistCatalog(updatedCatalog);
    persistLog(drinkLog.filter((entry) => entry.drinkId !== drink.id));
  };

  const handleRemoveLogEntry = useCallback(
    (entryId) => {
      const updated = drinkLog.filter((entry) => entry.id !== entryId);
      persistLog(updated);
      if (updated.length === 0) {
        setEditRecent(false);
      }
    },
    [drinkLog, persistLog, setEditRecent]
  );

  const formatTimeAgo = (timestamp) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return translate("gerade eben", "just now");
    if (diffMinutes < 60) return `${diffMinutes} ${translate("Min.", "min")}`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ${translate("Std.", "h")}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${translate("Tg.", "d")}`;
  };

  const formatDuration = (durationMs) => {
    if (durationMs == null || durationMs < 0) {
      return "-";
    }
    if (durationMs < 60 * 1000) {
      return translate("unter 1 Min.", "under 1 min");
    }
    const totalMinutes = Math.floor(durationMs / 60000);
    if (totalMinutes < 60) {
      return `${totalMinutes} ${translate("Min.", "min")}`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) {
      return `${hours} ${translate("Std.", "h")}`;
    }
    return `${hours} ${translate("Std.", "h")} ${minutes} ${translate("Min.", "min")}`;
  };

  const formatTimeLabel = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }, []);

  const recentDrinks = useMemo(() => {
    return [...drinkLog]
      .slice(-5)
      .reverse()
      .map((entry) => {
        const catalogEntry = drinkCatalog.find((drink) => drink.id === entry.drinkId);
        const iconSource = catalogEntry || { id: entry.drinkId, name: entry.name, icon: entry.icon };
        return {
          ...entry,
          icon: resolveIcon(iconSource),
        };
      });
  }, [drinkCatalog, drinkLog, resolveIcon]);

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={styles.background}>
      <View style={styles.overlay} />
      <TouchableOpacity onPress={() => setTutorialEnabled(!tutorialEnabled)} style={[appStyles.infoButton, { top: 24, right: 16, alignSelf: 'flex-end', zIndex: 10 }]}><Text style={appStyles.infoButtonText}>{tutorialEnabled ? (language === 'de' ? 'Tutorial aus' : 'Tutorial off') : (language === 'de' ? 'Tutorial an' : 'Tutorial on')}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setStatsVisible(true)} style={styles.statsFab} activeOpacity={0.9}>
        <Text style={styles.statsFabLabel}>{translate("Statistiken", "Statistics")}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>{translate("Getränkezähler", "Drink Counter")}</Text>
            <Text style={styles.screenSubtitle}>{translate("Behalte im Blick, was du heute getrunken hast.", "Keep track of what you have had today.")}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={toggleBacDetails}
          activeOpacity={0.9}
          style={[styles.bacCard, bacDetailsOpen ? styles.bacCardExpanded : null]}
        >
          <View style={styles.bacHeaderRow}>
            <Text style={styles.bacLabel}>{translate("Geschätzter Alkoholpegel", "Estimated BAC")}</Text>
            <Text style={styles.bacToggleHint}>
              {bacDetailsOpen
                ? translate("Tippe, um Details zu schließen", "Tap to hide details")
                : translate("Tippe für Details", "Tap for details")}
            </Text>
          </View>
          <View style={styles.bacValueRow}>
            <Text style={styles.bacValue}>{`${estimatedPromille.toFixed(2)} ‰`}</Text>
            {projectedSoberTimestamp ? (
              <Text style={styles.bacMeta}>
                {translate("~ nüchtern in", "~ sober in")} {formatDuration(projectedSoberDurationMs)}
              </Text>
            ) : null}
          </View>
          <Text style={styles.bacHint}>{bacHintMessage}</Text>
          <Text style={styles.bacMeta}>
            {translate("Durchschnittlicher Abbau: ca.", "Average elimination rate: approx.")} {METABOLISM_PER_HOUR_PROMILLE.toFixed(2)} ‰ {translate("pro Stunde.", "per hour.")}
          </Text>
          {bacDetailsOpen ? (
            <View style={styles.bacDetails}>
              <View style={styles.bacDetailsRow}>
                <Text style={styles.bacDetailsLabel}>{translate("Aufgenommen", "Consumed")}</Text>
                <Text style={styles.bacDetailsValue}>
                  {totalAlcoholGrams.toFixed(1)} {translate("g Alkohol", "g of alcohol")}
                </Text>
              </View>
              <View style={styles.bacDetailsRow}>
                <Text style={styles.bacDetailsLabel}>{translate("Abgebaut", "Metabolised")}</Text>
                <Text style={styles.bacDetailsValue}>
                  {`${eliminatedPromille.toFixed(2)} ‰`} ({eliminatedPercentage.toFixed(0)} %)
                </Text>
              </View>
              <View style={styles.bacDetailsRow}>
                <Text style={styles.bacDetailsLabel}>{translate("Letzter Drink", "Last drink")}</Text>
                <Text style={styles.bacDetailsValue}>
                  {lastDrinkTime
                    ? `${formatDuration(timeSinceLastDrink)} · ${formatTimeLabel(lastDrinkTime)}`
                    : "-"}
                </Text>
              </View>
              <View style={styles.bacDetailsRow}>
                <Text style={styles.bacDetailsLabel}>{translate("Erster Drink", "First drink")}</Text>
                <Text style={styles.bacDetailsValue}>
                  {firstDrinkTime
                    ? `${formatDuration(timeSinceFirstDrink)} · ${formatTimeLabel(firstDrinkTime)}`
                    : "-"}
                </Text>
              </View>
              {recentPromilleEntries.length > 0 ? (
                <View style={styles.bacDetailsList}>
                  {recentPromilleEntries.map((entry) => {
                    const icon = entry.icon || resolveIcon({ id: entry.drinkId, name: entry.name });
                    const durationLabel = formatDuration(now - entry.timestamp);
                    const durationText =
                      durationLabel === "-"
                        ? "-"
                        : language === "en"
                        ? `${durationLabel} ${translate("vor", "ago")}`
                        : `${translate("vor", "ago")} ${durationLabel}`;
                    return (
                      <View key={entry.id} style={styles.bacDetailsEntry}>
                        <Text style={styles.bacDetailsEntryIcon}>{icon}</Text>
                        <View style={styles.bacDetailsEntryText}>
                          <Text style={styles.bacDetailsEntryTitle}>{entry.name}</Text>
                          <Text style={styles.bacDetailsEntryMeta}>
                            {durationText} | +{entry.rawPromille.toFixed(2)} ‰ -> {entry.remainingPromille.toFixed(2)} ‰
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{translate("Schnellauswahl", "Quick picks")}</Text>
          <Text style={styles.sectionDescription}>
            {translate(
              "Tippe ein Getränk, um es sofort zu protokollieren.",
              "Tap a drink to log it instantly."
            )}
          </Text>
        </View>

        {quickDrinks.length > 0 ? (
          <View style={styles.quickGrid}>
            {quickDrinks.map((drink) => {
              const count = drinkCounts[drink.id] ?? 0;
              const icon = resolveIcon(drink);
              const backgroundColor = drink.color
                ? `${drink.color}E6`.slice(0, 9)
                : "rgba(229,193,133,0.9)";
              return (
                <TouchableOpacity
                  key={drink.id}
                  onPress={() => handleLogDrink(drink)}
                  style={[styles.quickTile, { backgroundColor }]}
                  activeOpacity={0.88}
                >
                  <Text style={styles.quickIcon}>{icon || "??"}</Text>
                  <Text style={styles.quickTitle}>{drink.name}</Text>
                  <Text style={styles.quickMeta}>
                    {drink.abv}% | {drink.volumeMl} ml
                  </Text>
                  {count > 0 ? (
                    <View style={styles.quickCountBadge}>
                      <Text style={styles.quickCountText}>{`${count}x`}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyQuickText}>
            {translate(
              "Keine Drinks in der Schnellauswahl - verwalte sie unten.",
              "No quick drinks yet - manage them below."
            )}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => setManageExpanded((prev) => !prev)}
          style={styles.manageToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.manageToggleText}>
            {manageExpanded ? translate('Verstecken', 'Hide') : translate('Getränke verwalten', 'Manage drinks')}
          </Text>
        </TouchableOpacity>

        {manageExpanded && (
          <View style={styles.manageCard}>
            {sortedCatalog.map((drink) => (
              <View key={drink.id} style={styles.manageRow}>
                <View style={styles.manageIconPill}>
                  <Text style={styles.manageIcon}>{resolveIcon(drink)}</Text>
                </View>
                <View style={styles.manageInfo}>
                  <Text style={styles.manageName}>{drink.name}</Text>
                  <Text style={styles.manageMeta}>{drink.abv}% · {drink.volumeMl} ml</Text>
                  <View style={styles.manageActions}>
                    <TouchableOpacity
                      onPress={() => toggleVisibility(drink)}
                      style={[styles.actionChip, !drink.isHidden ? styles.actionChipActive : null]}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.actionChipText, !drink.isHidden ? styles.actionChipTextActive : null]}>
                        {!drink.isHidden ? translate('Sichtbar', 'Visible') : translate('Versteckt', 'Hidden')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeDrink(drink)}
                      style={styles.removeChip}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.removeChipText}>{translate('Löschen', 'Delete')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.formDivider} />

            <Text style={styles.sectionTitle}>{translate("Eigenes Getränk anlegen", "Create a custom drink")}</Text>
            <View style={styles.formRow}>
              <TextInput
                style={styles.formInput}
                placeholder="Name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={form.name}
                onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
              />
          </View>
          <View style={styles.formRowTwoColumns}>
              <TextInput
                style={styles.formInputHalf}
                placeholder="% Vol"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="numeric"
                value={form.abv}
                onChangeText={(value) => setForm((prev) => ({ ...prev, abv: value }))}
              />
              <TextInput
                style={styles.formInputHalf}
                placeholder="ml"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="numeric"
                value={form.volume}
                onChangeText={(value) => setForm((prev) => ({ ...prev, volume: value }))}
              />
            </View>
            <Text style={[styles.sectionDescription, { marginTop: 8 }]}>
              {translate('Emoji auswählen (optional):', 'Pick an emoji (optional):')}
            </Text>
            <View style={styles.emojiPickerRow}>
              {EMOJI_CHOICES.map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setForm((prev) => ({ ...prev, icon: prev.icon === e ? '' : e }))}
                  style={[styles.emojiChip, form.icon === e ? styles.emojiChipActive : null]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.emojiChar}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Quick-Toggle entfernt: neue Getränke gehen automatisch in die Schnellauswahl */}
            <TouchableOpacity onPress={handleAddDrink} style={styles.addDrinkButton} activeOpacity={0.9}>
              <Text style={styles.addDrinkButtonText}>{translate("Getränk hinzufügen", "Add drink")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <InfoText
        header={translate("Getränkezähler!", "Drink Counter!")}
        rules={translate("Tippe deine Lieblingsgetränke in der Schnellauswahl an, um sie zu protokollieren.\n\nVerwalte Standarddrinks, blende sie aus oder lege eigene an. Die Statistiken zeigen dir Verlauf, Wochenübersicht und Favoriten inklusive Promille-Trend.", "Tap your favourite drinks in quick access to log them.\n\nManage default drinks, hide them or create your own. The stats show your timeline, weekly overview, favourites and the BAC trend.")}
      />
      <InfoHint />
      {/** Regeln-Button entfernt (Tutorials ersetzen ihn) */}
      <TutorialOverlay
        visible={tutorialEnabled}
        steps={[
          { text: translate('Schnellauswahl: Tippe, um sofort zu protokollieren.', 'Quick picks: tap to log instantly.'), placement: 'top' },
          { text: translate('Öffne die Verwaltung, um eigene Getränke anzulegen.', 'Open manage drinks to add your own.'), placement: 'bottom' },
          { text: translate('Statistiken zeigen Verlauf und Promille-Trend.', 'Stats show your timeline and BAC trend.'), placement: 'bottom' },
        ]}
        stepIndex={tutorialStep}
        onNext={() => setTutorialStep((s) => Math.min(2, s + 1))}
        onClose={() => setTutorialEnabled(false)}
      />

      <Modal visible={statsVisible} animationType="fade" transparent onRequestClose={closeStats}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{translate("Statistiken", "Statistics")}</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{translate("Heute", "Today")}</Text>
                <Text style={styles.summaryValue}>{todayStats.drinks}</Text>
                <Text style={styles.summaryHint}>{Math.round(todayStats.grams)} {translate("g Alkohol", "g of alcohol")}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{translate("Aktueller Pegel", "Current BAC")}</Text>
                <Text style={styles.summaryValue}>{estimatedPromille.toFixed(2)}</Text>
                <Text style={styles.summaryHint}>
                  {timelineTrend > 0
                    ? `${translate("Trend steigt", "Trend rising")} (+${timelineTrend.toFixed(2)})`
                    : timelineTrend < 0
                    ? `${translate("Trend faellt", "Trend falling")} (${timelineTrend.toFixed(2)})`
                    : translate("Trend stabil", "Trend steady")}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{translate("Beliebtester Drink", "Most popular drink")}</Text>
                <Text style={styles.summaryValue}>{topDrink ? `${topDrink.icon} ${topDrink.name}` : "—"}</Text>
                <Text style={styles.summaryHint}>{topDrink ? `${topDrink.count}x ${translate("heute", "today")}` : translate("Noch keine Daten", "No data yet")}</Text>
              </View>
            </View>
            <Text style={styles.modalSubtitle}>{translate("Promille-Verlauf (24h)", "BAC trend (24h)")}</Text>
            {promilleTimeline.length === 0 ? (
              <Text style={styles.modalHint}>{translate("Noch keine Daten", "No data yet")}</Text>
            ) : (
              <View style={styles.timelineWrapper}>
                <View style={styles.timelineChart}>
                  {promilleTimeline.map((point, index) => {
                    const normalizedHeight =
                      timelineMax === 0 ? 0 : Math.max((point.value / timelineMax) * 100, point.value > 0 ? 6 : 2);
                    return (
                      <View key={`${point.time}-${index}`} style={styles.timelineBar}>
                        <View style={[styles.timelineBarFill, { height: `${normalizedHeight}%` }]} />
                      </View>
                    );
                  })}
                </View>
                <View style={styles.timelineLabels}>
                  {promilleTimeline.map((point, index) => {
                    const divisor = Math.max(Math.floor(promilleTimeline.length / 4), 1);
                    if (index % divisor !== 0 && index !== promilleTimeline.length - 1) {
                      return <View key={`spacer-${point.time}-${index}`} style={styles.timelineLabelSpacer} />;
                    }
                    return (
                      <Text key={`${point.time}-${index}`} style={styles.timelineLabel}>
                        {formatTimeLabel(point.time)}
                      </Text>
                    );
                  })}
                </View>
                <Text style={styles.timelineHint}>
                  {translate("Peak", "Peak")}: {promillePeak.toFixed(2)} {translate("Promille", "‰")} – {translate("durchschnittlicher Abstand", "avg. spacing")} {averageIntervalMinutes ? `${Math.round(averageIntervalMinutes)} ${translate("min", "min")}` : "-"}
                </Text>
              </View>
            )}

<Text style={[styles.modalSubtitle, { marginTop: 18 }]}>{translate("Letzte 7 Tage", "Last 7 days")}</Text>
            {calendarData.length === 0 ? (
              <Text style={styles.modalHint}>{translate("Noch keine Daten", "No data yet")}</Text>
            ) : (
              <View style={styles.calendarRow}>
                {calendarData.map((day) => (
                  <View key={day.key} style={[styles.calendarCell, day.drinks > 0 ? styles.calendarCellActive : null]}>
                    <Text style={styles.calendarDay}>{getWeekdayLabel(day.date, language)}</Text>
                    <Text style={styles.calendarValue}>{day.drinks}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={[styles.modalSubtitle, { marginTop: 18 }]}>{translate("Beliebte Getränke", "Popular drinks")}</Text>
            {drinkBreakdown.length === 0 ? (
              <Text style={styles.modalHint}>{translate("Noch keine Einträge", "No entries yet")}</Text>
            ) : (
              <View style={styles.breakdownList}>
                {drinkBreakdown.slice(0, 5).map((item) => (
                  <View key={item.id} style={styles.breakdownRow}>
                    <View style={styles.breakdownLabel}>
                      <Text style={styles.breakdownIcon}>{item.icon}</Text>
                      <Text style={styles.breakdownName}>{item.name}</Text>
                    </View>
                    <View style={styles.breakdownBar}>
                      <View
                        style={[
                          styles.breakdownBarFill,
                          {
                            width: `${Math.max((item.count / breakdownMax) * 100, 8)}%`,
                            backgroundColor: item.color || "#E5C185",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.breakdownValue}>{item.count}x</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={[styles.modalSubtitle, { marginTop: 18 }]}>{translate("Letzte Einträge", "Recent entries")}</Text>
            {recentDrinks.length === 0 ? (
              <Text style={styles.modalHint}>{translate("Noch nichts protokolliert", "Nothing logged yet")}</Text>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setEditRecent((prev) => !prev)}
                  style={[styles.editRecentButton, editRecent ? styles.editRecentButtonActive : null]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.editRecentButtonLabel, editRecent ? styles.editRecentButtonLabelActive : null]}>
                    {editRecent
                      ? translate("Bearbeitung beenden", "Finish editing")
                      : translate("Letzte Getränke bearbeiten", "Edit recent drinks")}
                  </Text>
                </TouchableOpacity>
                {recentDrinks.map((entry) => (
                  <View key={entry.id} style={[styles.modalRow, styles.recentRow]}>
                    <View style={styles.recentRowText}>
                      <Text style={styles.modalRowLabel}>
                        {entry.icon ? `${entry.icon} ` : ""}
                        {entry.name}
                      </Text>
                      {editRecent && <Text style={styles.modalRowValueSecondary}>{formatTimeAgo(entry.timestamp)}</Text>}
                    </View>
                    {editRecent ? (
                      <TouchableOpacity
                        onPress={() => handleRemoveLogEntry(entry.id)}
                        style={styles.recentRemoveButton}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.recentRemoveButtonText}>{translate("Entfernen", "Remove")}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.modalRowValue}>{formatTimeAgo(entry.timestamp)}</Text>
                    )}
                  </View>
                ))}
              </>
            )}

            </ScrollView>
            <TouchableOpacity onPress={closeStats} style={styles.closeModalButton} activeOpacity={0.85}>
              <Text style={styles.closeModalButtonText}>{translate("Schließen", "Close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 14, 22, 0.6)",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 30,
    color: "white",
    fontFamily: "Quicksand_300Bold",
  },
  screenSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
    fontFamily: "Quicksand_300Light",
  },
  statsFab: {
    position: "absolute",
    top: 56,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    zIndex: 2,
  },
  statsFabLabel: {
    color: "white",
    fontSize: 13,
    fontFamily: "Quicksand_300Bold",
    letterSpacing: 0.6,
  },
  bacCard: {
    backgroundColor: "rgba(22, 27, 39, 0.85)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  bacCardExpanded: {
    paddingBottom: 26,
  },
  bacHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bacLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontFamily: "Quicksand_300Light",
  },
  bacToggleHint: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontFamily: "Quicksand_300Light",
  },
  bacValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
  },
  bacValue: {
    fontSize: 36,
    color: "white",
    fontFamily: "Quicksand_300Bold",
  },
  bacHint: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  bacMeta: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    marginTop: 6,
  },
  bacDetails: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: 14,
    gap: 12,
  },
  bacDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bacDetailsLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontFamily: "Quicksand_300Light",
  },
  bacDetailsValue: {
    color: "white",
    fontSize: 12,
    fontFamily: "Quicksand_300Bold",
  },
  bacDetailsList: {
    marginTop: 4,
    gap: 10,
  },
  bacDetailsEntry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bacDetailsEntryIcon: {
    fontSize: 20,
  },
  bacDetailsEntryText: {
    flex: 1,
  },
  bacDetailsEntryTitle: {
    color: "white",
    fontSize: 13,
    fontFamily: "Quicksand_300Bold",
  },
  bacDetailsEntryMeta: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: "Quicksand_300Bold",
  },
  sectionDescription: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 2,
    fontFamily: "Quicksand_300Light",
  },
  // Emoji picker row should wrap to use the width
  emojiPickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  emojiChip: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  emojiChipActive: {
    backgroundColor: "#E5C185",
    borderColor: "#E5C185",
  },
  emojiChar: {
    fontSize: 22,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  quickTile: {
    width: "48%",
    borderRadius: 18,
    padding: 12,
    minHeight: 104,
    position: "relative",
    justifyContent: "flex-end",
  },
  quickIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickTitle: {
    color: "#1B1B1F",
    fontSize: 16,
    fontFamily: "Quicksand_300Bold",
  },
  quickMeta: {
    color: "rgba(27,27,31,0.65)",
    fontSize: 12,
    marginTop: 2,
  },
  quickCountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(27,27,31,0.18)",
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  quickCountText: {
    color: "#1B1B1F",
    fontFamily: "Quicksand_300Bold",
  },
  emptyQuickText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Quicksand_300Light",
    fontSize: 13,
  },
  manageToggle: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  manageToggleText: {
    color: "white",
    fontFamily: "Quicksand_300Bold",
    fontSize: 13,
  },
  manageCard: {
    backgroundColor: "rgba(18, 21, 31, 0.9)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 36,
  },
  manageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  manageIconPill: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  manageIcon: {
    fontSize: 26,
  },
  manageInfo: {
    flex: 1,
    gap: 6,
  },
  manageName: {
    color: "white",
    fontFamily: "Quicksand_300Bold",
    fontSize: 15,
  },
  manageMeta: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  manageActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
  },
  actionChip: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  actionChipActive: {
    backgroundColor: "#E5C185",
  },
  actionChipText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontFamily: "Quicksand_300Bold",
  },
  actionChipTextActive: {
    color: "#221B15",
  },
  removeChip: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,92,92,0.18)",
  },
  removeChipText: {
    color: "#FF6A6A",
    fontSize: 12,
    fontFamily: "Quicksand_300Bold",
  },
  formDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 18,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  formRowTwoColumns: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  formInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
    fontFamily: "Quicksand_300Bold",
  },
  formInputHalf: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
    fontFamily: "Quicksand_300Bold",
  },
  formToggleRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  addDrinkButton: {
    backgroundColor: "#E5C185",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  addDrinkButtonText: {
    color: "#241D18",
    fontSize: 15,
    fontFamily: "Quicksand_300Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "88%",
    maxHeight: "85%",
    backgroundColor: "#191D28",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  modalTitle: {
    fontSize: 22,
    color: "white",
    fontFamily: "Quicksand_300Bold",
    marginBottom: 12,
  },
  modalContent: {
    paddingBottom: 24,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 120,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 14,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  summaryValue: {
    color: "white",
    fontSize: 20,
    fontFamily: "Quicksand_300Bold",
    marginTop: 4,
  },
  summaryHint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    marginTop: 6,
  },
  editRecentButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  editRecentButtonActive: {
    backgroundColor: "rgba(229,193,133,0.2)",
    borderColor: "rgba(229,193,133,0.45)",
  },
  editRecentButtonLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily: "Quicksand_300Bold",
  },
  editRecentButtonLabelActive: {
    color: "#E5C185",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Quicksand_300Bold",
    marginTop: 10,
  },
  modalMetric: {
    fontSize: 16,
    color: "white",
    fontFamily: "Quicksand_300Bold",
    marginTop: 6,
  },
  modalHint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 6,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalRowLabel: {
    color: "white",
    fontSize: 13,
  },
  modalRowValue: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  modalRowValueSecondary: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    marginTop: 4,
  },
  timelineWrapper: {
    marginTop: 12,
  },
  timelineChart: {
    height: 110,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  timelineBar: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  timelineBarFill: {
    backgroundColor: "#E5C185",
    width: "100%",
    borderRadius: 10,
  },
  timelineLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  timelineLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
  },
  timelineLabelSpacer: {
    flex: 1,
  },
  timelineHint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    marginTop: 8,
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
  calendarCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  calendarCellActive: {
    backgroundColor: "rgba(229,193,133,0.18)",
  },
  calendarDay: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  calendarValue: {
    color: "white",
    fontSize: 16,
    fontFamily: "Quicksand_300Bold",
    marginTop: 4,
  },
  recentRow: {
    alignItems: "center",
  },
  recentRowText: {
    flex: 1,
    marginRight: 12,
  },
  recentRemoveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,92,92,0.18)",
  },
  recentRemoveButtonText: {
    color: "#FF6A6A",
    fontSize: 12,
    fontFamily: "Quicksand_300Bold",
  },
  breakdownList: {
    marginTop: 12,
    gap: 10,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  breakdownLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  breakdownIcon: {
    fontSize: 18,
  },
  breakdownName: {
    color: "white",
    fontSize: 13,
    flexShrink: 1,
  },
  breakdownBar: {
    flex: 2,
    height: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  breakdownBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  breakdownValue: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginLeft: 8,
  },
  closeModalButton: {
    marginTop: 24,
    alignSelf: "flex-end",
    backgroundColor: "#E5C185",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  closeModalButtonText: {
    color: "#231C18",
    fontFamily: "Quicksand_300Bold",
    fontSize: 14,
  },
});

export default DrinkCounter;


























