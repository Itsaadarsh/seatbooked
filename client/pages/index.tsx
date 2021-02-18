import { NextPage } from 'next';
console.clear();

interface PROPS {
  [key: string]: Object;
}

const IndexPage: NextPage<PROPS> = ({ currentUser }) => {
  return currentUser ? <h1>Welcome to SEATBOOKED, you are signed in!!</h1> : <h1>Welcome to SEATBOOKED</h1>;
};

IndexPage.getInitialProps = async () => {
  return {};
};

export default IndexPage;
