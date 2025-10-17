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
      <View style={styles.nameColumn}>
        <Text style={styles.playerName} numberOfLines={1}>
          {playerObject.name}
        </Text>
        <Text style={styles.playerStatus}>
          {playerObject.drinks ? labels.drinks : labels.noDrinks}
        </Text>
      </View>

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

      <TouchableOpacity
        onPress={() => removePlayer(playerObject)}
        style={styles.removeButton}
        activeOpacity={0.8}
        accessibilityLabel={labels.remove}
      >
        <Text style={styles.removeButtonText}>x</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "rgba(23, 27, 36, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },
  nameColumn: {
    flex: 1.3,
    paddingRight: 12,
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Quicksand_300Bold",
  },
  playerStatus: {
    marginTop: 2,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Quicksand_300Light",
  },
  toggleGroup: {
    flexDirection: "row",
    width: 160,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.05)",
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(229,193,133,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#E5C185",
    fontSize: 20,
    fontFamily: "Quicksand_300Bold",
    lineHeight: 20,
  },
});

export default NameContainer;
