import AsyncStorage from '@react-native-async-storage/async-storage';
//import axios from 'axios';

const saveToStorage = async (item, value) => {
    try {
        await AsyncStorage.setItem(item, JSON.stringify(value));
        //console.log(item, " gespeichert: ", value);
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
    }
};

//Database
export const handleSqlRequest = async (sqlRequest) => {
    //TODO: this function is still required for HandleFeedBack.js. In the future a new route for user feedback needs to be implemented. Currently, this function does nothing.
    };


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://blankiball.de:8443';
const API_TOKEN_VALUE = process.env.EXPO_PUBLIC_API_TOKEN;

const getAuthToken = () => {
    if (!API_TOKEN_VALUE) {
        console.error('Missing EXPO_PUBLIC_API_TOKEN in environment.');
        return null;
    }
    return `Bearer ${API_TOKEN_VALUE}`;
};

// new implementation for Rocket.rs Server
export const getGameData = async (storageItem, setter, route) => {
    // API_DISABLED: Rocket API calls are currently disabled.
    // const token = getAuthToken();
    // if (!token) {
    //     return;
    // }
    //
    // try {
    //     /*axios.defaults.baseURL = 'https://blankiball.de:8443';
    //
    //     // Beispiel GET-Anfrage
    //     axios.get('/games/bottleSpinTruth', {
    //         headers: {
    //             'api-key': 'Bearer <dein Token hier>'
    //         }
    //     })
    //     .then(response => {
    //         console.log('API response:', response.data);
    //     })
    //     .catch(error => {
    //         console.error('API error:', error);
    //     });*/
    //
    //     const response = await fetch(`${API_BASE_URL}/games/${route}`, {
    //         method: 'GET',
    //         headers: {
    //             'api-key': token,
    //             'Content-Type': "application/json"
    //         }
    //     });
    //
    //     if (response.ok) {
    //         let ret = await response.json();
    //
    //         //unwrap data from response
    //         ret = ret.content;
    //
    //         saveToStorage(storageItem, ret);
    //         setter(ret);
    //         console.log("API successfully got Data")
    //     } else {
    //         console.log(response)
    //         console.error(`There was an error on route ${route} while trying to recieve data from the server.`);
    //     }
    // } catch (error) {
    //     console.error(`There was an error on route ${route}: ${error}`);
    // }
    return;
};


export const postFeedback = async (table, question_id, feedback) => {
    // API_DISABLED: Rocket API calls are currently disabled.
    // const token = getAuthToken();
    // if (!token) {
    //     return;
    // }
    //
    // console.log(`table: ${table}, question_id: ${question_id}, feedback: ${feedback}`);
    //
    // try {
    //     const response = await fetch(`${API_BASE_URL}/feedback`, {
    //         method: 'POST',
    //         headers: {
    //             'api-key': token,
    //             'Content-Type': "application/json"
    //         },
    //         body: JSON.stringify({
    //             table,
    //             question_id,
    //             feedback
    //         })
    //     });
    //
    //     if (response.ok) {
    //         console.log("Successuflly sent feedback to server");
    //     } else {
    //         console.log("Feedback could not be sent to server");
    //     }
    // } catch (error) {
    //     console.error(`There was an error while sending feedback to the server: ${error}`);
    // }
    return;
};
