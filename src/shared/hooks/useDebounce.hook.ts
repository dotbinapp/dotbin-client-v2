import { useEffect, useState } from 'react'

function useDebounce<TValue>(value: TValue, delayMs: number): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => window.clearTimeout(debounceId)
  }, [delayMs, value])

  return debouncedValue
}

export default useDebounce
