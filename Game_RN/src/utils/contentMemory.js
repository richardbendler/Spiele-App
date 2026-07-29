// Geraeteseitiges Gedaechtnis dafuer, welche Fragen/Prompts eine Person in welchem Spielmodus
// schon gesehen hat - damit bei laengerer Nutzung bevorzugt neue Inhalte gezeigt werden, statt
// zufaellig auch kuerzlich gesehene zu wiederholen.
//
// Bewusst KEIN zeitbasiertes Cooldown (z.B. "24h Sperre pro Frage"): bei sehr aktiver Nutzung
// waere ein Pool damit schneller "leer" als die Sperre ablaeuft, und die Person bekaeme dann
// gar keine Fragen mehr angezeigt. Stattdessen: eine reine Reihenfolge-Praferenz ueber alle
// je gesehenen Eintraege - "nie gesehen" schlaegt immer "vor langer Zeit gesehen" schlaegt
// "gerade eben gesehen". Dadurch bleibt das System unabhaengig vom Spielvolumen robust: wer den
// kompletten Pool durchgespielt hat, bekommt als Naechstes einfach den am laengsten nicht mehr
// gezeigten Eintrag zurueck (bestmoegliche Auffrischung), nie eine Sackgasse ohne Inhalt.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shuffleArrayFisherYates } from '../games/sublements/AdjustParamShape';

const STORAGE_KEY = 'contentMemory_v1';
// Harte Obergrenze pro Namespace, damit der gespeicherte Verlauf bei sehr langer Nutzung nicht
// unbegrenzt waechst. Beim Ueberschreiten wird die aeltere Haelfte (nach lastSeenSeq) verworfen -
// das kostet nur ein wenig Sortier-Feinschliff fuer sehr alte Eintraege, nie Funktionsfaehigkeit.
const MAX_TRACKED_PER_NAMESPACE = 4000;

let store = null;
let loadPromise = null;

const emptyStore = () => ({ seq: 0, pools: {} });

// Laedt den gespeicherten Verlauf einmalig von der Platte (App.js ruft dies beim Start proaktiv
// auf). Solange der Ladevorgang noch laeuft, liefert orderBySeenPriority einen einfachen Shuffle
// zurueck (siehe unten) - kein Absturz, nur eine kurze Uebergangsphase ohne Praeferenz.
export async function ensureContentMemoryLoaded() {
  if (store) {
    return store;
  }
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        store = raw ? JSON.parse(raw) : emptyStore();
        if (!store || typeof store !== 'object' || typeof store.pools !== 'object') {
          store = emptyStore();
        }
      } catch {
        store = emptyStore();
      }
      return store;
    })();
  }
  return loadPromise;
}

export function isContentMemoryLoaded() {
  return store !== null;
}

function persist() {
  if (!store) {
    return;
  }
  // Fire-and-forget: ein gescheiterter Schreibvorgang bedeutet im schlimmsten Fall, dass die
  // naechste Session wieder bei "alles ungesehen" startet - nie ein Fehlerzustand im Spiel.
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch(() => {});
}

// Merkt sich, dass die uebergebenen Eintraege (per id) im angegebenen Namespace (= Spielmodus,
// z.B. "spinTheBottleTruth" oder "theOne:most-likely") jetzt gerade gezeigt wurden.
export function markContentSeen(namespace, ids) {
  if (!store || !namespace) {
    return;
  }
  const list = Array.isArray(ids) ? ids : [ids];
  const filtered = list.filter((id) => id !== undefined && id !== null && id !== '');
  if (filtered.length === 0) {
    return;
  }
  const bucket = store.pools[namespace] || (store.pools[namespace] = {});
  filtered.forEach((rawId) => {
    store.seq += 1;
    bucket[String(rawId)] = store.seq;
  });
  const keys = Object.keys(bucket);
  if (keys.length > MAX_TRACKED_PER_NAMESPACE) {
    keys
      .sort((a, b) => bucket[a] - bucket[b])
      .slice(0, keys.length - MAX_TRACKED_PER_NAMESPACE)
      .forEach((key) => delete bucket[key]);
  }
  persist();
}

// Ordnet `items` neu: nie gesehene Eintraege zuerst (untereinander zufaellig gemischt), danach
// bereits gesehene Eintraege vom laengsten her ungesehen zum zuletzt gesehenen (ebenfalls
// innerhalb gleicher "Aktualitaet" zufaellig gemischt, damit es sich nicht mechanisch anfuehlt).
// `getId(item)` muss eine stabile, eindeutige Kennung pro Eintrag liefern.
export function orderBySeenPriority(namespace, items, getId) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }
  if (!store || !namespace) {
    return shuffleArrayFisherYates(items.slice());
  }
  const bucket = store.pools[namespace] || {};
  const withMeta = shuffleArrayFisherYates(items.slice()).map((item) => {
    let id;
    try {
      id = getId(item);
    } catch {
      id = undefined;
    }
    const lastSeen = id === undefined || id === null ? -1 : bucket[String(id)];
    return { item, lastSeen: lastSeen === undefined ? -1 : lastSeen };
  });
  withMeta.sort((a, b) => a.lastSeen - b.lastSeen);
  return withMeta.map((entry) => entry.item);
}

// Variante fuer Verbraucher, die von HINTEN aus ihrer Liste entnehmen (z.B. thooneDeckBuilder's
// popMatching-Logik). Liefert dieselbe Praeferenz, aber mit den wichtigsten Eintraegen am Ende.
export function orderBySeenPriorityForPopFromEnd(namespace, items, getId) {
  return orderBySeenPriority(namespace, items, getId).reverse();
}
