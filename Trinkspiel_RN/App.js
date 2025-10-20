import React, { useState, useEffect, useMemo, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

//Import der Datenbankvorlagen
// import { getGameData } from './src/general'; // API_RESTORE_STEP: uncomment to fetch texts from the server again
import { theOneSamplePrompts } from "./src/data/picoloTexts";
import { spinTheBottleTruthTexts } from "./src/data/spinTheBottleTruth";
import { spinTheBottleDareTexts } from "./src/data/spinTheBottleDare";
import { manyQuestionsSampleTexts } from "./src/data/manyQuestionsTexts";
import { activitySampleWords } from "./src/data/activityWords";

//Import der Menus
import StartMenu from "./src/menus/StartMenu";
import MainMenu from "./src/menus/MainMenu";
import AddPlayer from "./src/menus/AddPlayer";

//Import der Spiele
import PicoloGame from "./src/games/PicoloGame";
import ManyQuestionsGame from "./src/games/ManyQuestions";
import Kingscup from "./src/games/Kingscup";
import MaexchenGame from "./src/games/Maexchen";
import DrinkCounter from "./src/games/DrinkCounter";
import Activity from "./src/games/Activity";
import SpinTheBottle from "./src/games/SpinTheBottle";
import HorseRace from "./src/games/HorseRace";
import Schoeneberg from "./src/games/Schoeneberg";
import WhoWouldLikelyGame from "./src/games/WhoWouldLikely";
import NeverHaveIEverGame from "./src/games/NeverHaveIEver";
import PartyBoardGame from "./src/games/PartyBoardGame";
import SixBySixGame from "./src/games/SixBySix";
import SecretMission from "./src/games/SecretMission";

//Import des Contextes -> Verwaltet globale Variablen
import { VariablesContext } from "./VariablesContext";

//Import von Hilfsfunktionen
import { replaceHashtagsWithoutDuplicates, shuffleArrayFisherYates } from "./src/games/sublements/AdjustParamShape";

import { enableScreens } from "react-native-screens";
enableScreens();
import { askForRatingIfEligible } from "./src/utils/rating";

const DEFAULT_DRINK_CATALOG = [
  {
    id: "beer-500",
    name: "Bier 0.5l",
    abv: 5,
    volumeMl: 500,
    quick: true,
    isHidden: false,
    color: "#F5C26B",
    icon: "🍺",
  },
  {
    id: "radler-500",
    name: "Radler 0.5l",
    abv: 2.5,
    volumeMl: 500,
    quick: false,
    isHidden: false,
    color: "#E8D56E",
    icon: "??",
  },
  {
    id: "water-500",
    name: "Wasser 0.5l",
    abv: 0,
    volumeMl: 500,
    quick: false,
    isHidden: true,
    color: "#88C9F9",
    icon: "??",
  },
  {
    id: "sekt-100",
    name: "Sekt 0.1l",
    abv: 11,
    volumeMl: 100,
    quick: false,
    isHidden: true,
    color: "#F2E28A",
    icon: "??",
  },
  {
    id: "gin-tonic-250",
    name: "Gin Tonic 0.25l",
    abv: 12,
    volumeMl: 250,
    quick: false,
    isHidden: true,
    color: "#B6E0CE",
    icon: "??",
  },
  {
    id: "cola-330",
    name: "Cola 0.33l",
    abv: 0,
    volumeMl: 330,
    quick: false,
    isHidden: true,
    color: "#6B4C3B",
    icon: "??",
  },
  {
    id: "energy-250",
    name: "Energy 0.25l",
    abv: 0,
    volumeMl: 250,
    quick: false,
    isHidden: true,
    color: "#E06C3A",
    icon: "??",
  },
  {
    id: "cider-330",
    name: "Cider 0.33l",
    abv: 5,
    volumeMl: 330,
    quick: false,
    isHidden: true,
    color: "#C9D97E",
    icon: "??",
  },
  {
    id: "weinschorle-300",
    name: "Weinschorle 0.3l",
    abv: 6,
    volumeMl: 300,
    quick: false,
    isHidden: true,
    color: "#EAC77B",
    icon: "??",
  },
  {
    id: "vodka-shot-20",
    name: "Vodka 2cl",
    abv: 40,
    volumeMl: 20,
    quick: false,
    isHidden: true,
    color: "#C0E4F7",
    icon: "??",
  },
  {
    id: "beer-330",
    name: "Bier 0.33l",
    abv: 5,
    volumeMl: 330,
    quick: false,
    isHidden: false,
    color: "#F1B24A",
    icon: "🍻",
  },
  {
    id: "wine-150",
    name: "Wein 0.15l",
    abv: 12,
    volumeMl: 150,
    quick: true,
    isHidden: false,
    color: "#D26B6B",
    icon: "🍷",
  },
  {
    id: "shot-40",
    name: "Shot 4cl",
    abv: 40,
    volumeMl: 40,
    quick: true,
    isHidden: false,
    color: "#C97F5F",
    icon: "🥃",
  },
  {
    id: "cocktail-250",
    name: "Cocktail 0.25l",
    abv: 14,
    volumeMl: 250,
    quick: true,
    isHidden: false,
    color: "#8BC6B9",
    icon: "🍹",
  },
];

const ensureDrinkCatalogDefaults = (catalog) => {
  const fallbackById = Object.fromEntries(DEFAULT_DRINK_CATALOG.map((item) => [item.id, item]));
  return catalog.map((drink, index) => {
    const fallback = fallbackById[drink.id];
    const normalized = {
      ...fallback,
      ...drink,
    };
    if (fallback) {
      normalized.icon = drink.icon || fallback.icon;
      normalized.color = drink.color || fallback.color;
    } else {
      normalized.icon = drink.icon || "🥤";
      normalized.color = drink.color || DEFAULT_DRINK_CATALOG[index % DEFAULT_DRINK_CATALOG.length]?.color || "#F5C26B";
    }
    normalized.quick =
      typeof drink.quick === "boolean"
        ? drink.quick
        : fallback && typeof fallback.quick === "boolean"
        ? fallback.quick
        : false;
    normalized.isHidden = typeof drink.isHidden === "boolean" ? drink.isHidden : false;

    if (normalized.id === "cocktail-250" && !normalized.isHidden) {
      normalized.quick = true;
    }

    return normalized;
  });
};

export default function App() {
  const [theOnePrompts, setTheOnePrompts] = useState(() => [...theOneSamplePrompts]);
  const [textsWahrheitSpinTheBottle, setTextsWahrheitSpinTheBottle] = useState(() => [...spinTheBottleTruthTexts]);
  const [textsPflichtSpinTheBottle, setTextsPflichtSpinTheBottle] = useState(() => [...spinTheBottleDareTexts]);
  const [manyQuestions, setManyQuestions] = useState(() => [...manyQuestionsSampleTexts]);
  const [words, setWords] = useState(() => [...activitySampleWords]);
  const [drinkCatalog, setDrinkCatalog] = useState(DEFAULT_DRINK_CATALOG);
  const [drinkLog, setDrinkLog] = useState([]);
  const [theOneSettings, setTheOneSettings] = useState({
    currentDrunkenness: 4,
    desiredDrunkenness: 6,
    familiarity: 5,
  });

  ////////////////////////////////////////////////////////
  /////////// Daten aus lokalem Speicher holen  //////////
  ////////////////////////////////////////////////////////

  const loadFromDisk = async (setter, item) => {
    try {
      const response = await AsyncStorage.getItem(item);
      if (response) {
        setter(JSON.parse(response));
      }
    } catch (error) {
      console.error("Fehler beim Laden", error);
    }
  };

  useEffect(() => {
    loadFromDisk(setTheOnePrompts, "texts_Picolo");
    loadFromDisk(setTextsWahrheitSpinTheBottle, "textsWahrheitSpinTheBottle");
    loadFromDisk(setTextsPflichtSpinTheBottle, "textsPflichtSpinTheBottle");
    loadFromDisk(setManyQuestions, "manyQuestions");
    loadFromDisk(setWords, "words");
  }, []);

  useEffect(() => {
    const loadDrinkData = async () => {
      try {
        const catalogRaw = await AsyncStorage.getItem("drinkCounter_catalog");
        const logRaw = await AsyncStorage.getItem("drinkCounter_log");
        if (catalogRaw) {
          const parsed = JSON.parse(catalogRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDrinkCatalog(ensureDrinkCatalogDefaults(parsed));
          } else {
            setDrinkCatalog(DEFAULT_DRINK_CATALOG);
          }
        }
        if (logRaw) {
          setDrinkLog(JSON.parse(logRaw));
        }
      } catch (error) {
        console.error("Fehler beim Laden der Getraenkedaten", error);
      }
    };
    loadDrinkData();
  }, []);

  useEffect(() => {
    const loadStoredPlayers = async () => {
      try {
        const storedPlayers = await AsyncStorage.getItem('theOne_players');
        if (storedPlayers) {
          const parsed = JSON.parse(storedPlayers);
          if (Array.isArray(parsed)) {
            setPlayers(parsed);
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Spielernamen', error);
      }
    };
    loadStoredPlayers();
  }, []);

  useEffect(() => {
    const persistPlayers = async () => {
      try {
        await AsyncStorage.setItem('theOne_players', JSON.stringify(players));
      } catch (error) {
        console.error('Fehler beim Speichern der Spielernamen', error);
      }
    };
    persistPlayers();
  }, [players]);

  const Stack = createStackNavigator();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [players, setPlayers] = useState([]);
  const [language, setLanguage] = useState("de");
  const [tutorialEnabled, setTutorialEnabled] = useState(false);

  const shuffledManyQuestions = useMemo(() => shuffleArrayFisherYates([...manyQuestions]), [manyQuestions]);

  const navigationRef = React.useRef();
  const routeNameRef = React.useRef();

  const GAME_ROUTES = useMemo(() => new Set([
    'PicoloGame','ManyQuestionsGame','WhoWouldLikelyGame','NeverHaveIEverGame','Kingscup','MaexchenGame','Activity','DrinkCounter','SpinTheBottle','HorseRace','Schoeneberg','SixBySixGame','PartyBoardGame','SecretMission'
  ]), []);

  return (
    <VariablesContext.Provider
      value={{
        settingsVisible,
        setSettingsVisible,
        infoVisible,
        setInfoVisible,
        drinkCatalog,
        setDrinkCatalog,
        drinkLog,
        setDrinkLog,
        players,
        setPlayers,
        language,
        setLanguage,
        theOneSettings,
        setTheOneSettings,
        theOnePrompts,
        setTheOnePrompts,
        manyQuestions,
        setManyQuestions,
        tutorialEnabled,
        setTutorialEnabled,
      }}
    >
      <View style={{ flex: 1 }}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            try { routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name; } catch {}
          }}
          onStateChange={async () => {
            try {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
              if (previousRouteName && currentRouteName) {
                // if returning from any game to MainMenu, ask for rating
                if (currentRouteName === 'MainMenu' && GAME_ROUTES.has(previousRouteName)) {
                  await askForRatingIfEligible(language);
                }
              }
              routeNameRef.current = currentRouteName;
            } catch {}
          }}
        >
          <Stack.Navigator
            initialRouteName="StartMenu"
            screenOptions={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              headerShown: false,
            }}
          >
            <Stack.Screen name="StartMenu" component={StartMenu} />
            <Stack.Screen name="MainMenu" component={MainMenu} />
            <Stack.Screen name="AddPlayer" component={AddPlayer} />
            <Stack.Screen name="PicoloGame" component={PicoloGame} initialParams={{ theOneData: theOnePrompts }} />
            <Stack.Screen name="ManyQuestionsGame" component={ManyQuestionsGame} initialParams={{ manyQuestionsData: shuffledManyQuestions }} />
            <Stack.Screen name="WhoWouldLikelyGame" component={WhoWouldLikelyGame} />
            <Stack.Screen name="NeverHaveIEverGame" component={NeverHaveIEverGame} />
            <Stack.Screen name="Kingscup" component={Kingscup} />
            <Stack.Screen name="MaexchenGame" component={MaexchenGame} />
            <Stack.Screen name="Activity" component={Activity} initialParams={{ words }} />
            <Stack.Screen name="DrinkCounter" component={DrinkCounter} />
            <Stack.Screen
              name="SpinTheBottle"
              component={SpinTheBottle}
              initialParams={{ textsWahrheitSpinTheBottle, textsPflichtSpinTheBottle }}
            />
            <Stack.Screen name="HorseRace" component={HorseRace} />
            <Stack.Screen name="Schoeneberg" component={Schoeneberg} />
            <Stack.Screen name="SixBySixGame" component={SixBySixGame} />
            <Stack.Screen name="PartyBoardGame" component={PartyBoardGame} />
            <Stack.Screen name="SecretMission" component={SecretMission} />
          </Stack.Navigator>
        </NavigationContainer>
        <LanguageToggle />
      </View>
    </VariablesContext.Provider>
  );
}

const LanguageToggle = () => {
  const { language, setLanguage } = useContext(VariablesContext);
  const toggleLanguage = () => setLanguage((prev) => (prev === "de" ? "en" : "de"));
  return (
    <TouchableOpacity style={languageStyles.toggle} onPress={toggleLanguage} activeOpacity={0.8}>
      <Text style={languageStyles.toggleLabel}>{language === "de" ? "DE" : "EN"}</Text>
    </TouchableOpacity>
  );
};

const languageStyles = StyleSheet.create({
  toggle: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  toggleLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
});
