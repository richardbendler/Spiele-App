const { spawnSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { setTimeout: sleep } = require('timers/promises');

const METRO_PORT = 8081;
// Bewusst nicht 5554-5564: Auf dieser Maschine belegt der NTKDaemonService
// (Native Instruments) dauerhaft Port 5563, was ADB's automatische
// Emulator-Erkennung dazu bringt, einen nie erreichbaren "emulator-5562"
// Geister-Eintrag zu listen. Ein Emulator, der explizit auf einem Port
// ausserhalb dieses Bereichs startet, kollidiert damit nicht.
const EMULATOR_CONSOLE_PORT = Number(process.env.EMULATOR_PORT) || 5580;

const sdkRoot = () => process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;

// Resolves adb/emulator without relying on PATH, since ANDROID_HOME/platform-tools
// ist nicht in jeder Shell garantiert vorhanden.
const resolveSdkTool = (subdir, exeName) => {
  const root = sdkRoot();
  if (root) {
    const candidate = path.join(root, subdir, process.platform === 'win32' ? `${exeName}.exe` : exeName);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return exeName;
};

const listDeviceEntries = (adbPath) => {
  const result = spawnSync(adbPath, ['devices'], { encoding: 'utf8' });
  if (result.error) {
    throw new Error(`Konnte "${adbPath}" nicht ausfuehren: ${result.error.message}`);
  }
  return result.stdout
    .split(/\r?\n/)
    .slice(1) // "List of devices attached" header
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/));
};

// adb neigt dazu, nach Portkonflikten/nicht sauber beendeten Sessions verwaiste
// "offline"-Eintraege stehen zu lassen. Expo's eigene --android-Logik fragt
// wiederum ALLE von "adb devices" gelisteten Geraete ab (nicht nur ein
// gewaehltes) und bricht komplett ab, sobald eines davon nicht antwortet.
// Deshalb: selbst nur das erste wirklich einsatzbereite Geraet suchen und
// Expo dort gezielt vorbeisteuern, statt expo start --android zu nutzen.
const waitForActiveDevice = async (adbPath, { attempts = 1, delayMs = 1500, quiet = false } = {}) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const entries = listDeviceEntries(adbPath);
    const active = entries.filter(([, state]) => state === 'device');
    const ignored = entries.filter(([, state]) => state !== 'device');
    if (active.length > 0) {
      if (ignored.length > 0 && !quiet) {
        console.log(`Ignoriere nicht einsatzbereite Geraete: ${ignored.map(([serial, state]) => `${serial} (${state})`).join(', ')}`);
      }
      return active[0][0];
    }
    if (attempt < attempts) {
      if (!quiet) {
        console.log(`Noch kein einsatzbereites Geraet (Versuch ${attempt}/${attempts}), warte ${delayMs / 1000}s ...`);
      }
      await sleep(delayMs);
    }
  }
  return null;
};

const pickAvdName = (emulatorPath) => {
  if (process.env.EXPO_AVD_NAME) {
    return process.env.EXPO_AVD_NAME;
  }
  const result = spawnSync(emulatorPath, ['-list-avds'], { encoding: 'utf8' });
  const avds = (result.stdout || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (avds.length === 0) {
    return null;
  }
  if (avds.length > 1) {
    console.log(`Mehrere AVDs gefunden (${avds.join(', ')}) - verwende "${avds[0]}". Andere per EXPO_AVD_NAME waehlen.`);
  }
  return avds[0];
};

async function ensureDevice(adbPath, emulatorPath) {
  const already = await waitForActiveDevice(adbPath, { attempts: 1, quiet: true });
  if (already) {
    console.log(`Verwende bereits laufendes Geraet "${already}".`);
    return already;
  }

  const avdName = pickAvdName(emulatorPath);
  if (!avdName) {
    console.error('Kein AVD gefunden und kein Geraet aktiv. Lege in Android Studio > Device Manager einen Emulator an oder verbinde ein Geraet.');
    return null;
  }

  console.log(`Kein aktives Geraet - starte Emulator "${avdName}" auf Port ${EMULATOR_CONSOLE_PORT} ...`);
  const emulatorProcess = spawn(emulatorPath, ['-avd', avdName, '-port', String(EMULATOR_CONSOLE_PORT)], {
    detached: true,
    stdio: 'ignore',
  });
  emulatorProcess.unref();

  const serial = await waitForActiveDevice(adbPath, { attempts: 60, delayMs: 3000 });
  if (!serial) {
    console.error('Emulator ist nach 3 Minuten nicht als einsatzbereit erschienen. Android Studio > Device Manager pruefen.');
    return null;
  }
  return serial;
}

async function main() {
  const adbPath = resolveSdkTool('platform-tools', 'adb');
  const emulatorPath = resolveSdkTool('emulator', 'emulator');

  let serial;
  try {
    serial = await ensureDevice(adbPath, emulatorPath);
  } catch (err) {
    console.error(err.message);
    console.error('Stelle sicher, dass Android SDK platform-tools/emulator erreichbar sind (ANDROID_HOME gesetzt).');
    process.exit(1);
  }

  if (!serial) {
    process.exit(1);
  }

  console.log(`Verwende Geraet "${serial}".`);

  const expo = spawn('npx', ['expo', 'start'], {
    stdio: 'inherit',
    shell: true,
  });
  expo.on('exit', (code) => process.exit(code ?? 0));

  // Metro kurz Zeit geben, den Port zu binden, bevor App + Reverse-Tunnel folgen.
  await sleep(3000);

  spawnSync(adbPath, ['-s', serial, 'reverse', `tcp:${METRO_PORT}`, `tcp:${METRO_PORT}`], { stdio: 'inherit' });
  spawnSync(
    adbPath,
    ['-s', serial, 'shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', `exp://127.0.0.1:${METRO_PORT}`],
    { stdio: 'inherit' }
  );

  console.log('App auf dem Emulator gestartet. Hinweis: im Metro-Fenster NICHT "a" druecken - das nutzt Expos eigene, alle Geraete abfragende Android-Logik erneut. Bei Bedarf einfach "npm run android" erneut ausfuehren.');
}

main();
