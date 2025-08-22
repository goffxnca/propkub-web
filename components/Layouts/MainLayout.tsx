import { useRouter } from "next/router";
import Banner from "../Banner/Banner";
import Footer from "./Footer";
import Header from "./Header";
import { ReactNode } from "react";
// import UserSidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();

  const isHomePage = router.pathname === "/";

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
          "Propkub.com กำลังย้ายระบบล็อคอินใหม่ไปยังบริการ Cloud เพื่อเพิ่มความปลอดภัยและรองรับการเชื่อมต่อด้วยบัญชี Google และ Facebook ได้ง่ายและรวดเร็วยิ่งขึ้น ในวันที่ 23 สิงหาคม 2568 คุณจะได้รับอีเมลพร้อมกับรหัสผ่านชั่วคราวในการเข้าสู่ระบบ หลังจากนั้นคุณสามารถเปลี่ยนแปลงรหัสผ่านของคุณเองได้อีกครั้งที่หน้าโปรไฟล์"
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
