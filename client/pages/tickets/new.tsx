import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { reqHook, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    reqHook();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Post a new ticket here!</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className='form-control' />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={e => setPrice(e.target.value)}
            className='form-control'
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Post</button>
      </form>
    </div>
  );
}
