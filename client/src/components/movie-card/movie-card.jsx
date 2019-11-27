import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./movie-card.scss"

import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;
    if (!movie) return null;

    function addMovieToFavorites(e) {
      e.preventDefault();
      axios.post(`http://localhost:3000/users/${localStorage.getItem('user')}/Movies/${movie._id}`, {
        Username: localStorage.getItem('user')
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(response => {
        console.log(response);
        alert('Added to favorites.');
      }).catch(event => {
        console.log('Error adding movie to your favorites.');
        alert('Error adding movie to your favorites.');
      });
    };

    return (
      <Card className="movie-card" style={{ width: '30%' }}>
        <Card.Img variant="top" src={movie.ImagePath} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="primary" className="open-btn">More Info</Button>
          </Link>
          <Button variant="primary" className="addfav-btn" onClick={event => addMovieToFavorites(event)}>Add to Favorites</Button>
        </Card.Body>
      </Card>

    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
  }).isRequired,
};