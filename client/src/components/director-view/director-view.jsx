import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import "./director-view.scss"

import { Link } from "react-router-dom";


export class DirectorView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { director } = this.props;

    if (!director) return null;

    return (
      <div className="director-view">
        <Card className="director-view-card" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title className="director-name">{director.Name}</Card.Title>
            <Card.Text className="director-info">Bio:<br /> {director.Bio}</Card.Text>
            <Card.Text className="director-info">Born: {director.Birth}</Card.Text>
            <Card.Text className="director-info">Died: {director.Death}</Card.Text>
            <Link to={`/`}>
              <Button variant="info">Home</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>

    );
  }
}

DirectorView.propTypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birth: PropTypes.string.isRequired,
    Death: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
