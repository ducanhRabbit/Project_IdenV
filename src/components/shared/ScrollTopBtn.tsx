import { useEffect, useState } from 'react'
import { BiUpArrowAlt } from "react-icons/bi";
function ScrollTopBtn() {
    const scrollToTop = ()=> {
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })
    }
    const [activeScrollTopBtn,setActiveScrollTopBtn] = useState(false)
    useEffect(() => {
        const activeScrollTopBtn = () => {
          const scrollOffset = document.documentElement.scrollTop;
          if (scrollOffset > 1000) {
            setActiveScrollTopBtn(true);
          } else {
            setActiveScrollTopBtn(false);
          }
        };
    
        window.addEventListener("scroll", activeScrollTopBtn);
    
        return () => window.removeEventListener("scroll", activeScrollTopBtn);
      }, []);
  return (
    <button onClick={scrollToTop} className={`fixed bottom-6 right-6 p-2 rounded-full bg-[#cc0000] duration-300 z-40 ${!activeScrollTopBtn && 'opacity-0'}`}>
       <BiUpArrowAlt size={35} color='white' className=''/>
    </button>
  )
}

export default ScrollTopBtn