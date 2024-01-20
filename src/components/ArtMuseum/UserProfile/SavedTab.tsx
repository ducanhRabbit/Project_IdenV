import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Masonry } from "@mui/lab";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import SortBy from "./SortBy";
import http from "../../../axios/axios";
import CardImg from "../../shared/CardImg";
import BlackBackdrop from "../../shared/BlackBackDrop";
import { setCurrentUser } from "../../../redux/reducers/userReducer";
import { ConfirmWarnState } from "../../../shared/types";
interface SavedTab{
  config: object
}
function SavedTab({ config }:SavedTab) {
  const LIMIT = 20;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { id: userId } = useParams();
  const sortOptions = [
    {
      id: 1,
      value: "popular,-1",
      label: "Most likes",
    },
    {
      id: 2,
      value: "createdAt",
      label: "Last saved to",
    },
  ];
  const getSaved = async (page:number, params:any) => {
    const data = await http.get(`/user/${userId}/saved`, {
      params: {
        ...params,
        page,
        limit: LIMIT,
      },
    });

    return data.data;
  };
  const [selectedOption, setSelectedOption] = useState(sortOptions[0]);
  const [activeConfirmWarn, setActiveConfirmWarn] = useState<ConfirmWarnState | null>(null);
  console.log(selectedOption);
  const {
    data: savedData,
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["savedPost", config],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getSaved(pageParam, config),

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });
  const deleteMutation = useMutation({
    mutationKey: ["deleteSaved"],
    mutationFn: (postId:string) => {
      const res = http.delete(`/user/saved/${postId}`);
      return res
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey:["savedPost"]}
      // {
      //   refetchPage: (page, index) => {
      //     return index === Math.floor(index / LIMIT);
      //   },
      // }
      );
      const user = await http.get(`user/info/${userId}`);
      dispatch(setCurrentUser(user.data));
      setActiveConfirmWarn(null);
    },
  });
  return (
    <>
      {activeConfirmWarn && (
        <>
          <div className="confirm-wrapper text-center text-[#111] z-50 fixed top-1/2 left-1/2 bg-white font-witch min-w-[500px] rounded-xl p-6 -translate-x-1/2 -translate-y-1/2">
            <div className="text-3xl font-bold">Are you sure?</div>
            <div className="my-8">
              Once you delete a Inspiration, you can't{" "}
              <span className="text-[#cc0000] font-semibold">undo</span> it.
            </div>
            <div className="control flex justify-center gap-2">
              <button
                onClick={() => {
                  setActiveConfirmWarn(null);
                }}
                className="secondary-btn px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(activeConfirmWarn.data);
                }}
                className="primary-btn px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
          <BlackBackdrop
            onCloseBlackBackdrop={() => {
              setActiveConfirmWarn(null);
            }}
          ></BlackBackdrop>
        </>
      )}
      <div>
        <div className="header flex justify-between items-center px-4">
          <SortBy optionsList={sortOptions} />
          {/* <Listbox
            value={selectedOption}
            onChange={(option) => {
              setSelectedOption(option);
              searchParams.set("sortBy", option || "");
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
                {sortOptions.map((option, index) => (
                  <Listbox.Option value={option.value} key={index}>
                    {({ active, selected }) => (
                      <>
                        <div
                          className={`py-2 px-2 rounded-md  w-full inline-block ${
                            active
                              ? "bg-blue-500 text-red-500"
                              : "bg-white text-black"
                          }`}
                        >
                          {option.label}
                        </div>
                        {selected ? <div>huhu</div> : <div>Nono</div>}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox> */}
          <div className="flex items-center gap-2">
            <Link
              to={"/artMuseum/createInspiration"}
              className="add-btn inline-block p-3 rounded-full bg-white hover:bg-[#efefef] active:scale-95 duration-200"
            >
              <FaPlus size={20} color="#000" />
            </Link>
            {/* <button
                onClick={() => {
                  setActiveSelect(true);
                }}
                className="p-3 rounded-full bg-white hover:bg-[#efefef] active:scale-95 duration-200"
              >
                <AiFillEdit size={20} color="#000" />
              </button> */}
            {/* <Link
            to={"/artMuseum/createInspiration"}
            className="add-btn inline-block p-3 rounded-full bg-white hover:bg-[#efefef] active:scale-95 duration-200"
          >
            <FaPlus size={20} color="#000" />
          </Link>
          <button onClick={()=>{
            setActiveSelect(true)
          }} className="p-3 rounded-full bg-white hover:bg-[#efefef] active:scale-95 duration-200">
            <AiFillEdit size={20} color="#000" />
          </button> */}
          </div>
        </div>
        <div className="mainboard-container pt-8 bg-black overflow-hidden">
          {!!savedData?.pages.flat().length && (
            <InfiniteScroll
              dataLength={savedData?.pages.flat().length || 0}
              next={() => {
                fetchNextPage();
              }}
              hasMore={!!hasNextPage}
              loader={<div>Loading...</div>}
            >
              <div className="overflow-hidden">
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
                  {savedData?.pages.flat().map((item, index) => (
                    <CardImg
                      tab={"saved"}
                      setActiveConfirmWarn={setActiveConfirmWarn}
                      key={index}
                      content={item}
                      indexPage={Math.floor(index / LIMIT)}
                    />
                  ))}
                </Masonry>
              </div>
            </InfiniteScroll>
          )}
          {savedData && savedData.pages.flat().length <= 0 && !isLoading && (
            <div className="text-center text-2xl py-6">
              You haven't saved any Inspirations yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SavedTab;
