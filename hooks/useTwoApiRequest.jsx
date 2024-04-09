import { useState } from 'react';

export default function useTwoApiRequest(defaultRequestData = []) {
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState(undefined);
    const [statusCode, setStatusCode] = useState(undefined);
    const [isRequestError, setIsRequestError] = useState(false);

    const fetchData = async (requestData = defaultRequestData) => {
        setIsLoading(true);
        try {
            const response = await fetch('https://sedmima20.sps-prosek.cz/projekty/php/turnajovy-software/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(requestData),
            });

            setStatusCode(response.status);
            setResponseData(await response.json());
            setIsRequestError(false);
        } catch {
            setStatusCode(undefined);
            setResponseData(undefined);
            setIsRequestError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, responseData, statusCode, isRequestError, fetchData }
}
