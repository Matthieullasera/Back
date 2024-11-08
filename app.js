const express = require('express');
const mongoose = require('mongoose');
const app = express();

const userRoutes = require('./models/user');
const auth = require('./models/auth');

app.use(express.json());

mongoose.connect('mongodb+srv://matthieutest:test1234@cluster0.c3s75.mongodb.net/',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes); // Routes pour l'authentification

// Route publique pour afficher les livres sans authentification
app.get('/api/books', (req, res, next) => {
  const books = [
    {
      _id: 'book1',
      userId: 'user12345',
      title: 'Voyage au bout de la nuit',
      author: 'Louis-Ferdinand Céline',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      year: 1932,
      genre: 'Roman',
      ratings: [
        { userId: 'user67890', grade: 5 },
        { userId: 'user54321', grade: 4 }
      ],
      averageRating: 4.5
    },
    {
      _id: 'book2',
      userId: 'user67890',
      title: 'L’étranger',
      author: 'Albert Camus',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      year: 1942,
      genre: 'Roman philosophique',
      ratings: [
        { userId: 'user12345', grade: 4 },
        { userId: 'user98765', grade: 5 }
      ],
      averageRating: 4.5
    }
  ];

  res.status(200).json(books);
});

// Route protégée pour créer un livre (requiert l'authentification)
app.post('/api/books', auth, (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body,
    userId: req.auth.userId
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;
