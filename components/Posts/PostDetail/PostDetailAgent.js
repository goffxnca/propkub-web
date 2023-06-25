import { PhoneIcon } from "@heroicons/react/solid";
import LineBreak from "../../UI/Public/LineBreak";
import Button from "../../UI/Public/Button";
import Image from "next/image";
import { useState } from "react";
import LinkButton from "../../UI/Public/LinkButton";
import LineIcon from "../../Icons/LineIcon";
import {
  increasePhoneView,
  increaseLineView,
} from "../../../libs/managers/postManager";

const PostDetailAgent = ({ postId, agentInfo, isSold }) => {
  const [phoneVisible, setPhoneVisible] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200">
          <Image
            src={`${agentInfo.profileImg || "/user.png"}`}
            alt=""
            className="w-32 h-auto object-cover"
            height={150}
            width={150}
          />
        </div>

        <div className="pt-1">
          <div className="text-lg text-primary font-bold">{agentInfo.name}</div>
          {/* <div className="flex items-center">
            <StarIcon className="text-yellow-400 w-6 h-6" />
            <span className="text-gray-hard">5.0</span>
            <span className="text-gray-hard text-sm">(16 reviews)</span>
          </div> */}
          {/* <div className="text-sm text-gray-hard">081-222-1111</div>
          <div className="text-sm text-gray-hard">Line:</div> */}
        </div>
      </div>

      {/* <PostDetailAgentContactForm /> */}
      {/* <LineBreak /> */}
      {!isSold && (
        <>
          <LineBreak />
          <div className="flex flex-col">
            <Button
              variant="primary"
              onClick={() => {
                setPhoneVisible(true);
                if (!phoneVisible) {
                  increasePhoneView(postId);
                }
              }}
              Icon={<PhoneIcon className="text-white w-6 h-6" />}
            >
              {phoneVisible ? (
                <a href={`tel:${agentInfo.phone}`}>
                  {agentInfo.phone} (คลิกเพื่อโทรออก)
                </a>
              ) : (
                "(คลิกเพื่อโชว์หมายเลข)"
              )}
            </Button>

            <LinkButton
              variant="secondary"
              href={`https://line.me/ti/p/~${agentInfo.line}`}
              onClick={() => {
                increaseLineView(postId);
              }}
            >
              <LineIcon className="text-green-500 md:w-6 md:h-6 mr-1" />
              แอดไลน์
            </LinkButton>
          </div>
        </>
      )}
    </>
  );
};

export default PostDetailAgent;
