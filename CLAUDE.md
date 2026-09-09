# CLAUDE.md

Anweisungen für Claude Code in diesem Projekt. Ein Git-Repo mit zwei Teilen:
- `Game_RN/` – React-Native/Expo-App (Play Store)
- `Backend/js/` – Node.js-Server
- `Backend/rocket/rocket_server/` – Rust/Rocket-Server

## Kanarienvogel-Regel
Beginne **jede** Antwort an den Nutzer mit der Nennung des Namens "Richard" (z. B. als Anrede im ersten Satz). Grund: Der Nutzer nutzt dies als Indikator dafür, ob diese CLAUDE.md-Anweisungen noch zuverlässig befolgt werden. Fehlt der Name in einer Antwort, ist das für ihn das Signal, dass die Session zu lang geworden ist und er eine neue Session starten sollte. Diese Regel gilt für jede Antwort, unabhängig von Thema oder Länge, und hat Vorrang vor sonstigen Kürze-Vorgaben.

## Git-Workflow (automatisch, ohne Rückfrage)
Nach **jeder** inhaltlichen Änderung an Dateien in diesem Projekt:
1. Geänderte Dateien gezielt stagen (`git add <dateien>`, kein `git add -A`, keine Secrets/`.env`/Keys mitcommitten)
2. Commit mit kurzer, aussagekräftiger Message erstellen
3. `git push` zum aktuellen Branch auf `origin` durchführen

Diese Anweisung autorisiert Commit + Push im Voraus – keine erneute Rückfrage nötig, außer bei ungewöhnlichen Fällen (z. B. Merge-Konflikte, nötiger Force-Push, versehentlich gefundene Secrets).

## Build
- `Game_RN/`: kein lokaler Build-Schritt zwingend nötig (App läuft über Expo); Cloud-Builds laufen über EAS (siehe unten)
- `Backend/js/`: reines Node.js, kein Build-Schritt nötig
- `Backend/rocket/rocket_server/`: nach Änderungen `cargo build` ausführen

## Play Store / App Store (Game_RN)
`Game_RN/eas.json` enthält eine gültige EAS-Konfiguration inkl. Play-Console-Service-Account. Nach jeder Änderung an `Game_RN/`, die einen neuen Build rechtfertigt (Feature, Bugfix, Versions-Bump):

1. `eas build --platform android --profile production --non-interactive` (Cloud-Build)
2. `eas submit --platform android --profile production --non-interactive` – lädt den Build automatisch in den **internen Play-Store-Test-Track** hoch (`track: internal`). Das ist automatisch und ohne Rückfrage erlaubt, da nicht öffentlich sichtbar.

**Nicht automatisch:** Das Profil `production-release` (`track: production`, `releaseStatus: completed` = voller öffentlicher Rollout an echte Endnutzer) darf **nicht** automatisch ausgeführt werden. Dafür ist immer eine explizite Aufforderung des Nutzers in der jeweiligen Session nötig, da ein öffentlicher Rollout nicht rückgängig zu machen ist.
