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
