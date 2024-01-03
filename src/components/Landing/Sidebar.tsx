import { MdClose } from "react-icons/md";
import SubMenu from "./SubMenu";
import React from "react";
import { NavMenu } from "../../shared/types";
import BlackBackdrop from "../shared/BlackBackDrop";

interface SidebarProps {
  sidebarOpen: Boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const navList: NavMenu[] = [
    {
      tag: "Home",
      link: "123",
      subMenu: null,
    },
    {
      tag: "News",
      link: "456",
      subMenu: null,
    },
    {
      tag: "Characters",
      link: " 789",
      subMenu: null,
    },
    {
      tag: "Features",
      link: "8621",
      subMenu: null,
    },
    {
      tag: "Others",
      subMenu: [
        {
          tag: "Background",
          link: "#",
          subMenu: null,
        },
        {
          tag: "Goods",
          link: "#",
          subMenu: null,
        },
        {
          tag: "IDV art museum",
          link: "#",
          subMenu: null,
        },
      ],
    },
    {
      tag: "Languages",
      subMenu: [
        {
          tag: "English",
          link: "#",
          subMenu: null,
        },
        {
          tag: "繁體中文",
          link: "#",
          subMenu: null,
        },
        {
          tag: "日本語",
          link: "#",
          subMenu: null,
        },
        {
          tag: "한국어",
          link: "#",
          subMenu: null,
        },
      ],
    },
  ];
  return (
    <>
      <div
        className={
          `text-white min-w-[250px]  w-[40vw] h-full bg-[#292d2e] top-0 fixed right-0 z-50 overflow-y-scroll scrollbar-hide ease-in duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`
        }
      >
        <div className="sidebar-content h-full">
          <div className="flex justify-between items-center px-5 py-6 bg-[#121212]/[0.9]">
            <div className="text-4xl tracking-wider">M.E.N.U</div>
            <MdClose
              size={40}
              color="white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
          <ul className="nav-list ">
            {navList.map((nav, index) => (
              <div key={index}>
                {nav.subMenu ? (
                  <SubMenu data={nav} />
                ) : (
                  <li className=" text-xl border-b-2 border-[#121212]/[0.9]">
                    <div className="p-4 ">{nav.tag}</div>
                  </li>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
      {
        sidebarOpen && <BlackBackdrop
        className=""
        onCloseBlackBackdrop={() => {
          setSidebarOpen(false);
        }}
      ><></></BlackBackdrop>
      }
      
    </>
  );
}

export default Sidebar;
