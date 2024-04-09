import { useState, useEffect } from 'react';

export default function useLocalStorageState(key, defaultValue) {
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        try {
            return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
        } catch {
            return storedValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [state]);

    return [state, setState];
}
