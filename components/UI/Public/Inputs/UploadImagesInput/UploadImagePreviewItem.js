import { XCircleIcon } from "@heroicons/react/outline";

const ImagePreviewItem = ({ src, fileName, imageIndex, onClose }) => {
  return (
    <div className="relative transition-all md:hover:scale-105 my-2 md:m-2 flex">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="bg-gray-50 h-full w-full md:h-40 md:w-52 rounded-lg shadow-md object-cover"
      />
      <div className="h-full w-full flex justify-center items-center absolute  bottom-0 right-0 ">
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-black bg-opacity-40 text-white">
          {imageIndex + 1}
        </div>
      </div>

      <div
        className="absolute -top-3 -right-3 w-7 h-7 bg-white text-gray-400 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
        onClick={onClose.bind(null, imageIndex)}
      >
        x
      </div>
      <div className="absolute bottom-0 text-xs text-gray-400 bg-gray-50 w-full whitespace-nowrap overflow-hidden">
        {fileName}
      </div>
    </div>
  );
};

export default ImagePreviewItem;
