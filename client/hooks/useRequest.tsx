import axios from 'axios';
import { useState } from 'react';

const useRequest = ({
  url,
  method,
  body,
  onSuccess,
}: {
  url: string;
  method: string;
  body: object;
  onSuccess: () => {};
}) => {
  const [errors, setErrors] = useState(<></>);

  const reqHook = async () => {
    try {
      setErrors(<></>);
      const res = await (axios as any)[method](url, body);
      if (onSuccess) {
        onSuccess();
      }
      return res.data;
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <ul>
            {err.response.data.errors.map((err: { message: string; field: string }, index: number) => {
              return <li key={index}>{err.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { reqHook, errors };
};

export default useRequest;
