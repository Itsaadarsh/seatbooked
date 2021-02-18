import 'bootstrap/dist/css/bootstrap.css';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import Navbar from '../components/header';
import axiosBuild from '../api/buildClient';

const AppComponent: any = ({ Component, pageProps, currentUser }: AppProps) => {
  return (
    <div>
      <Navbar currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appCtx: any) => {
  try {
    const client = axiosBuild(appCtx.ctx.req);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (appCtx.Component.getInitialProps) {
      pageProps = await appCtx.Component.getInitialProps(appCtx.ctx, client, data.currentUser);
    }
    return {
      pageProps,
      ...data,
    };
  } catch (err) {
    return { currentUser: null };
  }
};

export default AppComponent;
