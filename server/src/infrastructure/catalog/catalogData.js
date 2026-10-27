// Données du catalogue : catégorie → difficulté → questions
// answer = index de la bonne réponse dans options
export const catalog = [
  {
    name: 'Musique',
    questions: {
      facile: [
        { question: 'Combien de cordes compte une guitare classique ?', options: ['4', '8', '6', '12'], answer: 2 },
        { question: 'Quel groupe a interprété « Bohemian Rhapsody » ?', options: ['Queen', 'The Beatles', 'ABBA', 'The Rolling Stones'], answer: 0 },
        { question: 'Quel chanteur est surnommé « le King » ?', options: ['Michael Jackson', 'Johnny Hallyday', 'Frank Sinatra', 'Elvis Presley'], answer: 3 },
        { question: 'Combien de notes compte la gamme (do, ré, mi, fa, sol, la, si) ?', options: ['5', '7', '8', '12'], answer: 1 },
        { question: 'Quel instrument possède des touches noires et blanches ?', options: ['Le violon', 'La batterie', 'Le piano', 'La harpe'], answer: 2 },
      ],
      moyen: [
        { question: 'Qui a composé « Les Quatre Saisons » ?', options: ['Mozart', 'Vivaldi', 'Bach', 'Beethoven'], answer: 1 },
        { question: 'De quel pays est originaire le groupe ABBA ?', options: ['Norvège', 'Danemark', 'Suède', 'Finlande'], answer: 2 },
        { question: "Quel album de Michael Jackson est le plus vendu de l'histoire ?", options: ['Thriller', 'Bad', 'Off the Wall', 'Dangerous'], answer: 0 },
        { question: 'Quelle chanteuse a interprété « La Vie en rose » ?', options: ['Barbara', 'Dalida', 'Juliette Gréco', 'Édith Piaf'], answer: 3 },
        { question: 'Combien de musiciens composent un quatuor ?', options: ['3', '5', '4', '6'], answer: 2 },
      ],
      difficile: [
        { question: 'Combien de symphonies Beethoven a-t-il achevées ?', options: ['5', '7', '9', '12'], answer: 2 },
        { question: 'En quelle année le festival de Woodstock a-t-il eu lieu ?', options: ['1969', '1967', '1971', '1973'], answer: 0 },
        { question: "Quel compositeur a écrit l'opéra « Carmen » ?", options: ['Verdi', 'Bizet', 'Puccini', 'Offenbach'], answer: 1 },
        { question: 'Quel est le vrai nom de Freddie Mercury ?', options: ['Frederick Mercer', 'Fred Bulsar', 'Farid Mercurio', 'Farrokh Bulsara'], answer: 3 },
        { question: 'Combien de touches compte un piano standard ?', options: ['76', '88', '92', '104'], answer: 1 },
      ],
    },
  },
  {
    name: 'Culture générale',
    questions: {
      facile: [
        { question: 'Combien de jours compte une année bissextile ?', options: ['365', '364', '366', '367'], answer: 2 },
        { question: 'Quelle planète est surnommée la planète rouge ?', options: ['Mars', 'Jupiter', 'Vénus', 'Saturne'], answer: 0 },
        { question: 'Qui a peint « La Joconde » ?', options: ['Michel-Ange', 'Raphaël', 'Picasso', 'Léonard de Vinci'], answer: 3 },
        { question: "Quel est l'animal terrestre le plus rapide ?", options: ['Le lion', 'Le guépard', 'Le cheval', "L'antilope"], answer: 1 },
        { question: 'Combien de côtés a un hexagone ?', options: ['5', '8', '6', '7'], answer: 2 },
      ],
      moyen: [
        { question: 'En quelle année a eu lieu la prise de la Bastille ?', options: ['1789', '1792', '1776', '1804'], answer: 0 },
        { question: "Quel est le symbole chimique de l'or ?", options: ['Or', 'Ag', 'Go', 'Au'], answer: 3 },
        { question: 'Qui a écrit « Les Misérables » ?', options: ['Émile Zola', 'Victor Hugo', 'Honoré de Balzac', 'Gustave Flaubert'], answer: 1 },
        { question: 'Quel est le plus grand océan du monde ?', options: ['Atlantique', 'Indien', 'Pacifique', 'Arctique'], answer: 2 },
        { question: "Combien d'os compte le corps humain adulte ?", options: ['206', '186', '226', '256'], answer: 0 },
      ],
      difficile: [
        { question: 'En quelle année le mur de Berlin est-il tombé ?', options: ['1987', '1991', '1989', '1990'], answer: 2 },
        { question: 'Quel élément chimique a pour symbole « K » ?', options: ['Le krypton', 'Le potassium', 'Le calcium', 'Le carbone'], answer: 1 },
        { question: 'Qui a été le premier président de la Ve République ?', options: ['Georges Pompidou', 'Vincent Auriol', 'René Coty', 'Charles de Gaulle'], answer: 3 },
        { question: 'Quelle est la vitesse approximative de la lumière dans le vide ?', options: ['300 000 km/s', '150 000 km/s', '30 000 km/s', '1 000 000 km/s'], answer: 0 },
        { question: 'Quel philosophe a écrit « Le Discours de la méthode » ?', options: ['Pascal', 'Descartes', 'Voltaire', 'Rousseau'], answer: 1 },
      ],
    },
  },
  {
    name: 'Cinéma',
    questions: {
      facile: [
        { question: 'Qui a réalisé « Titanic » (1997) ?', options: ['Steven Spielberg', 'James Cameron', 'Ridley Scott', 'Christopher Nolan'], answer: 1 },
        { question: 'Comment s’appelle le jeune sorcier à lunettes créé par J.K. Rowling ?', options: ['Harry Potter', 'Gandalf', 'Merlin', 'Dumbledore'], answer: 0 },
        { question: 'Dans « Le Roi Lion », comment s’appelle le père de Simba ?', options: ['Scar', 'Rafiki', 'Mufasa', 'Timon'], answer: 2 },
        { question: 'Quel personnage de Star Wars révèle « Je suis ton père » ?', options: ['Yoda', 'Obi-Wan Kenobi', 'Luke Skywalker', 'Dark Vador'], answer: 3 },
        { question: 'Quel studio a créé Mickey Mouse ?', options: ['Pixar', 'DreamWorks', 'Disney', 'Warner Bros'], answer: 2 },
      ],
      moyen: [
        { question: 'Quelle récompense est décernée au meilleur film du Festival de Cannes ?', options: ["L'Ours d'or", "Le Lion d'or", "La Palme d'or", 'Le César'], answer: 2 },
        { question: 'Qui a réalisé « Pulp Fiction » ?', options: ['Quentin Tarantino', 'Martin Scorsese', 'Guy Ritchie', 'David Fincher'], answer: 0 },
        { question: 'Quel acteur incarne Jack Sparrow dans « Pirates des Caraïbes » ?', options: ['Orlando Bloom', 'Brad Pitt', 'Johnny Depp', 'Leonardo DiCaprio'], answer: 2 },
        { question: 'Dans « Matrix », quelle pilule Neo choisit-il ?', options: ['La bleue', 'La rouge', 'La verte', 'Aucune'], answer: 1 },
        { question: 'Quel film de 2011 réunit Omar Sy et François Cluzet ?', options: ['Bienvenue chez les Ch’tis', 'Le Dîner de cons', 'Les Visiteurs', 'Intouchables'], answer: 3 },
      ],
      difficile: [
        { question: 'Quel film a remporté le tout premier Oscar du meilleur film (1929) ?', options: ['Les Ailes', 'Metropolis', 'Le Chanteur de jazz', 'Ben-Hur'], answer: 0 },
        { question: 'Qui a réalisé « Le Voyage dans la Lune » (1902) ?', options: ['Les frères Lumière', 'Georges Méliès', 'Charlie Chaplin', 'Jean Renoir'], answer: 1 },
        { question: "Combien d'Oscars a remporté « Le Seigneur des anneaux : Le Retour du roi » ?", options: ['7', '9', '11', '13'], answer: 2 },
        { question: 'Quel réalisateur a créé « Le Voyage de Chihiro » ?', options: ['Akira Kurosawa', 'Isao Takahata', 'Mamoru Hosoda', 'Hayao Miyazaki'], answer: 3 },
        { question: 'Dans quel film entend-on « Here’s looking at you, kid » ?', options: ['Casablanca', 'Autant en emporte le vent', 'Citizen Kane', 'Vertigo'], answer: 0 },
      ],
    },
  },
  {
    name: 'Voyage',
    questions: {
      facile: [
        { question: 'Dans quelle ville se trouve la tour Eiffel ?', options: ['Lyon', 'Paris', 'Marseille', 'Bruxelles'], answer: 1 },
        { question: "Quelle est la capitale de l'Italie ?", options: ['Milan', 'Venise', 'Rome', 'Naples'], answer: 2 },
        { question: 'Quelle monnaie utilise-t-on au Japon ?', options: ['Le yuan', 'Le won', 'Le yen', 'Le baht'], answer: 2 },
        { question: 'Dans quel pays se trouvent les pyramides de Gizeh ?', options: ['Maroc', 'Mexique', 'Jordanie', 'Égypte'], answer: 3 },
        { question: "Quel pays a la forme d'une botte ?", options: ["L'Italie", "L'Espagne", 'La Grèce', 'Le Portugal'], answer: 0 },
      ],
      moyen: [
        { question: "Quelle est la capitale de l'Australie ?", options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], answer: 2 },
        { question: 'Dans quelle ville se trouve la statue du Christ Rédempteur ?', options: ['Rio de Janeiro', 'São Paulo', 'Lisbonne', 'Buenos Aires'], answer: 0 },
        { question: 'Quel est le plus long fleuve de France ?', options: ['La Seine', 'Le Rhône', 'La Garonne', 'La Loire'], answer: 3 },
        { question: 'Dans quel pays peut-on visiter le Machu Picchu ?', options: ['Bolivie', 'Pérou', 'Chili', 'Équateur'], answer: 1 },
        { question: 'Quelle est la capitale du Canada ?', options: ['Toronto', 'Montréal', 'Vancouver', 'Ottawa'], answer: 3 },
      ],
      difficile: [
        { question: 'Quel est le plus petit pays du monde ?', options: ['Monaco', 'Le Vatican', 'Saint-Marin', 'Le Liechtenstein'], answer: 1 },
        { question: 'Quelle est la capitale de la Mongolie ?', options: ['Oulan-Bator', 'Astana', 'Bichkek', 'Tachkent'], answer: 0 },
        { question: 'Dans quel pays se trouve le site antique de Petra ?', options: ['Égypte', 'Liban', 'Jordanie', 'Syrie'], answer: 2 },
        { question: "Quel est le point culminant de l'Afrique ?", options: ['Le mont Kenya', 'Le Kilimandjaro', 'Le Ras Dashen', 'Le mont Stanley'], answer: 1 },
        { question: 'Combien de fuseaux horaires couvre la Russie ?', options: ['7', '9', '11', '13'], answer: 2 },
      ],
    },
  },
]
