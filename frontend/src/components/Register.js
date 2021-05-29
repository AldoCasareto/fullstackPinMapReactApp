import React from 'react';
import './register.css';
import { Cancel, Explore } from '@material-ui/icons';
import { useState, useRef } from 'react';
import axios from 'axios';

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value,
    };
    try {
      await axios.post('users/register', newUser);
      setError(false);
      setSuccess(true);
      setTimeout(() => {
         setShowRegister(false); 
      }, 2000);
      

    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className='registration'>
      <div className='logo'>
        <Explore /> Travel Points
      </div>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='username' ref={nameRef} />
        <input type='email' placeholder='e-mail' ref={emailRef} />
        <input type='password' placeholder='password' ref={passRef} />
        <button type='submit' className='registerBtn'>
          Register
        </button>
        {success && <span className='success'>Registration Successful</span>}
        {error && <span className='error'>Check your details</span>}
      </form>
      <Cancel
        className='registerCancel'
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
