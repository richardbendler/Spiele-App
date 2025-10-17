import React, { useContext, useMemo } from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { appStyles } from "../../../styles";
import { VariablesContext } from "../../../VariablesContext";
import { useTranslation } from "../../i18n";

const NameContainer = ({ playerObject }) => {
  const { players, setPlayers } = useContext(VariablesContext);
  const { t } = useTranslation();

  const labels = useMemo(
    () => ({
      drinks: t("nameContainer.drinks"),
      noDrinks: t("nameContainer.noDrinks"),
    }),
    [t]
  );

  const togglePlayerDrinks = (player) => {
    setPlayers((prevPlayerList) => {
      const updatedPlayerList = [...prevPlayerList];
      const index = updatedPlayerList.indexOf(player);
      if (index >= 0) {
        updatedPlayerList[index] = {
          ...updatedPlayerList[index],
          drinks: !updatedPlayerList[index].drinks,
        };
      }
      return updatedPlayerList;
    });
  };

  const removePlayer = (player) => {
    const index = players.indexOf(player);
    if (index > -1) {
      const newPlayerList = [...players];
      newPlayerList.splice(index, 1);
      setPlayers(newPlayerList);
    }
  };

  const TwoPartButton = ({ playerItem }) => (
    <TouchableOpacity onPress={() => togglePlayerDrinks(playerItem)}>
      <View style={styles.buttonContainer}>
        <View
          style={[
            styles.halfButton,
            {
              backgroundColor: playerItem.drinks ? "green" : "grey",
              opacity: playerItem.drinks ? 1 : 0.5,
            },
          ]}
        >
          <Text style={styles.buttonText}>{labels.drinks}</Text>
        </View>
        <View
          style={[
            styles.halfButton,
            {
              backgroundColor: !playerItem.drinks ? "red" : "grey",
              opacity: !playerItem.drinks ? 1 : 0.5,
            },
          ]}
        >
          <Text style={styles.buttonText}>{labels.noDrinks}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={appStyles.playerListText}>
      <Text style={{ color: "white", paddingRight: "2%", width: "35%" }} ellipsizeMode="tail" numberOfLines={1}>
        {playerObject.name}
      </Text>
      <View style={{ width: "50%" }}>
        <TwoPartButton playerItem={playerObject} />
      </View>
      <View style={{ paddingLeft: "2%" }}>
        <Button
          onPress={() => {
            removePlayer(playerObject);
          }}
          title="✕"
          color="red"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
  halfButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});

export default NameContainer;



