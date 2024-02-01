// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Carousel from "./Carousel";
import { getCharInfo } from "../../../redux/reducers/charInfoReducer";
import useScreenSize from "../../../hook/useScreenSize";
import { useQuery } from "@tanstack/react-query";

import http from "../../../axios/axios";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useEffect, useState } from "react";
import { Character as CharacterType } from "../../../shared/types";
export default function Character() {
  const dispatch = useAppDispatch();
  const { screenWidth } = useScreenSize();
  const isTablet = screenWidth <= 1023;

  const { currentChar } = useAppSelector((state) => state.charInfo);
  const [currentRole, setCurrentRole] = useState<string>("survival");
  const [currentActive, setCurrentActive] = useState<number>(0);
  const getCharacter = async (
    role: string
  ): Promise<CharacterType[] | undefined> => {
    const res = await http.get(`/character/role?role=${role}`);
    return res.data;
  };

  const { data: dataCharacter } = useQuery({
    queryKey: ["character", currentRole],
    queryFn: () => getCharacter(currentRole),
    refetchOnWindowFocus: false,
  });

  let findCurrentIndex: number = 0;
  if (dataCharacter) {
    findCurrentIndex = dataCharacter.findIndex((item) => item === currentChar);
  }
  useEffect(() => {
    if (dataCharacter) {
      dispatch(getCharInfo(dataCharacter[0]));
      setCurrentActive(0);
    }
  }, [dataCharacter]);

  return (
    <div className="character-container pb-4 bg-[url('https://i.ibb.co/vjphGQk/bg-d8d4cd3.jpg')] bg-center lg:bg-[25%_75%] bg-cover w-full min-h-[600px]">
      <div className="character-wrapper font-witch text-white max-w-[1200px] mx-auto pb-12 lg:pb-0">
        <h2 className="section-title text-center text-5xl lg:text-7xl pt-12 md:py-12 lg:pb-0">
          Characters
        </h2>
        <div className="character-content flex justify-center lg:flex-row flex-col">
          <div className="left-content w-full flex flex-col items-center  lg:w-1/2 ">
            <img
              src={currentChar.photo}
              className=" w-full min-h-[1200px] md:min-h-[1100px] md:w-[600px] md:max-h-[850px] lg:max-h-max  object-cover"
              alt=""
            />
            {isTablet && (
              <div className="char-control">
                <div className="flex justify-center gap-4 items-center">
                  <div
                    className={
                      `prev-step-btn w-[60px] ${currentActive === 0 ? "disable-btn" : ""}`
                    }
                    onClick={() => {
                      if (currentActive > 0 && dataCharacter) {
                        const prevChar = dataCharacter[currentActive - 1];
                        dispatch(getCharInfo(prevChar));
                        setCurrentActive((prev) => prev - 1);
                      }
                    }}
                  >
                    <img
                      src="https://i.ibb.co/f2tz44L/Prev-Circle.png"
                      alt=""
                    />
                  </div>
                  <div className="current-char text-2xl  text-center shrink-0">
                    {currentActive + 1} / {dataCharacter?.length}
                  </div>
                  <div
                    className={
                      `next-step-btn w-[60px] ${dataCharacter && currentActive === dataCharacter.length-1?"disable-btn":""}`
                    }
                    onClick={() => {
                      if (
                        dataCharacter &&
                        currentActive < dataCharacter.length - 1
                      ) {
                        const nextChar = dataCharacter[findCurrentIndex + 1];
                        dispatch(getCharInfo(nextChar));
                        setCurrentActive((prev) => prev + 1);
                      }
                    }}
                  >
                    <img
                      src="https://i.ibb.co/Px6KFfH/Next-Circle.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="right-content lg:pr-1 w-full lg:w-1/2 flex flex-col justify-center">
            <div className="type my-4  w-full flex lg:justify-start justify-center order-2 lg:order-1">
              <button
                className={`${
                  currentRole === "hunter"
                    ? "!bg-[url('https://i.ibb.co/wcK0g2X/type-bg-h-957b28b.webp')]"
                    : "bg-[url('https://i.ibb.co/TB8pb2S/type-bg-5afc87f.webp')]"
                } md:mr-4 lg:mx-4  hover:bg-[url('https://i.ibb.co/wcK0g2X/type-bg-h-957b28b.webp')] ease-in-out duration-300`}
                onClick={() => {
                  setCurrentRole("hunter");
                }}
              >
                <img src="https://i.ibb.co/7JnggHC/Hunter-Select.webp" alt="" />
              </button>
              <button
                className={`${
                  currentRole === "survival"
                    ? "!bg-[url('https://i.ibb.co/gVBKjDr/type-bg-h2-6976f2a.webp')]"
                    : "bg-[url('https://i.ibb.co/TB8pb2S/type-bg-5afc87f.webp')]"
                }  hover:bg-[url('https://i.ibb.co/gVBKjDr/type-bg-h2-6976f2a.webp')] ease-in-out duration-300`}
                onClick={() => {
                  setCurrentRole("survival");
                }}
              >
                <img src="https://i.ibb.co/gJmjByW/Sur-Select.webp" alt="" />
              </button>
            </div>
            <div className="character-carousel inline-block w-[85%] mx-auto mt-6 mb-4 order-3 lg:order-2">
              <Carousel currentRole={currentRole} data={dataCharacter} />
            </div>
            <div className="info-char px-8 lg:px-4  order-1 lg:order-3">
              <h2
                className={
                  (currentRole === "survival"
                    ? "text-marine"
                    : "text-primary") + " career text-5xl lg:text-[68px] my-4"
                }
              >
                {currentChar.career}
              </h2>
              <h3 className="full-name text-lg">
                Name: {currentChar.fullName}
              </h3>
              <div className="background-story mt-7">
                <div
                  className={
                    (currentRole === "survival"
                      ? "text-marine"
                      : "text-primary") + " title text-2xl mb-2"
                  }
                >
                  Background Story
                </div>
                <div className="story text-lg h-[156px] overflow-y-scroll">
                  {currentChar.backStory}
                </div>
                <div className="char-settings mt-6">
                  <div
                    className={
                      (currentRole === "survival"
                        ? "text-marine"
                        : "text-primary") + " settings-title text-2xl mb-2"
                    }
                  >
                    Character Settings
                  </div>
                  <div className="settings-info text-lg">
                    <ul>
                      <li className="leading-9">
                        <span className="text-grey-100">Character day:</span>{" "}
                        {currentChar.birth}
                      </li>
                      <li className="leading-9">
                        <span className="text-grey-100">Interests:</span>{" "}
                        {currentChar.interests}
                      </li>
                      <li className="leading-9">
                        <span className="text-grey-100">Talent:</span>{" "}
                        {currentChar.talents}
                      </li>
                      <li className="leading-9">
                        <span className="text-grey-100">Likes:</span>{" "}
                        {currentChar.likes}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
