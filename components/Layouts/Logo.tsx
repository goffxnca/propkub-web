import Link from 'next/link';

interface LogoProps {
  onClick?: () => void;
}

const Logo = ({ onClick }: LogoProps) => {
  return (
    <Link href="/" onClick={onClick}>
      <span className="sr-only">PropKub.com Logo</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-8"
        src="/propkub.com-logo4.png"
        alt="propkub.com logo4"
      />
    </Link>
  );
};

export default Logo;
