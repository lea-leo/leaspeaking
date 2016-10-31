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

Pour installer la partie speaker sur Ubuntu il faut ajouter
```javascript
sudo apt-get install libasound2-dev
```
Ensuite il suffit d'installer simplement leaspeaking ainsi

```javascript
npm install leaspeaking
```

Pour installer la paartie speaker sur Windows il faut ajouter
npm install --global --production windows-build-tools
avoir Python => voir https://github.com/nodejs/node-gyp

## Connexion avec l'enceinte bluetooth

Pour configurer une connexion auto du device, il faut ajouter AutoConnect=true au fichier /etc/bluetooth/audio.conf
Si le fichier existe pas il faut le créer.
Afin d'assurer la connexion auto il faut que le démon pulseaudio soit opérationnel pour cela, taper :
```shell
pulseaudio -k (pour l'arrêter)
pulseaudio --start (pour le démarrer)
```

Afin de désigner notre enceinte comme enceinte par défaut
```
pacmd set-default-sink bluez_sink.xx_xx_xx_xx_xx_xx (où est l'adresse MAC de l'enceinte, avec des _ au lieu des :)
pacmd set-default-sink bluez_sink.40_EF_4C_DF_D5_D3 (pour notre cas précis)
```

A noter qu'il est possible de faire une connexion manuelle avec l'aide de bluetoothctl puis connect <adresseMAC>

## Fonctionnalités OK

  * Reçoit les tweets
  * Stocke les tweets nouveau dans une file d'attente
  * Effectue les salutations d'usage au démarrage
  * Détecte le tweet gagnant
  * Ecris au gagnant sur son mur Twitter
  * Les paliers gagnants sont dynamiques
  * Joue un son aléatoire pour chaque tweet
  * Remercie le gagnant de façon sonore
  * EasterEggs OK pour les ADMINS selon certains mots clés
  * Détecter automatiquement le port de connexion
  * Détection automatique de l'enceinte bluetooth

## RAF

  * gérer le défilement du tweet => Sans objet
  * fixer le temps d'affichage du tweet => Temps fixé par le Rpi
  * Supprimer dans le script arduino tout les caractères non alpha-numérique


## Remarques diverses

Le code ne fonctionne que pour un Arduino Leonardo. Pour le Uno il faut utiliser la branche avec la librairie python.
L'écriture sur le port serial se fait à l'aide de python car la librairie npm serialport gère mal le DTR ce qui a pour effet de faire reseter l'arduino lors du premier appel. J'ai fais une demande de support sur leur github.
Avec le Léonardo, il est possible d'utiliser le module serialport.

La communication Arduino->Rpi a été testé avec succès. Donc pas de souci pour avoir un feedback de l'affichage du tweet.



