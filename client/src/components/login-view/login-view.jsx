import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import { Link } from "react-router-dom";

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication*/
    axios.post('https://myflix247365.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      }).catch(e => {
        console.log('no such user')
      });
  };

  return (
    <Form className="registration-form">
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control type="username" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Button variant="primary" style={{ margin: 5 }} onClick={handleSubmit}>Log In</Button>
      <Form.Group controlId='formRegisterNow'>
        <Link to={`/register`}>
          <Button variant="secondary" style={{ margin: 5 }}>Create New Account</Button>
        </Link>
      </Form.Group>
    </Form>);
}

LoginView.propTypes = {
  newUser: PropTypes.func.isRequired,
  onLoggedIn: PropTypes.func.isRequired
};