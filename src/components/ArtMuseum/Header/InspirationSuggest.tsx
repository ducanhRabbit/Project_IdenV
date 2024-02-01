import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { Inspiration } from "../../../shared/types";

interface InspirationSuggestProps{
  suggestList: Inspiration[]
}

function InspirationSuggest({ suggestList }:InspirationSuggestProps) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {suggestList && suggestList.map((item,index) => (
        <li key={index}>
          <Link to={`/artMuseum/inspiration/${item._id}`} className="flex rounded-2xl overflow-hidden group">
            <div className="w-[40%] h-[100px] shrink-0">
              <LazyLoadImage
                wrapperClassName="w-full"
                className="object-top object-cover w-full h-[100px]"
                src={item.artworkURL}
                effect="blur"
              />
            </div>
            <div className="flex-1 flex items-center justify-center bg-[#f6f6f6] group-hover:bg-[#e1e1e1]">
              <span className="text-center line-clamp-3 px-1 break-all">
                {item.plainTitle}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default InspirationSuggest;
