import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
/*import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToStorage = async (item, value) => {
    try {
        await AsyncStorage.setItem(item, JSON.stringify(value));
        //console.log(item, " gespeichert: ", value);
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
    }
};

//Database
  //HANDLE SQL REQUESTS
export const handleSqlRequestAndSafeToDisk = async (storageItem, setter, sqlRequest) => {
    const token = "Bearer "+"REDACTED_JWT"; // Token generieren und hier einfügen
    
    try {
        //const response = await fetch('http://45.9.63.16:3000/api/sqlRequest', {
        const response = await fetch('https://my-tournament.org:8443/api/sqlRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ sqlRequest }),
        });

        if (response.ok) {
            const responseText = await response.text();
            const ret = JSON.parse(responseText);
            //console.log(ret);
            saveToStorage(storageItem, ret)
            setter(ret);
        } else {
            console.log(response)
            console.error('Fehler beim Senden des Texts.');
            alert("API nicht erreichbar! - Fehler beim Senden des Texts.")
        }
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
        //alert('Ein Fehler ist aufgetreten:', error);
        alert(error)
    }
    
};*/

export const handleSqlRequest = async (sqlRequest) => {
    const token = "Bearer "+"REDACTED_JWT"; // Token generieren und hier einfügen
    ret = '';
    try {
        //const response = await fetch('http://45.9.63.16:3000/api/sqlRequest', {
        const response = await fetch('https://my-tournament.org:8443/api/sqlRequest', {
        //https nutzt Port 443
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ sqlRequest }),
        });
    
        if (response.ok) {
        const responseText = await response.text();
        ret = JSON.parse(responseText);
        } else {
            console.log(response)
            console.error('Fehler beim Senden des Texts.');
        }
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
    }
    //console.log(ret);
    return ret;
    };
