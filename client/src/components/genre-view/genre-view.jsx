import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import "./genre-view.scss"

export class GenreView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { genre } = this.props;

    return (
      <div className="genre-view">
        <Card className="genre-view-card" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title className="director-name">{Genre.Name}</Card.Title>
            <Card.Text>Description: {Genre.Description}</Card.Text>
            <Link to={'/'}>
              <Button variant="info">Back</Button>
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
