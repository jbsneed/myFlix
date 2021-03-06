const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  uuid = require('uuid'),
  passport = require('passport'),
  cors = require('cors'),
  path = require('path');

const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;

require('./passport.js');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true
// });

mongoose.connect(
  'mongodb+srv://myFlixDBadmin:Jamey02!@cluster0-dlnqj.mongodb.net/myFlixDB?retryWrites=true&w=majority',
  {
    useNewUrlParser: true
  }
);

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static(path.resolve('dist')));
app.use(cors());
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something ain\'t working right!');
});

var auth = require('./auth.js')(app);

/**
 * /movies returns a list of all movies
 * endpoint URL: /movies
 * GET request
 * no required params
 * example request:
 * @function getMovies(token){
 * axios
 * .get("https://myflix247365.herokuapp.com/movies",{ 
 * headers:{Authorization: `Bearer ${token}`}
 * })
 * .then(response=>{
 * this.props.setMovies(response.data);
 * })
 * .catch(function(error){
 * console.log(error);
 * });
 * }
 * example response:
 * 
 * @param {string} _id
 * @param {string} Title
 * @param {string} Description
 * @param {string} director
 * @param {string} genre
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Gets the data about a single movie by name
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Movies.findOne({ Title: req.params.Title })
      .then(function (movie) {
        res.json(movie);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Gets the data about a single genre by name
app.get(
  '/movies/genres/:Name',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then(function (movies) {
        res.json(movies.Genre.Description);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Gets the data about a single director by name
app.get(
  '/movies/directors/:Name',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then(function (movies) {
        res.json(movies.Director);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/** 
 * /users endpoint allows users to register
 * endpoint URL: /users
 * POST request
 * params required:
 * @params {string} username
 * @params {string} password
 * @params {string} email
 * @params {date} birthday
 * @constant handleSubmit
 * example request:
 * @function handleRegister = (e) => {
 * e.preventDefault();
 * axios.post('https://myflix247365.herokuapp.com/users', {
 * username: username,
 * email: email,
 * birthday: birthday,
 * password: password
 * })
 * .then(response =>{
 * const data= response.data;
 * console.log(data);
 * window.location.assign('/');
 * })
 * .catch(error =>{
 * console.error('Error registering the user.', err)
 * });
 * }
 * example response:
 * @param {object} user
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {date} birthday
*/
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
      .then(function (user) {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(function (user) {
              res.status(201).json(user);
            })
            .catch(function (error) {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//Get ALL users
app.get('/users', passport.authenticate('jwt', { session: false }), function (
  req,
  res
) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get a user by username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOne({ Username: req.params.Username })
      .then(function (user) {
        res.json(user);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * endpoint /users/:username allows users to update their information
 * endpoint URL: /users/:username
 * PUT request
 * @params {string} username
 * @params {string} password
 * @params {string} email
 * @params {date} birthday
 * example request:
 * @function handleUpdate = (e) =>{
 * e.preventDefault();
 * const userInfo = {
 * Username: username,
 * Password: password,
 * Email: email,
 * Birthday: birthday
 * };
 * axios.put(`/users/@{user}`, userInfo,
 * {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
 * )}
 * .then(response =>{
 * const data = response.data;
 * props.updateUser(data);
 * alert('Your profile was updated.');
 * window.open('/','_self');
 * })
 * .catch(function (error){
 * console.log(error);
 * });
 * }
 * example response:
 * @param {object} userInfo
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {date} birthday
 */
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
  function (req, res) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, //This line makes sure that the updated document is returned
      function (err, updatedUser) {
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

/** 
 * /users/:username/movies/:movieID endpoint adds a movie to users favorites
 * endpoint URL: /users/:username/movies/:movieID
 * @param {ObjectId} _id
 * @param {string} username
 * @function addMovieToFavorites(e){
 * e.preventDefault();
 * axios.post(`/users/${localStorage.getItem('user')}/Movies/${movie._id}`,{
 * Username: localStorage.getItem('user')
 * }, {
 * header: {Authorization: `Bearer ${localStorage.getItem('token')}`}
 * }).then(response =>{
 * console.log(response);
 * alert('Added to Favorites.');
 * }).catch(event=>{
 * console.log('Error adding movie to your favorites.');
 * alert('Error adding movie to your favorites.');
 * });
 * }
 * example response:
 * JSON of users updated list of favorite movies
 */
app.post(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, //This line makes sure that the updated document is returned
      function (err, updatedUser) {
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

/**
 * allows user to delete a movie from list of favorites
 * endpoint URL: /users/:Username/Movies/:MovieID
 * DELETE REQUEST
 * @param {ObjectId} _id
 * @param {string} user
 * example request:
 * @function deleteFavoriteMovie(event, favoriteMovie){
 * event.preventDefault();
 * axios.delete(`/users/${localStorage.getItem('user')}/Movies/${favoriteMovie}`, {
 * headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
 * }).then(response =>{
 * console.log(response);
 * window.open('/users/:Username','_self');
 * alert('Deleted from favorites.');
 * }).catch(event =>{
 * console.log('Error deleting movie from favorites.');
 * alert('Error deleting movie from favorites.');
 * });
 * }
 * example response:
 * JSON of user's updated list of favorites
 */
app.delete(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, //This line makes sure that the updated documents is returned
      function (err, updatedUser) {
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

/**
 * allows user to delete profile
 * endpoint URL: /users/:Username
 * DELETE request
 * @param {string} user
 * example request:
 * @function handleDelete = (e) =>{
 * e.preventDefault();
 * axios.delete(`/users/${user}`,{
 * header: {Authorization: `Bearer ${localStorage.getItem('token')}`}
 * }).then(response=>{
 * alert('Your account has been deleted.');
 * localStorage.removeItem('token');
 * localStorage.removeItem('user');
 * window.open('/','_self');
 * }).catch(function (error){
 * console.log(error);
 * alert('Error deleting the account.');
 * });
 * }
 * example response:
 * Username was deleted.
 */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(function (user) {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found.');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Index
app.get('/', function (req, res) {
  res.send(
    'Welcome to myFlix - an app full of information about your favorite films.'
  );
});

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function () {
  console.log('Listening on Port 3000.');
});
