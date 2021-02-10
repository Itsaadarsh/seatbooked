import Link from 'next/link';
import useRequest from '../hooks/useRequest';
import Router from 'next/router';

interface PROPS {
  [key: string]: Object;
}

const Navbar = ({ currentUser }: PROPS) => {
  const { reqHook } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  const signoutFunc = () => {
    reqHook();
  };

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>seatbooked</a>
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          {currentUser ? (
            <Link href='/'>
              <a onClick={signoutFunc} className='nav-link'>
                Sign out
              </a>
            </Link>
          ) : (
            <>
              <Link href='/auth/signup'>
                <a className='nav-link'>Sign up</a>
              </Link>
              <Link href='/auth/signin'>
                <a className='nav-link'>Sign in</a>
              </Link>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
