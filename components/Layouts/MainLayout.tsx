import { useRouter } from 'next/router';
import Footer from './Footer';
import Header from './Header';
import { ReactNode } from 'react';
import Banner from '../Banner/Banner';
// import UserSidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();

  const isHomePage = router.pathname === '/';

  // if (!isAuthenticated) {
  //   return;
  // }

  return (
    <div>
      {/* <Banner
        message={
          '23 สิงหาคม 2568 | Propkub.com ประกาศ'
        }
      /> */}

      <Header />
      <main className="min-h-screen py-4">{children}</main>
      <Footer />
      {/* <AddLine /> */}
      {/* <UserSidebar /> */}
    </div>
  );
};

export default MainLayout;
