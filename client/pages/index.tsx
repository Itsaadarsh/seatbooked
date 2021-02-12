import { NextPage } from 'next';
import axiosBuild from '../utils/buildClient';
console.clear();

interface PROPS {
  [key: string]: Object;
}

const IndexPage: NextPage<PROPS> = ({ currentUser }) => {
  return currentUser ? <h1>Welcome to SEATBOOKED, you are signed in!!</h1> : <h1>Welcome to SEATBOOKED</h1>;
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
