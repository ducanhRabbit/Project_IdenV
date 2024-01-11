import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { NavMenu } from "../../shared/types";

interface MenuModalProps{
  children: React.ReactNode
  menuList: NavMenu[],
  menuWrapperClass?:string,
  menuClass?:string,
  subClass?:string,
}

export default function MenuModal({
  children,
  menuList,
  menuWrapperClass = "menu-wrapper",
  menuClass = "menu-item",
  subClass = "sub-item",
}:MenuModalProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>{children}</Menu.Button>
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
        <Menu.Items
          className={
            "absolute mt-2 right-0 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none " +
            menuWrapperClass
          }
        >
          {menuList.map((menu, index) => (
            <div key={index}>
              {menu.subMenu ? (
                <div>
                  <div className="sub-title">{menu.tag}</div>
                  {menu.subMenu.map((sub,index) => (
                    <Menu.Item key={index}>
                      <Link
                        to={sub?.link || ""}
                        onClick={sub?.action}
                        className={menuClass + " block"}
                      >
                        {sub.tag}
                      </Link>
                    </Menu.Item>
                  ))}
                </div>
              ) : (
                <Menu.Item key={index}>
                  {menu.link ? (
                    <Link
                      to={menu?.link || ""}
                      onClick={menu?.action}
                      className={menuClass + " block"}
                    >
                      {menu.tag}
                    </Link>
                  ) : (
                    <div onClick={menu?.action}></div>
                  )}
                </Menu.Item>
              )}
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
