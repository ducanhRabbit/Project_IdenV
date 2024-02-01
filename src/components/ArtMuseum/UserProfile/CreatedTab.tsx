import { Link, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Masonry } from "@mui/lab";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import http from "../../../axios/axios";
import CardImg from "../../shared/CardImg";

function CreatedTab() {
  const LIMIT = 40;
  const { id: userId } = useParams();
  const getInspirationByAuthor = async (page:number) => {
    const data = await http.get(
      `/inspiration/user/${userId}?page=${page}&limit=${LIMIT}`
    );
    return data.data;
  };

  const {
    data: InspirationByAuthorData,
    fetchNextPage,
    isLoading,
    isSuccess,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["infinitInspiration", userId],
    initialPageParam:1,
    queryFn: ({ pageParam }) => getInspirationByAuthor(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });

  return (
    <>
      <div className="header text-right pr-4">
        <Link
          to={"/artMuseum/createInspiration"}
          className="add-btn inline-block p-3 rounded-full bg-white hover:bg-[#efefef] active:scale-95 duration-200"
        >
          <FaPlus size={20} color="#000" />
        </Link>
      </div>
      <div className="mainboard-container pt-8 bg-black overflow-hidden">
        <InfiniteScroll
          dataLength={InspirationByAuthorData?.pages.flat().length || 0}
          next={() => {
            fetchNextPage();
          }}
          hasMore={!!hasNextPage}
          loader={<div>Loading...</div>}
        >
          <div className="overflow-hidden">
              <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
                {isSuccess && InspirationByAuthorData?.pages.flat().map((item, index) => (
                  <CardImg
                    key={index}
                    content={item}
                  />
                ))}
              </Masonry>
          </div>
        </InfiniteScroll>
        {isSuccess && InspirationByAuthorData?.pages.flat().length <= 0 && !isLoading && (
          <div className="text-center text-2xl py-6">
            Nothing to show...yet! Inspirations you create will live here.
            <div className="mt-2">
              <Link to={"/artMuseum/createInspiration"} className="inline-block text-xl primary-btn px-3 py-2">
                Create
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CreatedTab;
