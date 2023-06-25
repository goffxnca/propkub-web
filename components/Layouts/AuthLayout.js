import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { authContext } from "../../contexts/authContext";
import Logo from "./Logo";

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isAgent, isNormalUser } = useContext(authContext);

  // if (loading) {
  //   return <div>MAN GO BACK TO HOMEPAGE NOW1</div>;
  // }

  if (isAuthenticated) {
    if (isAgent) {
      router.replace("/profile");
    } else if (isNormalUser) {
      router.replace("/");
    }
  }

  return (
    <div className="relative  w-screen h-screen">
      <div className="absolute top-0 left-0 w-screen h-screen  bg-white opacity-10 -z-10"></div>
      <div className="absolute top-0 left-0 w-screen h-screen -z-20">
        <Image
          src="/loginBackground.webp"
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="z-10">{children}</div>

      <div className="absolute top-0 left-0 w-screen p-4">
        <Logo size="large" />
      </div>
    </div>
  );
};

export default AuthLayout;
