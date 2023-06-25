import Link from "next/link";

const Logo = ({ onClick, size = "medium" }) => {
  const textSize =
    size === "medium" ? "text-2xl" : size === "large" ? "text-4xl" : "";
  return (
    <Link href="/">
      <a onClick={onClick}>
        <span className="sr-only">PropKub.com Logo</span>
        <img
          className="h-9"
          src="/propkub.com-logo2.svg"
          alt="propkub.com logo2"
        />
      </a>
    </Link>
  );
};

export default Logo;
