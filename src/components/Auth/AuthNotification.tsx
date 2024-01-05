import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthNotificationProps {
  isSuccess: number;
  message: string;
  closeControl?: () => void;
  redirect?: string;
}

function AuthNotification({
  isSuccess,
  message,
  closeControl,
  redirect,
}: AuthNotificationProps) {
  const autoCloseIn = 2;
  const navigate = useNavigate();
  const [countDownTime, setcountDownTime] = useState(autoCloseIn);
  useEffect(() => {
    let timeOut:any = null
    if (isSuccess) {
      timeOut = setInterval(() => {
        setcountDownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timeOut);
  }, []);

  useEffect(() => {
    if (countDownTime === 0 && isSuccess && redirect) {
      navigate(redirect);
    }
  }, [countDownTime]);

  return (
    <div className=" font-witch h-screen w-screen flex justify-center relative  items-center">
      <div
        onClick={closeControl}
        className="fixed top-0 overlay w-full h-full bg-black/60"
      ></div>
      <div className="container p-4 max-w-[300px] relative z-[99999] bg-white rounded-3xl">
        <div
          className={
            "rounded-3xl mb-4 " + (isSuccess ? "bg-marine" : "bg-primary")
          }
        >
          <img
            className="mx-auto"
            src={
              isSuccess
                ? "https://cdn3.emoji.gg/emojis/8536_emma_looking.png"
                : "https://cdn3.emoji.gg/emojis/1839-emma-no.png"
            }
            alt=""
          />
        </div>
        <div
          className={
            "message text-center mb-4 " +
            (isSuccess ? "text-marine" : "text-primary")
          }
        >
          <h2 className={"text-3xl"}>
            {isSuccess ? "Cipher is primed!" : "Something Wrong!"}
          </h2>
          <p className="text-xl">{message}</p>
        </div>
        <div className="text-center">
          <button
            onClick={closeControl}
            className={
              "py-3 px-5 rounded-xl text-white " +
              (isSuccess ? "bg-marine" : "bg-primary")
            }
          >
            {isSuccess ? `Escape in ${countDownTime}` : "Try again"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthNotification;
