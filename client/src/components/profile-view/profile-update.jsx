import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./profile-view.scss"

export function UpdateProfile(props) {
  const { username, password, email, birthday } = props.userInfo;
  const user = props.user;

  const [oldUsername, setNewUsername] = useState('');
  const [oldPassword, setNewPassword] = useState('');
  const [oldEmail, setNewEmail] = useState('');
  const [oldBirthday, setNewBirthday] = useState('');

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
      .then(respons => {
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
          <Form.Control type="username" placeholder="Alphanumeric characters only" value={oldUsername} onChange={e => setNewUsername(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>New Password:</Form.Label>
          <Form.Control type="password" placeholder="Password must be at least 8 characters" value={oldPassword} onChange={e => setNewPassword(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>New Email:</Form.Label>
          <Form.Control type="email" placeholder="Valid email required" value={oldEmail} onChange={e => setNewEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBirthday">
          <Form.Label>New Birthday:</Form.Label>
          <Form.Control type="birthday" placeholder="MM/DD/YYYY" value={oldBirthday} onChange={e => setNewBirthday(e.target.value)} />
        </Form.Group>

        <Button variant="primary" style={{ margin: 5 }} onClick={handleUpdate}>Update Info</Button>
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
  };
}