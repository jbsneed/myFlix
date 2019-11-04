const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  uuid = require('uuid'),
  passport = require('passport'),
  cors = require('cors');

const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;

require('./passport.js');

const Movies = Models.Movie;
const Users = Models.User;

/*mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true
});*/

mongoose.connect(
  'mongodb+srv://myFlixDBadmin:Jamey02!@cluster0-dlnqj.mongodb.net/myFlixDB?retryWrites=true&w=majority',
  {
    useNewUrlParser: true
  }
);

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use(cors());
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something ain\'t working right!');
});

var auth = require('./auth.js')(app);

// Gets the list of data about ALL movies
app.get('/movies', function(req, res) {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Gets the data about a single movie by name
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Movies.findOne({ Title: req.params.Title })
      .then(function(movie) {
        res.json(movie);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Gets the data about a single genre by name
app.get(
  '/movies/genres/:Name',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then(function(movies) {
        res.json(movies.Genre.Description);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Gets the data about a single director by name
app.get(
  '/movies/directors/:Name',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then(function(movies) {
        res.json(movies.Director);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Adds data for a new user to our list of users
app.post(
  '/users',
  [
    check('Username', 'Username is required')
      .not()
      .isEmpty(),
    check(
      'Username',
      'Username must contain only alphanumeric characters'
    ).isAlphanumeric(),
    check('Password', 'Password is required')
      .not()
      .isEmpty(),
    check('Password', 'Password must be at least 8 characters.').isLength({
      min: 8
    }),
    check('Email', 'Valid email is required').isEmail()
  ],
  (req, res) => {
    //check the validation object for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then(function(user) {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(function(user) {
              res.status(201).json(user);
            })
            .catch(function(error) {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch(function(error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//Get ALL users
app.get('/users', passport.authenticate('jwt', { session: false }), function(
  req,
  res
) {
  Users.find()
    .then(function(users) {
      res.status(201).json(users);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get a user by username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOne({ Username: req.params.Username })
      .then(function(user) {
        res.json(user);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Update a user's info, by username
/* We'll expect JSON in this format
{
Username:String,(required)
Password:String,(required)
Email: String, (required)
Birthday: Date
}*/
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required.')
      .not()
      .isEmpty(),
    check(
      'Username',
      'Username must contain only alphanumeric characters'
    ).isAlphanumeric(),
    check('Password', 'Password is required')
      .not()
      .isEmpty(),
    check('Password', 'Password must be at least 8 characters.').isLength({
      min: 8
    }),
    check('Email', 'Valid email is required').isEmail()
  ],
  function(req, res) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, //This line makes sure that the updated document is returned
      function(err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.send(
            'Information for username "' +
              req.params.Username +
              '" has been updated.'
          );
        }
      }
    );
  }
);

// Allows users to add a movie to their list of favorites
app.post(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, //This line makes sure that the updated document is returned
      function(err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res
            .status(200)
            .send(
              'The movie with the ID "' +
                req.params.MovieID +
                '" has been added to your favorites.'
            );
        }
      }
    );
  }
);

// Allows users to delete a movie from their list of favorites
app.delete(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, //This line makes sure that the updated documents is returned
      function(err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res
            .status(200)
            .send(
              'The movie with the ID "' +
                req.params.MovieID +
                '" has been deleted from your favorites.'
            );
        }
      }
    );
  }
);

// Allows existing users to deregister
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(function(user) {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found.');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Index
app.get('/', function(req, res) {
  res.send(
    'Welcome to myFlix - an app full of information about your favorite films.'
  );
});

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function() {
  console.log('Listening on Port 3000.');
});
