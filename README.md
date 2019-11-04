# GAIA web client

Prototyp eines (mobile-fähigen) Web Clients mit dem Bauern ihre Felder erfassen können. Entwickelt im Rahmen des INNOQ Hands-On Events am 24./25.10.2018 für [GaiaGreenhouses](https://www.facebook.com/GaiaGreenhouses/).

## Verwendung

Der aktuelle Stand ist auf [Google Firebase] deployed und kann wie folgt verwendet werden:

1. aufrufen der [Login-Maske](https://gaia-ce696.web.app/login.html) (Muss leider aktuell noch explizit aufgerufen werden)
2. E-Mail-Adresse eingeben und *Next* klicken
3. in der erhaltenen E-Mail den *Sign-in to project...* Link klicken
4. im Popup-Dialog dieselbe E-Mail-Adresse erneut eingeben (minimale Sicherheit) und mit *OK* bestätigen 
5. es erscheint automatisch die Maske zur Erfassung eines neuen Feldes
6. in der Sateliten-Ansicht mit der Maus die Eckpunkte des Feldes auswählen (zum Abschließen den Startpunkt erneut auswählen)
7. in der Drop-Down-Box das angebaute Getreide/Gemüse auswählen (aktuell nur Kartoffeln und Mais)
8. mit *Done* die Eingabe abschließen und das Feld speichern

Leider gibt es bisher keine Erfolgs- oder Fehlermeldung zum Speichern. Auch gibt es noch keine Übersicht/Liste der gespeicherten Felder.

Die gespeicherten Feldnamen können in der [Firebase Web Console](https://console.firebase.google.com/project/gaia-ce696/database/gaia-ce696/data) eingesehen werden. Die Authentifizierung erfolgt über einen Google Account der dem Projekt zugeordnet sein muss.


## Verwendete Technologien

für den Web Client

* HTML/JavaScript
* [OpenLayers](https://openlayers.org/)
* [Bootstrap](https://getbootstrap.com/)
* npm, parcel-bundler

Authentifizierung/Autorisierung, Persistence, Hosting

* [Google Firebase]


## Firebase

Um Firebase zu nutzen muss die CLI installiert werden und man muss sich einloggen:

    npm install -g firebase-tools
    firebase login

Dazu muss ein Google-Account vorhanden sein und zum Projekt hinzugefügt werden

## Deployment

    npm run-script deploy

---
[Google Firebase]: https://firebase.google.com/