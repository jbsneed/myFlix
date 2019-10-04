const express = require('express'),
morgan=require('morgan');

const app = express();

let topMovies = [ {
  title: 'Harry Potter and the Deathly Hallows, Part 2',
  director:'David Yates'},
  { title: 'Silence of the Lambs',
  director: 'Jonathan Demme'},
  {title: 'Red Dragon',
  director:'Brett Ratner'}]

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/movies',function(req,res){
  res.json(topMovies);
});

app.get('/',function(req,res){
  res.send('Welcome to myFlix - an app full of information about your favorite films.')
});

app.use(function(err,req,res,next){
  console.error(err.stack);
  res.status(500).send('Something ain\'t working right!');
});

app.listen(8080,()=>
console.log('Your app is listening on Port 8080.'));
