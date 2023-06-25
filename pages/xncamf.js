// import { useRef, useState } from "react";
// import Button from "../components/UI/Public/Button";
// import {
//   seedDistricts,
//   seedProvinces,
//   seedSubDistricts,
// } from "../libs/managers/addressManager";
// import { getAllPublicPosts, getPostById, seedPosts } from "../libs/post-utils";
// import { genSlug } from "../libs/string-utils";

// const XncamfPage = () => {
//   const postIdRef = useRef();

//   // const seedPostHandler = async () => {
//   //   if (text === "supersecret") {
//   //     confirm("Seeding Provinces?");
//   //   }

//   //   await seedPosts();
//   // };

//   // const seedProvinceHandler = async () => {
//   //   if (text === "supersecret") {
//   //     if (confirm("seedProvinces?")) {
//   //       await seedProvinces();
//   //     }
//   //   }
//   // };

//   // const seedDistricsHandler = async () => {
//   //   if (text === "supersecret") {
//   //     if (confirm("run seedDistricsHandler?")) {
//   //       await seedDistricts();
//   //     }
//   //   }
//   // };

//   const seedSubDistricsHandler = async () => {
//     if (text === "supersecret") {
//       if (confirm("run seedSubDistricsHandler?")) {
//         await seedSubDistricts();
//       }
//     }
//   };

//   // const getAllPublicPostsHandler = async () => {
//   //   const result = await getAllPublicPosts();
//   //   console.log(result.map((post) => post.thumbnail));
//   // };

//   // const getPostByIdHandler = async () => {
//   //   const result = await getPostById(postIdRef.current.value);
//   //   console.log(result);
//   // };

//   const [text, setText] = useState("");

//   const urlSlug = genSlug(text);

//   return (
//     <>
//       <input
//         type="text"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       ></input>
//       {/* {urlSlug}
//       <Button onClick={seedPostHandler}>SeedPost</Button>

//       <Button variant="secondary" onClick={getAllPublicPostsHandler}>
//         GetAllPosts
//       </Button>
//       <br />
//       <input ref={postIdRef} type="text" />
//       <Button variant="secondary" onClick={getPostByIdHandler}>
//         Get Doc By Id
//       </Button> */}

//       <Button variant="primary" onClick={seedSubDistricsHandler}>
//         Seed SubDistrict
//       </Button>
//     </>
//   );
// };

// export default XncamfPage;

const Xncamf = () => {
  return <h1>Test Page</h1>;
};

export default Xncamf;
