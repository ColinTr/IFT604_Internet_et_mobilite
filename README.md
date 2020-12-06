# Introduction
Ce projet de session a été réalisé dans le cadre du cours IFT717 - Applications Internet & Mobilité.<br/>
Notre groupe est constitué de :
- Colin Troisemaine (matricule 20 088 209)
- Guillaume Bouchard (matricule 20 100 748)
- Alexandre Turpin (matricule 20 088 156)
- Quentin Levieux (matricule 20 102 087)
- Adrien Verdier (matricule 20 088 959)


# Structure du projet

    ├── README.md                   <- Le README du plus haut niveau qui décrit la structure du projet
    │
    ├── application_android         <- Le projet du client Android
    │   └── app.src
    │       ├── androidTest
    │       └── main.java.com.example.koboard
    │           |   ├── httpUtils
    │           |   ├── model
    │           |   └── notification
    │           |   └── resources
    │           |   └── services
    │           |   └── ui
    │           └── test
    │
    ├── serveur_express             <- Le serveur express backend (notre API)
    │   ├── README.md
    │   ├── public                  
    │   └── src
    │       ├── controllers         <- Implémentation de la logique des routes
    │       ├── models              <- Modèle des objets de la BDD
    │       ├── routes              <- Définition des routes
    │       ├── services            <- Méthodes de gestion de la BDD
    │       └── utils               <- Fichiers de configuration et méthodes utilitaires
    │       └── app.js
    │
    ├── serveur_react               <- Le client Web frontend
    │   ├── README.md
    │   ├── public
    │   └── src
    │       ├── assets
    │       ├── components
    │       └── routes