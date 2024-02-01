import { useState } from 'react'

function useModal() {

   const [showModal,setShowModal] = useState(false) 
   const toogleModal = ()=>{
    setShowModal(!showModal)
   }
  return {
    showModal,
    setShowModal,
    toogleModal
  }
}

export default useModal