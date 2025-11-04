import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Banner from '../Banner/Banner';
import Header from './Header';
import Footer from './Footer';
// import UserSidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const { getFirstActiveAnnouncement } = useAnnouncements();
  const bannerMessage = getFirstActiveAnnouncement();

  const isHomePage = router.pathname === '/';

  // if (!isAuthenticated) {
  //   return;
  // }

  return (
    <div>
      {bannerMessage && <Banner message={bannerMessage} />}

      <Header />
      <main className="min-h-screen py-4">{children}</main>
      <Footer />
      {/* <AddLine /> */}
      {/* <UserSidebar /> */}
    </div>
  );
};

export default MainLayout;
