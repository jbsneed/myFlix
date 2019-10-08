const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something ain\'t working right!');
});

let Movies = [
  {
    title: 'Harry Potter and the Deathly Hallows, Part 2',
    director: 'David Yates'
  },
  { title: 'Silence of the Lambs', director: 'Jonathan Demme' },
  { title: 'Red Dragon', director: 'Brett Ratner' }
];

// Gets the list of data about ALL movies
app.get('/movies', function(req, res) {
  res.json(Movies);
});

// Gets the data about a single movie
app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returning data on selected movie');
});

// Gets the data about a single genre
app.get('/genres/:genre', (req, res) => {
  res.send('Successful GET request returning data on selected genre');
});

// Gets the data about a single director
app.get('/directors/:name', (req, res) => {
  res.send('Successful GET request returning data on selected director');
});

//Adds data for a new user to our list of users
app.post('/users', (req, res) => {
  let newUser = req.body;
  if (!newUser.name) {
    const message = 'Missing name in request body.';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    Students.push(newUser);
    res.status(201).send(newUser);
  }
});

// Allows users to update their user info
app.put('/users/:name/:info', (req, res) => {
  res.send('Successful PUT request returning data on selected user');
});

// Allows users to add a movie to their list of favorites
app.post('/users/:name/:favorites', (req, res) => {
  res.send('Successful POST request returning data on selected list');
});

// Allows users to delete a movie from their list of favorites
app.delete('/users/:name/:favorites', (req, res) => {
  res.send('Selected title was successfully deleted from list.');
});

// Allows existing users to deregister
app.delete('/users/:name', (req, res) => {
  res.send('You have successfully deregistered.');
});

app.get('/', function(req, res) {
  res.send(
    'Welcome to myFlix - an app full of information about your favorite films.'
  );
});

app.listen(8080, () => console.log('Your app is listening on Port 8080.'));
