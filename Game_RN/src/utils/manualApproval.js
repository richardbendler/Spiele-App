// Aktuell nirgends mehr verwendet: manual_approval steht im gesamten gebuendelten
// Prompt-Content durchgaengig auf 0 (kein Kurations-Workflow setzt es je auf 1), sodass
// jeder Verbraucher, der hierauf filtert, einen leeren Pool bekommt. Siehe App.js/PicoloGame.js.
// Fuer eine spaetere echte Content-Moderation (z.B. nach Backend-Reaktivierung) aufgehoben.
const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const isManualApproved = (entry) => {
  if (!entry) return false;
  const rawValue =
    entry.manualApproval ??
    entry.manual_approval ??
    entry.manuellFreigegeben ??
    entry.raw?.manual_approval ??
    entry.raw?.manualApproval;
  return toNumber(rawValue) === 1;
};

export const filterManualApproved = (list = []) =>
  Array.isArray(list) ? list.filter((entry) => isManualApproved(entry)) : [];
