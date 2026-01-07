import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, TextInput, Modal, Alert, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VariablesContext } from '../../VariablesContext';
import InfoText from './sublements/InfoText';
import InfoHint from './sublements/InfoHint';
import TutorialOverlay from './sublements/TutorialOverlay';
import { appStyles } from '../../styles';
import { useTranslation } from '../i18n';

const ALCOHOL_DENSITY = 0.789; // g/ml
const METABOLISM_PER_HOUR = 0.012; // g/dL per hour (~0.12 promille/h)
const BODY_WATER = 0.68;
const DEFAULT_WEIGHT = 75;
const DEFAULT_ICON = "\uD83E\uDD64";
const ICON_BY_ID = { "beer-500": "\uD83C\uDF7A", "beer-330": "\uD83C\uDF7A", "radler-500": "\uD83C\uDF7A", "wine-150": "\uD83C\uDF77", "shot-40": "\uD83E\uDD43", "cocktail-250": "\uD83C\uDF79", "water-500": "\uD83D\uDCA7", "sekt-100": "\uD83E\uDD42", "gin-tonic-250": "\uD83C\uDF78", "cola-330": "\uD83E\uDD64", "energy-250": "\u26A1", "cider-330": "\uD83C\uDF4F", "weinschorle-300": "\uD83C\uDF77", "vodka-shot-20": "\uD83E\uDD43" };
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;
const NAME_ICON_SUGGESTIONS = [
  { pattern: /bier/i, icon: '\uD83C\uDF7A' },
  { pattern: /wein|rose/i, icon: '\uD83C\uDF77' },
  { pattern: /shot|schnaps|whisky|whiskey|bourbon|vodka|rum/i, icon: '\uD83E\uDD43' },
  { pattern: /cocktail|spritz|mai tai|colada|mojito|martini/i, icon: '\uD83C\uDF79' },
  { pattern: /sekt|prosecco|champagner/i, icon: '\uD83E\uDD42' },
  { pattern: /biermix|radler|shandy/i, icon: '\uD83C\uDF7A' },
  { pattern: /alkoholfrei|wasser|soft|saft|juice/i, icon: '\uD83D\uDCA7' },
];
const EMOJI_CHOICES = [
  '\uD83C\uDF7A','\uD83C\uDF77','\uD83C\uDF79','\uD83E\uDD43','\uD83C\uDF78','\uD83E\uDD42','\uD83E\uDD64','\uD83D\uDCA7','\u26A1','\u2728','\u2615','\uD83C\uDF75',
  '\uD83C\uDF76','\uD83C\uDF7E','\uD83C\uDF7D','\uD83C\uDF64','\uD83C\uDF63','\uD83C\uDF5A','\uD83C\uDF4E','\uD83C\uDF52','\uD83C\uDF53','\uD83C\uDF6D','\uD83C\uDF82','\uD83C\uDF89'
];

