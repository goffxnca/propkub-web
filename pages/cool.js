import { useEffect, useState } from "react";
import { randomLetter, genPostNumber } from "../libs/string-utils";

const CoolPage = () => {
  //   const letter = randomLetter();

  const [letter, setLetter] = useState("");

  useEffect(() => {
    // const date = new Date();

    // const yearPart = date.getFullYear().toString().substring(2, 4);
    // const monthPart = ("0" + (date.getMonth() + 1)).slice(-2);
    // const randomChars = randomLetter();
    // const running = "00137";
    // const postNumber = yearPart + randomChars + monthPart + running;

    const fetchVal = async () => {
      const myval = await genPostNumber();
      setLetter(myval);
    };

    fetchVal();
  }, []);

  if (!letter) return null;
  return <div>{letter}</div>;
};

export default CoolPage;
