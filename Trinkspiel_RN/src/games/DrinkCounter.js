import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { VariablesContext } from '../../VariablesContext'; // Pfad zum VariablesContext anpassen
import AsyncStorage from '@react-native-async-storage/async-storage';

/*function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}*/

const DrinkCounter = () => {
    const { drinkTypes, setDrinkTypes } = useContext(VariablesContext);
    //const [isLoading, setIsLoading] = useState(true); // Zustand zum Verwalten des Ladens

    const saveDrinkTypesInStorage = async (newDrinkTypes) => {
      try {
          await AsyncStorage.setItem("drinkTypes", JSON.stringify(newDrinkTypes));
          //console.log("drinkTypes gespeichert: ", newDrinkTypes);
      } catch (error) {
          console.error('Fehler beim Speichern der drinkTypes:', error);
      }
    };

    //console.log(drinkTypes)
    
    

  // Speichern der drinkTypes, wenn sich diese ändern
  //useEffect(() => {
  //  saveDrinkTypesInStorage();
  //}, [drinkTypes]); // Der Dependency-Array mit drinkTypes stellt sicher, dass dies ausgeführt wird, wenn sich drinkTypes ändert

  

    

    
    
  const [inputValue, setInputValue] = useState('');
  const addDrinkType = () => {
    if (inputValue.trim() !== '') {
      const newDrinkTypes = [...drinkTypes];
      newDrinkTypes.push({ name: inputValue, count: 0 });
      setDrinkTypes(newDrinkTypes);
      saveDrinkTypesInStorage(newDrinkTypes);
      setInputValue('');
    }
    
  };

  const incrementCount = (index) => {
    const newDrinkTypes = [...drinkTypes];
    newDrinkTypes[index].count += 1;
    setDrinkTypes(newDrinkTypes);
    saveDrinkTypesInStorage(newDrinkTypes);
  };

  const removeDrinkType = (index) => {
    const updatedDrinkTypes = drinkTypes.filter((_, i) => i !== index);
    setDrinkTypes(updatedDrinkTypes);
    saveDrinkTypesInStorage(updatedDrinkTypes);
  };

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>
        <ScrollView>
          {drinkTypes.map((drinkType, index) => (
            <View key={index} style={styles.drinkTypeContainer}>
              <TouchableOpacity onPress={() => removeDrinkType(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>❌</Text>
            </TouchableOpacity>
              <Text style={styles.drinkTypeName}>{drinkType.name}</Text>
              <View style={styles.counterContainer}>
                <Text style={styles.drinkTypeCount}>{drinkType.count}</Text>
                <TouchableOpacity onPress={() => incrementCount(index)} style={styles.button}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={text => setInputValue(text)}
            placeholder="Getränketyp hinzufügen"
          />
          <TouchableOpacity onPress={addDrinkType} style={styles.addButton}>
            <Text style={styles.buttonText}>Hinzufügen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //backgroundColor: '#f3f3f3',
  },
  drinkTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  drinkTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drinkTypeCount: {
    fontSize: 18,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
});

export default DrinkCounter;