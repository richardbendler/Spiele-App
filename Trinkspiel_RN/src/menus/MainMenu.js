import React, { useState, useContext, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, useWindowDimensions, Linking, Alert } from 'react-native';
import { PLAY_STORE_URL } from '../utils/rating';
import { VariablesContext } from '../../VariablesContext';
import Settings from './sublements/Settings';
import { useTranslation } from '../i18n';

/** --- Config --- */
const CARD_BG = 'rgba(18,14,12,0.96)';
const OVERLAY_SHADE = 'rgba(10,14,22,0.78)';

const translationKeyMap = {
  'The One': 'theOne',
  Skala: 'skala',
  Kingscup: 'kingscup',
  Schoeneberg: 'schoeneberg',
  'Geheime Mission': 'secretMission',
  MaexchenGame: 'maexchen',
  SpinTheBottle: 'spinTheBottle',
  Top10: 'top10',
  ManyQuestionsGame: 'manyQuestions',
  WerWuerde: 'whoWould',
  IchHabNochNie: 'neverHaveIEver',
  '6by6': 'sixBySix',
  Activity: 'activity',
  Getraenkezaehler: 'drinkCounter',
  HorseRace: 'horseRace',
  Kopfpoker: 'kopfpoker',
  PartyBoardGame: 'partyBoard',
};

const navigationMap = {
  'The One': 'AddPlayer',
  Kingscup: 'Kingscup',
  MaexchenGame: 'MaexchenGame',
  SpinTheBottle: 'SpinTheBottle',
  ManyQuestionsGame: 'ManyQuestionsGame',
  WerWuerde: 'WhoWouldLikelyGame',
  IchHabNochNie: 'NeverHaveIEverGame',
  Schoeneberg: 'Schoeneberg',
  'Geheime Mission': 'SecretMission',
  '6by6': 'SixBySixGame',
  Getraenkezaehler: 'DrinkCounter',
  HorseRace: 'HorseRace',
  PartyBoardGame: 'AddPlayer',
};
const nextGameMap = {

  'The One': { nextGame: 'PicoloGame', showScales: true },

  PartyBoardGame: { nextGame: 'PartyBoardGame', showScales: false },

};



const GAME_STYLE_MAP = {
  'The One': { icon: '🎯', accent: '#F5C26B' },
  Skala: { icon: '📊', accent: '#7AC1B2' },
  Kingscup: { icon: '👑', accent: '#B784D7' },
  Schoeneberg: { icon: '🏙️', accent: '#F08974' },
  MaexchenGame: { icon: '🎲', accent: '#F3AE82' },
  SpinTheBottle: { icon: '🍾', accent: '#6FC3C3' },
  Top10: { icon: '🔟', accent: '#EF8A9C' },
  ManyQuestionsGame: { icon: '❓', accent: '#C2E76E' },
    IchHabNochNie: { icon: '✋', accent: '#EF8A9C' },
  WerWuerde: { icon: '🤔', accent: '#A5B4FF' },
  '6by6': { icon: '🎲', accent: '#FFCF70' },
  Activity: { icon: '🎭', accent: '#FF9F7A' },
  Getraenkezaehler: { icon: '🥤', accent: '#E5C185' },
  HorseRace: { icon: '🐎', accent: '#88D4A3' },
  Kopfpoker: { icon: '🃏', accent: '#CFA1E6' },
  PartyBoardGame: { icon: '🎮', accent: '#FFD166' },
  'Geheime Mission': { icon: '🕵️', accent: '#7AC1B2' },
};

const DEFAULT_CARD_STYLE = { icon: '', accent: '#E5C185' };



// Verhindert Wort-Splitting auf Android: bricht nur zwischen Wörtern

const TitleNoWordBreak = ({ text, style }) => {

  const words = String(text || '').split(' ');

  return (

    <Text style={style}>

      {words.map((w, i) => (

        <Text key={i}>

          {w}

          {i < words.length - 1 ? ' ' : ''}

        </Text>

      ))}

    </Text>

  );

};



