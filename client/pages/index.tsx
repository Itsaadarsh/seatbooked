import { NextPage } from 'next';
import axiosBuild from '../utils/buildClient';

interface PROPS {
  [key: string]: Object;
}

const IndexPage: NextPage<PROPS> = ({ currentUser }) => {
  return currentUser ? (
    <h1>Welcome to SEATBOOKED, you are signed in!!</h1>
  ) : (
    <div>
      <h1>Welcome to SEATBOOKED</h1>
      <a href='/auth/signup'>SIGN UP</a>
      <br />
      <a href='/auth/signin'>SIGN IN</a>
    </div>
  );
};

IndexPage.getInitialProps = async ({ req }) => {
  try {
    const axiosRes = await axiosBuild(req!).get('/api/users/currentuser');
    return axiosRes.data;
  } catch (err) {
    return { currentUser: null };
  }
};

export default IndexPage;
