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
import {
  PencilAltIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import SpinnerIcon from "../../Icons/SpinnerIcon";

const sanitizerOptions = {
  allowedTags: ["p", "strong", "em", "u", "ol", "ul", "li", "br", "a"],
};

const PostDetailBody = ({ post, postViews, images }) => {
  const router = useRouter();

  const studioSpec = post?.isStudio
    ? [
        {
          id: "studio",
          label: "ห้องสตูดิโอ",
          icon: getIcon("studio"),
        },
      ]
    : [];

  const specsFormat = useMemo(
    () =>
      studioSpec.concat(
        post?.specs.map((spec) => ({
          ...spec,
          label: `${spec.value} ${spec.label}`,
          icon: getIcon(spec.id),
        }))
      ),
    [post]
  );

  const facilitiesFormat = useMemo(
    () =>
      post?.facilities.map((facility) => ({
        ...facility,
        label: facility.label,
        icon: getIcon(facility.id),
      })),
    [post]
  );

  const priceWithFormat = useMemo(
    () => post?.price?.toLocaleString(),
    [post.price]
  );

  const priceUnitFormat = useMemo(
    () => (post?.priceUnit ? ` / ${getPriceUnit(post?.priceUnit)}` : ""),
    [post.priceUnit]
  );

  const addressFormat = useMemo(
    () => formatAddressFull(post.address),
    [post.address]
  );

  const purifiedDescInfo = useMemo(
    () => sanitizeHtml(post.desc, sanitizerOptions),
    [post.desc]
  );

  const postType = useMemo(() => getPostType(post.postType), [post.postType]);

  const assetType = useMemo(
    () => getAssetType(post.assetType),
    [post.assetType]
  );

  const condition = useMemo(
    () => getCondition(post.condition),
    [post.condition]
  );

  const onClickEditPost = () => {
    router.push(`/property/edit/${post.id}`);
  };

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
            {condition && (
              <div className="md:w-1/2">ลักษณะทรัพย์: {condition}</div>
            )}
            <div className="md:w-1/2">เลขประกาศ: {post.postNumber}</div>
            {post.refId && (
              <div className="md:w-1/2">เลขอ้างอิง: {post.refId}</div>
            )}
            <div className="md:w-1/2">วันที่ลงประกาศ: {post.createdAt}</div>
            {post.updatedAt && (
              <div className="md:w-1/2">
                วันที่อัพเดทล่าสุด: {post.updatedAt}
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
              (โปรดทราบว่าในบางกรณี/บางพื้นที่
              ภาพของอาจไม่อัพเดทเป็นของปีปัจจุบัน)
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
            <img
              key={index}
              src={image.original}
              className="mx-auto mt-2"
            ></img>
          ))}
        </div>
      </div>

      <LineBreak />
      <div>
        {/* <Heading size="2" label="อื่นๆ" /> */}
        <div className="flex gap-y-2 flex-wrap justify-between">
          <div className="flex items-center text-gray-500 hover:text-gray-900 cursor-pointer w-1/2">
            <ChartBarIcon className="w-5 h-5" />
            {postViews === -1 && (
              <div className="animate-spin">
                <SpinnerIcon className="w-4 h-4" />
              </div>
            )}
            {postViews >= 0 && (
              <p className="text-base font-medium ml-1">
                เข้าชม ({postViews || 0})
              </p>
            )}
          </div>

          {post?.contact?.passcode && (
            <div
              className="flex items-center text-gray-500 hover:text-gray-900 cursor-pointer w-1/2"
              onClick={onClickEditPost}
            >
              <PencilAltIcon className="w-5 h-5" />
              <p className="text-base font-medium ml-1">แก้ไขประกาศ</p>
            </div>
          )}

          <div className="flex items-center text-gray-500 hover:text-gray-900 cursor-pointer w-1/2">
            <InformationCircleIcon className="w-5 h-5" />
            <p className="text-base font-medium ml-1">รายงานประกาศ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailBody;
