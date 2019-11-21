import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./registration-view.scss"

import { Link } from "react-router-dom";

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('https://myflix247365.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    }).then(response => {
      const data = response.data;
      console.log(data);
      alert('Successfully registered!');
      window.open('/', '_self');
    }).catch(err => {
      console.error('Error registering the user.', err)
    });
  };

  return (
    <Form className="registration-form">
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control type="username" placeholder="Alphanumeric characters only" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control type="password" placeholder="Password must be at least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control type="email" placeholder="Valid email required" value={email} onChange={e => setEmail(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBirthday">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control type="birthday" placeholder="MM/DD/YYYY" value={birthday} onChange={e => setBirthday(e.target.value)} />
      </Form.Group>
      <Button variant="primary" style={{ margin: 5 }} type="submit" onClick={handleRegister}>Register</Button>
      <Button variant="secondary">
        <Link to={'/'}>Already a member? Login here.</Link>
      </Button>
    </Form>
  );
}

RegistrationView.propTypes = {

}