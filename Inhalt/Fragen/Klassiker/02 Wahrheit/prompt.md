Bitte denke dir 100 einzigartige Fragen für nachfolgendes Spiel aus. Bitte beachte dabei ganz genau die Spielbeschreibung und die Hinweise

Spieltitel: „Wahrheit“
Spielprinzip: Nacheinander werden Fragen an konkrete Personen gestellt. Die Fragen sollen interessant sein, aber nicht zu persönlich und nicht zu deep. Es soll in lockerer Atmosphäre (ggf. mit Alkohol) gespielt werden, also auch ein bisschen lustig sein.

Achte bei der Formulierung darauf, möglichst geschlechterneutral zu formuleren. Also statt "Wer ist der mutigste?" lieber schreiben "Wer ist die mutigste Person?".

Da die finale Liste als SQL-Befehl ausgeführt werden soll, um die Daten einer Datenbank hinzuzufügen, sollen die Daten in folgendem Format weiter befüllt werden. Dabei ist unbedingt darauf zu achten, die Klammern richtig zu setzen und die richtigen Anführungsstriche zu benutzen: Der String bzw. Integer sollen in doppelte Anführungsstriche und wenn im deutschen oder englischen Text Anführungsstriche benötigt werden, sollen einfache benutzt werden.

Hinter den beiden Strings stehen noch drei Integers. Diese gehören in der Reihenfolge zu den Attributen drunk_level, exposure_level und bool_drink. Bitte vergib auch diese Integer-Werte passend zu jeder Frage nach folgendem System:
drunk_level: von 0 bis 10, wie sehr geht es bei dieser Frage/Aussage ums Trinken (10 = voll)
exposure_level: von 0 bis 10, wie sehr muss man sich bei dieser Frage/Aussage exposen oder leicht lächerlich machen (10 = voll)
bool_drink: boolean der angibt, ob es bei der Frage/Aussage ums Trinken geht (1 = ja; 0 = nein)

Hier der SQL-Befehl, der befüllt werden soll:
INSERT INTO game_klassiker_questions (fk_pool, content, content_english, drunk_level, exposure_level, bool_drink) VALUES
(„2“, "Was war der seltsamste Ort, an dem du jemals eingeschlafen bist?“, „What was the weirdest place you ever fell asleep?“, "0", "5", "0"),
(„2“, „Wenn du eine Superkraft haben könntest, welche würdest du wählen?“, „If you could have any superpower, what would it be?“, "0", "1", "0"),
("2", "Wer aus der Runde hätte die besten Chancen, in einer Zombie-Apokalypse zu überleben?", "Who in the group would have the best chances of surviving a zombie apocalypse?", "0", "2", "0"),
… hier weiter befüllen …

Bitte achte darauf, keine Fragen doppelt zu haben! Und bitte außerdem darauf, dass die Übersetzungen richtig sind und in der richtigen Zeile stehen.
