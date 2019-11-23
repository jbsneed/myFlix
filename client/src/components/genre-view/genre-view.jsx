import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import "./genre-view.scss"

import { Link } from "react-router-dom";


export class GenreView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { genre } = this.props;

    if (!genre) return null;

    return (
      <div className="genre-view">
        <Card className="genre-view-card" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title className="genre-name">{genre.Name}</Card.Title>
            <Card.Text>{genre.Description}</Card.Text>
            <Link to={'/'}>
              <Button className="home-btn" variant="info">Home</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>

    );
  }
}

GenreView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
