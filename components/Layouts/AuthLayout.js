import Logo from './Logo';
import LocaleSwitcher from '../UI/LocaleSwitcher';

// interface AuthLayoutProps {
//   children: React.ReactNode;
// }

const AuthLayout = ({ children }) => {
  return (
    <div className="relative  w-screen h-screen">
      <div className="absolute top-0 left-0 w-screen h-screen  bg-white opacity-10 -z-10"></div>
      <div className="absolute top-0 left-0 w-screen h-screen -z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/loginBackground.webp"
          alt=""
          className="h-full w-full object-cover"
        ></img>
      </div>
      <div className="z-10">{children}</div>

      <div className="absolute top-0 left-0 w-screen p-4">
        <div className="flex justify-between items-center">
          <Logo />
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
