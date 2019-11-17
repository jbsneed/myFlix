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
      FavoriteMovies: []
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
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
          userData: response.data,
          username: response.data,
          password: response.data,
          email: response.data,
          birthday: response.data,
          FavoriteMovies: response.data.FavoriteMovies

        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteFavoriteMovie(event, FavoriteMovie) {
    let username = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    event.preventDefault();
    console.log(FavoriteMovie);
    axios.delete(`https://myflix247365.herokuapp.com/users/${username}/FavoriteMovies/${FavoriteMovie}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      this.getUser(token)
    }).catch(event => {
      alert('Something ain\'t working right!');
    });
  }

  render() {
    const { username, password, email, birthday, FavoriteMovies } = this.state;

    return (

      <div className="profile-view">
        <Card className="profile-view-card" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title className="profile-name">{username}</Card.Title>
            <ListGroup.Item>Password: {password}</ListGroup.Item>
            <ListGroup.Item>Email: {email}</ListGroup.Item>
            <ListGroup.Item>Birthday: {birthday}</ListGroup.Item>
            <ListGroup.Item> Favorite Movies:
              <div>
                {FavoriteMovies.map(FavoriteMovie =>
                  <ul>
                    <li key={FavoriteMovie}>
                      <p>
                        {JSON.parse(localStorage.getItem('movies')).find(movie => movie._id === FavoriteMovie).Title}
                      </p>
                      <Button variant="secondary" onClick={(event) => this.deleteFavoriteMovie(event, FavoriteMovie)}>Delete from Favorites</Button>
                    </li>
                  </ul>)
                }
              </div>
            </ListGroup.Item>
            <Link to={'/'}>
              <Button variant="info">Back</Button>
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

