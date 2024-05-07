import React, { useState,useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/admin/auth', formData);
      setLoading(false);
      if (response.data.success) {
        setLoggedIn(true);
        sessionStorage.setItem('token', response.data.token);
        setFormData({
          email: '',
          password: '',
        })
        // Handle successful authentication
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during authentication');
      setLoading(false);
    }
  };
  

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {loggedIn ? (
            <div>
              <h2>Welcome, User!</h2>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <h2>Login</h2>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </Form>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
