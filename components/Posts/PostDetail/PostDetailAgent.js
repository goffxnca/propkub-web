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
import { getLineUrl } from "../../../libs/string-utils";

const PostDetailAgent = ({ postId, postOwner, isSold }) => {
  const [phoneVisible, setPhoneVisible] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200">
          <img
            src={`${postOwner.profileImg || "/user.png"}`}
            alt=""
            className="w-full h-full object-cover"
          ></img>
        </div>

        <div className="pt-1">
          <div className="text-lg text-primary font-bold">{postOwner.name}</div>
        </div>
      </div>

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
                <a href={`tel:${postOwner.phone}`}>
                  {postOwner.phone} (คลิกเพื่อโทรออก)
                </a>
              ) : (
                "(คลิกเพื่อโชว์หมายเลข)"
              )}
            </Button>

            <LinkButton
              variant="secondary"
              href={getLineUrl(postOwner.line)}
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
