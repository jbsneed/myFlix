import React from 'react';
import { MainView } from '../main-view/main-view';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./movie-view.scss"

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
            <Card.Text>Director: {movie.Director.Name}</Card.Text>


            <Button variant="primary" onClick={() => onClick()}>Back</Button>
          </Card.Body>
        </Card>
      </div>

    );
  }
}

