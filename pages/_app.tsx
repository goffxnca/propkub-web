import Head from 'next/head';
import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';
import MainLayout from '../components/Layouts/MainLayout';
import { AuthContextProvider } from '../contexts/authContext';
import '../styles/globals.css';

type NextPageWithLayout = AppProps['Component'] & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getDefaultLayout = (page: ReactElement) => (
    <MainLayout>{page}</MainLayout>
  );
  const getLayout = Component.getLayout || getDefaultLayout;

  return (
    <AuthContextProvider>
      {getLayout(
        <>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <Component {...pageProps} />
        </>
      )}
    </AuthContextProvider>
  );
}

export default MyApp;
