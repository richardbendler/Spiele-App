import React, { useContext, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { VariablesContext } from "../../../VariablesContext";
import { useTranslation } from "../../i18n";

const NameContainer = ({ playerObject }) => {
  const { players, setPlayers } = useContext(VariablesContext);
  const { t } = useTranslation();

  const labels = useMemo(
    () => ({
      drinks: t("nameContainer.drinks"),
      noDrinks: t("nameContainer.noDrinks"),
      remove: t("nameContainer.remove"),
    }),
    [t]
  );

  const setDrinkStatus = (player, drinks) => {
    setPlayers((prev) => prev.map((entry) => (entry === player ? { ...entry, drinks } : entry)));
  };

  const removePlayer = (player) => {
    setPlayers((prev) => prev.filter((entry) => entry !== player));
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.playerName}>{playerObject.name}</Text>
        <TouchableOpacity
          onPress={() => removePlayer(playerObject)}
          style={styles.removeButton}
          activeOpacity={0.85}
          accessibilityLabel={labels.remove}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          onPress={() => setDrinkStatus(playerObject, true)}
          style={[styles.toggleChip, playerObject.drinks ? styles.chipActive : null]}
          activeOpacity={0.9}
        >
          <Text style={[styles.toggleText, playerObject.drinks ? styles.chipTextActive : null]}>
            {labels.drinks}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDrinkStatus(playerObject, false)}
          style={[styles.toggleChip, !playerObject.drinks ? styles.chipActive : null]}
          activeOpacity={0.9}
        >
          <Text style={[styles.toggleText, !playerObject.drinks ? styles.chipTextActive : null]}>
            {labels.noDrinks}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(28,34,46,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Quicksand_300Bold',
    flexShrink: 1,
    paddingRight: 12,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(229,193,133,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#E5C185',
    fontSize: 16,
    fontFamily: 'Quicksand_300Bold',
    lineHeight: 16,
  },
  toggleGroup: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 4,
  },
  toggleChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#E5C185',
  },
  toggleText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Quicksand_300Bold',
  },
  chipTextActive: {
    color: '#241D18',
  },
});

export default NameContainer;
