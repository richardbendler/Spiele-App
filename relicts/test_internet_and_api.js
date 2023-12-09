import NetInfo from "@react-native-community/netinfo";



/////////////////////////////////////////////////////////////////////////
// TESTBEREICH START

const handleTestAPI = async () => {
    try {
        const response = await fetch('https://www.codeyourapp.de/tools/query.php?count=5&mode=0')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Senden des Texts.');
                }
                //console.log(response);
                return response.text();
            })
            .catch(error => {
                console.error('Fehler bei der Anfrage:', error);
                throw error; // Fehler weiterwerfen, um ihn in der nächsthöheren Funktion zu behandeln
            });

        return response; // Rückgabe der tatsächlichen Antwort
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
        throw error; // Fehler weiterwerfen, um ihn in der nächsthöheren Funktion zu behandeln
    }
};
// TESTBEREICH ENDE
/////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
    // TESTBEREICH START
    
    //Test Internet Connection
    const [isConnected, setIsConnected] = useState(true);
    useEffect(() => {
        // Überwache die Internetverbindung
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected);
        });
    
        return () => {
          // Stelle sicher, dass du das Abonnement auflöst, um Speicherlecks zu vermeiden
          unsubscribe();
        };
      }, []);

    //Zugriff Test-API
    const [ret, setRet] = useState(["Platzhalter"]);
    useEffect(() => {
        const fetchData = async () => {
        const result = await handleTestAPI();
        setRet(JSON.stringify(result));
    };
    fetchData();
    }, []);

    //Activity
    const [words, setWords] = useState(["Platzhalterfrage"]);
    useEffect(() => {
        const fetchData = async () => {
        const result = await handleSqlRequest('SELECT * FROM `game_activity_words`');
        setWords(JSON.stringify(result));
    };
    fetchData();
    }, []);




    _storeData = async (category, newTask) => {
        try {
            await AsyncStorage.setItem(
                category,
                newTask,
            );
            console.log(category, " gespeichert: ", newTask);
        } catch (error) {
            console.log('Error saving data', error);
        }
    };
    

    _retrieveData = async (category) => {
        try {
            const value = await AsyncStorage.getItem(category);
            if (value !== null) {
                // We have data!!
                console.log(category, " ausgelesen: ", value);
            }
        } catch (error) {
            console.log('Error retrieving data', error);
        }
    };

    useEffect(() => {
        // Aufrufen der _retrieveData-Funktion beim Initialisieren der Komponente
        //_storeData("TASK", "Bett machen");
        //_retrieveData("TASK");
        
        //const drinkTypesFromStorage = _retrieveData("drinkTypes");
        //const AdddrinkTypes1 = { name: "Beispielgetränk 1", count: 0 }
        //_storeData("drinkTypes", JSON.stringify(drinkTypes1));
    }, []);

    
    // TESTBEREICH ENDE
    /////////////////////////////////////////////////////////////////////////



    {/*<Text>{words}</Text>
                    <Text>--------------------------</Text>
                    <Text>{ret}</Text>*/}

                    {/*<TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
                        <Text style={appStyles.menuButtonText}>Custom Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={appStyles.menuButton}>
                        <Text style={appStyles.menuButtonText}>Eigene Karten</Text>
                    </TouchableOpacity>*/}

                    <Text>
                        {isConnected ? '' : 'Du bist nicht mit dem Internet verbunden...'}
                    </Text>