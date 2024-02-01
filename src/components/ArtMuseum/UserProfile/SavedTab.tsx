import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
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
import SavedCard from "./SavedCard";
import BlackBackdrop from "../../shared/BlackBackDrop";
import { setCurrentUser } from "../../../redux/reducers/userReducer";
import { ConfirmWarnState } from "../../../shared/types";
import DelayChild from "../../shared/DelayChild";
interface SavedTab {
  sortConfig: {
    sortBy: string
  };
}
function SavedTab({ sortConfig }: SavedTab) {
  const LIMIT = 40;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { id: userId } = useParams();
  const getSaved = async (page: number, params: any) => {
    const data = await http.get(`/user/${userId}/saved`, {
      params: {
        ...params,
        page,
        limit: LIMIT,
      },
    });

    return data.data;
  };
  const location = useLocation()
  const [activeConfirmWarn, setActiveConfirmWarn] =
    useState<ConfirmWarnState | null>(null);
  const {
    data: savedData,
    fetchNextPage,
    isLoading,
    hasNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ["savedPost", sortConfig],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getSaved(pageParam, sortConfig),

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });
  useEffect(()=>{
    refetch()
  },[location.pathname])
  const deleteMutation = useMutation({
    mutationKey: ["deleteSaved"],
    mutationFn: (postId: string) => {
      const res = http.delete(`/user/saved/${postId}`);
      return res;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(
        { queryKey: ["savedPost"] }
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
          <SortBy sortConfig={sortConfig}/>
          <div className="flex items-center gap-2">
            <Link
              to={"/artMuseum/createInspiration"}
              className="add-btn inline-block p-3 rounded-full bg-white hover:bg-[#efefef] active:scale-95 duration-200"
            >
              <FaPlus size={20} color="#000" />
            </Link>
          </div>
        </div>
        <div className="mainboard-container pt-8 bg-black overflow-hidden">
          {savedData && savedData?.pages.flat().length > 0 && (
            <InfiniteScroll
              dataLength={savedData.pages.flat().length || 0}
              next={() => {
                fetchNextPage();
              }}
              hasMore={!!hasNextPage}
              loader={<div>Loading...</div>}
            >
              <div className="overflow-hidden">
                <DelayChild>
                  <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} sx={{width:"100%"}}>
                    {savedData?.pages.flat().map((item, index) => (
                      <SavedCard content={item} key={index} setActiveConfirmWarn={setActiveConfirmWarn}/>
                    ))}
                  </Masonry>
                </DelayChild>
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
