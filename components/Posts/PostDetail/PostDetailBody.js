import { getIcon } from "../../../libs/mappers/iconMapper";
import { getPriceUnit } from "../../../libs/mappers/priceUnitMapper";
import { useMemo } from "react";
import Heading from "../../UI/Public/Heading";
import LineBreak from "../../UI/Public/LineBreak";
import PostMap from "../PostMap";
import SizeIcon from "../../Icons/SizeIcon";
import SpecItem from "../Specs/SpecItem";
import LocationIcon from "../../Icons/LocationIcon";
import { formatAddressFull } from "../../../libs/formatters/addressFomatter";
import YoutubeIframe from "../../UI/Public/YoutubeIframe";
import { getAreaUnitById } from "../../../libs/mappers/areaUnitMapper";
import sanitizeHtml from "sanitize-html";
import { getAssetType } from "../../../libs/mappers/assetTypeMapper";
import { getPostType } from "../../../libs/mappers/postTypeMapper";
import { getCondition } from "../../../libs/mappers/conditionMapper";
import { InformationCircleIcon, ChartBarIcon } from "@heroicons/react/outline";
import SpinnerIcon from "../../Icons/SpinnerIcon";
import { SANITIZE_OPTIONS } from "../../../libs/constants";
import { getLocalDateByISODateString } from "../../../libs/date-utils";

