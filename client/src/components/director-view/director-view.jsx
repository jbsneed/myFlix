import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import "./director-view.scss"


export class DirectorView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie, onClick } = this.props;

    return (
      <div className="director-view">
        <Card className="director-view-card" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title className="director-name">{Director.Name}</Card.Title>
            <Card.Text>Bio: {Director.Bio}</Card.Text>
            <Card.Text>Born: {Director.Birth}</Card.Text>
            <Card.Text>Died: {Director.Death}</Card.Text>
            <Link to={'/'}>
              <Button variant="info">Back</Button>
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
