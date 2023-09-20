import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

//Import der Datenbankvorlagen
import { handleSqlRequest } from './src/general';

//Import der Menüs
import StartMenu from './src/menus/StartMenu';
import MainMenu from './src/menus/MainMenu';
import KlassikerMenu from './src/menus/KlassikerMenu';
import CardGamesMenu from './src/menus/CardGamesMenu';
import MiniGamesMenu from './src/menus/MiniGamesMenu';
import AddPlayer from './src/menus/AddPlayer';

//Import der Spiele
import PicoloGame from './src/games/PicoloGame';
import ManyQuestionsGame from './src/games/ManyQuestions';
import Kingscup from './src/games/Kingscup';
import MaexchenGame from './src/games/Mäxchen';
import DrinkCounter from './src/games/DrinkCounter';
import Activity from './src/games/Activity';
import SpinTheBottle from './src/games/SpinTheBottle';
import HorseRace from './src/games/HorseRace';

//Import des Contextes -> Verwaltet globale Variablen
import { VariablesContext } from './VariablesContext';



import { enableScreens } from 'react-native-screens';
enableScreens();


export default function App() {
  ////////////////////////////////////////////////////////
  ///////////////////// SQL-ABFRAGEN  ////////////////////
  ////////////////////////////////////////////////////////

  //Klassiker: Vorglühen
  const [texts_Picolo, setTexts_Picolo] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      //TODO: const result = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE NOT(fk_pool = 22)');
      const result = [{"author": "", "bool_drink": 1, "content": "Alle trinken, die schonmal betrunken einen Baum hochgeklettert sind.", "drunk_level": 3, "exposure_level": 0, "fk_pool": 16, "id": 12, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "#1, hast du schon einmal einen Filmriss gehabt?", "drunk_level": 4, "exposure_level": 0, "fk_pool": 2, "id": 13, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Wer zuerst seine Schuhe ausgezogen hat, darf 4 verteilen. Wenn ihr alle barfuß seid, dann wer zuerst Schuhe angezogen hat.", "drunk_level": 0, "exposure_level": 0, "fk_pool": 20, "id": 14, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "#1, hast du schon einmal von #2 geträumt? Erzähle es oder trink 4 Schlucke.", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 15, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Ich habe noch nie: jemandem Nacktbilder von mir geschickt.", "drunk_level": 0, "exposure_level": 0, "fk_pool": 4, "id": 16, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "#1, schicke ein Bild mit einem Kussmund an die letzte Person, mit der du auf Whatsapp gechattet hast oder trink 5 Schlücke.", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 17, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Was war dein peinlichstes Date?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 18, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "#, Was ist das Albernste, was du je im Beisein deines Schwarms getan hast? ", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 19, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Versuche, eine Minute lang auf einem Bein zu stehen, ohne das Gleichgewicht zu verlieren.", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 20, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Führe einen kurzen Breakdance oder einen anderen Tanzstil vor, den du dir ausdenkst.", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 21, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Wer würde am ehesten eine Bank ausrauben?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 21, "id": 22, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Wer ist immer der Betrunkenste?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 21, "id": 23, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Ich habe noch nie: wegen einem Traum geweint ", "drunk_level": 0, "exposure_level": 0, "fk_pool": 4, "id": 24, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": "", "bool_drink": 1, "content": "Ich habe noch nie: etwas geklaut ", "drunk_level": 0, "exposure_level": 0, "fk_pool": 4, "id": 25, "timestamp": "2023-08-07T16:43:34.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat eine Angst, die ihr Leben beeinflusst und sie bisher nicht überwunden hat?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 32, "timestamp": "2023-09-04T18:29:17.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat eine schlechte Angewohnheit, von der sie sich wünscht, sie loszuwerden?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 33, "timestamp": "2023-09-04T18:29:17.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat schon einmal eine große Lüge erzählt, um sich aus einer schwierigen Situation zu retten?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 34, "timestamp": "2023-09-04T18:29:17.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer kennt die besten Dad-Jokes?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 35, "timestamp": "2023-09-04T18:29:17.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist der witzigste im Raum?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 36, "timestamp": "2023-09-04T18:29:17.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person macht die besten Tagebucheinträge?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 37, "timestamp": "2023-09-04T18:31:55.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat eine peinliche Begegnung mit einem Prominenten gehabt und kann sie erzählen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 38, "timestamp": "2023-09-04T18:31:55.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat einen urkomischen Witz auf Lager, der immer für Lacher sorgt?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 39, "timestamp": "2023-09-04T18:31:55.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat die lustigsten Trinkspiele oder Partyspiele auf Lager?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 40, "timestamp": "2023-09-04T18:31:55.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat die lustigsten TikTok- oder Internet-Trends ausprobiert und dabei für Lacher gesorgt?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 41, "timestamp": "2023-09-04T18:31:55.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer hat den besten Sinn für Mode im Raum?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 42, "timestamp": "2023-09-04T18:34:25.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer macht die besten Fotos bei besonderen Anlässen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 43, "timestamp": "2023-09-04T18:34:25.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer könnte ein talentierter Schauspieler oder eine talentierte Schauspielerin sein?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 44, "timestamp": "2023-09-04T18:34:25.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist bekannt für seine oder ihre guten Schauspielkünste in der Gruppe?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 45, "timestamp": "2023-09-04T18:35:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist besonders kreativ, wenn es um ästhetische Dinge geht?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 46, "timestamp": "2023-09-04T18:35:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist bekannt für seine oder ihre guten Schauspielkünste in der Gruppe?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 47, "timestamp": "2023-09-04T18:35:31.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist besonders kreativ, wenn es um ästhetische Dinge geht?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 48, "timestamp": "2023-09-04T18:35:31.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer könnte am besten bei einem Pornodreh performen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 49, "timestamp": "2023-09-04T18:38:42.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer kommt immer, wirklich immer zu spät?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 50, "timestamp": "2023-09-04T18:38:42.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer war in seinem Leben schon einmal so verliebt, dass er/sie alles aufgegeben hätte, um mit dieser Person zusammen zu sein?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 51, "timestamp": "2023-09-04T18:41:45.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat ein Geheimnis, das bisher niemand in der Runde kennt?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 52, "timestamp": "2023-09-04T18:41:45.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat die witzigsten Tanzmoves und kann sie vorführen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 53, "timestamp": "2023-09-04T18:41:45.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer hat schon einmal eine peinliche Situation erlebt, die im Nachhinein lustig war?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 54, "timestamp": "2023-09-04T18:41:45.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat eine ausgefallene Talentshow-Einlage auf Lager?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 55, "timestamp": "2023-09-04T18:41:45.000Z"}, {"author": null, "bool_drink": 0, "content": "Mit welcher Person würde ich gerne im Fahrstuhl stecken bleiben?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 56, "timestamp": "2023-09-04T18:41:45.000Z"}, {"author": null, "bool_drink": 0, "content": "Welche Person hat die lustigsten Geschichten aus ihrer Kindheit zu erzählen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 57, "timestamp": "2023-09-04T18:41:45.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer würde am ehesten bei einer Verkleidungsparty in einem peinlichen Kostüm auftauchen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 58, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer würde in einer Zombie-Apokalypse als letztes überleben?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 59, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer hat den schrägsten Sinn für Humor und kann den besten Witz erzählen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 60, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer würde sich am meisten für eine Reality-TV-Show bewerben und warum?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 61, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer hat die lustigsten Anekdoten von unvergesslichen Missgeschicken zu erzählen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 62, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist der König oder die Königin des Wortspiels in der Gruppe?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 63, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer könnte am besten einen Stand-up-Comedy-Auftritt hinlegen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 64, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer hat die seltsamsten, aber unterhaltsamsten Essgewohnheiten?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 65, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer würde am ehesten eine peinliche Situation in der Öffentlichkeit überstehen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 66, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist der ultimative Spaßvogel in der Gruppe und kann immer für Lacher sorgen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 67, "timestamp": "2023-09-04T18:45:10.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer ist der Non-Alkoholiker?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 68, "timestamp": "2023-09-04T18:47:07.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer verträgt nicht mehr als 2 Bier?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 69, "timestamp": "2023-09-04T18:50:49.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer wird mal Reich?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 70, "timestamp": "2023-09-04T18:50:49.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer wird mal Bundeskanzler/in?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 71, "timestamp": "2023-09-04T18:50:49.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer wird mal Obdachlos?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 72, "timestamp": "2023-09-04T18:50:49.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer wird als erstes Papa/Mama?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 73, "timestamp": "2023-09-04T18:50:49.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer wird als nächstes einen Weltrekord brechen, und in welcher Disziplin?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 74, "timestamp": "2023-09-04T18:50:59.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer wird wahrscheinlich die besten Enkelkinder haben?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 75, "timestamp": "2023-09-04T18:50:59.000Z"}, {"author": null, "bool_drink": 0, "content": "Wer wird am ehesten ein geheimes Superhelden-Doppelleben führen?", "drunk_level": 0, "exposure_level": 0, "fk_pool": 3, "id": 76, "timestamp": "2023-09-04T18:50:59.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: meine Eltern belogen", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 77, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: meinen Partner belogen", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 78, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: auf die Klobrille gepinkelt", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 79, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: Fahrerflucht begangen", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 80, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: jemand Nacktes beobachtet", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 81, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: alleine laut vor dem Spiegel gesungen", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 82, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: besonders feige in einer Situation reagiert", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 83, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: einen Freund im Stich gelassen", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 84, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: länger als drei Tage nicht geduscht", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 85, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: das Handy von jemand anders durchsucht", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 86, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: Nacktbilder verschickt", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 87, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: bei einem Autounfall gegafft", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 88, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: wegen einem Traum geweint", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 89, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: eine vergebene Person geküsst", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 90, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: einen Fake-Account gehabt", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 91, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: nach dem Kotzen geknutscht", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 92, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: „Ich liebe dich“ gesagt, obwohl es nicht stimmte", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 93, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: alleine betrunken", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 94, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: etwas geklaut", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 95, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: den eigenen Furz genüsslich gerochen", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 96, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: ein Geheimnis ausgeplaudert", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 97, "timestamp": "2023-09-04T18:53:11.000Z"}, {"author": null, "bool_drink": 0, "content": "Ich habe noch nie: einen Popel gegessen", "drunk_level": 0, "exposure_level": 0, "fk_pool": 2, "id": 98, "timestamp": "2023-09-04T18:53:11.000Z"}]
      setTexts_Picolo(result);
  };
  fetchData();
  }, []);

  //100.000 Questions
  const [manyQuestions, setManyQuestions] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      //TODO: const result = await handleSqlRequest('SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 22');
      const result = [{"author": null, "bool_drink": 1, "content": "Wer stürzt immer am schnellsten ab?", "drunk_level": 5, "exposure_level": 7, "fk_pool": 22, "id": 99, "timestamp": "2023-09-07T17:35:13.000Z"}]
      setManyQuestions(result);
  };
  fetchData();
  }, []);

  //Activity
  const [words, setWords] = useState(["Platzhalterfrage"]);
  useEffect(() => {
    const fetchData = async () => {
      //TODO: const result = await handleSqlRequest('SELECT * FROM `game_activity_words`');
      const result = [{"forbidden_words": "Sand, Meer, Sonne, Urlaub ", "id": 1, "timestamp": "2023-08-31T12:25:06.000Z", "word": "Strandurlaub"}, {"forbidden_words": "Braut, Ehe, Ring, Feier", "id": 2, "timestamp": "2023-08-31T12:25:21.000Z", "word": "Hochzeit"}, {"forbidden_words": "", "id": 3, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Pantomime"}, {"forbidden_words": "", "id": 4, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Schachweltmeister"}, {"forbidden_words": "", "id": 5, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Kuckucksuhr"}, {"forbidden_words": "", "id": 6, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Zeitmaschine"}, {"forbidden_words": "", "id": 7, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Taschendieb"}, {"forbidden_words": "", "id": 8, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Streetart-Künstler"}, {"forbidden_words": "", "id": 9, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Balletttänzerin"}, {"forbidden_words": "", "id": 10, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Quantencomputer"}, {"forbidden_words": "", "id": 11, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Alien-Invasion"}, {"forbidden_words": "", "id": 12, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Origami-Künstler"}, {"forbidden_words": "", "id": 13, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Teleskop"}, {"forbidden_words": "", "id": 14, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Chirurgische Operation"}, {"forbidden_words": "", "id": 15, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Schneemann bauen"}, {"forbidden_words": "", "id": 16, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Sushi zubereiten"}, {"forbidden_words": "", "id": 17, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Kung-Fu-Kampf"}, {"forbidden_words": "", "id": 18, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Heiratsantrag machen"}, {"forbidden_words": "", "id": 19, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Sandburg bauen"}, {"forbidden_words": "", "id": 20, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Boxen"}, {"forbidden_words": "", "id": 21, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Wasserski fahren"}, {"forbidden_words": "", "id": 22, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Zaubershow"}, {"forbidden_words": "", "id": 23, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Gähnen"}, {"forbidden_words": "", "id": 24, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Radfahren"}, {"forbidden_words": "", "id": 25, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Verstecken spielen"}, {"forbidden_words": "", "id": 26, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Fotokopieren"}, {"forbidden_words": "", "id": 27, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Schatzsuche"}, {"forbidden_words": "", "id": 28, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Eislaufen"}, {"forbidden_words": "", "id": 29, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Telefonbuch durchblättern"}, {"forbidden_words": "", "id": 30, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Mondlandung"}, {"forbidden_words": "", "id": 31, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Hochseilakrobatik"}, {"forbidden_words": "", "id": 32, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Zeitreisen mit einer Zeitmaschine"}, {"forbidden_words": "", "id": 33, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Prostituierte"}, {"forbidden_words": "", "id": 34, "timestamp": "2023-09-04T19:10:05.000Z", "word": "Milf"}]
      setWords(result);
  };
  fetchData();
  }, []);


  //Für Menus
  const Stack = createStackNavigator();

  
  
  //Globale Variablen aus Context
  const [playerNames, setPlayerNames] = useState([]);
  const [drinkTypes, setDrinkTypes] = useState([]); 
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    
    <VariablesContext.Provider value={{ settingsVisible, setSettingsVisible, playerNames, setPlayerNames, drinkTypes, setDrinkTypes }}>
    <NavigationContainer>
      
      <Stack.Navigator 
        initialRouteName="StartMenu"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
      <Stack.Screen name="StartMenu" component={StartMenu} />
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="KlassikerMenu" component={KlassikerMenu} />
      <Stack.Screen name="CardGamesMenu" component={CardGamesMenu} />
      <Stack.Screen name="MiniGamesMenu" component={MiniGamesMenu} />
      <Stack.Screen name="AddPlayer" component={AddPlayer} />
      
      <Stack.Screen 
          name="PicoloGame" 
          component={PicoloGame}
          initialParams={{ texts: texts_Picolo }} 
      />
      <Stack.Screen 
          name="ManyQuestionsGame" 
          component={ManyQuestionsGame}
          initialParams={{ manyQuestions: manyQuestions }} 
      />
      <Stack.Screen name="Kingscup" component={Kingscup} />
      <Stack.Screen name="MaexchenGame" component={MaexchenGame} />
      <Stack.Screen 
          name="Activity" 
          component={Activity}
          initialParams={{ words: words }} 
      />
      <Stack.Screen name="DrinkCounter" component={DrinkCounter} />
      <Stack.Screen name="SpinTheBottle" component={SpinTheBottle} />
      <Stack.Screen name="HorseRace" component={HorseRace} />
    </Stack.Navigator>
  </NavigationContainer>
</VariablesContext.Provider>
  
  
  );
}

