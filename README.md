# leaspeaking
Module de discussion par tweet pour Léa

## Pré-requis à l'utilisation du module


### Credentials Twitter

Vous devez ajouter les clés suivantes à vos variables d'environnement :
  * **TWITTER_CONSUMER_KEY**
  * **TWITTER_CONSUMER_SECRET**
  * **TWITTER_ACCESS_TOKEN_KEY**
  * **TWITTER_ACCESS_TOKEN_SECRET**

Il s'agit de vos credentials Twitter.

### Installation

Pour installer la paartie speaker sur Ubuntu il faut ajouter
sudo apt-get install libasound2-dev

Pour installer la paartie speaker sur Windows il faut ajouter
npm install --global --production windows-build-tools
avoir Python => voir https://github.com/nodejs/node-gyp

## Fonctionnalités OK

  * Reçoit les tweets
  * Stocke les tweets nouveau dans une file d'attente
  * Effectue les salutations d'usage au démarrage
  * Détecte le tweet gagnant
  * Ecris au gagnant sur son mur Twitter
  * Les paliers gagnants sont dynamique
  * Joue un son aléatoire pour chaque tweet
  * Remercie le gagnant de façon sonore
  * EasterEggs OK pour les admins selon certains mots clés

## RAF

  * gérer le défilement du tweet => Sans objet
  * fixer le temps d'affichage du tweet => Temps fixé par le Rpi
  * Détecter automatiquement le port de connexion (à faire en JS ou python)


## Remarques diverses

Le code ne fonctionne que pour un Arduino Leonardo. Pour le Uno il faut utiliser la branche avec la librairie python.
L'écriture sur le port serial se fait à l'aide de python car la librairie npm serialport gère mal le DTR ce qui a pour effet de faire reseter l'arduino lors du premier appel. J'ai fais une demande de support sur leur github.
Avec le Léonardo, il est possible d'utiliser le module serialport.

La communication Arduino->Rpi a été testé avec succès. Donc pas de souci pour avoir un feedback de l'affichage du tweet.

