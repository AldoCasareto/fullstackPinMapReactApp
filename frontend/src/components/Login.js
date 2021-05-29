import React from 'react';
import './login.css';
import { Cancel, Explore } from '@material-ui/icons';
import { useState, useRef } from 'react';
import axios from 'axios';

const Login = ({ setShowlogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passRef.current.value,
    };

    try {
      const res = await axios.post('users/login', user);
      myStorage.setItem('user', res.data.username);
      setCurrentUser(res.data.username);
      setShowlogin(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className='loginModal'>
      <div className='logo'>
        <Explore /> Travel Points
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus type='text' placeholder='username' ref={nameRef} />
        <input type='password' min='6' placeholder='password' ref={passRef} />
        <button type='submit' className='LoginBtn'>
          Login
        </button>
        {error && <span className='error'>Check your details</span>}
      </form>
      <Cancel className='loginCancel' onClick={() => setShowlogin(false)} />
    </div>
  );
};

export default Login;
