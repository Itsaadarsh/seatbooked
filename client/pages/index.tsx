import axios from 'axios';
import { NextPage } from 'next';
import axiosBuild from '../utils/buildClient';

interface PROPS {
  [key: string]: Object;
}

const IndexPage: NextPage<PROPS> = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Welcome to Seatbooked.com</h1>;
};

IndexPage.getInitialProps = async ({ req }) => {
  const axiosRes = await axiosBuild(req!).get('/api/users/currentuser');
  return axiosRes.data;
};

export default IndexPage;
