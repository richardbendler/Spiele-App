import React, { useState, useContext, useCallback, useMemo, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, ScrollView, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { VariablesContext } from "../../VariablesContext";
import NameContainer from "./sublements/AddPlayerNameContainer";
import { useTranslation } from "../i18n";

const mapScaleLabel = (scale, index) => {
  if (!Array.isArray(scale) || index < 0 || index >= scale.length) {
    return "";
  }
  return scale[index];
};

const PlayerInput = React.memo(({ onAddPlayer, copy }) => {
  const [currentName, setCurrentName] = useState("");

  const handler = () => {
    const trimmedName = currentName.trim();
    if (trimmedName !== "") {
      onAddPlayer(trimmedName);
      setCurrentName("");
    }
  };

  return (
    <View style={styles.inputCard}>
      <Text style={styles.sectionLabel}>{copy.inputTitle}</Text>
      <Text style={styles.sectionHint}>{copy.inputSubtitle}</Text>
      <TextInput
        placeholder={copy.placeholder}
        placeholderTextColor="rgba(255,255,255,0.6)"
        value={currentName}
        onChangeText={setCurrentName}
        style={styles.nameInput}
        returnKeyType="done"
      />
      <TouchableOpacity onPress={handler} style={styles.primaryButton} activeOpacity={0.9}>
        <Text style={styles.primaryButtonText}>{copy.addButton}</Text>
      </TouchableOpacity>
    </View>
  );
});

const AddPlayer = ({ navigation, route }) => {
  const { players, setPlayers, theOneSettings, setTheOneSettings } = useContext(VariablesContext);
  const nextGameRoute = route?.params?.nextGame ?? "PicoloGame";
  const forwardParams = route?.params?.forwardParams;
  const showScales = route?.params?.showScales !== false;
  const { t } = useTranslation();
  const nextIdRef = useRef(0);

  useEffect(() => {
    const highestId = players.reduce((max, player) =>
      player?.id != null ? Math.max(max, Number(player.id)) : max,
      -1
    );
    nextIdRef.current = highestId >= 0 ? highestId + 1 : 0;
  }, [players]);

  const addPlayerText = useMemo(() => t("addPlayer"), [t]);
  const drinkingScale = useMemo(() => t("scales.drunkenness"), [t]);
  const familiarityScale = useMemo(() => t("scales.familiarity"), [t]);

  const playerInputCopy = useMemo(
    () => ({
      inputTitle: addPlayerText.inputTitle,
      inputSubtitle: addPlayerText.inputSubtitle,
      placeholder: addPlayerText.placeholder,
      addButton: addPlayerText.addButton,
    }),
    [addPlayerText]
  );

  const { currentDrunkenness, desiredDrunkenness, familiarity } = theOneSettings;
  const sliderMaxIndex = Array.isArray(drinkingScale) ? drinkingScale.length - 1 : 0;

  const updateSetting = useCallback(
    (key, maxValue) => (value) => {
      const upperBound = typeof maxValue === "number" ? maxValue : sliderMaxIndex;
      const clampedValue = Math.max(0, Math.min(upperBound, Math.round(value)));
      setTheOneSettings((prev) => ({ ...prev, [key]: clampedValue }));
    },
    [setTheOneSettings, sliderMaxIndex]
  );

  const handleAddPlayer = useCallback(
    (name) => {
      const nextId = nextIdRef.current;
      nextIdRef.current += 1;
      setPlayers((prev) => [...prev, { id: nextId, name, drinks: true }]);
    },
    [setPlayers]
  );

  const handleClearPlayers = useCallback(() => {
    setPlayers([]);
    nextIdRef.current = 0;
  }, [setPlayers]);

  const startGame = () => {
    if (players.length >= 2) {
      navigation.navigate(nextGameRoute, forwardParams);
    } else {
      Alert.alert(addPlayerText.alertTitle, addPlayerText.alertMessage);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={styles.background}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{addPlayerText.screenTitle}</Text>
        <Text style={styles.screenSubtitle}>{addPlayerText.listHint}</Text>

        <PlayerInput onAddPlayer={handleAddPlayer} copy={playerInputCopy} />

        <View style={styles.playerListCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{addPlayerText.listHeader}</Text>
            <Text style={styles.cardCounter}>{players.length} / 12</Text>
          </View>
          {players.length === 0 ? (
            <View style={styles.emptyPlayerContainer}>
              <Text style={styles.emptyPlayerText}>{addPlayerText.placeholder}</Text>
            </View>
          ) : (
            players.map((player) => (
              <NameContainer
                key={player.id != null ? String(player.id) : player.name}
                playerObject={player}
              />
            ))
          )}
        </View>

        {players.length > 0 ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearPlayers}
            activeOpacity={0.85}
          >
            <Text style={styles.clearButtonText}>{addPlayerText.clearAll}</Text>
          </TouchableOpacity>
        ) : null}

        {showScales ? (
          <View style={styles.sliderCard}>
            <Text style={styles.sliderTitle}>{addPlayerText.sliderCurrent}</Text>
            <View style={styles.sliderRow}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={sliderMaxIndex}
                step={1}
                value={currentDrunkenness}
                onValueChange={updateSetting("currentDrunkenness", sliderMaxIndex)}
                minimumTrackTintColor="#E5C185"
                maximumTrackTintColor="rgba(255,255,255,0.2)"
                thumbTintColor="#E5C185"
              />
              <Text style={styles.sliderValue}>
                {addPlayerText.sliderCurrentLabel} {mapScaleLabel(drinkingScale, currentDrunkenness)}
              </Text>
            </View>

            <Text style={styles.sliderTitle}>{addPlayerText.sliderDesired}</Text>
            <View style={styles.sliderRow}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={sliderMaxIndex}
                step={1}
                value={desiredDrunkenness}
                onValueChange={updateSetting("desiredDrunkenness", sliderMaxIndex)}
                minimumTrackTintColor="#E5C185"
                maximumTrackTintColor="rgba(255,255,255,0.2)"
                thumbTintColor="#E5C185"
              />
              <Text style={styles.sliderValue}>
                {addPlayerText.sliderDesiredLabel} {mapScaleLabel(drinkingScale, desiredDrunkenness)}
              </Text>
            </View>

            <Text style={styles.sliderTitle}>{addPlayerText.sliderFamiliarity}</Text>
            <View style={styles.sliderRow}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={Array.isArray(familiarityScale) ? familiarityScale.length - 1 : 0}
                step={1}
                value={familiarity}
                onValueChange={updateSetting("familiarity", Array.isArray(familiarityScale) ? familiarityScale.length - 1 : 0)}
                minimumTrackTintColor="#E5C185"
                maximumTrackTintColor="rgba(255,255,255,0.2)"
                thumbTintColor="#E5C185"
              />
              <Text style={styles.sliderValue}>
                {addPlayerText.sliderFamiliarityLabel} {mapScaleLabel(familiarityScale, familiarity)}
              </Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity onPress={startGame} style={[styles.startButton, !showScales && { marginTop: 16 }]} activeOpacity={0.9}>
          <Text style={styles.startButtonText}>{addPlayerText.startButton}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default AddPlayer;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 10, 14, 0.52)",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
  },
  screenTitle: {
    fontSize: 32,
    fontFamily: "Quicksand_300Bold",
    color: "white",
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    fontFamily: "Quicksand_300Light",
    color: "rgba(255,255,255,0.72)",
    marginBottom: 24,
  },
  inputCard: {
    backgroundColor: "rgba(19, 23, 32, 0.85)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sectionLabel: {
    fontSize: 18,
    color: "white",
    fontFamily: "Quicksand_300Bold",
  },
  sectionHint: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Quicksand_300Light",
    lineHeight: 18,
  },
  nameInput: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
    fontFamily: "Quicksand_300Bold",
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#E5C185",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#231C18",
    fontSize: 16,
    fontFamily: "Quicksand_300Bold",
  },
  playerListCard: {
    backgroundColor: "rgba(12, 15, 21, 0.9)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(229,193,133,0.6)',
  },
  clearButtonText: {
    color: '#E5C185',
    fontSize: 12,
    fontFamily: 'Quicksand_300Bold',
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: "white",
    fontFamily: "Quicksand_300Bold",
  },
  cardCounter: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Quicksand_300Light",
  },
  emptyPlayerContainer: {
    paddingVertical: 32,
  },
  emptyPlayerText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Quicksand_300Light",
    color: "rgba(255,255,255,0.4)",
  },
  sliderCard: {
    backgroundColor: "rgba(12, 15, 21, 0.9)",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sliderTitle: {
    fontSize: 15,
    color: "white",
    fontFamily: "Quicksand_300Bold",
    marginTop: 6,
  },
  sliderRow: {
    marginTop: 6,
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 42,
  },
  sliderValue: {
    textAlign: "right",
    fontSize: 12,
    color: "rgba(229,193,133,0.85)",
    fontFamily: "Quicksand_300Bold",
  },
  startButton: {
    marginTop: 30,
    backgroundColor: "#E5C185",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: {
    color: "#231C18",
    fontSize: 18,
    fontFamily: "Quicksand_300Bold",
    letterSpacing: 1,
  },
});
