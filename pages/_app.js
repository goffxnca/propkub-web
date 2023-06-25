import Head from "next/head";
import AuthChecker from "../components/Layouts/AuthChecker";
import MainLayout from "../components/Layouts/MainLayout";
import { AuthContextProvider } from "../contexts/authContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {

  const getDefaultLayout = (page) => <MainLayout>{page}</MainLayout>;
  const getLayout = Component.getLayout || getDefaultLayout;


  return (
    <AuthContextProvider>
      <AuthChecker>
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
      </AuthChecker>
    </AuthContextProvider>
  );
}

export default MyApp;
