import Router from 'next/router';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';

const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { reqHook, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    reqHook();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up!</h1>
      <div className='form-group'>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className='form-control' />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign Up</button>
      <br />
      <a href='/auth/signin'>Already have an account?</a>
    </form>
  );
};
export default signup;