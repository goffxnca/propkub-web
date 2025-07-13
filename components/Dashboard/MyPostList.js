import { useRouter } from "next/router";

import { getAssetType } from "../../libs/mappers/assetTypeMapper";
import { getPostType } from "../../libs/mappers/postTypeMapper";
import { getStatusLabelById } from "../../libs/mappers/statusMapper";

import PageTitle from "../UI/Private/PageTitle";
import Button from "../UI/Public/Button";
import DataTable from "../UI/Public/DataTable/DataTable";
import Stats from "./Stats";
import Modal from "../UI/Public/Modal";
import {
  SearchIcon,
  GlobeAltIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";

import { useState, useEffect } from "react";
import { getMyPosts } from "../../libs/post-utils";

const MyPropertyList = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResult = await getMyPosts(10, 0);
        setMyPosts(postsResult);
      } catch (error) {
        console.error("Error fetching my posts:", error);
        setApiError("เกิดข้อผิดพลาดในการโหลดข้อมูลประกาศ");
      }
    };
    fetchPosts();
  }, []);

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
                  href={`/account/posts/${item._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:text-primary-hover hover:underline"
                >
                  <SearchIcon className="w-4 h-4" />
                </a>
              ),
            },
            { title: "เลขประกาศ", field: "postNumber" },
            {
              title: "ลงวันที่",
              field: "createdAt",
              resolver: (item) =>
                new Date(item.createdAt).toLocaleDateString("th-TH"),
            },
            {
              title: "รูปภาพ",
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
            {
              title: "สถานะ",
              field: "status",
              custom: (item) => (
                <span
                  className={`rounded-full ${
                    item.status === "active"
                      ? "bg-green-100 text-green-800"
                      : item.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : item.status === "hold"
                      ? "bg-orange-100 text-orange-800"
                      : item.status === "sold"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  } px-2 text-xs leading-5`}
                >
                  {getStatusLabelById(item.status)}
                </span>
              ),
            },
            { title: "หัวข้อประกาศ", field: "title" },
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
              resolver: (item) => item.views?.post || 0,
            },
            {
              title: "ดูเบอร์",
              field: "phoneViews",
              resolver: (item) => item.views?.phone || 0,
            },
            {
              title: "ดูไลน์",
              field: "lineViews",
              resolver: (item) => item.views?.line || 0,
            },
          ]}
        />
      </div>

      <Modal
        visible={!!apiError}
        Icon={ExclamationIcon}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc={apiError}
        buttonCaption="ตกลง"
        onClose={() => {
          setApiError("");
        }}
      />
    </div>
  );
};

export default MyPropertyList;
