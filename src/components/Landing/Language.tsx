import { Menu, Transition } from "@headlessui/react";
import { Fragment} from "react";

export default function Language() {
  const languages = [
    {
      tag: "English",
      link: "123",
    },
    {
      tag: "繁體中文",
      link: "456",
    },
    {
      tag: "日本語",
      link: " 789",
    },
    {
      tag: "한국어",
      link: "8621",
    },
  ];
  return (
    <Menu as="div" className=" inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center text-base font-medium text-[#dde8f1] hover:hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          Language
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
        <Menu.Items className="absolute right-3 w-16 mt-2 origin-center  rounded-md bg-transparent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {languages.map((language, index) => {
            return (
              <Menu.Item key={index}>
                {({ active }) => (
                  <a
                    href={language.link}
                    className={`${
                      active ? " text-[#d07491]" : "text-[#dde8f1]"
                    } w-full items-center rounded-md  text-base block text-left`}
                  >
                    {language.tag}
                  </a>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
