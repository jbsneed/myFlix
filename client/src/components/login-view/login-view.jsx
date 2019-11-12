import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    props.onLoggedIn(username);
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
        <Button variant="secondary" style={{ margin: 5 }} onClick={() => props.newUser()}>Create New Account</Button>
      </Form.Group>
    </Form>);
}

LoginView.propTypes = {
  newUser: PropTypes.func.isRequired,
  onLoggedIn: PropTypes.func.isRequired
};