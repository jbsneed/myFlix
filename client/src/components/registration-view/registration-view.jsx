import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./registration-view.scss"

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
      window.open('/', '_self');
    }).catch(e => {
      console.log('error registering the user')
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

      <Button variant="primary" style={{ margin: 5 }} onClick={handleRegister}>Register</Button>
      <Form.Group controlId='formUserRegistered'>
        <Button variant="secondary" style={{ margin: 5 }} onClick={() => props.userRegistered()}>Already a member? Log in here!</Button>
      </Form.Group>
    </Form>
  );
}

RegistrationView.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
  userRegistered: PropTypes.func.isRequired,
  onLoggedIn: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}