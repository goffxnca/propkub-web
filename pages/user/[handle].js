import { useRouter } from "next/router";

const CoolPage = () => {
  const router = useRouter();

  return <div className="text-black">Username: {router.query.handle}</div>;
};

export default CoolPage;
