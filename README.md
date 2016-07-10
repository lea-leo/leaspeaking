# leaspeaking
Module de discussion par tweet pour Léa

Vous devez ajouter les clés suivantes à vos variables d'environnement :
  * **TWITTER_CONSUMER_KEY**
  * **TWITTER_CONSUMER_SECRET**
  * **TWITTER_ACCESS_TOKEN_KEY**
  * **TWITTER_ACCESS_TOKEN_SECRET**

Il s'agit de vos credentials Twitter.

L'écriture sur le port serial se fait à l'aide de python car la librairie npm serialport gère mal le DTR ce qui a pour effet de faire reseter l'arduino lors du premier appel. J'ai fais une demande de support sur leur github.

RAF :
  * gérer le défilement du tweet
  * fixer le temps d'affichage du tweet
  * Bufferiser les tweets

La communication Arduino->Rpi a été testé avec succès. Donc pas de souci pour avoir un feedback de l'affichage du tweet.
