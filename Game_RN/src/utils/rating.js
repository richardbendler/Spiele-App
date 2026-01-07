import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Play Store package matches android.package in app.json
const ANDROID_PACKAGE = 'com.felsbend.Game_RN';
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

const KEY_NEVER = 'rating.never';
const KEY_RATED = 'rating.rated';
const KEY_SNOOZE_UNTIL = 'rating.snoozeUntil';

const getBool = async (key) => {
  const v = await AsyncStorage.getItem(key);
  if (!v) return false;
  try { return !!JSON.parse(v); } catch (_) { return v === 'true'; }
};

const getNumber = async (key) => {
  const v = await AsyncStorage.getItem(key);
  if (!v) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const setNeverAskAgain = async () => {
  await AsyncStorage.setItem(KEY_NEVER, JSON.stringify(true));
};

export const snoozeDays = async (days) => {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  await AsyncStorage.setItem(KEY_SNOOZE_UNTIL, String(until));
};

const shouldShowPrompt = async () => {
  const never = await getBool(KEY_NEVER);
  if (never) return false;
  const rated = await getBool(KEY_RATED);
  if (rated) return false;
  const until = await getNumber(KEY_SNOOZE_UNTIL);
  if (until && Date.now() < until) return false;
  return true;
};

export const openStore = async () => {
  try { await Linking.openURL(PLAY_STORE_URL); } catch (_) { /* ignore */ }
};

export const askForRatingIfEligible = async (language = 'de') => {
  const eligible = await shouldShowPrompt();
  if (!eligible) return false;

  const title = language === 'de' ? 'Dir gefällt die App?' : 'Enjoying the app?';
  const message = language === 'de'
    ? 'Bewerte uns im Play Store – das hilft uns sehr!'
    : 'Please rate us on the Play Store — it really helps!';

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: language === 'de' ? 'Ja gerne' : 'Sure',
          onPress: async () => { await AsyncStorage.setItem(KEY_RATED, JSON.stringify(true)); await openStore(); resolve(true); },
        },
        {
          text: language === 'de' ? 'Erinnere mich später' : 'Remind me later',
          onPress: async () => { await snoozeDays(2); resolve(false); },
        },
        {
          text: language === 'de' ? 'Auf gar keinen Fall' : 'No thanks',
          style: 'cancel',
          onPress: async () => { await setNeverAskAgain(); resolve(false); },
        },
      ],
      { cancelable: true }
    );
  });
};
