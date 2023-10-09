import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { VariablesContext } from '../../VariablesContext'; // Pfad zum VariablesContext anpassen
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrinkCounter = () => {
    const { drinkTypes, setDrinkTypes } = useContext(VariablesContext);
    // Laden der drinkTypes beim Start der Komponente
    useEffect(() => {
        const loadDrinkTypes = async () => {
            try {
                const storedDrinkTypesString = await AsyncStorage.getItem('drinkTypes');
                if (storedDrinkTypesString) {
                    setDrinkTypes(JSON.parse(storedDrinkTypesString));
                } // Andernfalls verwenden Sie einen Standardwert oder lassen Sie es leer
            } catch (error) {
                console.error('Fehler beim Laden der drinkTypes:', error);
            }
        };
        loadDrinkTypes();
    }, []); // Der leere Dependency-Array stellt sicher, dass dies nur beim Mounten ausgeführt wird

    // Speichern der drinkTypes, wenn sich diese ändern
    useEffect(() => {
        const saveDrinkTypes = async () => {
            try {
                await AsyncStorage.setItem('drinkTypes', JSON.stringify(drinkTypes));
            } catch (error) {
                console.error('Fehler beim Speichern der drinkTypes:', error);
            }
        };
        saveDrinkTypes();
    }, [drinkTypes]); // Der Dependency-Array mit drinkTypes stellt sicher, dass dies ausgeführt wird, wenn sich drinkTypes ändert

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Zustand zum Verwalten des Ladens
  
    // Funktion zum Laden der Getränkeinformationen aus dem lokalen Speicher
    const loadDrinkTypes = async () => {
      try {
        const storedDrinkTypes = await AsyncStorage.getItem('drinkTypes');
        if (storedDrinkTypes) {
          setDrinkTypes(JSON.parse(storedDrinkTypes));
        }
        setIsLoading(false); // Laden beenden
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Laden beenden
      }
    };

  const addDrinkType = () => {
    if (inputValue.trim() !== '') {
      setDrinkTypes([...drinkTypes, { name: inputValue, count: 0 }]);
      setInputValue('');
    }
  };

  const incrementCount = (index) => {
    const newDrinkTypes = [...drinkTypes];
    newDrinkTypes[index].count += 1;
    setDrinkTypes(newDrinkTypes);
  };

  // Getränkeinformationen beim Start laden
  useEffect(() => {
    loadDrinkTypes();
  }, []);

  // ...

  if (isLoading) {
    return <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
    <Text>Lade Getränke...</Text>
  </ImageBackground>; // Anzeigen einer Lademeldung
    
  }

  return (
    <ImageBackground source={require("../../assets/images/bar/table.png")} style={{flex: 1}}>
      <View style={styles.container}>
        <ScrollView>
          {drinkTypes.map((drinkType, index) => (
            <View key={index} style={styles.drinkTypeContainer}>
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
