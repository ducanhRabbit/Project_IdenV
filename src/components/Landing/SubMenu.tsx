import { useState } from "react";
import { motion } from "framer-motion";
import { NavMenu } from "../../shared/types";

interface SubMenuProps {
  data:NavMenu
}
function SubMenu({ data }:SubMenuProps) {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  return (
    <>
      <li className={"text-xl border-b-2 border-[#121212]" + (subMenuOpen ? " bg-primary" : "")}>
        <div
          className="p-4 flex justify-between items-center"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          {data.tag}
          <div
            className={
              "w-[20px] ease-in-out duration-300" +
              `${subMenuOpen ? " rotate-90" : ""}`
            }
          >
            <img src="https://i.ibb.co/sCfjYTr/Next-no-Circle.png" alt="" />
          </div>
        </div>
      </li>
      <motion.ul
        animate={
          subMenuOpen
            ? {
                height: "fit-content",
              }
            : {
                height: 0,
              }
        }
        className="h-0 overflow-hidden text-lg"
      >
        {data.subMenu && data.subMenu.map((subMenu, index) => (
          <li key={index} className=" px-5 py-4 bg-[#121212]">{subMenu.tag}</li>
        ))}
      </motion.ul>
    </>
  );
}

export default SubMenu;
