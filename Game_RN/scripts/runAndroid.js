const { spawnSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Resolves adb without relying on PATH, since ANDROID_HOME/platform-tools
// is not guaranteed to be on PATH in every shell (see: Expo repeatedly
// picking a stale/offline emulator adb entry from a previous session).
const resolveAdb = () => {
  const sdkRoot = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (sdkRoot) {
    const candidate = path.join(sdkRoot, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return 'adb';
};

const listOnlineDevices = (adbPath) => {
  const result = spawnSync(adbPath, ['devices'], { encoding: 'utf8' });
  if (result.error) {
    throw new Error(`Konnte "${adbPath}" nicht ausfuehren: ${result.error.message}`);
  }
  return result.stdout
    .split(/\r?\n/)
    .slice(1) // "List of devices attached" header
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/))
    .filter(([, state]) => state === 'device') // drops "offline"/"unauthorized" ghosts
    .map(([serial]) => serial);
};

const adbPath = resolveAdb();

let devices;
try {
  devices = listOnlineDevices(adbPath);
} catch (err) {
  console.error(err.message);
  console.error('Stelle sicher, dass Android SDK platform-tools erreichbar sind (ANDROID_HOME gesetzt oder adb im PATH).');
  process.exit(1);
}

if (devices.length === 0) {
  console.error('Kein aktives Android-Geraet gefunden (adb devices zeigt keinen Eintrag mit Status "device").');
  console.error('Starte zuerst einen Emulator oder verbinde ein Geraet, dann erneut versuchen.');
  process.exit(1);
}

const chosen = devices[0];
if (devices.length > 1) {
  console.log(`Mehrere aktive Geraete gefunden (${devices.join(', ')}) - verwende "${chosen}".`);
} else {
  console.log(`Verwende Geraet "${chosen}".`);
}

// ANDROID_SERIAL macht die Zielauswahl fuer adb-basierte Tools (inkl. Expo/Metro)
// explizit, statt sie raten zu lassen, wenn mehrere Eintraege (auch offline) vorhanden sind.
const child = spawn('npx', ['expo', 'start', '--android'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, ANDROID_SERIAL: chosen },
});

child.on('exit', (code) => process.exit(code ?? 0));
