import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import "./movie-view.scss"

import { Link } from "react-router-dom";

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie, onClick } = this.props;

    if (!movie) return null;

    return (
      <div className="movie-view">
        <Card className="movie-view-card" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title className="movie-title">{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
            <Card.Text>Genre: {movie.Genre.Name}</Card.Text>
            <Link to={`/genres/${movie.Genre.Name}`}>
              <Button variant="link">Genre</Button>
            </Link>
            <Card.Text>Director: {movie.Director.Name}</Card.Text>
            <Link to={`/directors/${movie.Director.Name}`}>
              <Button variant="link">Director</Button>
            </Link>


            <Button variant="primary" onClick={() => onClick()}>Back</Button>
          </Card.Body>
        </Card>
      </div>

    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string,
      Birth: PropTypes.string,
      Death: PropTypes.string
    }),
    ImagePath: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
