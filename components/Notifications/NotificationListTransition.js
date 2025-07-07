import { Transition, Menu } from "@headlessui/react";
import { Fragment } from "react";
import { joinClasses } from "../../libs/utils/style-utils";
import MenuLinkItem from "../UI/Public/MenuLinkItem";
import NotificationItem from "./NotificationItem";

const NotificationListTransition = ({
  notifications = [],
  markNotificationAsRead,
}) => {
  return (
    <>
      {notifications.length > 0 && (
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
            {/* <h3>แจ้งเตือน</h3> */}
            {notifications.map((item) => (
              <Menu.Item key={item.id}>
                {({ active }) => (
                  <MenuLinkItem
                    href={item.href}
                    onClick={(e) => {
                      //if read before, just let's the link direct to detail page
                      if (item.read) {
                        return;
                      }

                      readNotification(item.id)
                        .then(() => {
                          markNotificationAsRead(item.id);
                        })
                        .catch((ex) => {
                          console.error(ex);
                        });
                    }}
                    className={joinClasses(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700 border-b"
                    )}
                  >
                    <NotificationItem
                      title={item.title}
                      read={item.read}
                      createdAtISO={item.createdAtISO}
                    />
                  </MenuLinkItem>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      )}
    </>
  );
};

export default NotificationListTransition;
