import { useState } from 'react';

const PostDetailControlArea = ({ agentInfo, isSold }) => {
  const [phoneVisible, setPhoneVisible] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200">
          {/* <Image
            src={`${agentInfo.profileImg || "/user.png"}`}
            alt=""
            className="w-32 h-auto object-cover"
            height={150}
            width={150}
          /> */}
        </div>

        <div className="pt-1">
          {/* <div className="text-lg text-primary font-bold">{agentInfo.name}</div> */}
          {/* <div className="flex items-center">
            <StarIcon className="text-yellow-400 w-6 h-6" />
            <span className="text-gray-hard">5.0</span>
            <span className="text-gray-hard text-sm">(16 reviews)</span>
          </div> */}
          {/* <div className="text-sm text-gray-hard">081-222-1111</div>
          <div className="text-sm text-gray-hard">Line:</div> */}
        </div>
      </div>
    </>
  );
};

export default PostDetailControlArea;
