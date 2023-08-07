import {StyleSheet, useState} from 'react-native';

const primaryColor = '#008b8b';
const secondaryColor = '#ff7474';

const menuStyles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor, 
  },
  
});

const gameStyles = StyleSheet.create({
  completeScreenGameContainer:{
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  gameContainer: {
    backgroundColor: primaryColor, 
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlyTextBasedGameText: {
    fontSize: 30,
    textAlign: 'center',
    padding: 20,
  },
});

const buttonStyles = StyleSheet.create({
  //Menu
  menuButton: {
    backgroundColor: secondaryColor,
    padding: 20,
    borderRadius: 15,
    margin: 20,
    width: '90%',
    alignItems: 'center',
  },
  menuButtonText:{
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    padding: 0,
    textTransform: 'uppercase', //
  },
  //Submit
  submitButton: {
    backgroundColor: secondaryColor,
    padding: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
});

const fontStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: '100%',
  },
  playerList: {
    marginBottom: 20,
  },
});


export const appStyles = {
  ...menuStyles,
  ...gameStyles,
  ...buttonStyles, 
  ...fontStyles,  
}