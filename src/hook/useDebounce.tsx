import React, { useEffect, useState } from "react";

function useDebounce( value:any, delay:number ) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => (
      setDebounceValue(value)
    ), delay);
    return () => clearTimeout(timer);
  },[value, delay]);
  return debounceValue;
}

export default useDebounce;
