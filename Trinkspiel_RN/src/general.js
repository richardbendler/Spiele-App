import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
export const getGames = async (storageItem, setter, route) => {
    const token = "Bearer "+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFwcCJ9LCJpYXQiOjE2OTExNzU2OTV9.TqiVCGJdiq8lgn9-akwwzoRLxR5KZhllRXr_yWQL9JE"; // Token generieren und hier einfügen
    
    try {
        const response = await fetch(`https://my-tournament.org:8443/games/${route}`, {
            method: 'GET',
            headers: {
                'api-key': token,
            }
        });

        if (response.ok) {
            let ret = await response.json();

            //unwrap data from response
            ret = ret.content;

            saveToStorage(storageItem, ret);
            setter(ret);
        } else {
            console.log(response)
            console.error(`There was an error on route ${route} while trying to recieve data from the server.`);
        }
    } catch (error) {
        console.error(`There was an error on route ${route}: ${error}`);
    }
};