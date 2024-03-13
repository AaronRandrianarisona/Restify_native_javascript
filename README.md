## Statut du travail

# Projet 1 (sans MongoDB)
toutes les test dans "./tests" et toutes les fonctionnalités sont implémentés

# Projet 2 (avec MongoDB & Mongoose)
la connexion à la base de donnée de mongoDB fonctionne
la chargement des fichiers json dans ./data pour remplir la BDD fonctionne


**Remarque:**: il y un ajout automatique d'un numero de version et d'un identifiant lié à l'objet qu'on veut sauvegarder (les attributs "__v" et "_id") lors de leur persistance.
Comme cet identifiant est généré par Mongoose et pas forcement le meme, j'ai donc fait des modifications dans les fichiers tests pour récupérer les "__v" et "_id" qui de chaque element à tester.


touts les test dans "./tests" fonctionnent