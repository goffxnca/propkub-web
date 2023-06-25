import { useRouter } from "next/router";
// import Banner from "../Banner/Banner";
import AddLine from "../Socials/AddLine";
import Footer from "./Footer";
import Header from "./Header";
// import UserSidebar from "./Sidebar";

const MainLayout = (props) => {
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
      {/* <Banner
        message={
          "PropKub.com ได้ปรับปรุงระบบยืนยันตัวตน สำหรับสมาชิกเดิมโปรดตรวจสอบอีเมลของคุณและยืนยันการเป็นเจ้าของ"
        }
      /> */}

      <Header />
      <main className="min-h-screen py-4">{props.children}</main>
      <Footer />
      {/* <AddLine /> */}
      {/* <UserSidebar /> */}
      {/* Leave gap for google ads  */}
      <div className="md:h-40"></div>
    </div>
  );
};

export default MainLayout;
