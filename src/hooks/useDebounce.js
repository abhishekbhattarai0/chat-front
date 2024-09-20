import { useEffect, useState } from "react"


export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState('')
    useEffect(()=> {
        const timeout = setTimeout((value)=> setDebouncedValue(value),delay);

        ()=>clearTimeout(timeout)
    },[delay, value])

    return debouncedValue;
}