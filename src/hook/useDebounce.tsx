import { useEffect, useState } from "react";

function useDebounce( value:string, delay:number ) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => (
      setDebounceValue(value.trim())
    ), delay);
    return () => clearTimeout(timer);
  },[value, delay]);
  return debounceValue;
}

export default useDebounce;
