import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import "./login-view.scss"

import { Link } from "react-router-dom";

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication*/
    axios.post('http://localhost:3000/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      }).catch(e => {
        console.log('no such user')
        alert('Incorrect username or password.');
      });
  };

  return (
    <Form className="login-form">
      <Form.Group controlId="formUsername">
        <Form.Label className="label">Username</Form.Label>
        <Form.Control type="username" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label className="label">Password</Form.Label>
        <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <div className="buttons">
        <Button className="login-btn" variant="primary" onClick={handleSubmit}>Log In</Button>
        <Link to={`/register`}>
          <Button className="register-btn" variant="primary">Create New Account</Button>
        </Link>
      </div>
    </Form>);
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};