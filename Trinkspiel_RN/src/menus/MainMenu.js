import React, { useState, useContext, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, useWindowDimensions } from 'react-native';
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
  'The One': { icon: '🥇', accent: '#F5C26B' },
  Skala: { icon: '📊', accent: '#7AC1B2' },
  Kingscup: { icon: '👑', accent: '#B784D7' },
  Schoeneberg: { icon: '🎶', accent: '#F08974' },
  MaexchenGame: { icon: '🎲', accent: '#F3AE82' },
  SpinTheBottle: { icon: '🌈', accent: '#6FC3C3' },
  Top10: { icon: '🔟', accent: '#EF8A9C' },
  ManyQuestionsGame: { icon: '❓', accent: '#C2E76E' },
  WerWuerde: { icon: '🧐', accent: '#A5B4FF' },
  '6by6': { icon: '🎯', accent: '#FFCF70' },
  Activity: { icon: '🎭', accent: '#FF9F7A' },
  Getraenkezaehler: { icon: '🍻', accent: '#E5C185' },
  HorseRace: { icon: '🏇', accent: '#88D4A3' },
  Kopfpoker: { icon: '🃏', accent: '#CFA1E6' },
  PartyBoardGame: { icon: '🎉', accent: '#FFD166' },
};
const DEFAULT_CARD_STYLE = { icon: '🍹', accent: '#E5C185' };

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

    entries.WerWuerde = entries.WerWuerde ?? {};
    if (!entries.WerWuerde.title || entries.WerWuerde.title === 'WerWuerde') {
      entries.WerWuerde.title = language === 'en' ? 'Who Would Most Likely' : 'Wer würde am ehesten';
    }
    if (!entries.WerWuerde.parameters) {
      entries.WerWuerde.parameters =
        language === 'en'
          ? 'Drink level: ★★☆☆☆ (2/5)\nGetting to know each other: ★★★★☆ (4/5)'
          : 'Trinklevel: ★★☆☆☆ (2/5)\nKennenlernen: ★★★★☆ (4/5)';
    }
    if (!entries.WerWuerde.description) {
      entries.WerWuerde.description =
        language === 'en'
          ? 'Count down, point together at whoever fits best, and whoever has the most fingers drinks.'
          : 'Zählt gemeinsam bis drei und zeigt auf die Person, die am besten passt. Die meisten Stimmen trinken.';
    }

    entries['6by6'] = entries['6by6'] ?? {};
    if (!entries['6by6'].title || entries['6by6'].title === '6by6') {
      entries['6by6'].title = 'Six by Six';
    }
    if (!entries['6by6'].parameters) {
      entries['6by6'].parameters =
        language === 'en'
          ? 'Drink level: ★★★★★ (5/5)\nGetting to know each other: ★☆☆☆☆ (1/5)'
          : 'Trinklevel: ★★★★★ (5/5)\nKennenlernen: ★☆☆☆☆ (1/5)';
    }
    if (!entries['6by6'].description) {
      entries['6by6'].description =
        language === 'en'
          ? 'Roll the dice for row and column. Number cards mean sips. Red = go again, black = pass on.'
          : 'Würfelt euch über das 6x6-Feld. Zahlenkarten zeigen Schlucke. Rot = nochmal dran, Schwarz = weitergeben.';
    }

    return entries;
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
    navigation.navigate(target, params ?? undefined);
  }, [navigation]);

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
      : commonCopy?.startGame ?? 'Start game';

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
        <Text style={startChipLabelStyles}>{startLabel}</Text>
      </View>
    ) : (
      <TouchableOpacity style={startChipStyles} onPress={() => startGame(game.key)} activeOpacity={0.88}>
        <Text style={startChipLabelStyles}>{startLabel}</Text>
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
          <Text style={[styles.chevron, isExpanded && styles.chevronExpanded]}>▾</Text>
        </TouchableOpacity>

        {isExpanded && !!game.parameters ? <Text style={styles.gameMeta}>{game.parameters}</Text> : null}
        {isExpanded && !!game.description ? <Text style={styles.gameDescription}>{game.description}</Text> : null}
        {isExpanded ? (
          <View style={styles.ratingRow} accessible accessibilityLabel={language === 'de' ? 'Bewertung' : 'Rating'}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.star}>★</Text>
            <Text style={styles.star}>★</Text>
            <Text style={styles.star}>★</Text>
            <Text style={styles.starDim}>★</Text>
            <Text style={styles.ratingText}>4.0</Text>
          </View>
        ) : null}

        <View style={footerRowStyles}>
          {startButton}
        </View>
      </View>
    );
  };

  const headerTitle = language === 'de' ? 'Bar-Auswahl' : 'Bar lineup';
  const headerSubtitle = language === 'de' ? 'Alle spielbaren Games zuerst. Kompakt - Details bei Klick.' : 'Playable games first. Compact - details on tap.';
  const renderDrinkCounterShortcut = () => {
    if (!drinkCounterCard) return null;
    const accentColor = drinkCounterCard.accent;
    const titleFallback = language === 'de' ? 'Getränkezähler' : 'Drink counter';
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
  cardIcon: { fontSize: 18 },
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
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 8 },
  star: { color: '#FFD166', fontSize: 12 },
  starDim: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  ratingText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginLeft: 6, fontFamily: 'Quicksand_300Light' },

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
