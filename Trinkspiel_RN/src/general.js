import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

//Database
  //HANDLE SQL REQUESTS
export const handleSqlRequest = async (sqlRequest) => {
const token = "Bearer "+"REDACTED_JWT"; // Token generieren und hier einfügen
ret = '';
try {
    //const response = await fetch('http://45.9.63.16:3000/api/sqlRequest', {
    const response = await fetch('https://my-tournament.org:443/api/sqlRequest', {
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