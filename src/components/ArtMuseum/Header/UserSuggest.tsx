import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { User } from "../../../shared/types";

interface UserSuggestProps{
  suggestList: User[]
}

function UserSuggest({ suggestList }:UserSuggestProps) {
  
  return (
    <ul className="grid grid-cols-3 font-witch gap-2 pb-2">
      {suggestList && suggestList.map((item, index) => (
        <li className={`test rounded-full ${index%2 === 0 ?'gradient-primary':'gradient-secondary'}`} key={index}>
          
          <Link to={`/artMuseum/profile/${item._id}/created`} className="user-tag cursor-pointer flex items-center rounded-full gap-3">
            <span className="user-ava p-1 bg-[#f3f3f3] rounded-full overflow-hidden">
                <LazyLoadImage className="w-[35px] h-[35px] rounded-full" src={item.photo}/>
            </span>
            <span className="leading-[35px] text-white  flex-1 rounded-full  block">
                {item.firstName}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default UserSuggest;
