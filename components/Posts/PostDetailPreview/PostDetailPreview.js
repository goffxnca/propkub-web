import { useMemo } from "react";
import PageTitle from "../../UI/Private/PageTitle";
import sanitizeHtml from "sanitize-html";
import { getPostType } from "../../../libs/mappers/postTypeMapper";
import { getAssetType } from "../../../libs/mappers/assetTypeMapper";
import { getCondition } from "../../../libs/mappers/conditionMapper";
import { getAreaUnitById } from "../../../libs/mappers/areaUnitMapper";
import { getPriceUnit } from "../../../libs/mappers/priceUnitMapper";
import { formatAddressFull } from "../../../libs/formatters/addressFomatter";
import { getStatusLabelById } from "../../../libs/mappers/statusMapper";
import PostActionList from "./PostActionList";
import PostDetailStats from "./PostDetailStats";
import PostActionConsole from "./PostActionConsole";
import { SANITIZE_OPTIONS } from "../../../libs/constants";

const PostDetailPreview = ({ post, postActions }) => {
  const postType = useMemo(() => getPostType(post.postType), [post.postType]);

  const assetType = useMemo(
    () => getAssetType(post.assetType),
    [post.assetType]
  );

  const condition = useMemo(
    () => getCondition(post.condition),
    [post.condition]
  );

  const purifiedDescInfo = useMemo(
    () => sanitizeHtml(post.desc, SANITIZE_OPTIONS),
    [post.desc]
  );

  const isStudio = useMemo(
    () => (post.isStudio ? "ใช่" : "ไม่ใช่"),
    [post.isStudio]
  );

  const bedRooms = post.specs.find((x) => x.id === "beds")?.value || 0;
  const bathRooms = post.specs.find((x) => x.id === "baths")?.value || 0;
  const kitchenRooms = post.specs.find((x) => x.id === "kitchens")?.value || 0;
  const parkings = post.specs.find((x) => x.id === "parkings")?.value || 0;

  const price = post.price.toLocaleString();
  const priceUnit = post?.priceUnit
    ? ` / ${getPriceUnit(post?.priceUnit)}`
    : "";

  const area = `${post.area} ${getAreaUnitById(post.areaUnit)}`;
  const facilities = post.facilities.map((p) => p.label).join(", ");
  const agentRefNumber = post.refNumber || "-";
  const address = formatAddressFull(post.address);

  const status = getStatusLabelById(post.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle label="รายละเอียดประกาศ" />
      <div className="lg:flex space-y-2 lg:space-x-2 lg:space-y-0">
        {/* Left Main Content */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg lg:w-2/3">
          {/* <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              ประกาศหมายเลข {post.postNumber}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{post.title}</p>
          </div> */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 ">
                <dt className="text-sm font-medium text-gray-500">
                  หมายเลขประกาศ
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-semibold">
                  {post.postNumber}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  หัวข้อประกาศ
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {post.title}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">สถานะ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span
                    className={`rounded-full ${
                      post.status === "active"
                        ? "bg-green-100 text-green-800"
                        : post.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : post.status === "hold"
                        ? "bg-orange-100 text-orange-800"
                        : post.status === "sold"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    } px-2 text-xs leading-5`}
                  >
                    {status}
                  </span>
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
                <dt className="text-sm font-medium text-gray-500">สำหรับ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {postType}
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
                <dt className="text-sm font-medium text-gray-500">
                  พื้นที่ใช้สอย
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {area}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  ห้องประเภท Studio
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {isStudio}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ห้องนอน</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {bedRooms}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ห้องน้ำ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {bathRooms}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ห้องครัว</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {kitchenRooms}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ที่จอดรถ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {parkings}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ราคา</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {price} {priceUnit}
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
                  สาธารณูปโภคอื่นๆ
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {facilities}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  หมายเลขอ้างอิง
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {agentRefNumber}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">รูปภาพ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul className="flex flex-wrap">
                    {post.images.map((image) => (
                      <li key={image} className="m-1">
                        <img
                          src={image}
                          className="h-20 w-20 object-cover rounded-sm"
                        />
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ที่ตั้ง</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {address}
                </dd>
              </div>

              {/* <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <pre>{JSON.stringify(post, null, 2)}</pre>
                </dd>
              </div> */}
            </dl>
          </div>
        </div>

        {/* Right Side Bar */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg lg:w-1/3 p-4 space-y-2">
          <PostDetailStats
            postViews={post.postViews}
            phoneViews={post.phoneViews}
            lineViews={post.lineViews}
          />
          <PostActionList postActions={postActions} />
          <PostActionConsole
            postId={post.id}
            postSlug={post?.slug}
            postStatus={post.status}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPreview;
