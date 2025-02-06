import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
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


// new implementation for Rocket.rs Server
export const getGameData = async (storageItem, setter, route) => {
    const token = "Bearer "+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFwcCJ9LCJpYXQiOjE2OTExNzU2OTV9.TqiVCGJdiq8lgn9-akwwzoRLxR5KZhllRXr_yWQL9JE"; // Token generieren und hier einfügen
    
    try {
        /*axios.defaults.baseURL = 'https://blankiball.de:8443';

        // Beispiel GET-Anfrage
        axios.get('/games/bottleSpinTruth', {
            headers: {
                'api-key': 'Bearer <dein Token hier>'
            }
        })
        .then(response => {
            console.log('API response:', response.data);
        })
        .catch(error => {
            console.error('API error:', error);
        });*/

        const response = await fetch(`https://blankiball.de:8443/games/${route}`, {
            method: 'GET',
            headers: {
                'api-key': token,
                'Content-Type': "application/json"
            }
        });

        if (response.ok) {
            let ret = await response.json();

            //unwrap data from response
            ret = ret.content;

            saveToStorage(storageItem, ret);
            setter(ret);
            console.log("API successfully got Data")
        } else {
            console.log(response)
            console.error(`There was an error on route ${route} while trying to recieve data from the server.`);
        }
    } catch (error) {
        console.error(`There was an error on route ${route}: ${error}`);
    }
};


export const postFeedback = async (table, question_id, feedback) => {
    const token = "Bearer "+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFwcCJ9LCJpYXQiOjE2OTExNzU2OTV9.TqiVCGJdiq8lgn9-akwwzoRLxR5KZhllRXr_yWQL9JE"; // Token generieren und hier einfügen
    
    console.log(`table: ${table}, question_id: ${question_id}, feedback: ${feedback}`);

    try {
        const response = await fetch("https://blankiball.de:8443/feedback", {
            method: 'POST',
            headers: {
                'api-key': token,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                table,
                question_id,
                feedback
            })
        });

        if (response.ok) {
            console.log("Successuflly sent feedback to server");
        } else {
            console.log("Feedback could not be sent to server");
        }
    } catch (error) {
        console.error(`There was an error while sending feedback to the server: ${error}`);
    }
};