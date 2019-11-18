import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./profile-view.scss"

export function ProfileUpdate(props) {
  const {
    Username: oldUsername,
    Password: oldPassword,
    Email: oldEmail,
    Birthday: oldBirthday
  } = props.userInfo;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    setUsername(oldUsername);
    setPassword(oldPassword);
    setEmail(oldEmail);
    setBirthday(oldBirthday);
  }, [oldUsername, oldPassword, oldEmail, oldBirthday]);

  const user = props.user;

  const handleUpdate = (e) => {
    e.preventDefault();
    const userInfo = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };
    axios.put(`https://myflix247365.herokuapp.com/users/${user}`,
      userInfo,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      },
    )
      .then(response => {
        props.updateUser(userInfo);
        alert('Your profile was updated.');
      })
      .catch(function (error) {
        console.log(error);
      });

    return (
      <Form className="update-form">
        <Form.Group controlId="formUsername">
          <Form.Label>New Username: </Form.Label>
          <Form.Control type="username" placeholder="Alphanumeric characters only" value={oldUsername} onChange={e => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>New Password:</Form.Label>
          <Form.Control type="password" placeholder="Password must be at least 8 characters" value={oldPassword} onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>New Email:</Form.Label>
          <Form.Control type="email" placeholder="Valid email required" value={oldEmail} onChange={e => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBirthday">
          <Form.Label>New Birthday:</Form.Label>
          <Form.Control type="birthday" placeholder="MM/DD/YYYY" value={oldBirthday} onChange={e => setBirthday(e.target.value)} />
        </Form.Group>

        <Button variant="primary" style={{ margin: 5 }} onClick={handleUpdate}>Update Info</Button>
      </Form>
    );
  }

  ProfileUpdate.propTypes = {
  };
}