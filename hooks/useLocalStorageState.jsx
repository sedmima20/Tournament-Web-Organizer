import { useState, useEffect } from 'react';

export default function useLocalStorageState(key, defaultValue) {
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? storedValue : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, state);
    }, [state]);

    return [state, setState];
}
