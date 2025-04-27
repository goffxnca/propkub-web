import { useRouter } from "next/router";
import Banner from "../Banner/Banner";
import AddLine from "../Socials/AddLine";
import Footer from "./Footer";
import Header from "./Header";
import { ReactNode } from "react";
// import UserSidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  console.log("MainLayout");
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
          "Propkub กำลังปรับปรุงระบบใหม่ เพื่อเพิ่มความปลอดภัย และช่วยให้การลงประกาศของคุณ เร็วขึ้นและง่ายขึ้น ในวันที่ 10 พฤษภาคม 2568 คุณจะได้รับอีเมลเพื่อตั้งรหัสผ่านใหม่ เพื่อใช้งานระบบล็อกอินเวอร์ชันใหม่ — หลังจากตั้งรหัสผ่านเรียบร้อย คุณจะสามารถใช้งานเว็บไซต์ได้ตามปกติ พร้อมทั้งสัมผัสประสบการณ์การโพสต์ประกาศด้วย AI อัจฉริยะรูปแบบใหม่"
        }
      />

      <Header />
      <main className="min-h-screen py-4">{children}</main>
      <Footer />
      {/* <AddLine /> */}
      {/* <UserSidebar /> */}
      {/* Leave gap for google ads  */}
      <div className="md:h-40"></div>
    </div>
  );
};

export default MainLayout;