const PostDetailBody = ({ post, postViews, images }) => {
  const studioSpec = post?.isStudio
    ? [
        {
          id: "studio",
          label: "ห้องสตูดิโอ",
          icon: getIcon("studio"),
        },
      ]
    : [];

  const specsFormat = studioSpec.concat(
    post?.specs.map((spec) => ({
      ...spec,
      label: `${spec.value} ${spec.label}`,
      icon: getIcon(spec.id),
    }))
  );

  const facilitiesFormat = post?.facilities.map((facility) => ({
    ...facility,
    label: facility.label,
    icon: getIcon(facility.id),
  }));

  const priceWithFormat = post?.price?.toLocaleString();

  const forRent = post.postType === "rent";
  const isLand = post.assetType === "land";

  const priceUnitFormat =
    forRent || isLand ? " / " + getPriceUnit(post.priceUnit) : "";

  const addressFormat = formatAddressFull(post.address);

  const purifiedDescInfo = useMemo(
    () => sanitizeHtml(post.desc, SANITIZE_OPTIONS),
    [post.desc]
  );

  const postType = getPostType(post.postType);

  const assetType = getAssetType(post.assetType);

  const condition = getCondition(post.condition);

  return (
    <div className="">
      <div className="space-y-2 md:mb-6 md:flex items-center justify-between ">
        <div className="flex items-center">
          <span className="text-gray-700 text-xl mr-1">{postType}</span>
          <span className="text-primary font-bold text-3xl">
            {priceWithFormat}
          </span>
          <span className="text-gray-700 text-xl ml-1">
            บาท{priceUnitFormat}
          </span>
        </div>

        <div>
          <ul className="md:flex md:flex-wrap w-full gap-x-4">
            {post.area > 0 && (
              <SpecItem
                className=""
                Icon={SizeIcon}
                label={`พื้นที่ใช้สอย ${post.area} ${getAreaUnitById(
                  post.areaUnit
                )}`}
              />
            )}

            {post.land > 0 && (
              <SpecItem
                className=""
                Icon={SizeIcon}
                label={`ขนาดที่ดิน ${post.land} ${getAreaUnitById(
                  post.landUnit
                )}`}
              />
            )}
          </ul>
        </div>
      </div>

      <>
        <LineBreak />
        <div>
          <Heading size="2" label="ข้อมูลเบื้องต้น" />
          <div className="md:flex md:flex-wrap text-gray-700">
            <div className="md:w-1/2">
              ประเภท: {postType}
              {assetType}
            </div>
            {condition && <div className="md:w-1/2">สภาพ: {condition}</div>}
            <div className="md:w-1/2">เลขประกาศ: {post.postNumber}</div>
            {post.refId && (
              <div className="md:w-1/2">เลขอ้างอิง: {post.refId}</div>
            )}
            <div className="md:w-1/2">
              วันที่ลงประกาศ: {getLocalDateByISODateString(post.createdAt)}
            </div>
            {post.updatedAt && (
              <div className="md:w-1/2">
                วันที่อัพเดทล่าสุด:{" "}
                {getLocalDateByISODateString(post.updatedAt)}
              </div>
            )}
          </div>
        </div>
      </>

      {specsFormat.length > 0 && (
        <>
          <LineBreak />
          <div>
            <Heading size="2" label="แปลน" />
            <div>
              <ul className="flex flex-wrap w-full gap-y-4">
                {specsFormat?.map((spec) => (
                  <SpecItem
                    className="w-1/2"
                    key={spec.id}
                    Icon={spec.icon}
                    label={spec.label}
                  />
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      <LineBreak />
      <div className="wysiwyg-content">
        <Heading size="2" label="รายละเอียด" />
        <div
          className="text-gray-700 break-words"
          dangerouslySetInnerHTML={{ __html: purifiedDescInfo }}
        />
      </div>

      {facilitiesFormat.length > 0 && (
        <>
          <LineBreak />
          <div>
            <Heading size="2" label="สิ่งอำนวยความสะดวกและสาธารณูปโภค" />
            <div>
              <ul className="flex flex-wrap w-full gap-y-4">
                {facilitiesFormat?.map((facility) => (
                  <SpecItem
                    className="w-1/2"
                    key={facility.label}
                    Icon={facility.icon}
                    label={facility.label}
                  />
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {post.video && (
        <>
          <LineBreak />
          <div>
            <Heading size="2" label="วิดีโอ" />
            <YoutubeIframe youtubeUrl={post.video} />
          </div>
        </>
      )}

      <LineBreak />
      <div>
        <Heading size="2" label="ทำเลที่ตั้ง" />

        <address className="not-italic">
          <div className="flex items-center">
            <LocationIcon className="text-gray-soft" />
            <p className="ml-2">{addressFormat}</p>
          </div>
        </address>
        <PostMap
          lat={post?.address?.location?.lat}
          lng={post?.address?.location?.lng}
        />

        {/* {post?.address?.location?.h >= 0 && ( */}
        {true && (
          <>
            <span className="text-sm text-gray-500">
              ด้านล่างเป็นภาพ Google Map Streetview ณ จุดที่ผู้ลงประกาศปัก Map
              คุณสามารถเลื่อนซ้ายขวาเพื่อดูบรรยากาศรอบๆได้
              (โปรดทราบว่าในบางกรณี/บางพื้นที่ ภาพอาจไม่อัพเดทตรงกับปีปัจจุบัน)
            </span>
            <PostMap
              mode="streetview"
              lat={post?.address?.location?.lat}
              lng={post?.address?.location?.lng}
              heading={post?.address?.location?.h}
            />
          </>
        )}
      </div>

      <LineBreak />
      <div className="wysiwyg-content">
        <Heading size="2" label="รูปภาพ" />
        <div className="">
          {images.map((image, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={image.original}
              className="mx-auto mt-2"
              alt=""
            ></img>
          ))}
        </div>
      </div>

      <LineBreak />
      <div>
        {/* <Heading size="2" label="อื่นๆ" /> */}
        <div className="flex gap-y-2 flex-wrap justify-between">
          <div className="flex items-center text-gray-500">
            <ChartBarIcon className="w-5 h-5" />

            <p className="text-base font-medium ml-1">
              เข้าชม ({postViews || 0})
            </p>
          </div>

          {/* <div className="flex items-center text-gray-500 hover:text-gray-900 cursor-pointer w-1/2">
            <InformationCircleIcon className="w-5 h-5" />
            <p className="text-base font-medium ml-1">รายงานประกาศ</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PostDetailBody;
