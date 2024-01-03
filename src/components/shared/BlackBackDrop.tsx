import React from "react";

interface BlackBackdropProps{
  className:string
  children: React.ReactNode
  onCloseBlackBackdrop: ()=> void
}

const BlackBackdrop = ({ className, children, onCloseBlackBackdrop, ...others }:BlackBackdropProps) => {
  return (
    <div
      {...others}
      onClick={onCloseBlackBackdrop}
      className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 duration-300 ` + className}
    >
      {children}
    </div>
  );
};

export default BlackBackdrop;