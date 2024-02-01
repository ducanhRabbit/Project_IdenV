import React, { useEffect, useState } from "react";

interface DelayChildProps{
  children: React.ReactNode
}

function DelayChild({ children }:DelayChildProps) {
  const delayTime = 700;
  const delay = (ms:number) => new Promise((res) => setTimeout(res, ms));
  const [shouldRenderChild, setShouldRenderChild] = useState(false);

  useEffect(() => {
    delay(delayTime).then(() => {
      setShouldRenderChild(true);
    });
  });
  return (
    <>
      {(() => {
        if (!shouldRenderChild) {
          return <div className="hidden">{children}</div>;
        } else {
          return <div className=" flex justify-center">{children}</div>;
        }
      })()}
    </>
  );
}

export default DelayChild;
