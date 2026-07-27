// Pflicht-Aufgaben für Flaschendrehen.
// intensity: 1-5, steuert sowohl den "Touchy"-Regler (Vertrautheit/Spice) als auch
// grob die empfohlene Betrunkenheitsstufe (siehe SpinTheBottle.js) - je hoeher, desto
// persoenlicher/gewagter die Aufgabe bzw. je betrunkener die Runde idealerweise ist.
// 1-2 = soft (kreativ/albern), 3 = medium (interaktiv), 4-5 = spicy (flirty, aber jugendfrei).
export const spinTheBottleDareTexts = [
  // --- Intensity 1: Soft / kreativ-albern (solo) ---
  { question_id: 9271, content: "Erfinde in 40 Sekunden einen Vierzeiler über den heutigen Abend.", content_en: "Create a four-line rhyme about tonight within 40 seconds.", intensity: 1 },
  { question_id: 9273, content: "Erfinde ein neues Spiel, erkläre die Regeln und gib ihm einen Namen.", content_en: "Invent a new game, explain the rules, and give it a name.", intensity: 1 },
  { question_id: 9274, content: "Male mit dem Finger in der Luft das inoffizielle Logo eurer Runde.", content_en: "Draw your group's unofficial logo in the air with your finger.", intensity: 1 },
  { question_id: 9276, content: "Summ ein bekanntes Lied rückwärts und lass raten, welches es ist.", content_en: "Hum a well-known song backwards and let others guess it.", intensity: 1 },
  { question_id: 9277, content: "Baue aus Gegenständen auf dem Tisch ein kleines Kunstwerk.", content_en: "Build a tiny piece of art from objects on the table.", intensity: 1 },
  { question_id: 9279, content: "Spiele deine Lieblingsfilmszene pantomimisch vor.", content_en: "Act out your favorite movie scene as pantomime.", intensity: 1 },
  { question_id: 9280, content: "Spiele 15 Sekunden lang imaginäre Schlagzeug-Soli auf dem Tisch.", content_en: "Drum an imaginary solo on the table for 15 seconds.", intensity: 1 },
  { question_id: 9282, content: "Erkläre in 20 Sekunden, warum dein Haustier (oder Wunschhaustier) ein Influencer wäre.", content_en: "Explain in 20 seconds why your pet (or dream pet) would be an influencer.", intensity: 1 },
  { question_id: 9283, content: "Verwandle einen alltäglichen Gegenstand in einen Zauberstab und führe einen Trick vor.", content_en: "Turn an everyday object into a magic wand and perform a trick.", intensity: 1 },
  { question_id: 9284, content: "Erfinde einen absurden Feiertag und erkläre seine Tradition.", content_en: "Invent an absurd holiday and explain its tradition.", intensity: 1 },
  { question_id: 9285, content: "Halte eine 20-Sekunden-Rede über das wichtigste Thema des Tages.", content_en: "Give a 20-second speech about the most important topic of the day.", intensity: 1 },
  { question_id: 9286, content: "Schreibe live eine neue Gruppenregel und lass alle dafür applaudieren.", content_en: "Write a new group rule on the spot and get everyone to applaud it.", intensity: 1 },
  { question_id: 9297, content: "Erfinde einen neuen Shot-Namen und beschreibe seinen Geschmack.", content_en: "Invent a new shot name and describe its flavor.", intensity: 1 },
  { question_id: 9301, content: "Erzähle einen Witz, den du dir gerade auf der Stelle ausdenkst.", content_en: "Tell a joke you make up right on the spot.", intensity: 1 },
  { question_id: 9302, content: "Mach 20 Sekunden lang Nachrichtensprecher*in-Stimme, egal was du sagst.", content_en: "Talk in a news-anchor voice for 20 seconds, no matter what you say.", intensity: 1 },
  { question_id: 9303, content: "Beschreibe das Wetter draußen, als wäre es der Höhepunkt eines Actionfilms.", content_en: "Describe the weather outside as if it were the climax of an action movie.", intensity: 1 },

  // --- Intensity 2: Soft-Medium / kreativ, interaktiv ---
  { question_id: 9256, content: "Finde drei Gemeinsamkeiten mit einer Person deiner Wahl in unter 30 Sekunden und verkünde sie.", content_en: "Find three things you have in common with someone of your choice in under 30 seconds and announce them.", intensity: 2 },
  { question_id: 9257, content: "Erfinde einen Spitznamen für eine Person deiner Wahl und erkläre ihn kreativ.", content_en: "Invent a nickname for someone of your choice and explain it creatively.", intensity: 2 },
  { question_id: 9261, content: "Erfinde einen Team-Handshake mit einer Person deiner Wahl und zeige ihn zweimal vor.", content_en: "Create a team handshake with someone of your choice and show it twice.", intensity: 2 },
  { question_id: 9264, content: "Beschreibe eine Person deiner Wahl als Superheld*in inklusive Superkraft.", content_en: "Describe someone of your choice as a superhero including their superpower.", intensity: 2 },
  { question_id: 9265, content: "Erfinde einen Werbeslogan für eine Person deiner Wahl und sage ihn überzeugend auf.", content_en: "Invent an advertising slogan for someone of your choice and present it convincingly.", intensity: 2 },
  { question_id: 9269, content: "Erfinde mit einer Person deiner Wahl einen Jubelruf und führe ihn laut vor.", content_en: "Create a cheer with someone of your choice and perform it loudly.", intensity: 2 },
  { question_id: 9270, content: "Frag eine Person deiner Wahl nach einem Geheimtipp und verkünde ihn wie eine Breaking News.", content_en: "Ask someone of your choice for a pro tip and announce it like breaking news.", intensity: 2 },
  { question_id: 9278, content: "Erfinde eine neue Cocktailzutat und preise sie an.", content_en: "Invent a new cocktail ingredient and pitch it to everyone.", intensity: 2 },
  { question_id: 9281, content: "Erfinde einen neuen Tanzschritt und bringe ihn einer Person deiner Wahl bei.", content_en: "Invent a dance move and teach it to someone of your choice.", intensity: 2 },
  { question_id: 9287, content: "Stoße mit allen an und erfindet dabei einen gemeinsamen Schlachtruf.", content_en: "Clink glasses with everyone and invent a shared battle cry.", intensity: 2 },
  { question_id: 9288, content: "Mische einen Überraschungs-Mocktail aus drei Zutaten deiner Wahl und probiere ihn.", content_en: "Mix a surprise mocktail from three ingredients of your choice and taste it.", intensity: 2 },
  { question_id: 9290, content: "Finde heraus, welches Getränk eine Person deiner Wahl am liebsten mag, und stoßt darauf an.", content_en: "Find out which drink someone of your choice likes most and toast to it.", intensity: 2 },
  { question_id: 9292, content: "Stoße reihum mit jeder Person an und sag jeweils einen kurzen Wunsch.", content_en: "Toast with each person in turn and say a short wish for them.", intensity: 2 },
  { question_id: 9296, content: "Erfinde einen Toast auf den nächsten Tag und stoßt gemeinsam an.", content_en: "Invent a toast to tomorrow and clink glasses together.", intensity: 2 },
  { question_id: 9299, content: "Lass eine Person deiner Wahl einen Toast in einer anderen Sprache anstimmen und stoßt danach an.", content_en: "Ask someone of your choice to lead a toast in another language and clink glasses afterward.", intensity: 2 },
  { question_id: 9304, content: "Frag eine Person deiner Wahl nach ihrem peinlichsten Kindheitsspitznamen.", content_en: "Ask someone of your choice for their most embarrassing childhood nickname.", intensity: 2 },
  { question_id: 9305, content: "Tauscht für die nächste Runde unauffällig eure Plätze mit einer Person deiner Wahl.", content_en: "Secretly swap seats with someone of your choice for the next round.", intensity: 2 },
  { question_id: 9306, content: "Lass dir von einer Person deiner Wahl in 10 Sekunden ein Geheim-Zeichen beibringen.", content_en: "Have someone of your choice teach you a secret hand sign in 10 seconds.", intensity: 2 },

  // --- Intensity 3: Medium / interaktiv, mutiger ---
  { question_id: 9258, content: "Mache einer Person deiner Wahl innerhalb von 20 Sekunden drei ernst gemeinte Komplimente.", content_en: "Give someone of your choice three sincere compliments within 20 seconds.", intensity: 3 },
  { question_id: 9259, content: "Baue mit einer Person deiner Wahl eine 20-sekündige Slow-Motion-Szene nach.", content_en: "Recreate a 20-second slow-motion scene with someone of your choice.", intensity: 3 },
  { question_id: 9260, content: "Synchronisiere eine erfundene Werbeanzeige mit einer Person deiner Wahl gemeinsam pantomimisch.", content_en: "Mime a made-up commercial together with someone of your choice in perfect sync.", intensity: 3 },
  { question_id: 9262, content: "Zeichne eine Person deiner Wahl in 30 Sekunden blind auf einen Notizzettel.", content_en: "Draw someone of your choice blindfolded on a note within 30 seconds.", intensity: 3 },
  { question_id: 9263, content: "Lass eine Person deiner Wahl entscheiden, welcher Song als nächstes läuft, und tanze 15 Sekunden dazu.", content_en: "Let someone of your choice choose the next song and dance to it for 15 seconds.", intensity: 3 },
  { question_id: 9266, content: "Baue mit einer Person deiner Wahl eine Standbildszene aus einem berühmten Film nach.", content_en: "Create a freeze-frame scene from a famous movie with someone of your choice.", intensity: 3 },
  { question_id: 9267, content: "Lass eine Person deiner Wahl eine Grimasse vormachen und halte sie gemeinsam für ein Foto.", content_en: "Ask someone of your choice to make a grimace and hold it together for a photo pose.", intensity: 3 },
  { question_id: 9268, content: "Spiele mit einer Person deiner Wahl eine kurze Szene 'Chef*in und Praktikant*in'.", content_en: "Act out a short 'boss and intern' scene with someone of your choice.", intensity: 3 },
  { question_id: 9272, content: "Erzähle eine dramatische 20-Sekunden-Liebesgeschichte mit offenem Ende.", content_en: "Tell a dramatic 20-second love story with an open ending.", intensity: 3 },
  { question_id: 9289, content: "Erfinde einen Trinkspruch auf eine Person deiner Wahl und lasst ihn gemeinsam hören.", content_en: "Create a toast to someone of your choice and have everyone repeat it.", intensity: 3 },
  { question_id: 9291, content: "Trink einen kleinen Schluck mit verschränkten Armen zusammen mit einer Person deiner Wahl.", content_en: "Take a small sip arm-in-arm with someone of your choice.", intensity: 3 },
  { question_id: 9293, content: "Halte einen 15-Sekunden-Werbespot für das Getränk, das du gerade hast, und trink danach einen Schluck.", content_en: "Deliver a 15-second ad for the drink in your hand, then take a sip.", intensity: 3 },
  { question_id: 9295, content: "Trink in Zeitlupe einen Schluck und kommentiere jede Bewegung dramatisch.", content_en: "Take a sip in slow motion and narrate every movement dramatically.", intensity: 3 },
  { question_id: 9298, content: "Schreibe mit deinem Finger ein Herz in die Luft und trink einen kleinen Schluck darauf.", content_en: "Draw a heart in the air with your finger and take a small sip to seal it.", intensity: 3 },
  { question_id: 9300, content: "Koste drei verschiedene Getränke blind und beschreibe jedes in einem Wort.", content_en: "Taste three different drinks blindfolded and describe each in one word.", intensity: 3 },
  { question_id: 9307, content: "Halte für eine Person deiner Wahl 15 Sekunden lang eine Laudatio, als hätte sie gerade einen Oscar gewonnen.", content_en: "Give a 15-second acceptance-speech-style tribute for someone of your choice, as if they just won an Oscar.", intensity: 3 },
  { question_id: 9308, content: "Lass dich von einer Person deiner Wahl 20 Sekunden lang frisieren oder stylen.", content_en: "Let someone of your choice style your hair or outfit for 20 seconds.", intensity: 3 },
  { question_id: 9309, content: "Tauscht für die nächste Runde ein Kleidungsstück mit einer Person deiner Wahl.", content_en: "Swap one item of clothing with someone of your choice for the next round.", intensity: 3 },
  { question_id: 9310, content: "Erzähle der Runde die ehrliche Geschichte hinter deinem Profilbild.", content_en: "Tell the group the honest story behind your profile picture.", intensity: 3 },

  // --- Intensity 4: Spicy (flirty, koerpernah, aber jugendfrei) ---
  { question_id: 9311, content: "Halte mit einer Person deiner Wahl 15 Sekunden lang Augenkontakt, ohne zu lachen.", content_en: "Hold eye contact with someone of your choice for 15 seconds without laughing.", intensity: 4 },
  { question_id: 9312, content: "Flüstere einer Person deiner Wahl ein ehrliches Kompliment ins Ohr.", content_en: "Whisper a genuine compliment into the ear of someone of your choice.", intensity: 4 },
  { question_id: 9313, content: "Setz dich für eine Runde auf den Schoß einer Person deiner Wahl (wenn beide einverstanden sind).", content_en: "Sit on the lap of someone of your choice for one round (only if both agree).", intensity: 4 },
  { question_id: 9314, content: "Gib einer Person deiner Wahl einen Kuss auf die Wange oder Hand (wenn beide einverstanden sind).", content_en: "Give someone of your choice a kiss on the cheek or hand (only if both agree).", intensity: 4 },
  { question_id: 9315, content: "Halte für den Rest der Runde Händchen mit einer Person deiner Wahl.", content_en: "Hold hands with someone of your choice for the rest of the round.", intensity: 4 },
  { question_id: 9316, content: "Beschreibe, was dir als Erstes an einer Person deiner Wahl aufgefallen ist, als ihr euch kennengelernt habt.", content_en: "Describe the first thing you noticed about someone of your choice when you met.", intensity: 4 },
  { question_id: 9317, content: "Lass dir von einer Person deiner Wahl unter vier Augen ein Geheimnis zuflüstern.", content_en: "Have someone of your choice whisper you a secret, just between you two.", intensity: 4 },
  { question_id: 9318, content: "Mach einer Person deiner Wahl vor, du würdest sie zum ersten Mal daten - inklusive Small Talk.", content_en: "Act out a first date with someone of your choice, small talk included.", intensity: 4 },
  { question_id: 9319, content: "Streichle kurz über die Hand einer Person deiner Wahl und sag ihr, was du an ihr schätzt.", content_en: "Gently stroke the hand of someone of your choice and tell them what you appreciate about them.", intensity: 4 },
  { question_id: 9320, content: "Erfinde live einen kurzen Liebesbrief an eine Person deiner Wahl (nicht ganz ernst gemeint erlaubt).", content_en: "Improvise a short love letter to someone of your choice (not entirely serious is fine).", intensity: 4 },
  { question_id: 9321, content: "Frag eine Person deiner Wahl, was sie an dir attraktiv findet.", content_en: "Ask someone of your choice what they find attractive about you.", intensity: 4 },
  { question_id: 9322, content: "Tanze für 20 Sekunden ganz nah mit einer Person deiner Wahl.", content_en: "Slow dance close with someone of your choice for 20 seconds.", intensity: 4 },

  // --- Intensity 5: Spicy+ ---
  { question_id: 9323, content: "Küsse eine Person deiner Wahl auf die Wange und sag ihr dabei ein Kompliment (wenn beide einverstanden sind).", content_en: "Kiss someone of your choice on the cheek while giving them a compliment (only if both agree).", intensity: 5 },
  { question_id: 9324, content: "Verrate der Runde, wer hier am ehesten dein Typ wäre, wenn du komplett frei wählen könntest.", content_en: "Tell the group who here would most be your type if you could choose completely freely.", intensity: 5 },
  { question_id: 9325, content: "Lass dir von einer Person deiner Wahl 15 Sekunden lang tief in die Augen schauen und beschreibe laut, was du fühlst.", content_en: "Let someone of your choice look deep into your eyes for 15 seconds and describe out loud what you feel.", intensity: 5 },
  { question_id: 9326, content: "Erzähle der Runde ehrlich, wann du zuletzt richtig nervös vor jemandem warst - und warum.", content_en: "Tell the group honestly when you were last genuinely nervous around someone - and why.", intensity: 5 },
  { question_id: 9327, content: "Frag eine Person deiner Wahl, ob sie dich schon mal geghosted hätte, wenn ihr euch nicht in dieser Runde kennengelernt hättet.", content_en: "Ask someone of your choice if they would have ghosted you had you not met in this group.", intensity: 5 },
  { question_id: 9328, content: "Lass dich von einer Person deiner Wahl umarmen und halte die Umarmung 20 Sekunden.", content_en: "Get a hug from someone of your choice and hold it for 20 seconds.", intensity: 5 },

  // --- Batch 2: Intensity 1 ---
  { question_id: 10101, content: "Mach 15 Sekunden lang eine stumme Nachrichtensendung nur mit Mimik.", content_en: "Do a silent 15-second news broadcast using only facial expressions.", intensity: 1 },
  { question_id: 10102, content: "Erfinde einen Werbejingle für den Gegenstand, der dir am nächsten liegt.", content_en: "Invent an ad jingle for whatever object is closest to you.", intensity: 1 },
  { question_id: 10103, content: "Sprich die nächsten drei Sätze nur in Reimen.", content_en: "Speak your next three sentences only in rhyme.", intensity: 1 },
  { question_id: 10104, content: "Zeige den dramatischsten Tod, den du schauspielern kannst.", content_en: "Perform the most dramatic death scene you can act out.", intensity: 1 },
  { question_id: 10105, content: "Erfinde ein Fantasietier und beschreibe seine drei besten Eigenschaften.", content_en: "Invent a fantasy creature and describe its three best traits.", intensity: 1 },
  { question_id: 10106, content: "Halte einen 15-Sekunden-Werbespot für Leitungswasser.", content_en: "Deliver a 15-second commercial for tap water.", intensity: 1 },
  { question_id: 10107, content: "Mach das Geräusch von drei verschiedenen Tieren hintereinander.", content_en: "Make the sounds of three different animals back to back.", intensity: 1 },
  { question_id: 10108, content: "Erzähle die Handlung deines Lieblingsfilms in 20 Sekunden nach.", content_en: "Retell the plot of your favorite movie in 20 seconds.", intensity: 1 },
  { question_id: 10109, content: "Balanciere ein Objekt deiner Wahl 10 Sekunden auf dem Kopf.", content_en: "Balance an object of your choice on your head for 10 seconds.", intensity: 1 },
  { question_id: 10110, content: "Sprich die nächsten zwei Sätze wie eine Person aus einem alten Ritterfilm.", content_en: "Speak your next two sentences like a character from an old knight movie.", intensity: 1 },
  { question_id: 10111, content: "Erfinde einen Fantasienamen für dich und stelle dich der Runde damit vor.", content_en: "Invent a fantasy name for yourself and introduce yourself to the group with it.", intensity: 1 },
  { question_id: 10112, content: "Zeichne mit geschlossenen Augen ein Gesicht auf einen Zettel.", content_en: "Draw a face on a piece of paper with your eyes closed.", intensity: 1 },
  { question_id: 10113, content: "Erfinde eine Verschwörungstheorie über den Gegenstand rechts von dir.", content_en: "Invent a conspiracy theory about the object to your right.", intensity: 1 },
  { question_id: 10114, content: "Spiele pantomimisch vor, wie du morgens aus dem Bett kommst.", content_en: "Mime how you get out of bed in the morning.", intensity: 1 },
  { question_id: 10115, content: "Halte eine 15-Sekunden-Dankesrede für einen imaginären Preis.", content_en: "Give a 15-second acceptance speech for an imaginary award.", intensity: 1 },
  { question_id: 10116, content: "Erfinde ein Ritual, das die Runde ab jetzt vor jedem Schluck macht.", content_en: "Invent a ritual the group must do before every sip from now on.", intensity: 1 },
  { question_id: 10117, content: "Mach 10 Sekunden lang die überzeugendste Roboter-Imitation.", content_en: "Do the most convincing robot impression for 10 seconds.", intensity: 1 },
  { question_id: 10118, content: "Erzähle in drei Sätzen, warum Montage eigentlich unterschätzt werden.", content_en: "Explain in three sentences why Mondays are actually underrated.", intensity: 1 },
  { question_id: 10119, content: "Erfinde einen Trinkspruch für die Runde und sag ihn laut auf.", content_en: "Invent a drinking toast for the group and recite it loudly.", intensity: 1 },
  { question_id: 10120, content: "Spiele eine Szene nach, in der du einen Parkplatz suchst - mit vollem Drama.", content_en: "Act out a scene of searching for a parking spot - full drama included.", intensity: 1 },
  { question_id: 10121, content: "Erkläre den Raum, als wärst du eine Immobilienmaklerin oder ein Immobilienmakler.", content_en: "Describe the room as if you were a real-estate agent.", intensity: 1 },
  { question_id: 10122, content: "Erfinde einen neuen Handshake, den die ganze Runde ab jetzt benutzt.", content_en: "Invent a new handshake the whole group uses from now on.", intensity: 1 },
  { question_id: 10123, content: "Zeig eine 10-Sekunden-Zeitlupe von dir, wie du ein Glas hebst.", content_en: "Show a 10-second slow-motion sequence of you lifting a glass.", intensity: 1 },

  // --- Batch 2: Intensity 2 ---
  { question_id: 10124, content: "Frag eine Person deiner Wahl nach ihrem peinlichsten Kindheitsspitznamen.", content_en: "Ask someone of your choice for their most embarrassing childhood nickname.", intensity: 2 },
  { question_id: 10125, content: "Erfinde mit einer Person deiner Wahl ein Geheimzeichen und benutzt es den restlichen Abend.", content_en: "Invent a secret signal with someone of your choice and use it for the rest of the night.", intensity: 2 },
  { question_id: 10126, content: "Tausche für eine Minute einen Gegenstand mit einer Person deiner Wahl.", content_en: "Swap an item with someone of your choice for one minute.", intensity: 2 },
  { question_id: 10127, content: "Interviewe eine Person deiner Wahl 20 Sekunden lang wie ein Reporter im Livestream.", content_en: "Interview someone of your choice for 20 seconds like a live-stream reporter.", intensity: 2 },
  { question_id: 10128, content: "Erfinde mit einer Person deiner Wahl einen gemeinsamen Bandnamen.", content_en: "Invent a shared band name with someone of your choice.", intensity: 2 },
  { question_id: 10129, content: "Beschreibe eine Person deiner Wahl in drei Emojis, ohne zu sprechen.", content_en: "Describe someone of your choice in three emojis, without speaking.", intensity: 2 },
  { question_id: 10130, content: "Frag eine Person deiner Wahl, was sie an dieser Runde am meisten schätzt.", content_en: "Ask someone of your choice what they appreciate most about this group.", intensity: 2 },
  { question_id: 10131, content: "Mach mit einer Person deiner Wahl ein spontanes Duett aus einem Lied, das euch beiden einfällt.", content_en: "Do a spontaneous duet with someone of your choice from any song you both know.", intensity: 2 },
  { question_id: 10132, content: "Erfinde für eine Person deiner Wahl einen Superheldennamen und ihre Herkunftsgeschichte.", content_en: "Invent a superhero name and origin story for someone of your choice.", intensity: 2 },
  { question_id: 10133, content: "Frag eine Person deiner Wahl nach ihrer verrücktesten Reise-Geschichte.", content_en: "Ask someone of your choice about their craziest travel story.", intensity: 2 },
  { question_id: 10134, content: "Tauscht kurz die Plätze mit einer Person deiner Wahl und übernimmt gegenseitig deren Sitzhaltung.", content_en: "Swap seats with someone of your choice and copy each other's sitting posture.", intensity: 2 },
  { question_id: 10135, content: "Erfinde ein High-Five mit einer Person deiner Wahl, das mindestens drei Schritte hat.", content_en: "Invent a high-five with someone of your choice that has at least three steps.", intensity: 2 },
  { question_id: 10136, content: "Frag eine Person deiner Wahl, welches Talent sie gerne öfter zeigen würde.", content_en: "Ask someone of your choice which talent they wish they showed off more often.", intensity: 2 },
  { question_id: 10137, content: "Schreib mit einer Person deiner Wahl gemeinsam einen Vierzeiler über den heutigen Abend.", content_en: "Write a four-line poem about tonight together with someone of your choice.", intensity: 2 },
  { question_id: 10138, content: "Frag eine Person deiner Wahl, was ihr erster Eindruck von dir war.", content_en: "Ask someone of your choice what their first impression of you was.", intensity: 2 },
  { question_id: 10139, content: "Mach mit einer Person deiner Wahl einen Countdown und stoßt danach gemeinsam an.", content_en: "Do a countdown with someone of your choice and toast together afterward.", intensity: 2 },
  { question_id: 10140, content: "Erfinde mit einer Person deiner Wahl ein Alibi für die letzten fünf Minuten.", content_en: "Invent an alibi with someone of your choice for the last five minutes.", intensity: 2 },
  { question_id: 10141, content: "Frag eine Person deiner Wahl, wann sie zuletzt richtig stolz auf sich war.", content_en: "Ask someone of your choice when they were last truly proud of themselves.", intensity: 2 },
  { question_id: 10142, content: "Lass dir von einer Person deiner Wahl ein Kompliment machen, das sich reimt.", content_en: "Have someone of your choice give you a compliment that rhymes.", intensity: 2 },
  { question_id: 10143, content: "Erfinde mit einer Person deiner Wahl eine Geheimsprache aus drei Wörtern.", content_en: "Invent a secret language of three words with someone of your choice.", intensity: 2 },
  { question_id: 10144, content: "Frag eine Person deiner Wahl nach ihrem seltsamsten Talent.", content_en: "Ask someone of your choice about their strangest talent.", intensity: 2 },
  { question_id: 10145, content: "Mach mit einer Person deiner Wahl einen kleinen Wettstreit im Grimassenschneiden.", content_en: "Have a mini face-pulling contest with someone of your choice.", intensity: 2 },
  { question_id: 10146, content: "Erfinde mit einer Person deiner Wahl ein Motto für den Rest des Abends.", content_en: "Invent a motto for the rest of the night with someone of your choice.", intensity: 2 },
  { question_id: 10147, content: "Frag eine Person deiner Wahl, welche Kleinigkeit sie an dieser Gruppe am meisten liebt.", content_en: "Ask someone of your choice what small thing they love most about this group.", intensity: 2 },

  // --- Batch 2: Intensity 3 ---
  { question_id: 10148, content: "Ruf eine Person an oder schreib ihr eine Nachricht und sag ihr, dass du gerade an sie denkst.", content_en: "Call or text someone and tell them you are thinking of them right now.", intensity: 3 },
  { question_id: 10149, content: "Erzähle der Runde eine peinliche Geschichte über dich, ohne zu schummeln.", content_en: "Tell the group an embarrassing story about yourself, no cheating.", intensity: 3 },
  { question_id: 10150, content: "Lass eine Person deiner Wahl dein Handy 15 Sekunden durchsehen (Fotos ausgenommen, wenn du willst).", content_en: "Let someone of your choice scroll your phone for 15 seconds (photos excluded if you want).", intensity: 3 },
  { question_id: 10151, content: "Gesteh der Runde eine kleine Unsicherheit, die du normalerweise verbirgst.", content_en: "Confess to the group a small insecurity you usually hide.", intensity: 3 },
  { question_id: 10152, content: "Lies der Runde die letzte Nachricht vor, die du verschickt hast (privates darfst du überspringen).", content_en: "Read the group your last sent message (skip anything private).", intensity: 3 },
  { question_id: 10153, content: "Erzähle der Runde, worauf du in deinem Leben gerade am meisten stolz bist.", content_en: "Tell the group what you are proudest of in your life right now.", intensity: 3 },
  { question_id: 10154, content: "Lass eine Person deiner Wahl eine Frage stellen, die du wahrheitsgemäß beantworten musst.", content_en: "Let someone of your choice ask you a question you must answer truthfully.", intensity: 3 },
  { question_id: 10155, content: "Erzähle der Runde von deinem letzten richtig schlechten Tag und was ihn ausgelöst hat.", content_en: "Tell the group about your last truly bad day and what triggered it.", intensity: 3 },
  { question_id: 10156, content: "Zeig der Runde dein zuletzt aufgenommenes Foto (private ausgenommen).", content_en: "Show the group the last photo you took (private ones excluded).", intensity: 3 },
  { question_id: 10157, content: "Gesteh der Runde etwas, das du in dieser Woche vermieden hast, zuzugeben.", content_en: "Confess to the group something you avoided admitting this week.", intensity: 3 },
  { question_id: 10158, content: "Erzähle der Runde die Geschichte hinter einer Narbe oder einem besonderen Erinnerungsstück.", content_en: "Tell the group the story behind a scar or a special keepsake.", intensity: 3 },
  { question_id: 10159, content: "Lass eine Person deiner Wahl dir einen ehrlichen Ratschlag geben und nimm ihn ernst an.", content_en: "Let someone of your choice give you honest advice and take it seriously.", intensity: 3 },
  { question_id: 10160, content: "Erzähle der Runde, wovor du dich diese Woche am meisten gedrückt hast.", content_en: "Tell the group what you have been avoiding most this week.", intensity: 3 },

  // --- Batch 2: Intensity 4 ---
  { question_id: 10161, content: "Sag einer Person deiner Wahl ein ehrliches Kompliment über ihr Aussehen.", content_en: "Give someone of your choice an honest compliment about their looks.", intensity: 4 },
  { question_id: 10162, content: "Halte 15 Sekunden Blickkontakt mit einer Person deiner Wahl, ohne zu lachen.", content_en: "Hold eye contact with someone of your choice for 15 seconds without laughing.", intensity: 4 },
  { question_id: 10163, content: "Frag eine Person deiner Wahl, was sie an dir am meisten mag.", content_en: "Ask someone of your choice what they like most about you.", intensity: 4 },
  { question_id: 10164, content: "Erzähle einer Person deiner Wahl, was dir bei ihr direkt aufgefallen ist, als ihr euch kennengelernt habt.", content_en: "Tell someone of your choice what you noticed about them right when you met.", intensity: 4 },
  { question_id: 10165, content: "Setz dich für den Rest der Runde neben eine Person deiner Wahl.", content_en: "Sit next to someone of your choice for the rest of the round.", intensity: 4 },
  { question_id: 10166, content: "Flüstere einer Person deiner Wahl ein ehrliches Kompliment ins Ohr.", content_en: "Whisper an honest compliment into the ear of someone of your choice.", intensity: 4 },
  { question_id: 10167, content: "Frag eine Person deiner Wahl nach ihrem Typ - und wie nah du selbst drankommst, mit Humor genommen.", content_en: "Ask someone of your choice about their type - and how close you come, taken with humor.", intensity: 4 },
  { question_id: 10168, content: "Erfinde mit einer Person deiner Wahl eine kurze romantische Filmszene und spielt sie nach.", content_en: "Invent a short romantic movie scene with someone of your choice and act it out.", intensity: 4 },
  { question_id: 10169, content: "Halte die Hand einer Person deiner Wahl für den nächsten Trinkspruch.", content_en: "Hold the hand of someone of your choice for the next toast.", intensity: 4 },
  { question_id: 10170, content: "Frag eine Person deiner Wahl, ob es einen Moment gab, in dem sie dich anders gesehen hat als vorher.", content_en: "Ask someone of your choice if there was a moment they saw you differently than before.", intensity: 4 },
  { question_id: 10171, content: "Erzähl einer Person deiner Wahl leise, was du an ihrem Lachen magst.", content_en: "Quietly tell someone of your choice what you like about their laugh.", intensity: 4 },

  // --- Batch 2: Intensity 5 ---
  { question_id: 10172, content: "Verrate der Runde ehrlich, wer hier für dich die meiste Ausstrahlung hat.", content_en: "Honestly tell the group who here has the most charisma for you.", intensity: 5 },
  { question_id: 10173, content: "Küsse deine eigene Hand und übergib den 'Kuss' an eine Person deiner Wahl.", content_en: "Kiss your own hand and pass the 'kiss' to someone of your choice.", intensity: 5 },
  { question_id: 10174, content: "Lass dir von einer Person deiner Wahl 20 Sekunden lang leise ins Ohr flüstern, was auch immer sie will.", content_en: "Let someone of your choice whisper anything they want in your ear for 20 seconds.", intensity: 5 },
  { question_id: 10175, content: "Frag eine Person deiner Wahl ehrlich, ob sie sich vorstellen könnte, mit dir auszugehen.", content_en: "Honestly ask someone of your choice if they could imagine going on a date with you.", intensity: 5 },
  { question_id: 10176, content: "Tausche für die nächste Runde einen Gegenstand als 'Pfand' mit einer Person deiner Wahl, den ihr euch erst am Ende zurückgebt.", content_en: "Swap an item as 'collateral' with someone of your choice for the rest of the round, returned only at the end.", intensity: 5 },
  { question_id: 10177, content: "Erzähle der Runde, wer hier am ehesten dein Typ wäre, wenn dieser Abend ein Film wäre.", content_en: "Tell the group who here would most be your type if tonight were a movie.", intensity: 5 },
  { question_id: 10178, content: "Lass dich von einer Person deiner Wahl auf die Stirn küssen (nur wenn beide einverstanden sind).", content_en: "Let someone of your choice kiss your forehead (only if both agree).", intensity: 5 },
  { question_id: 10179, content: "Frag eine Person deiner Wahl nach dem intimsten Detail, das sie heute Abend preisgeben würde.", content_en: "Ask someone of your choice for the most intimate detail they would share tonight.", intensity: 5 },
  { question_id: 10180, content: "Sag einer Person deiner Wahl, was du dir für den Rest des Abends mit ihr wünschst.", content_en: "Tell someone of your choice what you wish for the rest of the night with them.", intensity: 5 },
  { question_id: 10181, content: "Lass dir von der Runde eine Person zuweisen, mit der du die nächste Runde eng zusammensitzt.", content_en: "Let the group assign you someone to sit closely with for the next round.", intensity: 5 },

  // --- Batch 3: Intensity 1 ---
  { question_id: 11101, content: "Erzähl die Wetterlage draußen, als würdest du ein Fußballspiel kommentieren.", content_en: "Report the weather outside as if commentating on a soccer match.", intensity: 1 },
  { question_id: 11102, content: "Erfinde ein Firmenmotto für den Haushalt, in dem du gerade bist.", content_en: "Invent a company motto for the household you're currently in.", intensity: 1 },
  { question_id: 11103, content: "Zeig einen 10-Sekunden-Werbespot für Socken.", content_en: "Do a 10-second commercial for socks.", intensity: 1 },
  { question_id: 11104, content: "Spreche die nächsten zwei Sätze im Flüsterton wie ein Naturdokumentarfilm.", content_en: "Whisper your next two sentences like a nature documentary narrator.", intensity: 1 },
  { question_id: 11105, content: "Erfinde einen Namen für die Gruppe und ruft ihn dreimal gemeinsam.", content_en: "Invent a name for the group and chant it together three times.", intensity: 1 },
  { question_id: 11106, content: "Mach 15 Sekunden lang Kommentator-Stimme für ein imaginäres Autorennen im Raum.", content_en: "Do a 15-second sports commentator voice for an imaginary race in the room.", intensity: 1 },
  { question_id: 11107, content: "Erfinde ein Maskottchen für den heutigen Abend und stell es der Runde vor.", content_en: "Invent a mascot for tonight and introduce it to the group.", intensity: 1 },
  { question_id: 11108, content: "Spiele eine 10-Sekunden-Szene, in der du ein Paket ausgepackt bekommst, das dich enttäuscht.", content_en: "Act out a 10-second scene of unboxing a disappointing package.", intensity: 1 },
  { question_id: 11109, content: "Erzähle einen Kurzwitz mit einem Gegenstand vom Tisch als Hauptfigur.", content_en: "Tell a short joke with an object from the table as the main character.", intensity: 1 },
  { question_id: 11110, content: "Halte eine 15-Sekunden-Wetterprognose für das Wetter in deinem Kopf gerade.", content_en: "Give a 15-second weather forecast for the weather inside your head right now.", intensity: 1 },
  { question_id: 11111, content: "Führe einen imaginären Hund an einer imaginären Leine durch den Raum.", content_en: "Walk an imaginary dog on an imaginary leash across the room.", intensity: 1 },
  { question_id: 11112, content: "Erfinde einen Werbeslogan für das Getränk in deiner Hand.", content_en: "Invent an ad slogan for the drink in your hand.", intensity: 1 },
  { question_id: 11113, content: "Zeig, wie du dir vorstellst, dass Roboter tanzen, für 10 Sekunden.", content_en: "Show how you imagine robots dance, for 10 seconds.", intensity: 1 },
  { question_id: 11114, content: "Sprich die nächsten drei Sätze im Stil einer Zeichentrickfigur deiner Wahl.", content_en: "Speak your next three sentences in the style of a cartoon character of your choice.", intensity: 1 },
  { question_id: 11115, content: "Erfinde ein Alarmsystem-Geräusch und demonstriere es einmal laut.", content_en: "Invent an alarm-system sound and demonstrate it loudly once.", intensity: 1 },
  { question_id: 11116, content: "Erzähl der Runde, was du gerade denkst, aber rückwärts buchstabiert langsam vorgelesen.", content_en: "Tell the group what you're thinking, but read it slowly spelled backward.", intensity: 1 },
  { question_id: 11117, content: "Spiele eine 10-Sekunden-Trailer-Ankündigung für den Rest des Abends.", content_en: "Do a 10-second movie-trailer style announcement for the rest of the night.", intensity: 1 },
  { question_id: 11118, content: "Erfinde eine Fantasiesportart und erkläre eine Regel davon.", content_en: "Invent a fantasy sport and explain one rule of it.", intensity: 1 },
  { question_id: 11119, content: "Mach ein 10-Sekunden-Interview mit dir selbst über den besten Moment heute.", content_en: "Interview yourself for 10 seconds about the best moment today.", intensity: 1 },
  { question_id: 11120, content: "Zeig der Runde deinen besten 'Zeitlupensieg'-Moment nach einem imaginären Wettkampf.", content_en: "Show the group your best slow-motion victory moment after an imaginary contest.", intensity: 1 },

  // --- Batch 3: Intensity 2 ---
  { question_id: 11121, content: "Frag eine Person deiner Wahl, was sie sich für den Rest des Jahres am meisten wünscht.", content_en: "Ask someone of your choice what they wish for most for the rest of the year.", intensity: 2 },
  { question_id: 11122, content: "Erfinde mit einer Person deiner Wahl ein Codewort für 'Hilfe, rette mich aus diesem Gespräch'.", content_en: "Invent a code word with someone of your choice for 'help, save me from this conversation'.", intensity: 2 },
  { question_id: 11123, content: "Tauscht für die nächste Runde Sitzplätze mit einer Person deiner Wahl und imitiert einander kurz.", content_en: "Swap seats with someone of your choice for the next round and briefly imitate each other.", intensity: 2 },
  { question_id: 11124, content: "Frag eine Person deiner Wahl nach ihrem witzigsten Missgeschick dieses Jahr.", content_en: "Ask someone of your choice about their funniest mishap this year.", intensity: 2 },
  { question_id: 11125, content: "Erfinde mit einer Person deiner Wahl eine gemeinsame Erkennungsmelodie und summt sie einmal.", content_en: "Invent a shared theme tune with someone of your choice and hum it once.", intensity: 2 },
  { question_id: 11126, content: "Frag eine Person deiner Wahl, welches Klischee über sie überhaupt nicht stimmt.", content_en: "Ask someone of your choice which cliché about them is totally untrue.", intensity: 2 },
  { question_id: 11127, content: "Mach mit einer Person deiner Wahl ein Standbild, das 'Freundschaft' darstellt.", content_en: "Freeze-pose with someone of your choice to represent 'friendship'.", intensity: 2 },
  { question_id: 11128, content: "Frag eine Person deiner Wahl, was ihr Lieblingsmoment mit dir bisher war.", content_en: "Ask someone of your choice what their favorite moment with you has been so far.", intensity: 2 },
  { question_id: 11129, content: "Erfinde mit einer Person deiner Wahl eine kurze Choreografie zu einem Ton, den ihr gemeinsam summt.", content_en: "Invent a short dance routine with someone of your choice to a tune you hum together.", intensity: 2 },
  { question_id: 11130, content: "Frag eine Person deiner Wahl, was sie an einem perfekten Abend anders machen würde.", content_en: "Ask someone of your choice what they would change about a perfect night.", intensity: 2 },
  { question_id: 11131, content: "Erfinde für eine Person deiner Wahl einen Ehrentitel und verleihe ihn feierlich.", content_en: "Invent an honorary title for someone of your choice and award it ceremoniously.", intensity: 2 },
  { question_id: 11132, content: "Frag eine Person deiner Wahl nach dem besten Ratschlag, den sie je bekommen hat.", content_en: "Ask someone of your choice about the best advice they have ever received.", intensity: 2 },
  { question_id: 11133, content: "Mach mit einer Person deiner Wahl ein spontanes Selfie mit der lustigsten Grimasse.", content_en: "Take a spontaneous selfie with someone of your choice, funniest face possible.", intensity: 2 },
  { question_id: 11134, content: "Frag eine Person deiner Wahl, welches Talent von ihr in der Gruppe am meisten übersehen wird.", content_en: "Ask someone of your choice which of their talents gets overlooked most in the group.", intensity: 2 },

  // --- Batch 3: Intensity 3 ---
  { question_id: 11135, content: "Erzähl der Runde ehrlich, was dich diese Woche am meisten gestresst hat.", content_en: "Honestly tell the group what stressed you out most this week.", intensity: 3 },
  { question_id: 11136, content: "Schreib jemandem, den du länger nicht kontaktiert hast, eine kurze nette Nachricht - jetzt sofort.", content_en: "Send someone you haven't contacted in a while a short nice message - right now.", intensity: 3 },
  { question_id: 11137, content: "Erzähl der Runde von einer Sache, die du diesen Monat zum ersten Mal getan hast.", content_en: "Tell the group about something you did for the first time this month.", intensity: 3 },
  { question_id: 11138, content: "Lass die Runde dir eine unbequeme Frage stellen, die du wahrheitsgemäß beantworten musst.", content_en: "Let the group ask you one uncomfortable question you must answer truthfully.", intensity: 3 },
  { question_id: 11139, content: "Erzähl der Runde, welches Ziel du dir für die nächsten sechs Monate gesetzt hast.", content_en: "Tell the group which goal you have set for the next six months.", intensity: 3 },
  { question_id: 11140, content: "Zeig der Runde eine Notiz oder Erinnerung auf deinem Handy, die dir wichtig ist.", content_en: "Show the group a note or reminder on your phone that matters to you.", intensity: 3 },
  { question_id: 11141, content: "Erzähl der Runde ehrlich, was du an dir selbst gerade am meisten arbeitest.", content_en: "Honestly tell the group what you are currently working on about yourself.", intensity: 3 },
  { question_id: 11142, content: "Sag der Runde eine Sache, für die du dich bei jemandem hier entschuldigen möchtest, auch für Kleinigkeiten.", content_en: "Tell the group one thing you want to apologize to someone here for, even something small.", intensity: 3 },

  // --- Batch 3: Intensity 4 ---
  { question_id: 11143, content: "Sag einer Person deiner Wahl, was du an ihrem Charakter am meisten bewunderst.", content_en: "Tell someone of your choice what you admire most about their character.", intensity: 4 },
  { question_id: 11144, content: "Frag eine Person deiner Wahl, ob sie sich an einen Moment erinnert, in dem Funken geflogen sind zwischen euch.", content_en: "Ask someone of your choice if they remember a moment sparks flew between you two.", intensity: 4 },
  { question_id: 11145, content: "Lehn dich für den nächsten Trinkspruch an die Schulter einer Person deiner Wahl.", content_en: "Lean on the shoulder of someone of your choice for the next toast.", intensity: 4 },
  { question_id: 11146, content: "Erzähl einer Person deiner Wahl, was sie tun müsste, um dich zu beeindrucken.", content_en: "Tell someone of your choice what they'd have to do to impress you.", intensity: 4 },
  { question_id: 11147, content: "Frag eine Person deiner Wahl, was ihr erster Gedanke über dich war, ganz ehrlich.", content_en: "Ask someone of your choice their very first honest thought about you.", intensity: 4 },
  { question_id: 11148, content: "Schenk einer Person deiner Wahl ein spontanes Kompliment über etwas, das sie heute trägt.", content_en: "Give someone of your choice a spontaneous compliment about something they're wearing tonight.", intensity: 4 },

  // --- Batch 3: Intensity 5 ---
  { question_id: 11149, content: "Frag die Runde offen, wer dich hier am meisten überraschen könnte, würdet ihr euch besser kennenlernen.", content_en: "Openly ask the group who here could surprise you most if you got to know them better.", intensity: 5 },
  { question_id: 11150, content: "Lass dir von einer Person deiner Wahl eine ehrliche Antwort geben: Würde sie mit dir flirten, wenn ihr euch neu treffen würdet?", content_en: "Get an honest answer from someone of your choice: would they flirt with you if you met for the first time now?", intensity: 5 },
  { question_id: 11151, content: "Sag einer Person deiner Wahl, was du dir insgeheim für den Rest des Abends von ihr erhoffst.", content_en: "Tell someone of your choice what you secretly hope for from them for the rest of the night.", intensity: 5 },
  { question_id: 11152, content: "Küsse die Wange einer Person deiner Wahl zum Abschluss dieser Runde (nur mit Einverständnis).", content_en: "Kiss the cheek of someone of your choice to close this round (only with consent).", intensity: 5 },

  // --- Batch 4: Intensity 1 ---
  { question_id: 12101, content: "Erfinde einen Radiosender-Namen und moderiere 15 Sekunden lang eine Sendung.", content_en: "Invent a radio station name and host a 15-second show.", intensity: 1 },
  { question_id: 12102, content: "Erzähl der Runde in drei Sätzen die schlechteste Filmidee, die dir gerade einfällt.", content_en: "Tell the group the worst movie idea you can think of, in three sentences.", intensity: 1 },
  { question_id: 12103, content: "Mach ein 10-Sekunden-Wettervorhersage-Update, aber komplett übertrieben dramatisch.", content_en: "Do a 10-second weather forecast update, completely over-dramatic.", intensity: 1 },
  { question_id: 12104, content: "Spiele eine Runde 'unsichtbares Tennis' mit der Person gegenüber.", content_en: "Play a round of 'invisible tennis' with the person across from you.", intensity: 1 },
  { question_id: 12105, content: "Erfinde einen Namen für ein Fantasieland und beschreibe seine Hauptstadt.", content_en: "Invent a fantasy country name and describe its capital city.", intensity: 1 },
  { question_id: 12106, content: "Zeig der Runde deinen besten stummen Comedian-Auftritt für 15 Sekunden.", content_en: "Show the group your best silent comedian act for 15 seconds.", intensity: 1 },
  { question_id: 12107, content: "Erfinde ein Zaubertrick-Intro und führe es vor, auch ohne echten Trick.", content_en: "Invent a magic-trick intro and perform it, even without a real trick.", intensity: 1 },
  { question_id: 12108, content: "Sprich für die nächsten zwei Sätze wie ein Pirat.", content_en: "Speak your next two sentences like a pirate.", intensity: 1 },
  { question_id: 12109, content: "Erfinde eine kurze Fabel mit einer Moral über Trinkspiele.", content_en: "Invent a short fable with a moral about drinking games.", intensity: 1 },
  { question_id: 12110, content: "Halte 10 Sekunden lang eine Yoga-Pose deiner Wahl und benenne sie mit einem erfundenen Namen.", content_en: "Hold a yoga pose of your choice for 10 seconds and give it a made-up name.", intensity: 1 },
  { question_id: 12111, content: "Erfinde ein Fantasiegericht und beschreibe, wie es schmeckt.", content_en: "Invent a fantasy dish and describe how it tastes.", intensity: 1 },
  { question_id: 12112, content: "Mach eine 10-Sekunden-Ansage, als würdest du am Flughafen einen Flug ausrufen.", content_en: "Do a 10-second airport-style flight announcement.", intensity: 1 },
  { question_id: 12113, content: "Erfinde einen Spitznamen für jede Person in der Runde, spontan und schnell.", content_en: "Invent a nickname for each person in the group, fast and spontaneous.", intensity: 1 },
  { question_id: 12114, content: "Spiele nach, wie ein Superheld ganz gelangweilt einkaufen geht.", content_en: "Act out a superhero grocery shopping while looking completely bored.", intensity: 1 },
  { question_id: 12115, content: "Erzähl in 15 Sekunden eine Gute-Nacht-Geschichte für Erwachsene mit Happy End.", content_en: "Tell a 15-second bedtime story for adults with a happy ending.", intensity: 1 },
  { question_id: 12116, content: "Erfinde eine neue Emoji-Bedeutung und benutze sie in einem Satz.", content_en: "Invent a new meaning for an emoji and use it in a sentence.", intensity: 1 },
  { question_id: 12117, content: "Mach 10 Sekunden lang die dramatischste Zeitlupenbewegung, die du kannst.", content_en: "Do the most dramatic slow-motion movement you can for 10 seconds.", intensity: 1 },
  { question_id: 12118, content: "Erfinde ein Firmenlogo mit Handzeichen und stelle es vor.", content_en: "Invent a company logo using hand gestures and present it.", intensity: 1 },

  // --- Batch 4: Intensity 2 ---
  { question_id: 12119, content: "Frag eine Person deiner Wahl, welche Serie sie dir unbedingt empfehlen würde.", content_en: "Ask someone of your choice which show they'd absolutely recommend to you.", intensity: 2 },
  { question_id: 12120, content: "Erfinde mit einer Person deiner Wahl einen Trinkspruch nur aus Tiergeräuschen.", content_en: "Invent a toast made only of animal sounds with someone of your choice.", intensity: 2 },
  { question_id: 12121, content: "Frag eine Person deiner Wahl, was ihr Lieblingswort in einer Fremdsprache ist, und lerne es.", content_en: "Ask someone of your choice for their favorite word in a foreign language and learn it.", intensity: 2 },
  { question_id: 12122, content: "Mach mit einer Person deiner Wahl einen improvisierten Werbespot für die Gruppe.", content_en: "Improvise an ad for the group together with someone of your choice.", intensity: 2 },
  { question_id: 12123, content: "Frag eine Person deiner Wahl nach ihrem besten Urlaubsfoto und lass es dir beschreiben.", content_en: "Ask someone of your choice about their best vacation photo and have them describe it.", intensity: 2 },
  { question_id: 12124, content: "Erfinde mit einer Person deiner Wahl eine Choreografie für einen imaginären Sieg.", content_en: "Invent a victory dance with someone of your choice for an imaginary win.", intensity: 2 },
  { question_id: 12125, content: "Frag eine Person deiner Wahl, was sie diese Woche zum Lachen gebracht hat.", content_en: "Ask someone of your choice what made them laugh this week.", intensity: 2 },
  { question_id: 12126, content: "Mach mit einer Person deiner Wahl einen Vergleich, wer die verrücktere Geschichte parat hat, und stimmt ab.", content_en: "Compete with someone of your choice over who has the crazier story, then vote.", intensity: 2 },
  { question_id: 12127, content: "Frag eine Person deiner Wahl nach ihrem größten Guilty Pleasure im Fernsehen.", content_en: "Ask someone of your choice about their biggest TV guilty pleasure.", intensity: 2 },
  { question_id: 12128, content: "Erfinde mit einer Person deiner Wahl ein Motto für euch beide für diesen Abend.", content_en: "Invent a shared motto for tonight with someone of your choice.", intensity: 2 },
  { question_id: 12129, content: "Frag eine Person deiner Wahl, welches Klischee über ihre Generation sie nervt.", content_en: "Ask someone of your choice which cliché about their generation annoys them.", intensity: 2 },
  { question_id: 12130, content: "Mach mit einer Person deiner Wahl ein spontanes Wortspiel-Duell, drei Runden.", content_en: "Have a spontaneous pun duel with someone of your choice, three rounds.", intensity: 2 },

  // --- Batch 4: Intensity 3 ---
  { question_id: 12131, content: "Erzähl der Runde, was dich diese Woche wirklich stolz gemacht hat.", content_en: "Tell the group what genuinely made you proud this week.", intensity: 3 },
  { question_id: 12132, content: "Zeig der Runde eine App auf deinem Handy, die du eigentlich löschen solltest.", content_en: "Show the group an app on your phone you should probably delete.", intensity: 3 },
  { question_id: 12133, content: "Erzähl der Runde eine Sache, die du dir für den Rest des Jahres fest vorgenommen hast.", content_en: "Tell the group something you've firmly committed to for the rest of the year.", intensity: 3 },
  { question_id: 12134, content: "Lass eine Person deiner Wahl eine ehrliche Einschätzung über dich abgeben, ganz ohne Filter.", content_en: "Let someone of your choice give an honest, unfiltered assessment of you.", intensity: 3 },
  { question_id: 12135, content: "Erzähl der Runde, wovor du dich früher am meisten gefürchtet hast und ob das noch so ist.", content_en: "Tell the group what you used to fear most and whether that's still true.", intensity: 3 },
  { question_id: 12136, content: "Gesteh der Runde, welches Thema du am liebsten vermeidest, wenn es zur Sprache kommt.", content_en: "Confess to the group which topic you prefer to avoid whenever it comes up.", intensity: 3 },
  { question_id: 12137, content: "Erzähl der Runde die Geschichte hinter deinem größten Lernmoment dieses Jahr.", content_en: "Tell the group the story behind your biggest lesson learned this year.", intensity: 3 },

  // --- Batch 4: Intensity 4 ---
  { question_id: 12138, content: "Sag einer Person deiner Wahl, welches Detail an ihr dir jedes Mal auffällt.", content_en: "Tell someone of your choice which detail about them you notice every time.", intensity: 4 },
  { question_id: 12139, content: "Frag eine Person deiner Wahl, ob sie sich an euer erstes richtiges Gespräch erinnert - und wie es war.", content_en: "Ask someone of your choice if they remember your first real conversation - and how it felt.", intensity: 4 },
  { question_id: 12140, content: "Halt für die nächste Runde Händchen mit einer Person deiner Wahl.", content_en: "Hold hands with someone of your choice for the next round.", intensity: 4 },
  { question_id: 12141, content: "Sag einer Person deiner Wahl, was du an ihrer Art zu reden am meisten magst.", content_en: "Tell someone of your choice what you like most about the way they talk.", intensity: 4 },
  { question_id: 12142, content: "Frag eine Person deiner Wahl offen, ob sie dich schon mal attraktiv fand, ganz beiläufig.", content_en: "Casually and openly ask someone of your choice if they've ever found you attractive.", intensity: 4 },

  // --- Batch 4: Intensity 5 ---
  { question_id: 12143, content: "Sag einer Person deiner Wahl leise, was dich an ihr am meisten reizt.", content_en: "Quietly tell someone of your choice what intrigues you most about them.", intensity: 5 },
  { question_id: 12144, content: "Frag die Runde ehrlich, wer hier am meisten Chemie mit dir hätte, rein hypothetisch.", content_en: "Honestly ask the group who here would have the most chemistry with you, purely hypothetically.", intensity: 5 },
  { question_id: 12145, content: "Lass dir von einer Person deiner Wahl sagen, was sie an einem Date mit dir am meisten reizen würde.", content_en: "Have someone of your choice tell you what would excite them most about a date with you.", intensity: 5 },

  // --- Batch 5: Intensity 1 ---
  { question_id: 13101, content: "Erfinde einen Werbespot für Regenwetter und mach ihn richtig überzeugend.", content_en: "Invent a commercial for rainy weather and make it truly convincing.", intensity: 1 },
  { question_id: 13102, content: "Erzähl der Runde einen Fun Fact, den du dir gerade komplett ausdenkst, mit todernstem Gesicht.", content_en: "Tell the group a fun fact you make up on the spot with a totally serious face.", intensity: 1 },
  { question_id: 13103, content: "Spiele eine 15-Sekunden-Szene, in der du dein Lieblingstier zum ersten Mal triffst.", content_en: "Act out a 15-second scene of meeting your favorite animal for the first time.", intensity: 1 },
  { question_id: 13104, content: "Erfinde eine kurze Choreografie für 'den perfekten Schluck'.", content_en: "Invent a short dance routine for 'the perfect sip'.", intensity: 1 },
  { question_id: 13105, content: "Mach 10 Sekunden lang die Stimme eines Filmtrailer-Sprechers für dein eigenes Leben.", content_en: "Do a 10-second movie-trailer voice narrating your own life.", intensity: 1 },
  { question_id: 13106, content: "Erfinde einen Begrüßungsritual für neue Mitspieler*innen dieser Gruppe.", content_en: "Invent a welcome ritual for new players joining this group.", intensity: 1 },
  { question_id: 13107, content: "Zeig der Runde deine beste Interpretation von 'gelangweiltes Königshaus'.", content_en: "Show the group your best interpretation of 'bored royalty'.", intensity: 1 },
  { question_id: 13108, content: "Erfinde einen Namen für ein neues Emoji und beschreibe, wofür es steht.", content_en: "Invent a name for a new emoji and describe what it represents.", intensity: 1 },
  { question_id: 13109, content: "Erzähl in 15 Sekunden das dramatischste 'Wie ich hierher kam'.", content_en: "Tell the most dramatic 'how I got here' story in 15 seconds.", intensity: 1 },
  { question_id: 13110, content: "Mach eine Verkehrsdurchsage für den Weg von der Couch zur Küche.", content_en: "Do a traffic announcement for the route from the couch to the kitchen.", intensity: 1 },
  { question_id: 13111, content: "Spiele pantomimisch nach, wie du versuchst, eine Chipstüte lautlos zu öffnen.", content_en: "Mime trying to open a bag of chips completely silently.", intensity: 1 },
  { question_id: 13112, content: "Erfinde ein Fantasiewort und lass die Runde raten, was es bedeutet.", content_en: "Invent a fantasy word and let the group guess its meaning.", intensity: 1 },
  { question_id: 13113, content: "Halte eine 10-Sekunden-Laudatio auf den besten Snack am Tisch.", content_en: "Give a 10-second eulogy praising the best snack on the table.", intensity: 1 },
  { question_id: 13114, content: "Mach die überzeugendste Stimme eines Nachrichtensprechers für 15 Sekunden.", content_en: "Do the most convincing newscaster voice for 15 seconds.", intensity: 1 },

  // --- Batch 5: Intensity 2 ---
  { question_id: 13115, content: "Frag eine Person deiner Wahl, welches Wort sie am Handy am häufigsten tippt.", content_en: "Ask someone of your choice which word they type most on their phone.", intensity: 2 },
  { question_id: 13116, content: "Erfinde mit einer Person deiner Wahl eine Miniserie über den heutigen Abend, Titel inklusive.", content_en: "Invent a mini-series about tonight with someone of your choice, title included.", intensity: 2 },
  { question_id: 13117, content: "Frag eine Person deiner Wahl, was ihr Lieblingsgeräusch ist und warum.", content_en: "Ask someone of your choice their favorite sound and why.", intensity: 2 },
  { question_id: 13118, content: "Erfinde mit einer Person deiner Wahl ein Zwei-Personen-Applaus-Pattern.", content_en: "Invent a two-person applause pattern with someone of your choice.", intensity: 2 },
  { question_id: 13119, content: "Frag eine Person deiner Wahl nach dem besten Rat, den sie dieses Jahr befolgt hat.", content_en: "Ask someone of your choice about the best advice they followed this year.", intensity: 2 },
  { question_id: 13120, content: "Mach mit einer Person deiner Wahl ein 10-Sekunden-Wortspiel-Battle über ein Thema eurer Wahl.", content_en: "Do a 10-second pun battle with someone of your choice about a topic of your choice.", intensity: 2 },
  { question_id: 13121, content: "Frag eine Person deiner Wahl, was für sie ein perfekter freier Tag wäre.", content_en: "Ask someone of your choice what a perfect day off would look like for them.", intensity: 2 },
  { question_id: 13122, content: "Erfinde mit einer Person deiner Wahl ein kurzes Rap-Battle über den heutigen Abend.", content_en: "Do a short rap battle about tonight with someone of your choice.", intensity: 2 },

  // --- Batch 5: Intensity 3 ---
  { question_id: 13123, content: "Erzähl der Runde etwas, das du diese Woche vermieden hast anzusprechen.", content_en: "Tell the group something you avoided bringing up this week.", intensity: 3 },
  { question_id: 13124, content: "Zeig der Runde dein bisher liebstes Foto dieses Jahres, mit kurzer Erklärung.", content_en: "Show the group your favorite photo from this year, with a short explanation.", intensity: 3 },
  { question_id: 13125, content: "Erzähl der Runde, wofür du gerade wirklich dankbar bist.", content_en: "Tell the group what you're genuinely grateful for right now.", intensity: 3 },
  { question_id: 13126, content: "Lass die Runde raten, was dich diese Woche am meisten beschäftigt hat, dann bestätige oder korrigiere.", content_en: "Let the group guess what's been on your mind most this week, then confirm or correct them.", intensity: 3 },
  { question_id: 13127, content: "Erzähl der Runde deine ehrliche Meinung zu einem Thema, bei dem du dich normalerweise zurückhältst.", content_en: "Share your honest opinion on a topic you usually hold back on.", intensity: 3 },

  // --- Batch 5: Intensity 4 ---
  { question_id: 13128, content: "Sag einer Person deiner Wahl, welches Kompliment du ihr schon lange mal machen wolltest.", content_en: "Tell someone of your choice a compliment you've wanted to give them for a while.", intensity: 4 },
  { question_id: 13129, content: "Frag eine Person deiner Wahl, wie sie deine Anziehungskraft auf einer Skala von 1 bis 10 einschätzt - mit Humor genommen.", content_en: "Ask someone of your choice to rate your charm from 1 to 10 - taken with humor.", intensity: 4 },
  { question_id: 13130, content: "Schau einer Person deiner Wahl 10 Sekunden in die Augen und sag ihr dann ein Kompliment.", content_en: "Look someone of your choice in the eyes for 10 seconds, then give them a compliment.", intensity: 4 },

  // --- Batch 5: Intensity 5 ---
  { question_id: 13131, content: "Sag der Runde ehrlich, wer hier am ehesten dein Herz höherschlagen lassen könnte.", content_en: "Honestly tell the group who here could most make your heart race.", intensity: 5 },
  { question_id: 13132, content: "Lass dir von einer Person deiner Wahl bestätigen oder verneinen: hättet ihr euch woanders getroffen, wäre etwas gelaufen?", content_en: "Have someone of your choice confirm or deny: if you'd met elsewhere, would something have happened?", intensity: 5 },

  // --- Batch 6: Intensity 1 ---
  { question_id: 14101, content: "Erfinde einen Werbeslogan für schlechtes Wetter und trag ihn stolz vor.", content_en: "Invent an ad slogan for bad weather and deliver it proudly.", intensity: 1 },
  { question_id: 14102, content: "Mach eine 10-Sekunden-Late-Night-Show-Moderation über den Raum, in dem ihr sitzt.", content_en: "Do a 10-second late-night-show monologue about the room you're sitting in.", intensity: 1 },
  { question_id: 14103, content: "Erfinde eine Fantasiekreatur, die nur in Wohnzimmern lebt, und beschreibe ihre Gewohnheiten.", content_en: "Invent a fantasy creature that only lives in living rooms and describe its habits.", intensity: 1 },
  { question_id: 14104, content: "Zeig der Runde deine beste 'gerade aufgewacht'-Performance.", content_en: "Show the group your best 'just woke up' performance.", intensity: 1 },
  { question_id: 14105, content: "Erfinde einen Werbejingle für den nächsten Schluck, den die Runde nimmt.", content_en: "Invent an ad jingle for the group's next sip.", intensity: 1 },
  { question_id: 14106, content: "Sprich die nächsten drei Sätze wie ein Wissenschaftler, der gerade eine winzige Entdeckung feiert.", content_en: "Speak your next three sentences like a scientist celebrating a tiny discovery.", intensity: 1 },
  { question_id: 14107, content: "Erfinde eine Verschwörungstheorie darüber, warum es gerade dieses Wetter gibt.", content_en: "Invent a conspiracy theory about why the weather is like this right now.", intensity: 1 },
  { question_id: 14108, content: "Halte eine 10-Sekunden-Dankesrede an deinen Lieblingssnack.", content_en: "Give a 10-second thank-you speech to your favorite snack.", intensity: 1 },
  { question_id: 14109, content: "Mach für 10 Sekunden die überzeugendste 'im Fahrstuhl warten'-Pantomime.", content_en: "Do the most convincing 'waiting in an elevator' mime for 10 seconds.", intensity: 1 },
  { question_id: 14110, content: "Erfinde einen kompletten Lebenslauf für den Gegenstand direkt vor dir.", content_en: "Invent a full life story for the object right in front of you.", intensity: 1 },
  { question_id: 14111, content: "Zeig der Runde einen 10-Sekunden-Tanz, den du komplett improvisierst.", content_en: "Show the group a 10-second dance you fully improvise.", intensity: 1 },
  { question_id: 14112, content: "Erfinde ein neues Wort für 'Vorfreude' und benutze es in einem Satz.", content_en: "Invent a new word for 'anticipation' and use it in a sentence.", intensity: 1 },

  // --- Batch 6: Intensity 2 ---
  { question_id: 14113, content: "Frag eine Person deiner Wahl, welches Lied sie sofort tanzen lässt.", content_en: "Ask someone of your choice which song instantly makes them dance.", intensity: 2 },
  { question_id: 14114, content: "Erfinde mit einer Person deiner Wahl einen kleinen Sketch über euren ersten Eindruck voneinander.", content_en: "Create a short sketch with someone of your choice about your first impression of each other.", intensity: 2 },
  { question_id: 14115, content: "Frag eine Person deiner Wahl, was für sie der beste Teil dieses Abends bisher war.", content_en: "Ask someone of your choice the best part of tonight so far.", intensity: 2 },
  { question_id: 14116, content: "Mach mit einer Person deiner Wahl ein Standbild zum Thema 'überraschter Champion'.", content_en: "Freeze-pose with someone of your choice on the theme 'surprised champion'.", intensity: 2 },
  { question_id: 14117, content: "Frag eine Person deiner Wahl nach ihrem Lieblingswort, das es in keiner anderen Sprache gibt.", content_en: "Ask someone of your choice for their favorite word that has no equivalent in another language.", intensity: 2 },
  { question_id: 14118, content: "Erfinde mit einer Person deiner Wahl einen Slogan für die Gruppe heute Abend.", content_en: "Invent a slogan for the group tonight with someone of your choice.", intensity: 2 },
  { question_id: 14119, content: "Frag eine Person deiner Wahl, wie ihr perfektes Kompliment klingen würde.", content_en: "Ask someone of your choice what their perfect compliment would sound like.", intensity: 2 },

  // --- Batch 6: Intensity 3 ---
  { question_id: 14120, content: "Erzähl der Runde etwas, das dich in letzter Zeit wirklich stolz gemacht hat, ohne es kleinzureden.", content_en: "Tell the group something that made you truly proud recently, without downplaying it.", intensity: 3 },
  { question_id: 14121, content: "Zeig der Runde ein Foto, das eine wichtige Erinnerung für dich zeigt.", content_en: "Show the group a photo that represents an important memory for you.", intensity: 3 },
  { question_id: 14122, content: "Erzähl der Runde eine Sache, die du dieses Jahr über dich selbst gelernt hast.", content_en: "Tell the group something you learned about yourself this year.", intensity: 3 },
  { question_id: 14123, content: "Gesteh der Runde, wo du dir selbst gegenüber zu streng bist.", content_en: "Confess to the group where you're too hard on yourself.", intensity: 3 },

  // --- Batch 6: Intensity 4 ---
  { question_id: 14124, content: "Sag einer Person deiner Wahl, was du dir für sie im nächsten Jahr wünschst.", content_en: "Tell someone of your choice what you wish for them next year.", intensity: 4 },
  { question_id: 14125, content: "Frag eine Person deiner Wahl, was für sie 'Chemie zwischen zwei Menschen' bedeutet.", content_en: "Ask someone of your choice what 'chemistry between two people' means to them.", intensity: 4 },
  { question_id: 14126, content: "Umarme eine Person deiner Wahl fünf Sekunden länger als sonst üblich.", content_en: "Hug someone of your choice five seconds longer than usual.", intensity: 4 },

  // --- Batch 6: Intensity 5 ---
  { question_id: 14127, content: "Sag einer Person deiner Wahl leise ins Ohr, was du dir für den Rest der Nacht wünschst.", content_en: "Quietly whisper to someone of your choice what you wish for the rest of the night.", intensity: 5 },
  { question_id: 14128, content: "Frag die Runde offen: Wer hier hat schon mal insgeheim mit dir geflirtet, ohne dass du es bemerkt hast?", content_en: "Openly ask the group: who here has secretly flirted with you before without you noticing?", intensity: 5 },

  // --- Batch 7: Intensity 1 ---
  { question_id: 15101, content: "Erfinde ein Fantasiegetränk und beschreibe seine drei Zutaten.", content_en: "Invent a fantasy drink and describe its three ingredients.", intensity: 1 },
  { question_id: 15102, content: "Halte eine 10-Sekunden-Ansage, als würdest du eine U-Bahn-Station ausrufen.", content_en: "Do a 10-second announcement as if calling out a subway station.", intensity: 1 },
  { question_id: 15103, content: "Erfinde ein neues Wort für 'Feierabend' und benutze es in einem Satz.", content_en: "Invent a new word for 'quitting time' and use it in a sentence.", intensity: 1 },
  { question_id: 15104, content: "Spiele eine 10-Sekunden-Szene, in der ein Roboter zum ersten Mal tanzt.", content_en: "Act out a 10-second scene of a robot dancing for the first time.", intensity: 1 },
  { question_id: 15105, content: "Erfinde ein Maskottchen-Geräusch und stell es der Runde zweimal vor.", content_en: "Invent a mascot sound and demonstrate it to the group twice.", intensity: 1 },
  { question_id: 15106, content: "Sprich die nächsten zwei Sätze wie ein Werbespot für Zahnpasta.", content_en: "Speak your next two sentences like a toothpaste commercial.", intensity: 1 },
  { question_id: 15107, content: "Erfinde eine kurze Verschwörungstheorie über die Person, die zuletzt getrunken hat.", content_en: "Invent a short conspiracy theory about whoever drank last.", intensity: 1 },
  { question_id: 15108, content: "Halte eine 10-Sekunden-Laudatio auf das schönste Möbelstück im Raum.", content_en: "Give a 10-second eulogy praising the nicest piece of furniture in the room.", intensity: 1 },
  { question_id: 15109, content: "Mach für 10 Sekunden die überzeugendste Zeitlupen-Rennkommentar-Stimme.", content_en: "Do the most convincing slow-motion sports-commentary voice for 10 seconds.", intensity: 1 },
  { question_id: 15110, content: "Erfinde einen Fantasienamen für den Rest des Abends und stell dich damit vor.", content_en: "Invent a fantasy name for the rest of the night and introduce yourself with it.", intensity: 1 },
  { question_id: 15111, content: "Erzähl in 15 Sekunden die dramatischste Version davon, wie du hierher gekommen bist.", content_en: "Tell the most dramatic version of how you got here, in 15 seconds.", intensity: 1 },
  { question_id: 15112, content: "Zeig der Runde deine beste Interpretation eines gelangweilten Roboters.", content_en: "Show the group your best interpretation of a bored robot.", intensity: 1 },

  // --- Batch 7: Intensity 2 ---
  { question_id: 15113, content: "Frag eine Person deiner Wahl nach ihrem Lieblingswort und benutze es die nächsten fünf Minuten selbst.", content_en: "Ask someone of your choice for their favorite word and use it yourself for the next five minutes.", intensity: 2 },
  { question_id: 15114, content: "Erfinde mit einer Person deiner Wahl eine gemeinsame Erkennungsmelodie für die Gruppe.", content_en: "Invent a shared theme tune for the group with someone of your choice.", intensity: 2 },
  { question_id: 15115, content: "Frag eine Person deiner Wahl, was ihr Lieblingsmoment aus der gemeinsamen Zeit war.", content_en: "Ask someone of your choice about their favorite moment from your time together.", intensity: 2 },
  { question_id: 15116, content: "Mach mit einer Person deiner Wahl eine improvisierte Nachrichtensendung über den heutigen Abend.", content_en: "Improvise a news broadcast about tonight with someone of your choice.", intensity: 2 },
  { question_id: 15117, content: "Frag eine Person deiner Wahl, welches Klischee über sie stimmt.", content_en: "Ask someone of your choice which cliché about them is actually true.", intensity: 2 },
  { question_id: 15118, content: "Erfinde mit einer Person deiner Wahl einen Ehren-Applaus und führt ihn vor.", content_en: "Invent an honorary applause with someone of your choice and perform it.", intensity: 2 },
  { question_id: 15119, content: "Frag eine Person deiner Wahl nach ihrem besten Rat für ein erfülltes Leben.", content_en: "Ask someone of your choice for their best advice for a fulfilling life.", intensity: 2 },

  // --- Batch 7: Intensity 3 ---
  { question_id: 15120, content: "Erzähl der Runde eine Sache, die du diese Woche über eine Person hier gelernt hast.", content_en: "Tell the group something you learned about someone here this week.", intensity: 3 },
  { question_id: 15121, content: "Gesteh der Runde, welches Thema du am meisten meidest, wenn es hochkommt.", content_en: "Confess to the group which topic you avoid most when it comes up.", intensity: 3 },
  { question_id: 15122, content: "Erzähl der Runde deine ehrliche Meinung zu einer Entscheidung, die du dieses Jahr getroffen hast.", content_en: "Share your honest opinion on a decision you made this year.", intensity: 3 },

  // --- Batch 7: Intensity 4 ---
  { question_id: 15123, content: "Sag einer Person deiner Wahl, welches Detail ihres Lachens dir gefällt.", content_en: "Tell someone of your choice which detail of their laugh you like.", intensity: 4 },
  { question_id: 15124, content: "Frag eine Person deiner Wahl, was für sie ein perfekter erster Abend zu zweit wäre.", content_en: "Ask someone of your choice what a perfect first night together would look like for them.", intensity: 4 },

  // --- Batch 7: Intensity 5 ---
  { question_id: 15125, content: "Sag der Runde ehrlich, wer hier am meisten Anziehungskraft auf dich hat, ganz offen.", content_en: "Openly and honestly tell the group who here has the most pull on you.", intensity: 5 },

  // --- Batch 8: Intensity 1 ---
  { question_id: 16101, content: "Erfinde einen kurzen Werbespot für die beste Erfindung aller Zeiten - deine Wahl.", content_en: "Invent a short ad for the best invention of all time - your pick.", intensity: 1 },
  { question_id: 16102, content: "Halte eine 10-Sekunden-Rede darüber, warum Socken unterschätzt werden.", content_en: "Give a 10-second speech on why socks are underrated.", intensity: 1 },
  { question_id: 16103, content: "Spiele eine 10-Sekunden-Szene nach, in der du versuchst, leise eine Tür zu schließen.", content_en: "Act out a 10-second scene of trying to quietly close a door.", intensity: 1 },
  { question_id: 16104, content: "Erfinde einen Begrüßungstanz für die Gruppe und führe ihn einmal auf.", content_en: "Invent a welcome dance for the group and perform it once.", intensity: 1 },
  { question_id: 16105, content: "Mach 10 Sekunden lang die Stimme eines gelangweilten Museumsführers.", content_en: "Do a bored museum-tour-guide voice for 10 seconds.", intensity: 1 },
  { question_id: 16106, content: "Erfinde eine kurze Gute-Nacht-Ansage für die Runde, als wärst du ein Flugkapitän.", content_en: "Invent a short good-night announcement for the group as if you were a flight captain.", intensity: 1 },
  { question_id: 16107, content: "Erzähl in drei Sätzen, wie dein perfekter Superheldenname lauten würde und warum.", content_en: "Explain in three sentences what your perfect superhero name would be and why.", intensity: 1 },
  { question_id: 16108, content: "Erfinde einen Trinkspruch nur aus Zahlen.", content_en: "Invent a toast made only of numbers.", intensity: 1 },
  { question_id: 16109, content: "Zeig der Runde deine beste Zeitlupen-Reaktion auf eine gute Nachricht.", content_en: "Show the group your best slow-motion reaction to good news.", intensity: 1 },
  { question_id: 16110, content: "Erfinde ein Fantasiewort für 'Kater' und erkläre seine Bedeutung.", content_en: "Invent a fantasy word for 'hangover' and explain its meaning.", intensity: 1 },

  // --- Batch 8: Intensity 2 ---
  { question_id: 16111, content: "Frag eine Person deiner Wahl, welches Wort sie am Handy autokorrigiert bekommt und hasst.", content_en: "Ask someone of your choice which word autocorrect always ruins for them.", intensity: 2 },
  { question_id: 16112, content: "Erfinde mit einer Person deiner Wahl einen Spitznamen für die Gruppe heute Abend.", content_en: "Invent a nickname for the group tonight with someone of your choice.", intensity: 2 },
  { question_id: 16113, content: "Frag eine Person deiner Wahl, welches Talent sie gerne in dieser Runde zeigen würde.", content_en: "Ask someone of your choice which talent they'd like to show off in this group.", intensity: 2 },
  { question_id: 16114, content: "Mach mit einer Person deiner Wahl eine improvisierte Wettervorhersage für die Stimmung im Raum.", content_en: "Improvise a weather forecast for the room's mood with someone of your choice.", intensity: 2 },
  { question_id: 16115, content: "Frag eine Person deiner Wahl nach ihrem Lieblingsmoment aus der heutigen Runde bisher.", content_en: "Ask someone of your choice their favorite moment from tonight so far.", intensity: 2 },
  { question_id: 16116, content: "Erfinde mit einer Person deiner Wahl ein kurzes Lied über die Gruppe.", content_en: "Invent a short song about the group with someone of your choice.", intensity: 2 },

  // --- Batch 8: Intensity 3 ---
  { question_id: 16117, content: "Erzähl der Runde, was du dir für den nächsten Monat fest vorgenommen hast.", content_en: "Tell the group what you've firmly planned for next month.", intensity: 3 },
  { question_id: 16118, content: "Gesteh der Runde eine Sache, die du gerne öfter sagen würdest, dich aber traust.", content_en: "Confess to the group something you wish you said more often but don't dare to.", intensity: 3 },

  // --- Batch 8: Intensity 4 ---
  { question_id: 16119, content: "Sag einer Person deiner Wahl, was dich an ihrer Energie am meisten anzieht.", content_en: "Tell someone of your choice what about their energy attracts you most.", intensity: 4 },
  { question_id: 16120, content: "Frag eine Person deiner Wahl, ob sie sich an einen Moment erinnert, in dem sie an dich gedacht hat, ohne Grund.", content_en: "Ask someone of your choice if they recall a moment they thought of you for no reason.", intensity: 4 },

  // --- Batch 8: Intensity 5 ---
  { question_id: 16121, content: "Sag einer Person deiner Wahl, was du dir insgeheim für einen gemeinsamen Moment nach diesem Abend erhoffst.", content_en: "Tell someone of your choice what you secretly hope for in a shared moment after tonight.", intensity: 5 },

  // --- Batch 9: Intensity 1 ---
  { question_id: 17101, content: "Erfinde eine kurze Radiodurchsage über das Wetter im Raum gerade.", content_en: "Invent a short radio bulletin about the weather in the room right now.", intensity: 1 },
  { question_id: 17102, content: "Spiele eine 10-Sekunden-Szene, in der ein Kuchen zum Leben erwacht.", content_en: "Act out a 10-second scene of a cake coming to life.", intensity: 1 },
  { question_id: 17103, content: "Erfinde einen Werbeslogan für die Person rechts von dir.", content_en: "Invent an ad slogan for the person to your right.", intensity: 1 },
  { question_id: 17104, content: "Halte eine 10-Sekunden-Dankesrede an das Sofa oder den Stuhl, auf dem du sitzt.", content_en: "Give a 10-second thank-you speech to the couch or chair you're sitting on.", intensity: 1 },
  { question_id: 17105, content: "Mach für 10 Sekunden die Stimme eines aufgeregten Sportreporters bei einem Tischtennis-Ball.", content_en: "Do an excited sports-reporter voice for 10 seconds narrating a ping-pong ball.", intensity: 1 },
  { question_id: 17106, content: "Erfinde ein Fantasiewort für 'Durst' und benutze es in einem Satz.", content_en: "Invent a fantasy word for 'thirst' and use it in a sentence.", intensity: 1 },
  { question_id: 17107, content: "Zeig der Runde eine 10-Sekunden-Zeitlupe von dir, wie du eine Tür öffnest.", content_en: "Show the group a 10-second slow-motion sequence of you opening a door.", intensity: 1 },
  { question_id: 17108, content: "Erfinde einen Namen für einen imaginären Feiertag heute und erkläre die Tradition.", content_en: "Invent a name for an imaginary holiday today and explain its tradition.", intensity: 1 },

  // --- Batch 9: Intensity 2 ---
  { question_id: 17109, content: "Frag eine Person deiner Wahl, welches Wort für sie 'Zuhause' am besten beschreibt.", content_en: "Ask someone of your choice which word best describes 'home' for them.", intensity: 2 },
  { question_id: 17110, content: "Erfinde mit einer Person deiner Wahl einen kurzen Werbespot für die Runde heute Abend.", content_en: "Invent a short ad for the group tonight with someone of your choice.", intensity: 2 },
  { question_id: 17111, content: "Frag eine Person deiner Wahl, was für sie der beste Teil an Freundschaft ist.", content_en: "Ask someone of your choice what the best part of friendship is for them.", intensity: 2 },
  { question_id: 17112, content: "Mach mit einer Person deiner Wahl eine kurze Comedy-Routine über den heutigen Abend.", content_en: "Do a short comedy routine about tonight with someone of your choice.", intensity: 2 },

  // --- Batch 9: Intensity 3 ---
  { question_id: 17113, content: "Erzähl der Runde etwas, das du dieses Jahr über echte Freundschaft gelernt hast.", content_en: "Tell the group something you learned about real friendship this year.", intensity: 3 },
  { question_id: 17114, content: "Zeig der Runde eine Erinnerung auf deinem Handy, auf die du besonders stolz bist.", content_en: "Show the group a memory on your phone you're especially proud of.", intensity: 3 },

  // --- Batch 9: Intensity 4 ---
  { question_id: 17115, content: "Sag einer Person deiner Wahl, was dich an ihrem Humor am meisten anzieht.", content_en: "Tell someone of your choice what about their humor attracts you most.", intensity: 4 },
  { question_id: 17116, content: "Frag eine Person deiner Wahl, was ihr auffällt, wenn sie dich lange nicht gesehen hat.", content_en: "Ask someone of your choice what they notice first after not seeing you for a while.", intensity: 4 },

  // --- Batch 9: Intensity 5 ---
  { question_id: 17117, content: "Sag der Runde offen, welche Person hier dich heute Abend am meisten überrascht hat - und warum.", content_en: "Openly tell the group which person here surprised you most tonight - and why.", intensity: 5 },

  // --- Batch 10: Intensity 1 ---
  { question_id: 18101, content: "Erfinde einen kurzen Werbespot für den Rest des Abends.", content_en: "Invent a short ad for the rest of the night.", intensity: 1 },
  { question_id: 18102, content: "Halte eine 10-Sekunden-Wettervorhersage für die Stimmung im Raum.", content_en: "Give a 10-second weather forecast for the mood in the room.", intensity: 1 },
  { question_id: 18103, content: "Spiele eine 10-Sekunden-Szene, in der eine Pflanze zum ersten Mal spricht.", content_en: "Act out a 10-second scene of a plant speaking for the first time.", intensity: 1 },
  { question_id: 18104, content: "Erfinde einen neuen Begrüßungsgruß, den die Runde ab jetzt benutzt.", content_en: "Invent a new greeting the group uses from now on.", intensity: 1 },
  { question_id: 18105, content: "Mach 10 Sekunden lang die Stimme eines aufgeregten Kochshow-Moderators.", content_en: "Do an excited cooking-show-host voice for 10 seconds.", intensity: 1 },
  { question_id: 18106, content: "Erfinde ein Fantasiewort für 'Vorfreude auf den nächsten Schluck'.", content_en: "Invent a fantasy word for 'anticipation of the next sip'.", intensity: 1 },
  { question_id: 18107, content: "Zeig der Runde deine beste Interpretation von 'total überrascht'.", content_en: "Show the group your best interpretation of 'totally surprised'.", intensity: 1 },

  // --- Batch 10: Intensity 2 ---
  { question_id: 18108, content: "Frag eine Person deiner Wahl, welches Wort sie am liebsten öfter hören würde.", content_en: "Ask someone of your choice which word they wish they heard more often.", intensity: 2 },
  { question_id: 18109, content: "Erfinde mit einer Person deiner Wahl einen kurzen Sketch über eine perfekte Verabredung.", content_en: "Create a short sketch about a perfect date with someone of your choice.", intensity: 2 },
  { question_id: 18110, content: "Frag eine Person deiner Wahl, was für sie Glück in einem Satz bedeutet.", content_en: "Ask someone of your choice what happiness means to them in one sentence.", intensity: 2 },

  // --- Batch 10: Intensity 3 ---
  { question_id: 18111, content: "Erzähl der Runde etwas, das du dir für die Zukunft dieser Gruppe wünschst.", content_en: "Tell the group something you wish for this group's future.", intensity: 3 },

  // --- Batch 10: Intensity 4 ---
  { question_id: 18112, content: "Sag einer Person deiner Wahl, was du an ihrer Ausstrahlung besonders findest.", content_en: "Tell someone of your choice what you find special about their presence.", intensity: 4 },

  // --- Batch 10: Intensity 5 ---
  { question_id: 18113, content: "Sag der Runde ehrlich, mit wem hier du am liebsten den Abend allein ausklingen lassen würdest.", content_en: "Honestly tell the group who here you'd most like to end the night alone with.", intensity: 5 },

  // --- Batch 11: Intensity 1 ---
  { question_id: 19101, content: "Erfinde einen kurzen Werbespot für die beste Erfindung des Abends bisher.", content_en: "Invent a short ad for the best invention of the night so far.", intensity: 1 },
  { question_id: 19102, content: "Halte eine 10-Sekunden-Rede darüber, warum dieser Abend legendär wird.", content_en: "Give a 10-second speech on why tonight is going to be legendary.", intensity: 1 },
  { question_id: 19103, content: "Spiele eine 10-Sekunden-Szene, in der ein Glas zum ersten Mal spricht.", content_en: "Act out a 10-second scene of a glass speaking for the first time.", intensity: 1 },
  { question_id: 19104, content: "Erfinde einen neuen Abschiedsgruß, den die Runde ab jetzt benutzt.", content_en: "Invent a new goodbye greeting the group uses from now on.", intensity: 1 },
  { question_id: 19105, content: "Mach 10 Sekunden lang die Stimme eines aufgeregten Quizshow-Moderators.", content_en: "Do an excited game-show-host voice for 10 seconds.", intensity: 1 },
  { question_id: 19106, content: "Erfinde ein Fantasiewort für 'perfekter Moment' und benutze es in einem Satz.", content_en: "Invent a fantasy word for 'perfect moment' and use it in a sentence.", intensity: 1 },

  // --- Batch 11: Intensity 2 ---
  { question_id: 19107, content: "Frag eine Person deiner Wahl, welches Wort für sie 'Abenteuer' am besten beschreibt.", content_en: "Ask someone of your choice which word best describes 'adventure' for them.", intensity: 2 },
  { question_id: 19108, content: "Erfinde mit einer Person deiner Wahl einen kurzen Sketch über die perfekte Nacht.", content_en: "Create a short sketch about the perfect night with someone of your choice.", intensity: 2 },

  // --- Batch 11: Intensity 3 ---
  { question_id: 19109, content: "Erzähl der Runde etwas, das du dir für den Rest dieses Abends wünschst.", content_en: "Tell the group something you wish for the rest of tonight.", intensity: 3 },

  // --- Batch 11: Intensity 4 ---
  { question_id: 19110, content: "Sag einer Person deiner Wahl, was du dir von einem gemeinsamen Moment mit ihr erhoffst.", content_en: "Tell someone of your choice what you hope for from a shared moment with them.", intensity: 4 },

  // --- Batch 11: Intensity 5 ---
  { question_id: 19111, content: "Sag der Runde ehrlich, wer heute Nacht dein Favorit ist, ganz offen.", content_en: "Honestly and openly tell the group who your favorite is tonight.", intensity: 5 },

  // --- Batch 12: gemischt ---
  { question_id: 19301, content: "Erfinde ein neues Trinkspiel-Wort und erkläre seine Regel in einem Satz.", content_en: "Invent a new drinking-game word and explain its rule in one sentence.", intensity: 1 },
  { question_id: 19302, content: "Halte eine 10-Sekunden-Rede über den besten Snack des Abends.", content_en: "Give a 10-second speech about the best snack of the night.", intensity: 1 },
  { question_id: 19303, content: "Mach 10 Sekunden lang die Stimme eines Wetter-Moderators, der von einem Sturm im Glas berichtet.", content_en: "Do a 10-second weather-anchor voice reporting on a storm in a glass.", intensity: 1 },
  { question_id: 19304, content: "Erfinde einen Spitznamen für den heutigen Abend und ruf ihn einmal laut.", content_en: "Invent a nickname for tonight and shout it out once.", intensity: 1 },
  { question_id: 19305, content: "Frag eine Person deiner Wahl, was ihr Lieblingswort in dieser Runde ist.", content_en: "Ask someone of your choice their favorite word used in this group.", intensity: 2 },
  { question_id: 19306, content: "Erfinde mit einer Person deiner Wahl ein Codewort für 'bester Moment des Abends'.", content_en: "Invent a code word with someone of your choice for 'best moment of the night'.", intensity: 2 },
  { question_id: 19307, content: "Erzähl der Runde, was du dir für die nächste gemeinsame Runde wünschst.", content_en: "Tell the group what you wish for the next time you're all together.", intensity: 3 },
  { question_id: 19308, content: "Sag einer Person deiner Wahl, was dich an ihrer Art, Geschichten zu erzählen, fasziniert.", content_en: "Tell someone of your choice what fascinates you about the way they tell stories.", intensity: 4 },
  { question_id: 19309, content: "Sag der Runde ehrlich, welcher Moment heute Abend dir am nächsten ging.", content_en: "Honestly tell the group which moment tonight hit closest to home for you.", intensity: 5 },

  // --- Batch 13: Auffuellung ---
  { question_id: 19501, content: "Erfinde ein neues Wort für 'guter Schluck' und benutze es sofort.", content_en: "Invent a new word for 'good sip' and use it right away.", intensity: 1 },
  { question_id: 19502, content: "Halte eine 10-Sekunden-Rede darüber, warum diese Runde besonders ist.", content_en: "Give a 10-second speech on why this group is special.", intensity: 1 },
  { question_id: 19503, content: "Mach 10 Sekunden lang die Stimme eines begeisterten Sportkommentators für Kartenspiele.", content_en: "Do an enthusiastic sports-commentator voice for a card game, for 10 seconds.", intensity: 1 },
  { question_id: 19504, content: "Frag eine Person deiner Wahl, was für sie 'ein guter Abend' bedeutet.", content_en: "Ask someone of your choice what 'a good night' means to them.", intensity: 2 },
  { question_id: 19505, content: "Erzähl der Runde, was du dir für dich selbst nach diesem Abend wünschst.", content_en: "Tell the group what you wish for yourself after tonight.", intensity: 3 },
  { question_id: 19506, content: "Sag einer Person deiner Wahl, was dich an ihrer Präsenz in dieser Runde beeindruckt.", content_en: "Tell someone of your choice what impresses you about their presence in this group.", intensity: 4 },
];
