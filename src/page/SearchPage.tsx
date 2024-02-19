import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BiChevronsDown } from "react-icons/bi";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import http from "../axios/axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import CardImg from "../components/shared/CardImg";
function SearchPage() {
  const [searchParams, _setSearchParams] = useSearchParams();
  const key = searchParams.get("key");
  const LIMIT = 20;
  const getInfinitUsers = async (key: string | null, pageParam: number) => {
    const res = await http.get(
      `/user/search?key=${key}&page=${pageParam}&limit=${LIMIT}`
    );
    return res.data;
  };

  const getInfinitInspiration = async (
    key: string | null,
    pageParam: number
  ) => {
    const res = await http.get(
      `/inspiration/search?key=${key}&page=${pageParam}&limit=${LIMIT}`
    );
    return res.data;
  };
  const location = useLocation();
  const SearchUserQuery = useInfiniteQuery({
    queryKey: ["searchUsers", key],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getInfinitUsers(key, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < LIMIT ? undefined : allPages.length + 1;
    },
    placeholderData: keepPreviousData,
  });
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  const SearchInspiQuery = useInfiniteQuery({
    queryKey: ["searchInspiration", key],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getInfinitInspiration(key, pageParam),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < LIMIT ? undefined : allPages.length + 1;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen w-full bg-black font-witch  pt-[80px] search-result-container px-4">
      <div className="text-white text-3xl mb-6">Search results for "{key}"</div>
      {SearchUserQuery.data && SearchUserQuery.data.pages.flat().length > 0 && (
        <div className="wrapper pb-8">
          <div className="users-result grid md:grid-cols-2 grid-cols-1 gap-6 mt-6 px-4">
            {SearchUserQuery.data.pages.flat().map((item, index) => (
              <Link
                to={`/artMuseum/profile/${item._id}`}
                key={index}
                className="user-card w-full min-h-[150px] flex-1 bg-white flex gap-4 gap-x-8 px-4 py-3 rounded-md overflow-hidden shadow-[0_25px_50px_-12px_rgba(219,219,219,0.6)]"
              >
                <div
                  className={`ava ${index} shrink-0  relative after:absolute after:content-[''] after:block after:-left-[170px] after:z-0  after:w-[300px] after:h-[150px] after:rotate-[65deg] after:top-0 ${
                    index % 2 !== 0 ? "after:bg-[#111]" : "after:bg-[#a30000]"
                  }`}
                >
                  <LazyLoadImage
                    className={`w-[100px] z-10 relative bg-white h-[100px] rounded-full border-2 ${
                      index % 2 !== 0 ? "border-[#111]" : "border-[#a30000]"
                    }  object-cover`}
                    src={item.photo}
                  />
                </div>
                <div className="user-info flex-1 min-w-0">
                  <div className="username inline-block text-xl font-bold break-all line-clamp-1">
                    {item.userName}
                  </div>
                  <div className="follow leading-tight mb-2">
                    <span className="text-sm text-[#5d5d5d]">
                      {item.followers.length} Followers
                    </span>
                  </div>
                  <div className="user-email text-lg text-[#565656] mb-2 line-clamp-1">
                    {item.email}
                  </div>
                  <div className="story line-clamp-3  text-[#5d5d5d]">
                    {item.story || "Tell your story"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            {SearchUserQuery.hasNextPage && (
              <button
                onClick={() => {
                  if (SearchUserQuery.hasNextPage) {
                    SearchUserQuery.fetchNextPage();
                  }
                }}
                className="text-white text-xl px-4 py-3 hover:text-[#cc0000] duration-150"
              >
                More
                <BiChevronsDown className="inline-block" />
              </button>
            )}
          </div>
        </div>
      )}

      {SearchInspiQuery.data &&
        SearchInspiQuery.data.pages.flat().length > 0 && (
          <div className="search-inspiration">
            <div className="text-white text-3xl mb-6 px-2">Inspirations:</div>
            <div className="inspiration-result">
              <InfiniteScroll
                dataLength={SearchInspiQuery.data.pages.flat().length || 0}
                next={() => {
                  SearchInspiQuery.fetchNextPage();
                }}
                hasMore={!!SearchInspiQuery.hasNextPage}
                loader={<div>Loading...</div>}
              >
                <div className="overflow-hidden px-2">
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="masonry-container"
                    columnClassName="masonry-column"
                  >
                    {SearchInspiQuery.isSuccess &&
                      SearchInspiQuery.data.pages
                        .flat()
                        .map((item, index) => (
                          <div key={index} className="masonry-item">
                            <CardImg key={index} content={item} />
                          </div>
                        ))}
                  </Masonry>
                </div>
              </InfiniteScroll>
            </div>
          </div>
        )}
    </div>
  );
}

export default SearchPage;
