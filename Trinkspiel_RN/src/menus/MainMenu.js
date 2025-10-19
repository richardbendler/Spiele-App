import React, { useState, useContext, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
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

  const commonCopy = useMemo(() => t('common'), [t]);
  const gamesCopy = useMemo(() => t('mainMenu.games'), [t]);
  const newBadgeLabel = language === 'de' ? 'NEU' : 'NEW';

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
    return entries;
  }, [gamesCopy]);

  const gameCards = useMemo(() => {
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

  const [expandedKey, setExpandedKey] = useState(null);
  const toggleExpand = useCallback((key) => setExpandedKey((p) => (p === key ? null : key)), []);
  const startGame = useCallback((gameKey) => {
    const target = navigationMap[gameKey];
    if (!target) return;
    const params = nextGameMap[gameKey];
    navigation.navigate(target, params ?? undefined);
  }, [navigation]);

  const headerTitle = language === 'de' ? 'Bar-Auswahl' : 'Bar lineup';
  const headerSubtitle = language === 'de' ? 'Alle spielbaren Games zuerst. Kompakt – Details bei Klick.' : 'Playable games first. Compact – details on tap.';

  return (
    <ImageBackground source={require('../../assets/images/bar/bar_background_filled.png')} style={styles.background}>
      <View style={[styles.overlay, { backgroundColor: OVERLAY_SHADE }]} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
          </View>
        </View>

        <View style={styles.cardGrid}>
          {gameCards.map((game) => {
            const isExpanded = expandedKey === game.key;
            const StartChip = (
              <View
                style={[styles.startChip, game.isComingSoon ? styles.startChipDisabled : { backgroundColor: game.accent, borderColor: `${game.accent}AA` }]}
              >
                <Text style={[styles.startChipLabel, game.isComingSoon && styles.startChipLabelDisabled]}>
                  {game.isComingSoon
                    ? language === 'de'
                      ? 'Bald verfügbar'
                      : 'Coming soon'
                    : commonCopy?.startGame ?? 'Start game'}
                </Text>
              </View>
            );

            return (
              <View key={game.key} style={[styles.gameCard, { borderColor: `${game.accent}80`, shadowColor: `${game.accent}3D` }]}> 
                <TouchableOpacity style={styles.cardTopRow} onPress={() => toggleExpand(game.key)} activeOpacity={0.9}>
                  <View style={[styles.cardIconWrapperAbs, { backgroundColor: `${game.accent}26`, borderColor: `${game.accent}88` }]}>
                    <Text style={styles.cardIcon}>{game.icon}</Text>
                  </View>
                  <Text style={[styles.chevronAbs, isExpanded && styles.chevronExpanded]}>▾</Text>
                  {game.isNew ? (
                    <View style={[styles.newBadgeAbs, { backgroundColor: `${game.accent}33`, borderColor: `${game.accent}80` }]}>
                      <Text style={[styles.cardBadgeText, { color: game.accent }]}>{newBadgeLabel}</Text>
                    </View>
                  ) : null}
                  <TitleNoWordBreak text={game.title} style={styles.gameTitleFull} />
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

                <View style={styles.cardFooterRow}>
                  {!game.isComingSoon && (
                    <TouchableOpacity onPress={() => startGame(game.key)} activeOpacity={0.88}>
                      {StartChip}
                    </TouchableOpacity>
                  )}
                  {game.isComingSoon && StartChip}
                </View>
              </View>
            );
          })}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  titleGroup: { flex: 1, paddingRight: 12 },
  headerTitle: { color: '#F5E9D7', fontSize: 24, fontFamily: 'Quicksand_700Bold' },
  headerSubtitle: { color: 'rgba(245,233,215,0.75)', fontSize: 12, marginTop: 4, lineHeight: 18, fontFamily: 'Quicksand_300Light' },

  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gameCard: {
    width: '48%',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    backgroundColor: CARD_BG,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginBottom: 14,
  },
  cardTopRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 44,
    paddingRight: 28,
  },
  cardIconWrapperAbs: {
    position: 'absolute',
    left: 12,
    top: 18,
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardIcon: { fontSize: 20 },
  chevronAbs: {
    position: 'absolute',
    right: 12,
    top: 20,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: { transform: [{ rotate: '180deg' }] },
  newBadgeAbs: {
    position: 'absolute',
    right: 12,
    top: 36,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignSelf: 'flex-end',
  },
  cardBadgeText: { fontSize: 9, fontFamily: 'Quicksand_300Bold', letterSpacing: 0.8 },

  gameTitleFull: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Quicksand_300Bold',
    lineHeight: 20,
    width: '100%',
    minWidth: 0,
    flexShrink: 1,
    textBreakStrategy: 'simple',
    android_hyphenationFrequency: 'none',
    includeFontPadding: false,
  },

  gameMeta: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginBottom: 4, fontFamily: 'Quicksand_300Light' },
  gameDescription: { color: 'rgba(255,255,255,0.92)', lineHeight: 16, fontSize: 11, fontFamily: 'Quicksand_300Light' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 8 },
  star: { color: '#FFD166', fontSize: 12 },
  starDim: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  ratingText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginLeft: 6, fontFamily: 'Quicksand_300Light' },

  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  startChip: {
    borderRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
  },
  startChipLabel: {
    fontFamily: 'Quicksand_300Bold',
    fontSize: 12,
    letterSpacing: 0.4,
    color: '#231C18',
  },
  startChipDisabled: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.24)' },
  startChipLabelDisabled: { color: 'rgba(255,255,255,0.55)' },
});

export default MainMenu;