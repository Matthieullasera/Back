const Book = require('../models/book');


exports.getOneBook = (req, res, next) => {
    Book.findOne({
      _id: req.params.id
    }).then(
      (book) => {
        res.status(200).json(book);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);  
  delete bookObject._id;
  delete bookObject._userId;
  
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
    book.save()
    .then(() => { res.status(201).json({message: 'livre enregistré !'})})
    .catch(error => {
      console.error('Erreur lors de la sauvegarde :', error);
      res.status(400).json({ error });
 });
};

exports.createRateBook = (req, res, next) => {
  const userId = req.auth.userId; 
  const { rating } = req.body; 

  if (typeof rating !== 'number' || rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }

      
      const hasRated = book.ratings.some((rate) => rate.userId === userId);
      if (hasRated) {
        return res.status(403).json({ message: 'Vous avez déjà noté ce livre.' });
      }
      book.ratings.push({ userId: userId, grade: rating });
      const totalRatings = book.ratings.length;
      const totalGrade = book.ratings.reduce((sum, rate) => sum + rate.grade, 0);
      book.averageRating = totalGrade / totalRatings;


      book.save()
        .then((updatedBook) => {
          res.status(200).json(updatedBook); 
        })
        .catch((error) => {
          console.error('Erreur de mise à jour de la note :', error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.error('Erreur lors de la recherche du livre :', error);
      res.status(500).json({ error });
    });
};


  exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
  };
  
exports.deleteBook = (req, res, next) => {
    Book.deleteOne({_id: req.params.id}).then(
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
  
      
    );
  };
  
 exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(
      (books) => {
        res.status(200).json(books);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  
 exports.bestRatingBook = (req, res, next) => {
    Book.find()
    .sort({ averageRating: -1 })
    .limit(3) 
    .then((books) => {
      res.status(200).json(books); 
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
  };


  