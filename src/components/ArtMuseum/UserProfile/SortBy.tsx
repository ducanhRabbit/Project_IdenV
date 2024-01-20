import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { DiGhostSmall } from "react-icons/di";
import { useSearchParams } from "react-router-dom";

import { FaCheck } from "react-icons/fa";
import { SortOption } from "../../../shared/types";

interface SortByProps{
  optionsList: SortOption[]
}

function SortBy({ optionsList }:SortByProps) {
  const [selectedOption, setSelectedOption] = useState(optionsList[0]);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Listbox
      value={selectedOption}
      onChange={(option) => {
        setSelectedOption(option);
        searchParams.set("sortBy", option["value"] || "");
        setSearchParams(searchParams);
      }}
      as="div"
      className={"relative z-20"}
    >
      <Listbox.Button className="p-3 rounded-full bg-white active:scale-95 duration-200 hover:bg-[#efefef]">
        <DiGhostSmall size={20} color="#000" />
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Listbox.Options
          className={
            "absolute left-0 min-w-[150px] mt-2 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 text-black"
          }
        >
          {optionsList.map((option, index) => (
            <Listbox.Option value={option.value} key={index}>
              {({ active, selected }) => (
                <>
                  <div
                    className={`relative py-2 px-2 rounded-md  w-full inline-block cursor-pointer ${
                      active ? "bg-[#cc0000] text-white" : "bg-white text-black"
                    }`}
                  >
                    {option.label}
                    {selected ? (
                      <div
                        className={`absolute right-2 top-1/2 -translate-y-1/2`}
                      >
                        <FaCheck color={`${active ? "#fff" : "#cc0000"}`} />
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}

export default SortBy;
