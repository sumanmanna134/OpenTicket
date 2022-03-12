import Footer from './components/footers';
import Header from './components/header';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const signupForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      name,
      phone,
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };
  return (
    <main className="d-flex flex-column min-vh-100">
      <div className="container">
        <form onSubmit={onSubmit}>
          <h1>Signup</h1>
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Contact Number (+91) </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
            />
          </div>

          {errors}

          <button className="btn btn-primary">Sign Up</button>
        </form>
      </div>
      <Footer />
    </main>
  );
};

export default signupForm;
