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
      {/* {isHomePage && (
        <Banner
          message={
            "ประกาศ ตั้งแต่วันที่ 1 ตุลาคม 2565 เป็นต้นไป HaHome.co ได้รีแบรนด์เป็น PropKub.com เพื่อให้จดจำได้ง่ายขึ้น"
          }
        />
      )} */}

      <Banner
        message={
          '23 สิงหาคม 2568 | Propkub.com ได้ปรับปรุงระบบล็อคอินใหม่เพื่อเพิ่มความปลอดภัย | สำหรับผู้ใช้งานที่สร้างบัญชีก่อนวันที่ 23 สิงหาคม 2568 รหัสผ่านชั่วคราวได้ถูกส่งไปยังอีเมลของคุณเพื่อใช้เข้าสู่ระบบ | เมื่อเข้าสู่ระบบแล้ว กรุณาตั้งรหัสผ่านใหม่ทันทีที่หน้าโปรไฟล์ | (หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์ Spam/Junk/Promotions)'
        }
      />

      <Header />
      <main className="min-h-screen py-4">{children}</main>
      <Footer />
      {/* <AddLine /> */}
      {/* <UserSidebar /> */}
    </div>
  );
};

export default MainLayout;
