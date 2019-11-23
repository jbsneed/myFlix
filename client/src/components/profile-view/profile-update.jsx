import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./profile-view.scss"

export function ProfileUpdate(props) {
  const [username, setNewUsername] = useState('');
  const [password, setNewPassword] = useState('');
  const [email, setNewEmail] = useState('');
  const [birthday, setNewBirthday] = useState('');

  const user = props.user;
  if (!user) {
    alert('You are not logged in.');
    window.open('/', '_self');
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    const userInfo = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };
    axios.put(`https://myflix247365.herokuapp.com/users/${user}`, userInfo,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      },
    )
      .then(response => {
        props.updateUser(userInfo);
        const update = response.data;
        console.log(update);
        alert('Your profile was updated.');
        window.open('/', '_self');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(`https://myflix247365.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(response => {
      alert('Your account has been deleted.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.open('/', '_self');
    }).catch(function (error) {
      console.log(error);
      alert('Error deleting the account.');
    });
  }

  return (
    <Form className="update-form">
      <Form.Group controlId="formUsername">
        <Form.Label className="label">New Username: </Form.Label>
        <Form.Control type="username" placeholder="Alphanumeric characters only" value={username} onChange={e => setNewUsername(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label className="label">New Password:</Form.Label>
        <Form.Control type="password" placeholder="Password must be at least 8 characters" value={password} onChange={e => setNewPassword(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label className="label">New Email:</Form.Label>
        <Form.Control type="email" placeholder="Valid email required" value={email} onChange={e => setNewEmail(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBirthday">
        <Form.Label className="label">New Birthday:</Form.Label>
        <Form.Control type="birthday" placeholder="MM/DD/YYYY" value={birthday} onChange={e => setNewBirthday(e.target.value)} />
      </Form.Group>

      <Button variant="primary" style={{ margin: 5 }} onClick={handleUpdate}>Submit</Button>
      <Button variant="secondary" style={{ margin: 5 }} onClick={handleDelete}>Delete Account</Button>
    </Form>
  );
}

ProfileUpdate.propTypes = {
};