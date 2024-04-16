import { useState } from 'react';

export default function useTwoApiRequest(defaultRequestData = {}) {
    const [responseData, setResponseData] = useState(undefined);
    const [statusCode, setStatusCode] = useState(undefined);
    const [isError, setIsError] = useState(false);

    const fetchData = async (requestData = defaultRequestData) => {
        try {
            const response = await fetch('https://sedmima20.sps-prosek.cz/projekty/php/turnajovy-software/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(requestData),
            });

            let json;
            try {
                json = await response.json();
            } catch {
                json = undefined;
            }

            setStatusCode(response.status);
            setResponseData(json);
            setIsError(false);
            return { statusCode: response.status, responseData: json, isError: false }
        } catch {
            setStatusCode(undefined);
            setResponseData(undefined);
            setIsError(true);
            return { statusCode: undefined, responseData: undefined, isError: true }
        }
    }

    return { statusCode, responseData, isError, fetchData }
}
