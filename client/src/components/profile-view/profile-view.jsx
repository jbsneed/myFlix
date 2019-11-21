import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './profile-view.scss'

import { Link } from 'react-router-dom';

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      userData: null,
      userInfo: {},
      favoriteMovies: []
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://myflix247365.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        //Assign the result to the state
        this.setState({
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favoriteMovies: response.data.FavoriteMovies
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteFavoriteMovie(event, favoriteMovie) {
    event.preventDefault();
    axios.delete(`https://myflix247365.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${favoriteMovie}`, {
      Username: localStorage.getItem('user')
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(response => {
      console.log(response);
      alert('Deleted from favorites.');
    }).catch(event => {
      console.log('Not working.');
      alert('Not working');
    });
  }

  render() {
    const { username, email, birthday, favoriteMovies } = this.state;
    let movies = localStorage.getItem('movies');

    return (

      <div className="profile-view">
        <Card className="profile-view-card" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title className="profile-name">{username}</Card.Title>
            <ListGroup.Item>Password: ********</ListGroup.Item>
            <ListGroup.Item>Email: {email}</ListGroup.Item>
            <ListGroup.Item>Birthday: {birthday}</ListGroup.Item>
            <ListGroup.Item> Favorite Movies:
              <div>
                {favoriteMovies.length === 0 &&
                  <div className="value">You don't have any favorites!</div>
                }
                {favoriteMovies.length > 0 &&
                  <ul>
                    {favoriteMovies.map(favoriteMovie =>
                      <li key={favoriteMovie}>
                        <p>
                          {JSON.parse(movies) && movies.find(movie => movie._id === favoriteMovie).Title}
                        </p>
                        <Button variant="secondary" onClick={(event) => this.deleteFavoriteMovie(event, favoriteMovie)}>Delete from Favorites</Button>
                      </li>
                    )}
                  </ul>
                }
              </div>
            </ListGroup.Item>
            <Link to={'/'}>
              <Button variant="info">Home</Button>
            </Link>

            <Link to={`/update/:Username`}>
              <Button className="update-button">Update my info</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

