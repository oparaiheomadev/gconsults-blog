import { useEffect, useState } from 'react';

// Waits until the value stops changing for `delay` ms, then returns it.
// Used for search: we only ask Supabase after you pause typing.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // typed again? cancel the old timer
  }, [value, delay]);

  return debounced;
}
