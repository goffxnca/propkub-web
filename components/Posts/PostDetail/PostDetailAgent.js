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

const PostDetailAgent = ({ postId, postOwner }) => {
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneClick = async () => {
    if (phoneVisible) return;

    setIsLoading(true);
    setError("");

    try {
      await increasePhoneView(postId);
      setPhoneVisible(true);
    } catch (error) {
      console.error("Failed to increase phone view:", error);
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineClick = async () => {
    setIsLoading(true);
    setError("");

    try {
      await increaseLineView(postId);
    } catch (error) {
      console.error("Failed to increase line view:", error);
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
      <>
        <LineBreak />
        <div className="flex flex-col">
          <Button
            variant="primary"
            onClick={handlePhoneClick}
            disabled={isLoading}
            loading={isLoading}
            Icon={
              phoneVisible ? (
                <PhoneIcon className="text-white w-6 h-6" />
              ) : undefined
            }
          >
            {phoneVisible ? (
              <a href={`tel:${postOwner.phone}`}>
                {postOwner.phone} (คลิกเพื่อโทรออก)
              </a>
            ) : isLoading ? (
              "กำลังดึงข้อมูล"
            ) : (
              "(คลิกเพื่อโชว์หมายเลข)"
            )}
          </Button>

          <LinkButton
            variant="secondary"
            href={getLineUrl(postOwner.line)}
            onClick={handleLineClick}
            disabled={isLoading}
          >
            <LineIcon className="text-green-500 md:w-6 md:h-6 mr-1" />
            {isLoading ? "กำลังดึงข้อมูล..." : "แอดไลน์"}
          </LinkButton>

          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>
      </>
    </>
  );
};

export default PostDetailAgent;
