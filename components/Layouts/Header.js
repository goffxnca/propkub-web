import { Fragment, useContext, useEffect, useState } from "react";
import { Popover, Transition, Menu } from "@headlessui/react";
import {
  MenuIcon,
  XIcon,
  UserIcon,
  ChartPieIcon,
  LogoutIcon,
  HomeIcon,
  OfficeBuildingIcon,
  FlagIcon,
  QuestionMarkCircleIcon,
  MailIcon,
  PencilAltIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import Logo from "./Logo";
import Banner from "../Banner/Banner";
import { authContext } from "../../contexts/authContext";
import { joinClasses } from "../../libs/utils/style-utils";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { ChatIcon } from "@heroicons/react/solid";
import MenuLinkItem from "../UI/Public/MenuLinkItem";
import Image from "next/image";
import TownhomeIcon from "../Icons/HeroIconsV2/Townhome";
import ShopIcon from "../Icons/HeroIconsV2/Shop";

const authenticatedMobileMenus = [
  {
    name: "โปรไฟล์",
    description: "Your customers' data will be safe and secure.",
    href: "/profile",
    icon: UserIcon,
  },
  {
    name: "ออกจากระบบ",
    description: "Your customers' data will be safe and secure.",
    href: "",
    onClick: () => {
      signout("/");
    },
    icon: LogoutIcon,
  },
];

const agentUserMobileMenus = [
  {
    name: "หน้าแรก",
    description: "Your customers' data will be safe and secure.",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "โปรไฟล์",
    description: "Your customers' data will be safe and secure.",
    href: "/profile",
    icon: UserIcon,
  },
  {
    name: "แดชบอร์ด",
    description: "Your customers' data will be safe and secure.",
    href: "/dashboard",
    icon: ChartPieIcon,
  },
  {
    name: "ลงประกาศ",
    description: "Your customers' data will be safe and secure.",
    href: "/account/posts/create",
    icon: PencilAltIcon,
  },
  {
    name: "ออกจากระบบ",
    description: "Your customers' data will be safe and secure.",
    href: "",
    onClick: () => {
      signout("/");
    },
    icon: LogoutIcon,
  },
];

const normalUserMobileMenus = [
  {
    name: "หน้าแรก",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "ลงประกาศฟรี",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "/login",
    icon: PencilAltIcon,
  },
  {
    name: "ติดต่อเรา",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "/contact",
    icon: MailIcon,
  },
];

const Header = () => {
  const [bannerActive, setBannerActive] = useState(false);
  const [mobileMenus, setMobileMenus] = useState([]);

  const { signout, user, isAgent, isNormalUser, isAuthenticated, loading } =
    useContext(authContext);

  const userNavigation = [
    { name: "โปรไฟล์", href: "/profile" },
    { name: "แดชบอร์ด", href: "/dashboard" },
    { name: "ลงประกาศ", href: "/account/posts/create" },
    {
      name: "ออกจากระบบ",
      href: "",
      onClick: () => {
        signout("/");
      },
    },
  ];

  useEffect(() => {
    if (isAgent) {
      setMobileMenus(agentUserMobileMenus);
    } else if (isNormalUser) {
      setMobileMenus(normalUserMobileMenus.concat(authenticatedMobileMenus));
      setMobileMenus(agentUserMobileMenus);
    } else {
      setMobileMenus(normalUserMobileMenus);
    }
  }, [isAgent, isNormalUser]);

  const closeHeaderBannerHandler = () => {
    setBannerActive(false);
  };

  return (
    <Popover className="relative bg-white shadow-sm">
      <div className="mx-auto">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-4 md:justify-start md:space-x-10 px-4 sm:px-6">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Logo />
          </div>

          {/* Hamburgur */}
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>

          {/* Desktop Navs */}
          {!loading && (
            <Popover.Group as="nav" className="hidden md:flex space-x-10">
              <Link
                href="/"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                หน้าแรก
              </Link>

              <Link
                href="/contact"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                ติดต่อเรา
              </Link>
            </Popover.Group>
          )}

          {/* Desktop actions */}
          {!loading && !isAuthenticated && (
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link
                href="/login"
                className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
              >
                เข้าสู่ระบบ
              </Link>

              <Link
                href="/signup"
                className="ml-8 whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
              >
                สมัครใช้งาน
              </Link>
            </div>
          )}

          {/* top-right menus */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              {/* chat messages */}
              <Menu as="div" className="relative flex-shrink-0">
                <div>
                  <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                    <div className="hidden text-gray-500 text-sm font-medium lg:block">
                      <div className="relative">
                        <span className="sr-only">View chat messages</span>
                        <ChatIcon className="h-7 w-7" aria-hidden="true" />
                      </div>
                    </div>
                  </Menu.Button>
                </div>
              </Menu>

              {/* account menus */}
              <Menu as="div" className="ml-2 relative flex-shrink-0">
                <div>
                  <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                    <div
                      className={`w-8 h-8 rounded-full border border-gray-200 `}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${user.photoURL || "/user.png"}`}
                        alt=""
                        className="rounded-full w-full h-full object-cover"
                      ></img>
                    </div>

                    <span className="hidden ml-2 text-gray-700 text-sm font-medium lg:block">
                      <span className="sr-only">Open user menu for </span>
                      <span>
                        {user?.displayName || ""}
                        {isAgent && " (เอเจ้นท์)"}
                      </span>
                    </span>

                    <ChevronDownIcon
                      className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <MenuLinkItem
                            href={item.href}
                            onClick={(e) => {
                              if (item.onClick) {
                                e.preventDefault();
                                item.onClick();
                              }
                            }}
                            className={joinClasses(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </MenuLinkItem>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Hamburgur Open */}
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-30">
          {({ close }) => (
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5 ">
                <div className="flex items-center justify-between">
                  {!user && (
                    <div>
                      <Logo onClick={close} />
                    </div>
                  )}

                  {/* avatar */}
                  {user && (
                    <div className="flex items-center">
                      <div
                        className={`w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200 `}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${user.photoURL || "/user.png"}`}
                          alt=""
                          className="h-full w-full object-cover"
                        ></img>
                      </div>

                      <div className="text-primary font-bold ml-2">
                        {user?.displayName}
                      </div>
                      {isAgent && (
                        <div className="text-primary font-bold ml-1">
                          ({user?.role})
                        </div>
                      )}
                    </div>
                  )}

                  <div className="-mr-2 self-start ml-auto">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <hr className="border-b border-gray-50 my-4" />
                <div className="mt-6">
                  <nav>
                    <ul className="grid gap-y-8">
                      {mobileMenus.map((item, idx) => (
                        <div key={item.name}>
                          <li className="list-none">
                            <Link
                              href={item.href}
                              className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                              onClick={(e) => {
                                close();
                                if (item.onClick) {
                                  e.preventDefault();
                                  item.onClick();
                                }
                              }}
                            >
                              <item.icon
                                className="flex-shrink-0 h-6 w-6 text-indigo-600"
                                aria-hidden="true"
                              />
                              <span className="ml-3 text-base font-medium text-gray-900">
                                {item.name}
                              </span>
                            </Link>
                          </li>
                          {item.lineBreak && mobileMenus.length - idx > 1 && (
                            <hr className="border-b border-gray-50" />
                          )}
                        </div>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
              {/* Mobile Actions */}
              {!loading && !isAuthenticated && (
                <div className="py-6 px-5 space-y-6">
                  <div className="flex gap-4">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-hover"
                      onClick={close}
                    >
                      สมัครใช้งาน
                    </Link>

                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-accent-hover"
                      onClick={close}
                    >
                      เข้าสู่ระบบ
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Header;
