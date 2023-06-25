import { useRouter } from "next/router";

import { getAssetType } from "../../libs/mappers/assetTypeMapper";
import { getPostType } from "../../libs/mappers/postTypeMapper";
import { getStatusLabelById } from "../../libs/mappers/statusMapper";

import PageTitle from "../UI/Private/PageTitle";
import Button from "../UI/Public/Button";
import DataTable from "../UI/Public/DataTable/DataTable";
import Stats from "./Stats";
import {
  EyeIcon,
  PencilAltIcon,
  SearchIcon,
  ClockIcon,
  CheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/outline";
import { getSubStatusLabelById } from "../../libs/mappers/subStatusMapper";

const MyPropertyList = ({ myPosts = [] }) => {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <PageTitle label="แดชบอร์ด" />

      <Stats myPosts={myPosts} />

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {/* <h1 className="text-xl font-semibold text-gray-900">
              ประกาศทั้งหมดของฉัน
            </h1> */}
            {/* <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name,
              title, email and role.
            </p> */}
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              type="submit"
              variant="primary"
              onClick={() => {
                router.push("/agent/addpost");
              }}
            >
              ลงประกาศ
            </Button>
          </div>
        </div>

        <DataTable
          items={myPosts}
          columns={[
            {
              title: "",
              field: "viewPublic",
              custom: (item) => (
                <a
                  href={`property/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:text-primary-hover hover:underline"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                </a>
              ),
            },
            {
              title: "",
              field: "view",
              custom: (item) => (
                <a
                  href={`/account/posts/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:text-primary-hover hover:underline"
                >
                  <SearchIcon className="w-4 h-4" />
                </a>
              ),
            },
            { title: "#", field: "postNumber" },
            { title: "วันที่", field: "createdAt" },
            {
              title: "รูป",
              field: "image",
              custom: (item) => (
                <div className="h-12 w-12 ">
                  <img
                    src={item.thumbnail}
                    className="h-12 w-12 object-cover rounded-sm"
                  />
                </div>
              ),
            },
            // {
            //   title: "ติด Google?",
            //   field: "indexed",
            //   resolver: (item) =>
            //     item.indexed ? (
            //       <CheckIcon className="w-6 h-6 text-green-600 font-extrabold" />
            //     ) : (
            //       <ClockIcon className="w-4 h-4" />
            //     ),
            // },
            {
              title: "สถานะ",
              field: "status",
              custom: (item) => (
                <span
                  className={`rounded-full ${
                    item.status === "active"
                      ? "bg-green-100  text-green-800"
                      : "bg-red-100 text-red-800"
                  }  px-2 text-xs leading-5`}
                >
                  {getSubStatusLabelById(item.subStatus)}
                </span>
              ),
            },
            { title: "หัวข้อ", field: "title" },
            {
              title: "ประเภท",
              field: "assetType",
              resolver: (item) => getAssetType(item.assetType),
            },

            {
              title: "สำหรับ",
              field: "postType",
              resolver: (item) => getPostType(item.postType),
            },
            {
              title: "จังหวัด",
              field: "address.provinceId",
              resolver: (item) => item.address.provinceLabel,
            },
            {
              title: "เข้าชม",
              field: "postViews",
              resolver: (item) => item.postViews || 0,
            },
            {
              title: "ดูเบอร์",
              field: "phoneViews",
              resolver: (item) => item.phoneViews || 0,
            },
            {
              title: "ดูไลน์",
              field: "lineViews",
              resolver: (item) => item.lineViews || 0,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MyPropertyList;
