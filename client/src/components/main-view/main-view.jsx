import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: null,
      selectedMovie: null,
      user: null
    };
  }
  //One of the "hooks" available in a React Component
  componentDidMount() {
    axios.get('https://myflix247365.herokuapp.com/movies')
      .then(response => {
        //Assign the result to the state
        this.setState({
          movies: response.data
        });
      }).catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  registerUser() {
    this.setState({
      newUser: true
    });
  }

  userRegistered() {
    this.setState({
      newUser: null
    });
  }

  onBackClick() {
    this.setState({ selectedMovie: null });
  }

  render() {
    //If the state isn't initialized, this will throw on runtime
    //before the data is initially loaded
    const { movies, selectedMovie, user, newUser } = this.state;

    if (!user) {
      if (newUser) {
        return
        <RegistrationView
          userRegistered={() => this.userRegistered()}
          onLoggedIn={user => this.onLoggedIn(user)} />;
      }
      else {
        return <LoginView
          onLoggedIn={user => this.onLoggedIn(user)}
          newUser={() => this.registerUser()}
          userRegistered={() => this.userRegistered()} />;
      }

    }

    //Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView movie={selectedMovie}
            onClick={() => this.onBackClick()} />
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
          ))}
      </div>
    );
  }
}