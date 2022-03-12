import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import buildClient from './auth/api/build-client';
import Header from './auth/components/header';
const reactComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
      </div>
    </>
  );
};

// different crom page Component getInitialProps
// context === {Component, ctx: {req, res}}
reactComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  let currentUser = null;
  let pageProps = {};
  try {
    const response = await client.get('/api/users/currentuser');
    currentUser = response.data.currentUser;
  } catch (e) {
    currentUser = null;
  } finally {
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return { pageProps, currentUser: currentUser };
  }
};

export default reactComponent;
