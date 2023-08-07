const manyQuestions = [
    
    'Wer war in seinem Leben schon einmal so verliebt, dass er/sie alles aufgegeben hätte, um mit dieser Person zusammen zu sein? ',

    'Welche Person hat ein Geheimnis, das bisher niemand in der Runde kennt? ',

    'Wer hatte schon einmal eine existenzielle Krise und wie ist er/sie damit umgegangen? ',

    'Welche Person hat eine Entscheidung getroffen, die das Leben anderer Menschen stark beeinflusst hat? ',

    'Wer hat sich schon einmal so verletzt gefühlt, dass er/sie darüber nachgedacht hat, professionelle Hilfe zu suchen? ',

    'Welche Person hat etwas in seinem/ihrem Leben bereut und würde es gerne rückgängig machen? ',

    'Wer hat eine außergewöhnliche Erfahrung gemacht, von der er/sie bisher niemandem erzählt hat? ',

    'Welche Person hat sich schon einmal in einer schwierigen Situation moralisch oder ethisch fragwürdig verhalten? ',

    'Wer hat sich schon einmal einsam gefühlt, obwohl er/sie von vielen Menschen umgeben war? ',

    'Welche Person hat eine Angst, die ihr Leben beeinflusst und sie bisher nicht überwunden hat? ',

    'Wer hat schon einmal einen großen Fehler gemacht, der fast alles zerstört hätte? ',

    'Welche Person hat schon einmal einen schweren Verlust erlitten und wie ist sie damit umgegangen? ',

    'Wer hat schon einmal eine Entscheidung getroffen, die sein/ihr Leben komplett verändert hat, im Nachhinein aber als falsch empfunden wurde? ',

    'Welche Person hat eine schlechte Angewohnheit, von der sie sich wünscht, sie loszuwerden? ',

    'Wer hat schon einmal jemandem absichtlich oder unabsichtlich stark wehgetan und es bisher nicht wiedergutgemacht? ',

    'Welche Person hat schon einmal eine große Lüge erzählt, um sich aus einer schwierigen Situation zu retten? ',

    'Wer hat schon einmal etwas gestohlen oder sich unrechtmäßig angeeignet? ',

    'Welche Person hat ein persönliches Ziel oder einen Traum, den sie bisher niemandem offenbart hat? ',

    'Wer hat sich schon einmal so unsicher oder minderwertig gefühlt, dass er/sie sich vor anderen verstecken wollte? ',

    'Welche Person hat eine schwierige Beziehung zu einem Familienmitglied oder einem engen Freund und hat bisher nicht versucht, das Problem zu lösen? ',

    'Wer hat schon einmal jemanden bewusst verletzt oder ausgenutzt, um einen eigenen Vorteil zu erlangen? ',

    'Welche Person hat ein Geheimnis, das sie gerne mit jemandem teilen würde, aber bisher nicht den Mut dazu gefunden hat? ',

    'Wer hat sich schon einmal in einer Beziehung oder Freundschaft nicht getraut, die Wahrheit auszusprechen, weil er/sie Angst vor den Konsequenzen hatte? ',

    'Welche Person hat sich in der Vergangenheit für eine wichtige Sache oder einen persönlichen Wert eingesetzt, obwohl es unangenehme Folgen hatte? ',

    'Wer hat schon einmal eine Chance verpasst, die sein/ihr Leben hätte verändern können, und bereut es zutiefst? ',

    'Welche Person hat eine unerfüllte Sehnsucht oder einen Traum, den sie bisher aus Angst oder Unsicherheit nicht verfolgt hat? ',

    'Wer hat schon einmal das Vertrauen einer wichtigen Person in seinem/ihrem Leben enttäuscht und kämpft seitdem damit, sich zu vergeben? ',

    'Welche Person hat ein starkes Bedürfnis nach Anerkennung und Bestätigung von anderen, das sich manchmal in ungesunden Verhaltensweisen äußert? ',

    'Wer hat sich schon einmal in einer Situation befunden, in der er/sie nicht mehr weiterwusste und jemand Fremdes ihm/ihr geholfen hat? ',

    'Welche Person hat eine außergewöhnliche Fähigkeit oder Begabung, die sie bisher nicht richtig genutzt hat? ',

    'Wer hat schon einmal eine riskante Entscheidung getroffen, die von anderen als unvernünftig oder gefährlich angesehen wurde? ',

    'Welche Person hat schon einmal für jemand anderen große Opfer gebracht, die niemand sonst bemerkt hat? ',

    'Wer hat sich schon einmal so verzweifelt gefühlt, dass er/sie an Selbstmord gedacht hat oder professionelle Hilfe in Anspruch nehmen musste? ',

    'Welche Person hat sich in der Vergangenheit so sehr verändert, dass sie sich manchmal selbst nicht mehr erkennt? ',

    'Wer hat schon einmal jemandem eine zweite Chance gegeben, obwohl die meisten anderen es nicht getan hätten? ',

    'Welche Person hat schon einmal eine tiefe spirituelle Erfahrung gemacht, die sie nicht erklären kann? ',

    'Wer hat sich schon einmal in einer persönlichen Krise an einen Fremden gewandt und wurde positiv überrascht? ',

    'Welche Person hat schon einmal eine Situation erlebt, in der sie anfing, an sich selbst zu zweifeln? ',

    'Wer hat schon einmal eine schwere Entscheidung getroffen, die sein/ihr Leben in eine völlig neue Richtung gelenkt hat? ',

    'Welche Person hat eine versteckte Leidenschaft oder Interesse, das bisher niemand in ihrem Umfeld vermutet hätte? ',

    'Wer hat schon einmal vergessen, wo er/sie sein Auto auf einem riesigen Parkplatz geparkt hat? ',

    'Welche Person hat die verrücktesten Spitznamen für ihre Haustiere? ',

    'Wer hat schon einmal ein lustiges Missgeschick erlebt, das er/sie mit niemandem teilen wollte? ',

    'Welche Person hat die witzigsten Tanzmoves und kann sie vorführen? ',

    'Wer hat schon einmal eine peinliche Situation erlebt, die im Nachhinein lustig war? ',

    'Welche Person hat eine ausgefallene Talentshow-Einlage auf Lager? ',

    'Wer hat schon einmal eine komische Situation in einem Aufzug erlebt? ',

    'Welche Person hat die lustigsten Geschichten aus ihrer Kindheit zu erzählen? ',

    'Wer hat schon einmal einen verrückten Traum gehabt und kann ihn witzig schildern? ',

    'Welche Person hat die lustigsten Witze auf Lager und kann sie zum Besten geben? ',

    'Wer hat schon einmal eine komische Textnachricht an die falsche Person geschickt? ',

    'Welche Person hat die besten lustigen Anekdoten von ihren Reisen zu erzählen? ',

    'Wer hat schon einmal einen lustigen Streich gespielt, der allen in Erinnerung geblieben ist? ',

    'Welche Person hat eine skurrile und lustige Sammlung von Gegenständen? ',

    'Wer hat schon einmal ein urkomisches Missverständnis gehabt und kann es schildern? ',

    'Welche Person hat die lustigsten Haustiergeschichten zu erzählen? ',

    'Wer hat schon einmal eine lustige Verkleidung oder Kostümierung getragen? ',

    'Welche Person hat schon einmal einen witzigen Dialog zwischen sich und ihrem Haustier simuliert? ',

    'Wer hat schon einmal einen lustigen YouTube-Videoclip entdeckt und kann ihn der Gruppe zeigen? ',

    'Welche Person hat die ausgefallensten und witzigsten Reaktionen auf Stresssituationen? ',

    'Wer hat schon einmal eine peinliche Situation mit einem Körperteil erlebt, das verrückt gespielt hat? ',

    'Welche Person hat die witzigsten und kreativsten Ausreden für Dinge, die sie vergessen hat? ',

    'Wer hat schon einmal versehentlich etwas im Laden kaputt gemacht und ist dann schnell weggeschlichen? ',

    'Welche Person hat die witzigsten Schnappschüsse von sich selbst beim Versuch, das perfekte Selfie zu machen? ',

    'Wer hat schon einmal eine lustige Panne mit einem technischen Gerät oder einer App erlebt? ',

    'Welche Person hat die besten und lustigsten Tiergeräusche drauf und kann sie vormachen? ',

    'Wer hat schon einmal ein lustiges Missgeschick in der Küche erlebt, das wie ein Comedy-Sketch aussah? ',

    'Welche Person hat eine peinliche Begegnung mit einem Prominenten gehabt und kann sie erzählen? ',

    'Wer hat schon einmal einen komischen und unerwarteten Klingelton auf seinem Handy gehabt? ',

    'Welche Person hat die lustigsten Geschichten von ihren Versuchen, ein Haustier zu dressieren? ',

    'Wer hat schon einmal eine witzige Verkleidung getragen und dabei alle zum Lachen gebracht? ',

    'Welche Person hat einen urkomischen Witz auf Lager, der immer für Lacher sorgt? ',

    'Wer hat schon einmal eine witzige Panne bei einer sportlichen Aktivität erlebt? ',

    'Welche Person hat die lustigsten Kinderzitate oder Ausreden von ihren eigenen Kindern gesammelt? ',

    'Wer hat schon einmal bei einem öffentlichen Auftritt eine komische oder peinliche Bemerkung gemacht? ',

    'Welche Person hat die besten Anekdoten von ihren Erfahrungen mit öffentlichen Verkehrsmitteln? ',

    'Wer hat schon einmal eine witzige Herausforderung in einem Videospiel gemeistert? ',

    'Welche Person hat die lustigsten Trinkspiele oder Partyspiele auf Lager? ',

    'Wer hat schon einmal eine lustige und unerwartete Reaktion auf eine Achterbahnfahrt gezeigt? ',

    'Welche Person hat die lustigsten TikTok- oder Internet-Trends ausprobiert und dabei für Lacher gesorgt? ',
    // Add more general questions here
  ];

export default manyQuestions;