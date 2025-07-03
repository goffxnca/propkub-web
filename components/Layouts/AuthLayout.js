import Image from "next/image";
import Logo from "./Logo";

const AuthLayout = ({ children }) => {
  // Auth redirection is now handled by GuestOnlyRoute component

  return (
    <div className="relative  w-screen h-screen">
      <div className="absolute top-0 left-0 w-screen h-screen  bg-white opacity-10 -z-10"></div>
      <div className="absolute top-0 left-0 w-screen h-screen -z-20">
        {/* <Image
          src="/loginBackground.webp"
          alt=""
          layout="fill"
          objectFit="cover"
        /> */}
        <img
          src="/loginBackground.webp"
          className="h-full w-full object-cover"
        ></img>
      </div>
      <div className="z-10">{children}</div>

      <div className="absolute top-0 left-0 w-screen p-4">
        {/* <Logo /> */}
      </div>
    </div>
  );
};

export default AuthLayout;
