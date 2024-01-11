import {
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Masonry } from "@mui/lab";
import { TailSpin } from "react-loader-spinner";
import http from "../../axios/axios";
import CardImg from "../shared/CardImg";
import ScrollTopBtn from "../shared/ScrollTopBtn";

function MasonryGallery() {
  const LIMIT = 20;
  const getInfinitInspiration = async (pageParam: number) => {
    const data = await http.get(
      `/inspiration?page=${pageParam}&limit=${LIMIT}`
    );
    return data.data;
  };
  const {
    data: InfiniteData,
    isSuccess,
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
  console.log(InfiniteData);
  return (
    <>
      <ScrollTopBtn></ScrollTopBtn>
      <div className="mainboard-container pt-8 bg-black overflow-hidden">
        <InfiniteScroll
          dataLength={InfiniteData?.pages.flat().length || 0}
          next={() => {
            fetchNextPage();
          }}
          hasMore={!!hasNextPage}
          loader={<div>Loading...</div>}
        >
          <div className="overflow-hidden px-2">
            <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
              {isSuccess &&
                InfiniteData.pages
                  .flat()
                  .map((item, index) => (
                    <CardImg
                      key={index}
                      content={item}
                      indexPage={Math.floor(index / LIMIT)}
                      tab="no"
                    />
                  ))}
            </Masonry>
          </div>
        </InfiniteScroll>
        {isFetchingNextPage && (
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
      </div>
    </>
  );
}

export default MasonryGallery;
