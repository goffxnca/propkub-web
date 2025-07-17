import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const PostImageGallery = ({ images }) => {
  return (
    <ImageGallery
      items={images}
      lazyLoad={true}
      //   showThumbnails={false}
      showPlayButton={false}
      showIndex={true}
      showBullets={true}
      // renderItem={(item) => (
      //   <div className="max-h-[80vh] h-[600px] w-full">
      //     <div className="">
      //       {/* <Image
      //         className="image-gallery-image"
      //         src={item.original}
      //         layout="fill"
      //         objectFit="contain"
      //       ></Image> */}

      //       <div className="flex justify-center">
      //         <img className="" src={item.original}></img>
      //       </div>
      //     </div>
      //   </div>
      // )}
      // renderThumbInner={(item) => (
      //   // <Image
      //   //   src={item.thumbnail}
      //   //   width={184}
      //   //   height={200}
      //   //   objectFit="cover"
      //   // ></Image>

      //   <img
      //     src={item.thumbnail}
      //     className="h-[100px] w-[92px] object-cover"
      //   ></img>
      // )}
    />
  );
};

export default PostImageGallery;
