import { useState } from 'react'

function useOpenModal() {

    let [isOpen, setIsOpen] = useState(false)

    const closeModal = ()=> {
      setIsOpen(false)
    }
  
    const openModal = ()=> {
      setIsOpen(true)
    }
  
  return {
    isOpen,
    setIsOpen,
    closeModal,
    openModal
  }
}

export default useOpenModal