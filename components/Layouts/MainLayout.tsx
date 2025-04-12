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
      {isHomePage && (
        <Banner
          message={
            "ประกาศ ตั้งแต่วันที่ 1 ตุลาคม 2565 เป็นต้นไป HaHome.co ได้รีแบรนด์เป็น PropKub.com เพื่อให้จดจำได้ง่ายขึ้น"
          }
        />
      )}
      {/* <Banner
        message={
          "PropKub ขอความร่วมมือผู้ลงประกาศต่างๆ ไม่ลงประกาศที่เป็นทรัพย์เดียวกันซ้ำซ้อนหลายๆครั้ง เนื่องจากส่งผลกระทบต่อเว็บไซต์ในการจัดอันดับบน Google โดยเรากำลังเร่งพัฒนาระบบดันประกาศเดิมขึ้นหน้าแรก ให้ท่านใช้งานได้ฟรี โดยจะแล้วเสร็จในเร็วๆนี้"
        }
      /> */}

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