function MainMenu({ navigation }) {

  const { language } = useContext(VariablesContext);

  const { t } = useTranslation();

  const { width: windowWidth } = useWindowDimensions();



  const commonCopy = useMemo(() => t('common'), [t]);

  const gamesCopy = useMemo(() => t('mainMenu.games'), [t]);

  const newBadgeLabel = language === 'de' ? 'NEU' : 'NEW';



  const gridLayout = useMemo(() => {
    const horizontalPadding = 32; // ScrollView paddings combined
    const availableWidth = Math.max(windowWidth - horizontalPadding, 0);
    const maxCardWidth = windowWidth >= 1024 ? 320 : 260;

    let columns = 1;
    if (windowWidth >= 1200) {
      columns = 4;
    } else if (windowWidth >= 900) {
      columns = 3;
    } else if (windowWidth >= 360) {
      columns = 2;
    }

    const gap = columns > 1 ? 12 : 0;
    let cardWidth =
      columns === 1 ? Math.min(availableWidth, maxCardWidth) : (availableWidth - gap * (columns - 1)) / columns;

    cardWidth = Math.min(cardWidth, maxCardWidth);
    if (!cardWidth || Number.isNaN(cardWidth)) {
      cardWidth = maxCardWidth;
    }

    return { columns, cardWidth, gap, availableWidth };
  }, [windowWidth]);
  const isSingleColumnLayout = gridLayout.columns === 1;

  const cardGridDynamicStyle = {

    marginHorizontal: gridLayout.columns > 1 ? -(gridLayout.gap / 2) : 0,

    justifyContent:

      isSingleColumnLayout || gridLayout.cardWidth * gridLayout.columns + gridLayout.gap * (gridLayout.columns - 1) < gridLayout.availableWidth

        ? 'center'

        : 'flex-start',

  };

  const cardDynamicStyle = {

    width: gridLayout.cardWidth,

    marginHorizontal: gridLayout.columns > 1 ? gridLayout.gap / 2 : 0,

    alignSelf: isSingleColumnLayout ? 'center' : 'flex-start',

  };

  const footerDynamicStyle = isSingleColumnLayout ? styles.cardFooterRowFullWidth : null;

  const startChipDynamicStyle = isSingleColumnLayout ? styles.startChipFullWidth : null;



  // Render parameter stars (Trinklevel/Kennenlernen) like the yellow stars at bottom
  const renderParameterStars = (paramText, accentColor) => {
    if (!paramText || typeof paramText !== 'string') return null;
    // Try to extract "(x/5)" occurrences
    const matches = Array.from(paramText.matchAll(/\((\d)\/5\)/g)).map((m) => Number(m[1]));
    const labels = language === 'de' ? ['Trinklevel', 'Kennenlernen'] : ['Drink level', 'Getting to know'];
    const rows = [];
    const toStars = (n) => {
      const full = Math.max(0, Math.min(5, Number(n) || 0));
      return new Array(5).fill(0).map((_, i) => (
        <Text key={i} style={i < full ? styles.star : styles.starDim}>*</Text>
      ));
    };
    if (matches.length >= 2) {
      rows.push(
        <View key="row1" style={styles.paramRow}>
          <Text style={styles.paramLabel}>{labels[0]}:</Text>
          <View style={styles.paramStars}>{toStars(matches[0])}</View>
        </View>,
      );
      rows.push(
        <View key="row2" style={styles.paramRow}>
          <Text style={styles.paramLabel}>{labels[1]}:</Text>
          <View style={styles.paramStars}>{toStars(matches[1])}</View>
        </View>,
      );
      return rows;
    }
    // Fallback: show raw text
    return <Text style={styles.gameMeta}>{paramText}</Text>;
  };

  const gameDescriptions = useMemo(() => {
    const entries = {};
    Object.entries(translationKeyMap).forEach(([legacyKey, translationKey]) => {
      const copy = gamesCopy?.[translationKey] ?? {};
      entries[legacyKey] = {
        title: copy.title ?? legacyKey,
        parameters: copy.parameters ?? '',
        description: copy.description ?? '',
      };
    });

    // Visible title overrides
    if (entries.ManyQuestionsGame) { entries.ManyQuestionsGame.title = language === 'de' ? '100 Fragen' : '100 Questions'; }
    if (entries.MaexchenGame) { entries.MaexchenGame.title = 'Mäxchen'; }
    if (entries.Schoeneberg) { entries.Schoeneberg.title = 'Schöneberg'; }

    // Fallback descriptions
    Object.keys(entries).forEach((k) => {
      if (!entries[k].description) {
        entries[k].description = language === 'de' ? 'Mehr Infos folgen bald.' : 'More info coming soon.';
      }
    });

    entries.WerWuerde = entries.WerWuerde ?? {};
    if (!entries.WerWuerde.title || entries.WerWuerde.title === 'WerWuerde') {
      entries.WerWuerde.title = language === 'en' ? 'Who Would Most Likely' : 'Wer würde am ehesten';
    }
    if (!entries.WerWuerde.parameters) {
      entries.WerWuerde.parameters =
        language === 'en'
          ? 'Drink level: ★★☆☆☆ (2/5)\\nGetting to know each other: ★★★★☆ (4/5)'
          : 'Trinklevel: ★★☆☆☆ (2/5)\\nKennenlernen: ★★★★☆ (4/5)';
    }
    if (!entries.WerWuerde.description) {
      entries.WerWuerde.description =
        language === 'en'
          ? 'Count down, point together at whoever fits best. Most votes drink.'
          : 'Zählt gemeinsam bis drei und zeigt auf die Person, die am besten passt. Die meisten Stimmen trinken.';
    }

    entries['6by6'] = entries['6by6'] ?? {};
    if (!entries['6by6'].title || entries['6by6'].title === '6by6') {
      entries['6by6'].title = 'Six by Six';
    }
    if (!entries['6by6'].parameters) {
      entries['6by6'].parameters =
        language === 'en'
          ? 'Drink level: ★★★★★ (5/5)\\nGetting to know each other: ★☆☆☆☆ (1/5)'
          : 'Trinklevel: ★★★★★ (5/5)\\nKennenlernen: ★☆☆☆☆ (1/5)';
    }
    if (!entries['6by6'].description) {
      entries['6by6'].description =
        language === 'en'
          ? 'Roll the dice for row and column. Number cards mean sips. Red = go again, black = pass on.'
          : 'Würfelt euch über das 6x6-Feld. Zahlenkarten zeigen Schlucke. Rot = nochmal dran, Schwarz = weitergeben.';
    }

    if(language==='en'){ if(entries['Geheime Mission']) entries['Geheime Mission'].title='Secret Mission'; if(entries.IchHabNochNie) entries.IchHabNochNie.title='Never Have I Ever'; } return entries;
  }, [gamesCopy, language]);


  const allGameCards = useMemo(() => {
    return Object.keys(translationKeyMap).map((legacyKey) => {
      const entry = gameDescriptions[legacyKey] ?? {};
      const style = GAME_STYLE_MAP[legacyKey] ?? DEFAULT_CARD_STYLE;
      const hasTarget = !!navigationMap[legacyKey];
      return {

        key: legacyKey,

        title: entry.title,

        parameters: entry.parameters,

        description: entry.description,

        isNew: legacyKey === 'Getraenkezaehler',

        isComingSoon: !hasTarget,

        icon: style.icon,

        accent: style.accent,
      };
    });
  }, [gameDescriptions]);

  const drinkCounterCard = useMemo(
    () => allGameCards.find((game) => game.key === 'Getraenkezaehler'),
    [allGameCards],
  );

  const sortedGameCards = useMemo(() => {
    const filtered = allGameCards.filter((game) => game.key !== 'Getraenkezaehler');
    const playable = filtered.filter((game) => !game.isComingSoon);
    const comingSoon = filtered.filter((game) => game.isComingSoon);
    return [...playable, ...comingSoon];
  }, [allGameCards]);

  const [expandedKey, setExpandedKey] = useState(null);

  const toggleExpand = useCallback((key) => setExpandedKey((p) => (p === key ? null : key)), []);

  const startGame = useCallback((gameKey) => {
    const target = navigationMap[gameKey];
    if (!target) return;
    const params = nextGameMap[gameKey];

    if (gameKey === 'PartyBoardGame' || gameKey === '6by6') {
      const title = language === 'de' ? 'Beta-Hinweis' : 'Beta Notice';
      const message = language === 'de'
        ? 'Achtung: Dieses Spiel ist noch in Entwicklung und ist deswegen noch nicht perfekt ausgereift. Es kann Fehler enthalten und sich noch ändern. Möchtest du die Beta starten?'
        : 'Heads up: This game is still in development and not fully polished yet. It may contain bugs and change over time. Do you want to start the beta?';
      const cancelText = language === 'de' ? 'Abbrechen' : 'Cancel';
      const continueText = language === 'de' ? 'Beta starten' : 'Start beta';
      Alert.alert(title, message, [
        { text: cancelText, style: 'cancel' },
        { text: continueText, onPress: () => navigation.navigate(target, params ?? undefined) },
      ]);
      return;
    }

    navigation.navigate(target, params ?? undefined);
  }, [navigation, language]);

  const renderGameCard = (game, options = {}) => {
    if (!game) return null;

    const { disableResponsive = false, containerStyle, cardKey } = options;
    const layoutStyle = disableResponsive ? null : cardDynamicStyle;
    const footerStyle = disableResponsive ? null : footerDynamicStyle;
    const startChipLayoutStyle = disableResponsive ? null : startChipDynamicStyle;
    const isExpanded = expandedKey === game.key;
    const accentColor = game.accent;
    const startLabel = game.isComingSoon
      ? language === 'de'
        ? 'Bald verfügbar'
        : 'Coming soon'
      : (commonCopy?.startGame ?? 'Start game');

    const computedStartLabel = (!game.isComingSoon && (game.key === 'PartyBoardGame' || game.key === '6by6'))
      ? (language === 'de' ? 'Beta starten' : 'Start beta')
      : startLabel;

    const cardContainerStyles = [
      styles.gameCard,
      layoutStyle,
      containerStyle,
      isExpanded ? styles.gameCardExpanded : styles.gameCardCompact,
      { borderColor: `${accentColor}80`, shadowColor: `${accentColor}3D` },
    ];
    const cardTopRowStyles = [styles.cardTopRow, !isExpanded && styles.cardTopRowCompact];
    const cardIconWrapperStyles = [
      styles.cardIconWrapper,
      !isExpanded && styles.cardIconWrapperCompact,
      { backgroundColor: `${accentColor}26`, borderColor: `${accentColor}88` },
    ];
    const footerRowStyles = [styles.cardFooterRow, footerStyle, !isExpanded && styles.cardFooterRowCompact];
    const startChipStyles = [
      styles.startChip,
      startChipLayoutStyle,
      !isExpanded && styles.startChipCompact,
      game.isComingSoon ? styles.startChipDisabled : { backgroundColor: accentColor, borderColor: `${accentColor}AA` },
    ].filter(Boolean);
    const startChipLabelStyles = [styles.startChipLabel, game.isComingSoon && styles.startChipLabelDisabled].filter(Boolean);
    const startButton = game.isComingSoon ? (
      <View style={startChipStyles}>
        <Text style={startChipLabelStyles}>{computedStartLabel}</Text>
      </View>
    ) : (
      <TouchableOpacity style={startChipStyles} onPress={() => startGame(game.key)} activeOpacity={0.88}>
        <Text style={startChipLabelStyles}>{computedStartLabel}</Text>
      </TouchableOpacity>
    );

    return (
      <View key={cardKey ?? game.key} style={cardContainerStyles}>
        <TouchableOpacity style={cardTopRowStyles} onPress={() => toggleExpand(game.key)} activeOpacity={0.9}>
          <View style={cardIconWrapperStyles}>
            <Text style={styles.cardIcon}>{game.icon}</Text>
          </View>
          <View style={styles.cardHeaderContent}>
            <View style={styles.cardTitleRow}>
              <TitleNoWordBreak text={game.title} style={styles.gameTitleFull} />
              {game.isNew ? (
                <View style={[styles.newBadge, { backgroundColor: `${accentColor}26`, borderColor: `${accentColor}80` }]}>
                  <Text style={[styles.cardBadgeText, { color: accentColor }]}>{newBadgeLabel}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <Text style={[styles.chevron, isExpanded && styles.chevronExpanded]}>{isExpanded ? 'v' : '>'}</Text>
        </TouchableOpacity>

        {isExpanded && !!game.parameters ? (
          <View style={styles.paramStarsContainer}>
            {renderParameterStars(game.parameters, accentColor)}
          </View>
        ) : null}
        {isExpanded && !!game.description ? <Text style={styles.gameDescription}>{game.description}</Text> : null}
        {/* bottom rating row removed */}

        <View style={footerRowStyles}>
          {startButton}
        </View>
      </View>
    );
  };

  const headerTitle = language === 'de' ? 'Spielauswahl' : 'Game Lineup';
  const headerSubtitle = language === 'de' ? 'Tippe auf eine Karte f\u00fcr Details.' : 'Tap a card to see details.';
  const renderDrinkCounterShortcut = () => {
    if (!drinkCounterCard) return null;
    const accentColor = drinkCounterCard.accent;
    const titleFallback = language === 'de' ? 'Getr\u00e4nkez\u00e4hler' : 'Drink counter';
    const helperText = language === 'de' ? 'Runde tracken' : 'Track the round';
    const actionLabel = language === 'de' ? 'Öffnen' : 'Open';
    return (
      <TouchableOpacity
        key="drink-counter-shortcut"
        style={[styles.drinkCounterShortcut, { borderColor: `${accentColor}55`, backgroundColor: `${accentColor}14` }]}
        onPress={() => startGame('Getraenkezaehler')}
        activeOpacity={0.88}
      >
        <View style={[styles.drinkCounterIconWrapper, { backgroundColor: `${accentColor}26`, borderColor: `${accentColor}70` }]}>
          <Text style={styles.cardIcon}>{drinkCounterCard.icon}</Text>
        </View>
        <View style={styles.drinkCounterCopy}>
          <Text style={styles.drinkCounterTitle}>{drinkCounterCard.title || titleFallback}</Text>
          <Text style={styles.drinkCounterSubtitle}>{helperText}</Text>
        </View>
        <View style={[styles.drinkCounterAction, { backgroundColor: `${accentColor}F0` }]}>
          <Text style={styles.drinkCounterActionLabel}>{actionLabel}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require('../../assets/images/bar/bar_background_filled.png')} style={styles.background}>
      <View style={[styles.overlay, { backgroundColor: OVERLAY_SHADE }]} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
          </View>
          {renderDrinkCounterShortcut()}
        </View>

        <View style={[styles.cardGrid, cardGridDynamicStyle]}>
          {sortedGameCards.map((game) =>
            renderGameCard(game, {
              cardKey: game.key,
            }),
          )}
        </View>
        {/* Play Store rating CTA */}
        <TouchableOpacity
          onPress={() => Linking.openURL(PLAY_STORE_URL)}
          style={styles.rateCta}
          activeOpacity={0.88}
        >
          <Text style={styles.rateCtaStar}>★</Text>
          <Text style={styles.rateCtaLabel}>
            {language === 'de' ? 'Dir gefällt die App? Bewerte uns im Play Store' : 'Enjoy the app? Rate us on Play Store'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Settings />

    </ImageBackground>

  );

}



const styles = StyleSheet.create({

  background: { flex: 1 },

  overlay: { ...StyleSheet.absoluteFillObject },

  scrollContainer: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 96 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 16,
    rowGap: 16,
  },
  titleGroup: { flex: 1, paddingRight: 12 },
  headerTitle: { color: '#F5E9D7', fontSize: 24, fontFamily: 'Quicksand_700Bold' },
  headerSubtitle: { color: 'rgba(245,233,215,0.75)', fontSize: 12, marginTop: 4, lineHeight: 18, fontFamily: 'Quicksand_300Light' },
  drinkCounterShortcut: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    gap: 12,
  },
  drinkCounterIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drinkCounterCopy: { flex: 1, minWidth: 0 },
  drinkCounterTitle: { color: '#F5E9D7', fontSize: 14, fontFamily: 'Quicksand_700Bold' },
  drinkCounterSubtitle: { color: 'rgba(245,233,215,0.75)', fontSize: 11, marginTop: 2, fontFamily: 'Quicksand_300Light' },
  drinkCounterAction: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drinkCounterActionLabel: { fontSize: 12, fontFamily: 'Quicksand_300Bold', color: '#231C18', letterSpacing: 0.4 },

  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  gameCard: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    backgroundColor: CARD_BG,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginBottom: 14,
    flexShrink: 0,
  },
  gameCardCompact: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  gameCardExpanded: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 8,
  },
  cardTopRowCompact: {
    paddingVertical: 2,
    marginBottom: 4,
  },
  cardIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 10,
  },
  cardIconWrapperCompact: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  cardHeaderContent: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  newBadge: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  cardIcon: { fontSize: 22 },
  chevron: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginLeft: 12,
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: { transform: [{ rotate: '180deg' }] },
  cardBadgeText: { fontSize: 9, fontFamily: 'Quicksand_300Bold', letterSpacing: 0.8 },

  gameTitleFull: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Quicksand_300Bold',
    lineHeight: 18,
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    textBreakStrategy: 'simple',
    android_hyphenationFrequency: 'none',
    includeFontPadding: false,
  },

  gameMeta: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginBottom: 4, fontFamily: 'Quicksand_300Light' },
  gameDescription: { color: 'rgba(255,255,255,0.92)', lineHeight: 15, fontSize: 11, fontFamily: 'Quicksand_300Light' },
  rateCta: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(229,193,133,0.65)',
    backgroundColor: 'rgba(24,19,15,0.48)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  rateCtaStar: { color: '#E5C185', fontSize: 14, marginTop: -1 },
  rateCtaLabel: { color: 'rgba(255,255,255,0.95)', fontSize: 13.5, fontFamily: 'Quicksand_300Bold', textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 8 },
  star: { color: '#FFD166', fontSize: 12 },

  starDim: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },

  ratingText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginLeft: 6, fontFamily: 'Quicksand_300Light' },

  // Parameters stars layout
  paramStarsContainer: { marginTop: 6, gap: 4 },
  paramRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  paramLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: 'Quicksand_300Light' },
  paramStars: { flexDirection: 'row', alignItems: 'center', gap: 2 },



  cardFooterRow: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
    alignSelf: 'stretch',
  },
  cardFooterRowFullWidth: { justifyContent: 'flex-start' },
  startChip: {
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
  },
  cardFooterRowCompact: { marginTop: 6 },
  startChipCompact: {
    minWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  startChipFullWidth: { alignSelf: 'stretch', width: '100%' },
  startChipLabel: {
    fontFamily: 'Quicksand_300Bold',
    fontSize: 12.5,
    letterSpacing: 0.4,
    color: '#231C18',
    textAlign: 'center',
  },

  startChipDisabled: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.24)' },

  startChipLabelDisabled: { color: 'rgba(255,255,255,0.55)' },

});



export default MainMenu;



























