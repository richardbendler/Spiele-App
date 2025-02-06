Bitte denke dir 100 einzigartige Fragen für nachfolgendes Spiel aus. Bitte beachte dabei ganz genau die Spielbeschreibung und die Hinweise

Spieltitel: "Wettkampf"
Spielprinzip: In jeder Runde spielen alle gegen alle. Es sollen Aufgaben gestellt werden, die in einer entspannten Runde erfüllbar sind, zum Beispiel "Wer kann am längsten auf einem Bein stehen?". Außerdem sollen die Aufgaben ohne Equipment außer ggf. einem Getränk gespielt werden können. Die Aufgaben sollen lustig sein, aber nicht zu peinlich. Die Aufgaben dürfen gerne auch teilweise Alkohol involvieren. Achte bei den Aufgaben darauf, dass sie auch nicht zu lange dauern sollen.

Achte bei der Formulierung darauf, möglichst geschlechterneutral zu formuleren. Also statt "Wer ist der mutigste?" lieber schreiben "Wer ist die mutigste Person?".

Da die finale Liste als SQL-Befehl ausgeführt werden soll, um die Daten einer Datenbank hinzuzufügen, sollen die Daten in folgendem Format weiter befüllt werden. Dabei ist unbedingt darauf zu achten, die Klammern richtig zu setzen und die richtigen Anführungsstriche zu benutzen: Der String bzw. Integer sollen in doppelte Anführungsstriche und wenn im deutschen oder englischen Text Anführungsstriche benötigt werden, sollen einfache benutzt werden.

Hinter den beiden Strings stehen noch drei Integers. Diese gehören in der Reihenfolge zu den Attributen drunk_level, exposure_level und bool_drink. Bitte vergib auch diese Integer-Werte passend zu jeder Frage nach folgendem System:
drunk_level: von 0 bis 10, wie sehr geht es bei dieser Frage/Aussage ums Trinken (10 = voll)
exposure_level: von 0 bis 10, wie sehr muss man sich bei dieser Frage/Aussage exposen oder leicht lächerlich machen (10 = voll)
bool_drink: boolean der angibt, ob es bei der Frage/Aussage ums Trinken geht (1 = ja; 0 = nein)

Hier der SQL-Befehl, der befüllt werden soll:
INSERT INTO game_klassiker_questions (fk_pool, content, content_english, drunk_level, exposure_level, bool_drink) VALUES
(„10“, "Wer kann den besten Witz erzählen?“, „Who can tell the best joke?“, "0", "3", "0"),
… hier weiter befüllen …

Bitte achte darauf, keine Fragen doppelt zu haben! Und bitte außerdem darauf, dass die Übersetzungen richtig sind und in der richtigen Zeile stehen.
