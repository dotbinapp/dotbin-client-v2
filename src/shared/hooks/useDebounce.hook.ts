import { useEffect, useState } from 'react'

const DEFAULT_SEARCH_DELAY_MS = 350

function useDebounce<TValue>(value: TValue): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, DEFAULT_SEARCH_DELAY_MS)

    return () => window.clearTimeout(debounceId)
  }, [value])

  return debouncedValue
}

export default useDebounce
