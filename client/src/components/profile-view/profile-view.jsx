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
    axios.get(`http://localhost:3000/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        //Assign the result to the state
        const movies = localStorage.getItem('movies');
        this.setState({
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favoriteMovies: response.data.FavoriteMovies.map(id => JSON.parse(movies).find(m => m._id === id))
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteFavoriteMovie(event, favoriteMovie) {
    event.preventDefault();
    axios.delete(`http://localhost:3000/users/${localStorage.getItem('user')}/Movies/${favoriteMovie}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(response => {
      console.log(response);
      window.open('/users/:Username', '_self');
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
            <Card.Title className="profile-name">~ {username} ~</Card.Title>
            <ListGroup.Item>Password: ********</ListGroup.Item>
            <ListGroup.Item>Email: {email}</ListGroup.Item>
            <ListGroup.Item>Birthday: {birthday}</ListGroup.Item>
            <ListGroup.Item> Favorite Movies:
              <div>
                {favoriteMovies.length === 0 &&
                  <div className="value">You don't have any favorites!</div>
                }
                {favoriteMovies.length > 0 &&
                  <ul className="favorite-movies">
                    {favoriteMovies.map((favoriteMovie, i) =>
                      <li key={i}>
                        <p>{favoriteMovie.Title}
                          <Button className="deletefav-btn" variant="link" onClick={(event) => this.deleteFavoriteMovie(event, favoriteMovie._id)}>Delete from Favorites</Button></p>
                      </li>
                    )}
                  </ul>
                }
              </div>
            </ListGroup.Item>
            <div className="buttons">
              <Link to={'/'}>
                <Button className="home-btn" variant="info">Home</Button>
              </Link>

              <Link to={`/update/:Username`}>
                <Button className="update-btn">Update my info</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

