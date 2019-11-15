import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from "react-router-dom";

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,

    };
  }
  //One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null
    })
  }

  getMovies(token) {
    axios.get('https://myflix247365.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        //Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
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

    //Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view">
          <Route exact path="/" render={() => {
            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
            return movies.map(m => <MovieCard key={m._id} movie={m} />)
          }
          } />
          <Route path="/register" render={() => <RegistrationView />} />
          <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
          <Route path="/directors/:name" render={({ match }) => <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />} />
          <Routh path="/genres/:name" render={({ match }) => <GenreView genre={genres.find(m => m.Genre.Name === match.params.name).Genre} />} />
        </div>
      </Router>
    );
  }
}

MainView.propTypes = {
  //none
};