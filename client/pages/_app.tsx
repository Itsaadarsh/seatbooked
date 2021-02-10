import 'bootstrap/dist/css/bootstrap.css';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import Navbar from '../components/header';
import axiosBuild from '../utils/buildClient';

const AppComponent: any = ({ Component, pageProps, currentUser }: AppProps) => {
  return (
    <div>
      <Navbar currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appCtx: any) => {
  try {
    const axiosRes = await axiosBuild(appCtx.ctx.req).get('/api/users/currentuser');
    let pageProps = {};
    if (appCtx.Component.getInitialProps) {
      pageProps = await appCtx.Component.getInitialProps(appCtx.ctx);
    }
    return {
      pageProps,
      ...axiosRes.data,
    };
  } catch (err) {
    return { currentUser: null };
  }
};

export default AppComponent;
