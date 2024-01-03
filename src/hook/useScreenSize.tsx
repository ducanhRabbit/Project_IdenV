import { useEffect, useState } from 'react'

function useScreenSize() {
    const [screenWidth,setScreenWidth] = useState(window.innerWidth)
    const [screenHeight,setScreenHeight] = useState(window.innerHeight)
    
    
    useEffect(()=>{
        const handleResize = ()=>{
            setScreenWidth(window.innerWidth)
            setScreenHeight(window.innerHeight)
        }
        window.addEventListener('resize',handleResize)
        return ()=>{
            window.removeEventListener('resize',handleResize)
        }
    },[window.innerWidth,window.innerHeight])
  return {screenWidth,screenHeight, isMobile: screenWidth <768}
}

export default useScreenSize