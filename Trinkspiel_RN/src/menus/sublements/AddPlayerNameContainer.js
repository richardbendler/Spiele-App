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
      <View style={styles.nameRow}>
        <Text style={styles.playerName}>
          {playerObject.name}
        </Text>
        <TouchableOpacity
          onPress={() => removePlayer(playerObject)}
          style={styles.removeButton}
          activeOpacity={0.8}
          accessibilityLabel={labels.remove}
        >
          <Text style={styles.removeButtonText}>x</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.playerStatus}>
        {playerObject.drinks ? labels.drinks : labels.noDrinks}
      </Text>

      <View style={styles.toggleGroup}>
        <TouchableOpacity
          onPress={() => setDrinkStatus(playerObject, true)}
          style={[styles.toggleButton, playerObject.drinks ? styles.toggleActive : styles.toggleInactive]}
          activeOpacity={0.85}
        >
          <Text style={[styles.toggleText, playerObject.drinks ? styles.toggleTextActive : null]}>
            {labels.drinks}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDrinkStatus(playerObject, false)}
          style={[styles.toggleButton, !playerObject.drinks ? styles.toggleActive : styles.toggleInactive]}
          activeOpacity={0.85}
        >
          <Text style={[styles.toggleText, !playerObject.drinks ? styles.toggleTextActive : null]}>
            {labels.noDrinks}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "rgba(23, 27, 36, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand_300Bold",
    flexShrink: 1,
    paddingRight: 8,
  },
  playerStatus: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Quicksand_300Light",
  },
  toggleGroup: {
    flexDirection: "row",
    width: '100%',
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginTop: 10,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleActive: {
    backgroundColor: "#E5C185",
  },
  toggleInactive: {
    backgroundColor: "transparent",
  },
  toggleText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontFamily: "Quicksand_300Bold",
  },
  toggleTextActive: {
    color: "#241D18",
  },
  removeButton: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(229,193,133,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#E5C185",
    fontSize: 18,
    fontFamily: "Quicksand_300Bold",
    lineHeight: 18,
  },
});

export default NameContainer;
