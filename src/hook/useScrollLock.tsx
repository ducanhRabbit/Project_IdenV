import { useEffect, useState } from 'react'

function useScrollLock() {
    const body = document.body.style
    const [isLocked,setIsLock] = useState(body.overflowY==='hidden')

    useEffect(()=>{
        body.overflowY = isLocked?'hidden':'auto'
    },[isLocked,body])

    const toggleLocked =()=> setIsLock(!isLocked)
  return {isLocked,toggleLocked,setIsLock}
}

export default useScrollLock