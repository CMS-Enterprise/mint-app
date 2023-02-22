/*
Hook used to debounce input, return debounce loading, and stop debounce
*/

import { useEffect, useState } from 'react';

function useDebounce(value: string | undefined, wait: number, stop: boolean) {
  const [oldValue, setOldValue] = useState(value); // Used to compare again incoming value to reset loading state
  const [debounceValue, setDebounceValue] = useState(value);
  const [debounceLoading, setDebounceLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!debounceLoading && value !== oldValue && !stop) {
      // If value changes start loading
      setDebounceLoading(true);
    }
    const timer = setTimeout(() => {
      setDebounceValue(value);
      setOldValue(value);
      setDebounceLoading(false);
    }, wait);
    return () => clearTimeout(timer); // cleanup when unmounted
  }, [value, wait, debounceLoading, oldValue, stop]);

  return { debounceValue, debounceLoading };
}

export default useDebounce;
