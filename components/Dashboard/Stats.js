import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";
import {
  EyeIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  PhoneIcon,
  ChatIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { joinClasses } from "../../libs/utils/style-utils";

const Stats = ({ myPosts }) => {
  const stats = [
    {
      id: 1,
      name: "ประกาศของฉันทั้งหมด",
      stat: myPosts.length,
      icon: DocumentDuplicateIcon,
      change: "122",
      changeType: "increase",
    },
    {
      id: 2,
      name: "เข้าชม (ครั้ง)",
      stat: myPosts.reduce(
        (partialSum, p) => partialSum + (p.postViews || 0),
        0
      ),
      icon: EyeIcon,
      change: "5.4%",
      changeType: "increase",
    },
    {
      id: 3,
      name: "กดดูเบอร์ (ครั้ง)",
      stat: myPosts.reduce(
        (partialSum, p) => partialSum + (p.phoneViews || 0),
        0
      ),
      icon: PhoneIcon,
      change: "3.2%",
      changeType: "decrease",
      note: "**นี่คือจำนวนครั้งที่กดดูเบอร์ แต่ทางเราไม่ทราบว่าผู้เข้าชมประกาศโทรไปหาท่านหรือไม่",
    },
    {
      id: 4,
      name: "กดดูไลน์ (ครั้ง)",
      stat: myPosts.reduce(
        (partialSum, p) => partialSum + (p.lineViews || 0),
        0
      ),
      icon: ChatIcon,
      change: "3.2%",
      changeType: "decrease",
      note: "**นี่คือจำนวนครั้งที่กดดูไลน์ แต่ทางเราไม่ทราบว่าผู้เช้าชมประกาศแอดไลน์ไปหาท่านหรือไม่",
    },
    {
      id: 5,
      name: "ติด Google",
      stat: myPosts.filter((p) => !!p.indexed).length || 0,
      icon: SearchIcon,
      change: "122",
      changeType: "increase",
      link: {
        caption: "อ่านเพิ่มเติมเกี่ยวกับการติด Google",
        href: "https://propkub.com/guides/google-indexing",
      },
    },
  ];

  return (
    <div>
      {/* <h3 className="text-lg font-medium leading-6 text-gray-900">
        ข้อมูลสถิติ
      </h3> */}

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>

            <dd className="ml-16 flex items-baseline pb-2 sm:pb-2">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>

              {/* <p
                className={joinClasses(
                  //   item.changeType === "increase"
                  //     ? "text-green-600"
                  //     : "text-red-600",
                  "ml-2 flex items-baseline text-sm font-semibold"
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                )}

                <span className="sr-only">
                  {item.changeType === "increase" ? "Increased" : "Decreased"}
                  by
                </span>
              </p> */}

              {item.link && (
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a
                      href={item.link.href}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.link.caption}
                      <span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div>
              )}
            </dd>
            <p className="text-xs text-gray-400 font-light italic mb-1">
              {item.note}
            </p>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Stats;
