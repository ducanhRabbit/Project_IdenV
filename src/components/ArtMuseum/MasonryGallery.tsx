import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { TailSpin } from "react-loader-spinner";
import http from "../../axios/axios";
import CardImg from "../shared/CardImg";
import ScrollTopBtn from "../shared/ScrollTopBtn";
import { Inspiration } from "../../shared/types";
import "../../css/MasonryLayout/Masonry.css";
function MasonryGallery() {
  const LIMIT = 40;
  const getInfinitInspiration = async (pageParam: number) => {
    const data = await http.get(
      `/inspiration?page=${pageParam}&limit=${LIMIT}`
    );
    return data.data;
  };
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  const {
    data: InfiniteData,
    isSuccess,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["infinitInspiration"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return getInfinitInspiration(pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });
  return (
    <>
      <ScrollTopBtn></ScrollTopBtn>
      <div className="mainboard-container pt-8 bg-black overflow-hidden w-full">
      {isLoading && (
          <div className="flex justify-center mx-auto">
            <TailSpin
              height="40"
              width="40"
              color="#cc0000"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
          <InfiniteScroll
            dataLength={InfiniteData?.pages.flat().length || 0}
            next={() => {
              fetchNextPage();
            }}
            hasMore={!!hasNextPage}
            loader={<div>Loading...</div>}
          >
            <div className="overflow-hidden px-2 w-full">
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-container"
                columnClassName="masonry-column"
              >
                {isSuccess &&
                  InfiniteData.pages
                    .flat()
                    .map((item: Inspiration, index: number) => (
                      <div key={index} className="masonry-item">
                        <CardImg content={item} />
                      </div>
                    ))}
              </Masonry>
            </div>
          </InfiniteScroll>
        
      </div>
    </>
  );
}

export default MasonryGallery;
