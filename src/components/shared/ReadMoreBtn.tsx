import React from "react";

interface ReadMoreBtnProps{
  children: string,
  limitedLetter:number,
  setActiveReadmore: React.Dispatch<React.SetStateAction<boolean>>,
  startIndex?:number
}

function ReadMoreBtn({
  children,
  limitedLetter,
  setActiveReadmore,
  startIndex = 0,
}:ReadMoreBtnProps) {
  return (
    <>
      <span className="duration-300 break-all hyphens-auto">
        {children?.length < limitedLetter
          ? children
          : children?.substring(startIndex, limitedLetter) + "..."}
        {children?.length > limitedLetter && (
          <button
            className="inline-block text-sm text-[#cc0000]/80 font-normal outline-none"
            onClick={() => {
              setActiveReadmore(true);
            }}
          >
            more
          </button>
        )}
      </span>
    </>
  );
}

export default ReadMoreBtn;