const DrinkCounter = () => {
  const { drinkCatalog, setDrinkCatalog, drinkLog, setDrinkLog, tutorialEnabled, setTutorialEnabled } = useContext(VariablesContext);
  const { language } = useTranslation();
  const t = (de, en) => (language === 'en' ? en : de);

  // Profile
  const [profileVisible, setProfileVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [bodyWeightKg, setBodyWeightKg] = useState(DEFAULT_WEIGHT);

  // UI
  const [editRecent, setEditRecent] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const [statsVisible, setStatsVisible] = useState(false);
  const [manageExpanded, setManageExpanded] = useState(false);
  const [form, setForm] = useState({ name: '', abv: '5', volume: '500', icon: '' });

  // Load profile at start
  useEffect(() => {
    (async () => {
      try {
        const nameRaw = await AsyncStorage.getItem('drinkCounter_userName');
        const weightRaw = await AsyncStorage.getItem('drinkCounter_bodyWeightKg');
        if (nameRaw) setUserName(nameRaw);
        if (weightRaw) {
          const w = parseFloat(String(weightRaw).replace(',', '.'));
          if (!Number.isNaN(w) && w > 20 && w < 300) setBodyWeightKg(w);
        }
        if (!nameRaw || !weightRaw) setProfileVisible(true);
      } catch {
        setProfileVisible(true);
      }
    })();
  }, []);

  const saveProfile = useCallback(async () => {
    const safeName = (userName || '').trim();
    const w = parseFloat(String(bodyWeightKg).replace(',', '.'));
    const safeWeight = Math.max(20, Math.min(300, Number.isNaN(w) ? DEFAULT_WEIGHT : w));
    setUserName(safeName);
    setBodyWeightKg(safeWeight);
    await AsyncStorage.setItem('drinkCounter_userName', safeName);
    await AsyncStorage.setItem('drinkCounter_bodyWeightKg', String(safeWeight));
    setProfileVisible(false);
  }, [userName, bodyWeightKg]);

  // Persist helpers
  const persistCatalog = useCallback(async (catalog) => {
    setDrinkCatalog(catalog);
    try { await AsyncStorage.setItem('drinkCounter_catalog', JSON.stringify(catalog)); } catch {}
  }, [setDrinkCatalog]);
  const persistLog = useCallback(async (log) => {
    setDrinkLog(log);
    try { await AsyncStorage.setItem('drinkCounter_log', JSON.stringify(log)); } catch {}
  }, [setDrinkLog]);

  // Quick drinks: all visible
  const quickDrinks = useMemo(() => (drinkCatalog || []).filter((d) => !d.isHidden), [drinkCatalog]);
  const palette = ['#F5C26B','#D26B6B','#8BC6B9','#A37ACC','#F7A0AE','#6CD0C7','#F3CE8B','#88C9F9','#B6E0CE','#EAC77B'];

  // Icon helpers + logging
  const guessIconForName = useCallback((name) => {
    if (!name) return DEFAULT_ICON;
    for (const c of NAME_ICON_SUGGESTIONS) { if (c.pattern.test(name)) return c.icon; }
    const emojiChar = Array.from(name).find((ch) => EMOJI_REGEX.test(ch));
    return emojiChar || DEFAULT_ICON;
  }, []);
  const resolveIcon = useCallback((drink) => {
    if (!drink) return DEFAULT_ICON;
    if (drink.icon && drink.icon !== '??' && EMOJI_REGEX.test(drink.icon)) return drink.icon;
    if (ICON_BY_ID[drink.id]) return ICON_BY_ID[drink.id];
    return guessIconForName(drink.name) || DEFAULT_ICON;
  }, [guessIconForName]);
  // Log a drink
  const logDrink = useCallback((drink) => {
    const entry = { id: `log-${Date.now()}`, drinkId: drink.id, name: drink.name, abv: drink.abv, volumeMl: drink.volumeMl, timestamp: new Date().toISOString(), icon: resolveIcon(drink) };
    persistLog([...(drinkLog || []), entry]);
  }, [drinkLog, persistLog, resolveIcon]);

  // Manage visibility
  const toggleVisibility = useCallback((drink) => {
    const next = (drinkCatalog || []).map((d) => d.id === drink.id ? { ...d, isHidden: !d.isHidden } : d);
    persistCatalog(next);
  }, [drinkCatalog, persistCatalog]);
  const removeDrink = useCallback((drink) => {
    Alert.alert(t('Getränk löschen?', 'Delete drink?'), t('Das Getränk und zugehörige Einträge werden entfernt.', 'This drink and its log entries will be removed.'), [
      { text: t('Abbrechen', 'Cancel'), style: 'cancel' },
      { text: t('Löschen', 'Delete'), style: 'destructive', onPress: () => {
        persistCatalog((drinkCatalog || []).filter((d) => d.id !== drink.id));
        persistLog((drinkLog || []).filter((e) => e.drinkId !== drink.id));
      } },
    ]);
  }, [drinkCatalog, drinkLog, persistCatalog, persistLog]);

  // Edit recent
  const recentDrinks = useMemo(() => [...(drinkLog || [])].slice(-8).reverse(), [drinkLog]);
  const removeLogEntry = useCallback((entryId) => {
    Alert.alert(t('Eintrag löschen?', 'Delete entry?'), t('Dieser Log-Eintrag wird dauerhaft entfernt.', 'This log entry will be permanently removed.'), [
      { text: t('Abbrechen', 'Cancel'), style: 'cancel' },
      { text: t('Löschen', 'Delete'), style: 'destructive', onPress: () => persistLog((drinkLog || []).filter((e) => e.id !== entryId)) },
    ]);
  }, [drinkLog, persistLog]);
  const adjustLogTime = useCallback((entryId, deltaMinutes) => {
    const upd = (drinkLog || []).map((e) => e.id === entryId ? { ...e, timestamp: new Date(new Date(e.timestamp).getTime() + deltaMinutes * 60000).toISOString() } : e);
    persistLog(upd);
  }, [drinkLog, persistLog]);
  const updateLogVolume = useCallback((entryId, value) => {
    const vol = parseFloat(String(value).replace(',', '.'));
    if (Number.isNaN(vol) || vol <= 0 || vol > 2000) return;
    const upd = (drinkLog || []).map((e) => e.id === entryId ? { ...e, volumeMl: vol } : e);
    persistLog(upd);
  }, [drinkLog, persistLog]);

  const addDrink = useCallback(() => {
    const name = (form.name || '').trim();
    const abv = parseFloat(String(form.abv).replace(',', '.'));
    const volume = parseFloat(String(form.volume).replace(',', '.'));
    if (!name) return;
    if (Number.isNaN(abv) || abv < 0 || abv > 96) return;
    if (Number.isNaN(volume) || volume <= 0 || volume > 2000) return;
    const color = palette[(drinkCatalog?.length || 0) % palette.length];
    const providedIcon = (form.icon || '').trim();
    const icon = EMOJI_REGEX.test(providedIcon) ? providedIcon : guessIconForName(name);
    const newDrink = { id: `custom-${Date.now()}`, name, abv, volumeMl: volume, isHidden: false, color, icon };
    persistCatalog([...(drinkCatalog || []), newDrink]);
    setForm({ name: '', abv: '5', volume: '500', icon: '' });
  }, [form, drinkCatalog, persistCatalog, guessIconForName]);

  // BAC estimate (promille)
  const estimatedPromille = useMemo(() => {
    const weightGrams = bodyWeightKg * 1000;
    let bacGdL = 0;
    (drinkLog || []).forEach((e) => {
      const time = new Date(e.timestamp).getTime();
      if (Number.isNaN(time)) return;
      const hours = Math.max((Date.now() - time) / 3600000, 0);
      const grams = e.volumeMl * (e.abv / 100) * ALCOHOL_DENSITY;
      const raw = (grams / (BODY_WATER * weightGrams)) * 100; // g/dL
      const elim = Math.min(raw, hours * METABOLISM_PER_HOUR);
      bacGdL += Math.max(raw - elim, 0);
    });
    return +(bacGdL * 10).toFixed(2);
  }, [drinkLog, bodyWeightKg]);

  // Compute BAC at time helper
  const computePromilleAt = useCallback((timeMs) => {
    const weightGrams = bodyWeightKg * 1000;
    let bacGdL = 0;
    (drinkLog || []).forEach((e) => {
      const t = new Date(e.timestamp).getTime();
      if (Number.isNaN(t) || t > timeMs) return;
      const hours = Math.max((timeMs - t) / 3600000, 0);
      const grams = e.volumeMl * (e.abv / 100) * ALCOHOL_DENSITY;
      const raw = (grams / (BODY_WATER * weightGrams)) * 100;
      const elim = Math.min(raw, hours * METABOLISM_PER_HOUR);
      bacGdL += Math.max(raw - elim, 0);
    });
    return bacGdL * 10;
  }, [drinkLog, bodyWeightKg]);

  // Timeline (last 24h)
  const TIMELINE_POINTS = 12;
  const promilleTimeline = useMemo(() => {
    const current = Date.now();
    const start = current - 24 * 60 * 60 * 1000;
    const step = (current - start) / TIMELINE_POINTS;
    const pts = [];
    for (let i = 0; i <= TIMELINE_POINTS; i += 1) {
      const t = start + i * step;
      pts.push({ time: t, value: computePromilleAt(t) });
    }
    return pts;
  }, [computePromilleAt]);
  const timelineMax = useMemo(() => promilleTimeline.reduce((m, p) => Math.max(m, p.value), 0), [promilleTimeline]);
  const timelineTrend = useMemo(() => {
    if (promilleTimeline.length < 2) return 0;
    return promilleTimeline[promilleTimeline.length - 1].value - promilleTimeline[0].value;
  }, [promilleTimeline]);

  // Calendar last 7 days
  const formatDateKey = (value) => { const d = new Date(value); d.setHours(0,0,0,0); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; };
  const getWeekdayLabel = (date) => { const labels = language === 'en' ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['So','Mo','Di','Mi','Do','Fr','Sa']; return labels[date.getDay()]; };
  const calendarData = useMemo(() => {
    const buckets = new Map();
    (drinkLog || []).forEach((e) => {
      const key = formatDateKey(e.timestamp);
      const b = buckets.get(key) || { drinks: 0 };
      b.drinks += 1;
      buckets.set(key, b);
    });
    const today = new Date(); today.setHours(0,0,0,0);
    const days = [];
    for (let off = 6; off >= 0; off -= 1) {
      const day = new Date(today); day.setDate(today.getDate() - off);
      const key = formatDateKey(day);
      const b = buckets.get(key) || { drinks: 0 };
      days.push({ key, date: day, drinks: b.drinks });
    }
    return days;
  }, [drinkLog, language]);

  // Breakdown by drink
  const drinkBreakdown = useMemo(() => {
    const counts = {};
    (drinkLog || []).forEach((e) => { counts[e.drinkId] = (counts[e.drinkId] || 0) + 1; });
    const palette = ['#F5C26B','#D26B6B','#8BC6B9','#A37ACC','#F7A0AE','#6CD0C7','#F3CE8B','#88C9F9','#B6E0CE','#EAC77B'];
    const entries = Object.entries(counts).map(([drinkId, count], idx) => {
      const dc = (drinkCatalog || []).find((d) => d.id === drinkId);
      return { id: drinkId, name: dc?.name || '—', color: dc?.color || palette[idx % palette.length], count };
    }).sort((a,b)=>b.count-a.count);
    return entries;
  }, [drinkLog, drinkCatalog]);
  const breakdownMax = drinkBreakdown.length ? drinkBreakdown[0].count : 1;

  const formatAgo = (ts) => {
    const diffMin = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (diffMin < 1) return t('gerade eben', 'just now');
    if (diffMin < 60) return `${diffMin} ${t('Min.', 'min')}`;
    const h = Math.floor(diffMin / 60);
    return `${h} ${t('Std.', 'h')}`;
  };

  return (
    <ImageBackground source={require('../../assets/images/bar/table.png')} style={styles.background}>
      <View style={styles.overlay} />
      <TouchableOpacity onPress={() => setProfileVisible(true)} style={styles.profileFab}>
        <Text style={styles.profileFabLabel}>{t('Profil', 'Profile')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStatsVisible(true)} style={styles.statsFab}>
        <Text style={styles.statsFabLabel}>{t('Statistiken', 'Statistics')}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>{t('Getränkezähler', 'Drink Counter')}</Text>
            <Text style={styles.screenSubtitle}>{t('Behalte im Blick, was du heute getrunken hast.', 'Keep track of what you have had today.')}</Text>
          </View>
        </View>

        <View style={styles.bacCard}>
          <View style={styles.bacHeaderRow}>
            <Text style={styles.bacLabel}>{t('Geschätzter Alkoholpegel', 'Estimated BAC')}</Text>
            <TouchableOpacity onPress={() => setDetailsOpen((p) => !p)}>
              <Text style={styles.bacToggle}>{detailsOpen ? t('Details ausblenden', 'Hide details') : t('Details anzeigen', 'Show details')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bacValueRow}>
            <Text style={styles.bacValue}>{`${estimatedPromille.toFixed(2)} %`}</Text>
            <Text style={styles.bacMeta}>{t('Basis: Körpergewicht', 'Based on weight')}: {bodyWeightKg} kg</Text>
          </View>
          {detailsOpen && (
            <View style={styles.bacDetailsBox}>
              <Text style={styles.bacDetailsLine}>{t('Name', 'Name')}: {userName || '—'}</Text>
              <Text style={styles.bacDetailsLine}>{t('Letzter Drink', 'Last drink')}: {(recentDrinks[0] && formatAgo(recentDrinks[0].timestamp)) || '—'}</Text>
              <Text style={styles.bacDetailsLine}>{t('Einträge gesamt', 'Total entries')}: {(drinkLog || []).length}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setEditRecent((p) => !p)}
            style={[styles.editRecentInlineButton, editRecent ? styles.editRecentInlineButtonActive : null]}
            activeOpacity={0.85}
          >
            <Text style={[styles.editRecentInlineLabel, editRecent ? styles.editRecentInlineLabelActive : null]}>
              {editRecent ? t('Bearbeitung beenden', 'Finish editing') : t('Letzte Getränke bearbeiten', 'Edit recent drinks')}
            </Text>
          </TouchableOpacity>
          {editRecent && (
            <View style={styles.inlineRecentPanel}>
              <View style={styles.inlineRecentHeader}>
                <Text style={styles.inlineHeaderTime}>{t('Zeit', 'Time')}</Text>
                <Text style={styles.inlineHeaderVolume}>{t('Menge (ml)', 'Volume (ml)')}</Text>
                <Text style={styles.inlineHeaderAction}>{t('Aktion', 'Action')}</Text>
              </View>
              <ScrollView style={styles.inlineRecentScroll} contentContainerStyle={styles.inlineRecentContent}>
                {recentDrinks.map((entry) => (
                  <View key={entry.id} style={styles.inlineRecentRow}>
                    <View style={styles.inlineRecentText}>
                      <Text style={styles.inlineRecentTitle}>{entry.name}</Text>
                      <Text style={styles.inlineRecentMeta}>{formatAgo(entry.timestamp)} • {entry.volumeMl} ml</Text>
                    </View>
                    <View style={styles.inlineRecentActions}>
                      <TouchableOpacity onPress={() => adjustLogTime(entry.id, -5)} style={styles.inlineTimeChip}><Text style={styles.inlineTimeChipText}>-5m</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => adjustLogTime(entry.id, 5)} style={styles.inlineTimeChip}><Text style={styles.inlineTimeChipText}>+5m</Text></TouchableOpacity>
                      <TextInput style={styles.inlineVolumeInput} keyboardType="numeric" defaultValue={String(entry.volumeMl)} onEndEditing={(e) => updateLogVolume(entry.id, e.nativeEvent.text)} />
                      <TouchableOpacity onPress={() => removeLogEntry(entry.id)} style={styles.inlineRemoveChip}><Text style={styles.inlineRemoveChipText}>{t('Entfernen', 'Remove')}</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('Schnellauswahl', 'Quick picks')}</Text>
          <Text style={styles.sectionDescription}>{t('Tippe ein Getränk, um es sofort zu protokollieren.', 'Tap a drink to log it instantly.')}</Text>
        </View>
        {quickDrinks.length > 0 ? (
          <View style={[styles.quickGrid, windowWidth < 360 ? styles.quickGridTwoCols : styles.quickGridThreeCols]}>
            {quickDrinks.map((drink, index) => {
              const palette = ['#F5C26B','#D26B6B','#8BC6B9','#A37ACC','#F7A0AE','#6CD0C7','#F3CE8B','#88C9F9','#B6E0CE','#EAC77B'];
              const bg = drink.color || palette[index % palette.length];
              return (
                <TouchableOpacity key={drink.id} onPress={() => logDrink(drink)} style={[styles.quickTile, windowWidth < 360 ? styles.quickTileTwo : styles.quickTileThree, { backgroundColor: bg }]} activeOpacity={0.88}>
                  <Text style={styles.quickIcon}>🍹</Text>
                  <Text style={styles.quickTitle}>{drink.name}</Text>
                  <Text style={styles.quickMeta}>{drink.abv}% | {drink.volumeMl} ml</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyQuickText}>{t('Keine Drinks in der Schnellauswahl - verwalte sie unten.', 'No quick drinks yet - manage them below.')}</Text>
        )}

        <TouchableOpacity onPress={() => setManageExpanded((p) => !p)} style={styles.manageToggle} activeOpacity={0.85}>
          <Text style={styles.manageToggleText}>{manageExpanded ? t('Verstecken', 'Hide') : t('Getränke verwalten', 'Manage drinks')}</Text>
        </TouchableOpacity>
        {manageExpanded && (
        <View style={styles.manageCard}>
          {(drinkCatalog || []).map((drink) => (
            <View key={drink.id} style={styles.manageRow}>
              <View style={styles.manageIconPill}><Text style={styles.manageIcon}>{resolveIcon(drink)}</Text></View>
              <View style={styles.manageInfo}>
                <Text style={styles.manageName}>{drink.name}</Text>
                <Text style={styles.manageMeta}>{drink.abv}% • {drink.volumeMl} ml</Text>
                <View style={styles.manageActions}>
                  <TouchableOpacity onPress={() => toggleVisibility(drink)} style={[styles.actionChip, !drink.isHidden ? styles.actionChipActive : null]}>
                    <Text style={[styles.actionChipText, !drink.isHidden ? styles.actionChipTextActive : null]}>{!drink.isHidden ? t('Ausblenden', 'Hide') : t('Einblenden', 'Show')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeDrink(drink)} style={styles.removeChip}>
                    <Text style={styles.removeChipText}>{t('Löschen', 'Delete')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.formDivider} />
          <Text style={styles.sectionTitle}>{t('Eigenes Getränk anlegen', 'Create a custom drink')}</Text>
          <View style={styles.formRow}><TextInput style={styles.formInput} placeholder={t('Name', 'Name')} placeholderTextColor="rgba(255,255,255,0.4)" value={form.name} onChangeText={(v)=>setForm((f)=>({ ...f, name: v }))} /></View>
          <View style={styles.formRowTwoColumns}>
            <View style={styles.formFieldHalf}>
              <Text style={styles.formLabel}>{t('Alkoholgehalt in Prozent (% Vol)', 'Alcohol by volume (% Vol)')}</Text>
              <TextInput style={styles.formInputHalf} placeholder="% Vol" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="numeric" value={form.abv} onChangeText={(v)=>setForm((f)=>({ ...f, abv: v }))} />
            </View>
            <View style={styles.formFieldHalf}>
              <Text style={styles.formLabel}>{t('Menge (ml)', 'Volume (ml)')}</Text>
              <TextInput style={styles.formInputHalf} placeholder="ml" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="numeric" value={form.volume} onChangeText={(v)=>setForm((f)=>({ ...f, volume: v }))} />
            </View>
          </View>
          <Text style={[styles.sectionDescription, { marginTop: 8 }]}>{t('Emoji auswählen (optional):', 'Pick an emoji (optional):')}</Text>
          <View style={styles.emojiPickerRow}>
            {EMOJI_CHOICES.map((e) => (
              <TouchableOpacity key={e} onPress={() => setForm((prev) => ({ ...prev, icon: prev.icon === e ? '' : e }))} style={[styles.emojiChip, form.icon === e ? styles.emojiChipActive : null]} activeOpacity={0.85}>
                <Text style={styles.emojiChar}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={addDrink} style={styles.closeModalButton} activeOpacity={0.85}><Text style={styles.closeModalButtonText}>{t('Hinzufügen', 'Add')}</Text></TouchableOpacity>
        </View>
        )}
      </ScrollView>

      {/* Hints / Info */}
      <InfoText
        header={t('Getränkezähler!', 'Drink Counter!')}
        rules={t('Tippe deine Lieblingsgetränke in der Schnellauswahl an, um sie zu protokollieren.\n\nVerwalte Standarddrinks, blende sie aus oder lege eigene an. Die Statistiken zeigen dir Verlauf, Wochenübersicht und Favoriten inklusive Promille-Trend.','Tap your favourite drinks in quick access to log them.\n\nManage default drinks, hide them or create your own. The stats show your timeline, weekly overview, favourites and the BAC trend.')}
      />
      <InfoHint />

      {/* Profile Modal */}
      <Modal visible={profileVisible} animationType="fade" transparent onRequestClose={() => setProfileVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('Dein Profil', 'Your Profile')}</Text>
            <View style={styles.formRow}><TextInput style={styles.formInput} placeholder={t('Name', 'Name')} placeholderTextColor="rgba(255,255,255,0.4)" value={userName} onChangeText={setUserName} /></View>
            <View style={styles.formRow}><TextInput style={styles.formInput} placeholder={t('Körpergewicht (kg)', 'Body weight (kg)')} placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="numeric" value={String(bodyWeightKg)} onChangeText={setBodyWeightKg} /></View>
            <TouchableOpacity onPress={saveProfile} style={styles.closeModalButton}><Text style={styles.closeModalButtonText}>{t('Speichern', 'Save')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tutorial overlay */}
      <TutorialOverlay
        visible={!!tutorialEnabled}
        steps={[
          { text: t('Tippe Drinks in der Schnellauswahl, um sie zu protokollieren.', 'Tap drinks in quick picks to log them.'), placement: 'top' },
          { text: t('Verwalte Drinks unten — ausblenden oder eigene hinzufügen.', 'Manage drinks below — hide or add your own.'), placement: 'bottom' },
          { text: t('Statistiken zeigen Verlauf und Wochenübersicht.', 'Stats show trend and weekly overview.'), placement: 'bottom' },
        ]}
        stepIndex={0}
        onNext={() => setTutorialEnabled(false)}
        onClose={() => setTutorialEnabled(false)}
      />

      {/* Statistics Modal */}
      <Modal visible={statsVisible} animationType="fade" transparent onRequestClose={() => setStatsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{t('Statistiken', 'Statistics')}</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>{t('Heute', 'Today')}</Text>
                  <Text style={styles.summaryValue}>{calendarData.find(d=>formatDateKey(Date.now())===d.key)?.drinks || 0}</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>{t('Aktueller Pegel', 'Current BAC')}</Text>
                  <Text style={styles.summaryValue}>{estimatedPromille.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>{t('Trend', 'Trend')}</Text>
                  <Text style={styles.summaryHint}>{timelineTrend > 0 ? t('steigt', 'rising') : timelineTrend < 0 ? t('fällt', 'falling') : t('stabil', 'steady')}</Text>
                </View>
              </View>

              <Text style={styles.modalSubtitle}>{t('Promille-Verlauf (24h)', 'BAC trend (24h)')}</Text>
              {promilleTimeline.length === 0 ? (
                <Text style={styles.modalHint}>{t('Noch keine Daten', 'No data yet')}</Text>
              ) : (
                <View style={styles.timelineChart}>
                  {promilleTimeline.map((p, idx) => {
                    const h = timelineMax === 0 ? 0 : Math.max((p.value / timelineMax) * 100, p.value > 0 ? 6 : 2);
                    return <View key={idx} style={styles.timelineBar}><View style={[styles.timelineBarFill,{ height: `${h}%` }]} /></View>;
                  })}
                </View>
              )}

              <Text style={[styles.modalSubtitle, { marginTop: 18 }]}>{t('Letzte 7 Tage', 'Last 7 days')}</Text>
              <View style={styles.calendarRow}>
                {calendarData.map((d) => (
                  <View key={d.key} style={[styles.calendarCell, d.drinks > 0 ? styles.calendarCellActive : null]}>
                    <Text style={styles.calendarDay}>{getWeekdayLabel(d.date)}</Text>
                    <Text style={styles.calendarValue}>{d.drinks}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.modalSubtitle, { marginTop: 18 }]}>{t('Beliebte Getränke', 'Popular drinks')}</Text>
              {drinkBreakdown.length === 0 ? (
                <Text style={styles.modalHint}>{t('Noch keine Einträge', 'No entries yet')}</Text>
              ) : (
                <View style={styles.breakdownList}>
                  {drinkBreakdown.slice(0,5).map((it) => (
                    <View key={it.id} style={styles.breakdownRow}>
                      <View style={styles.breakdownLabel}><Text style={styles.breakdownName}>{it.name}</Text></View>
                      <View style={styles.breakdownBar}><View style={[styles.breakdownBarFill,{ width: `${Math.max((it.count/breakdownMax)*100,8)}%`, backgroundColor: it.color }]} /></View>
                      <Text style={styles.breakdownValue}>{it.count}x</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => setStatsVisible(false)} style={styles.closeModalButton}><Text style={styles.closeModalButtonText}>{t('Schließen', 'Close')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,14,22,0.6)' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 96, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 16 },
  screenTitle: { fontSize: 30, color: 'white', fontFamily: 'Quicksand_300Bold' },
  screenSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontFamily: 'Quicksand_300Light' },
  statsFab: { position: 'absolute', top: 56, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18, paddingVertical: 10, paddingHorizontal: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', zIndex: 2 },
  statsFabLabel: { color: 'white', fontSize: 13, fontFamily: 'Quicksand_300Bold', letterSpacing: 0.6 },
  profileFab: { position: 'absolute', top: 24, left: 16, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', zIndex: 10 },
  profileFabLabel: { color: 'white', fontSize: 12, fontFamily: 'Quicksand_300Bold', letterSpacing: 0.6 },
  bacCard: { backgroundColor: 'rgba(22,27,39,0.85)', borderRadius: 24, padding: 18, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  bacHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bacLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'Quicksand_300Light' },
  bacValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 },
  bacValue: { fontSize: 36, color: 'white', fontFamily: 'Quicksand_300Bold' },
  bacMeta: { color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 6 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { color: 'white', fontSize: 18, fontFamily: 'Quicksand_300Bold' },
  sectionDescription: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2, fontFamily: 'Quicksand_300Light' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 20 },
  quickGridThreeCols: { },
  quickGridTwoCols: { },
  quickTile: { borderRadius: 14, padding: 8, minHeight: 90, position: 'relative', justifyContent: 'flex-end', marginBottom: 12 },
  quickTileThree: { width: '33.3333%' },
  quickTileTwo: { width: '50%' },
  quickIcon: { fontSize: 22, marginBottom: 6 },
  quickTitle: { color: '#1B1B1F', fontSize: 13, fontFamily: 'Quicksand_300Bold' },
  quickMeta: { color: 'rgba(27,27,31,0.65)', fontSize: 10, marginTop: 1 },
  emptyQuickText: { color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand_300Light', fontSize: 13 },
  manageCard: { backgroundColor: 'rgba(18,21,31,0.9)', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 36 },
  manageRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  manageInfo: { flex: 1, gap: 6 },
  manageName: { color: 'white', fontFamily: 'Quicksand_300Bold', fontSize: 15 },
  manageMeta: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2, marginBottom: 6 },
  manageIconPill: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  manageIcon: { fontSize: 26 },
  manageActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, alignItems: 'center' },
  manageToggle: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 16 },
  manageToggleText: { color: 'white', fontFamily: 'Quicksand_300Bold', fontSize: 13 },
  bacToggle: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  bacDetailsBox: { marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 10 },
  bacDetailsLine: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  actionChip: { borderRadius: 14, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.06)' },
  actionChipActive: { backgroundColor: '#E5C185' },
  actionChipText: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'Quicksand_300Bold' },
  actionChipTextActive: { color: '#221B15' },
  removeChip: { borderRadius: 14, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255,92,92,0.18)', marginLeft: 'auto' },
  removeChipText: { color: '#FF6A6A', fontSize: 12, fontFamily: 'Quicksand_300Bold' },
  formDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 18 },
  formRowTwoColumns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  formFieldHalf: { flex: 1 },
  formLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 6 },
  formInputHalf: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', color: 'white', paddingHorizontal: 12, paddingVertical: 10 },
  // inline recent edit panel
  editRecentInlineButton: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingVertical: 6, paddingHorizontal: 12 },
  editRecentInlineButtonActive: { backgroundColor: '#E5C185' },
  editRecentInlineLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'Quicksand_300Bold' },
  editRecentInlineLabelActive: { color: '#221B15' },
  inlineRecentPanel: { marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 10 },
  inlineRecentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginBottom: 6 },
  inlineHeaderTime: { color: 'rgba(255,255,255,0.6)', fontSize: 11, flexBasis: 120, textAlign: 'center' },
  inlineHeaderVolume: { color: 'rgba(255,255,255,0.6)', fontSize: 11, width: 72, textAlign: 'center' },
  inlineHeaderAction: { color: 'rgba(255,255,255,0.6)', fontSize: 11, width: 72, textAlign: 'center' },
  inlineRecentScroll: { maxHeight: 220 },
  inlineRecentContent: { paddingBottom: 4 },
  inlineRecentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  inlineRecentText: { flex: 1 },
  inlineRecentTitle: { color: 'white', fontSize: 13, fontFamily: 'Quicksand_300Bold' },
  inlineRecentMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  inlineRecentActions: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  inlineTimeChip: { backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, width: 54, alignItems: 'center' },
  inlineTimeChipText: { color: 'white', fontSize: 11 },
  inlineVolumeInput: { width: 72, height: 40, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', color: 'white', paddingHorizontal: 10, paddingVertical: 8, textAlign: 'right', textAlignVertical: 'center', fontSize: 14, lineHeight: 22 },
  inlineRemoveChip: { backgroundColor: 'rgba(255,92,92,0.18)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  inlineRemoveChipText: { color: '#FF6A6A', fontSize: 12, fontFamily: 'Quicksand_300Bold' },
  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor: 'rgba(15,15,18,0.96)', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  modalTitle: { color: 'white', fontSize: 18, fontFamily: 'Quicksand_300Bold', marginBottom: 10 },
  formRow: { marginBottom: 12 },
  formInput: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', color: 'white', paddingHorizontal: 12, paddingVertical: 10 },
  closeModalButton: { marginTop: 12, alignSelf: 'flex-end', backgroundColor: '#E5C185', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 16 },
  closeModalButtonText: { color: '#231C18', fontFamily: 'Quicksand_300Bold', fontSize: 14 },
  // stats modal extra styles
  modalContent: { paddingBottom: 12 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  summaryCard: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', paddingVertical: 10, borderRadius: 12 },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  summaryValue: { color: 'white', fontSize: 18, fontFamily: 'Quicksand_300Bold', marginTop: 4 },
  summaryHint: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
  modalSubtitle: { color: 'white', fontSize: 16, fontFamily: 'Quicksand_300Bold', marginTop: 10 },
  modalHint: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6 },
  timelineChart: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 4, marginTop: 8 },
  timelineBar: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' },
  timelineBarFill: { width: '100%', backgroundColor: '#E5C185' },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 12 },
  calendarCell: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)' },
  calendarCellActive: { backgroundColor: 'rgba(229,193,133,0.18)' },
  calendarDay: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  calendarValue: { color: 'white', fontSize: 16, fontFamily: 'Quicksand_300Bold', marginTop: 4 },
  breakdownList: { marginTop: 12, gap: 10 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  breakdownLabel: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  breakdownName: { color: 'white', fontSize: 13, flexShrink: 1 },
  breakdownBar: { flex: 2, height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  breakdownBarFill: { height: '100%', borderRadius: 6 },
  breakdownValue: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginLeft: 8 },
  // Emoji picker (ensure multi-row layout)
  emojiPickerRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', marginTop: 8, marginBottom: 6 },
  emojiChip: { borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', marginRight: 8, marginBottom: 8 },
  emojiChipActive: { backgroundColor: '#E5C185', borderColor: '#E5C185' },
  emojiChar: { fontSize: 16 },
});

export default DrinkCounter;
