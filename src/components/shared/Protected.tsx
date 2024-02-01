import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: React.ReactNode
}
const Protected = ({
  children,
}:ProtectedProps) => {
  const [isSignedIn,setIsSignedIn] = useState(!!localStorage.getItem('user')) 
  useEffect(()=>{
    let checkToken = localStorage.getItem('user')
    if(!!checkToken){
      setIsSignedIn(true)
    }else{
      setIsSignedIn(false)
    }
  },[location])
  if (!isSignedIn) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default Protected;