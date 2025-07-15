import { useMemo } from "react";
import PageTitle from "../../UI/Private/PageTitle";
import sanitizeHtml from "sanitize-html";
import { getPostType } from "../../../libs/mappers/postTypeMapper";
import { getAssetType } from "../../../libs/mappers/assetTypeMapper";
import { getCondition } from "../../../libs/mappers/conditionMapper";
import { getAreaUnitById } from "../../../libs/mappers/areaUnitMapper";
import { getPriceUnit } from "../../../libs/mappers/priceUnitMapper";
import { formatAddressFull } from "../../../libs/formatters/addressFomatter";
import { getSpecLabel } from "../../../libs/mappers/specMapper";
import { orDefault } from "../../../libs/string-utils";
import PostDetailStats from "./PostDetailStats";
import PostActionConsole from "./PostActionConsole";
import PostStatusBadge from "../PostStatusBadge/PostStatusBadge";
import PostTimeline from "./PostTimeline";
import { SANITIZE_OPTIONS } from "../../../libs/constants";

const PostDetailPreview = ({ post, postActions }) => {
  // Calculated fields - exact order from posts.schema.ts

  // Required fields (schema order)
  const title = post.title;
  const purifiedDescInfo = useMemo(
    () => sanitizeHtml(post.desc, SANITIZE_OPTIONS),
    [post.desc]
  );
  const assetType = getAssetType(post.assetType);
  const postType = getPostType(post.postType);
  const priceWithUnit = post.priceUnit
    ? `${post.price.toLocaleString()}/${getPriceUnit(post.priceUnit)}`
    : post.price.toLocaleString();
  const thumbnail = post.thumbnail;
  const images = post.images;
  const facilities = orDefault(post.facilities.map((p) => p.label).join(", "));

  const specs = orDefault(
    post.specs
      .map((spec) => {
        const thaiLabel = getSpecLabel(spec.id);
        return `${thaiLabel}: ${spec.value}`;
      })
      .join(", ")
  );

  const address = formatAddressFull(post.address);
  const postNumber = post.postNumber;

  // Optional fields (schema order)
  const isStudio =
    post.isStudio !== undefined ? (post.isStudio ? "ใช่" : "ไม่ใช่") : "-";
  const video = orDefault(post.video);
  const landWithUnit =
    post.land && post.landUnit
      ? `${post.land} ${getAreaUnitById(post.landUnit)}`
      : orDefault(post.land);
  const areaWithUnit =
    post.area && post.areaUnit
      ? `${post.area} ${getAreaUnitById(post.areaUnit)}`
      : orDefault(post.area);
  const condition = orDefault(post.condition && getCondition(post.condition));
  const agentRefNumber = orDefault(post.refId);
  const createdAt = new Date(post.createdAt).toLocaleDateString("th-TH");
  const updatedAt = orDefault(
    post.updatedAt && new Date(post.updatedAt).toLocaleDateString("th-TH")
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle label="รายละเอียดประกาศ" />
      <div className="lg:flex space-y-2 lg:space-x-2 lg:space-y-0">
        {/* Left Main Content */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg lg:w-2/3">
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  หมายเลขประกาศ
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {postNumber}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">สถานะ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <PostStatusBadge status={post.status} />
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  หัวข้อประกาศ
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {title}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  รายละเอียด
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <div
                    className="break-words"
                    dangerouslySetInnerHTML={{ __html: purifiedDescInfo }}
                  />
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  ประเภททรัพย์
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {assetType}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  ลักษณะทรัพย์
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {condition}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">สำหรับ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {postType}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ที่ตั้ง</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {address}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ราคา</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {priceWithUnit}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  พื้นที่ใช้สอย
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {areaWithUnit}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  ขนาดที่ดิน
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {landWithUnit}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">รูปหลัก</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <img
                    src={thumbnail}
                    className="h-20 w-20 object-cover rounded-sm"
                    alt="thumbnail"
                  />
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">รูปภาพ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul className="flex flex-wrap">
                    {images.map((image, index) => (
                      <li key={index} className="m-1">
                        <img
                          src={image}
                          className="h-20 w-20 object-cover rounded-sm"
                          alt={`image-${index}`}
                        />
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">วิดีโอ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {video}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  สาธารณูปโภค
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {facilities}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  ข้อมูลห้อง
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {specs}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  ห้อง Studio
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {isStudio}
                </dd>
              </div>

              {/* Optional fields */}

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  หมายเลขอ้างอิง
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {agentRefNumber}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  วันที่สร้าง
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {createdAt}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  วันที่แก้ไข
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updatedAt}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Side Bar */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg lg:w-1/3 p-4 space-y-2">
          <PostDetailStats
            postViews={post.views?.post || 0}
            phoneViews={post.views?.phone || 0}
            lineViews={post.views?.line || 0}
          />
          <PostTimeline postActions={post.postActions} />
          <PostActionConsole
            postId={post.id}
            postSlug={post.slug}
            postStatus={post.status}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPreview;
