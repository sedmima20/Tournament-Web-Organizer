import { useState } from 'react';

export default function useTwoApiRequest(defaultRequestData = {}) {
    const [responseData, setResponseData] = useState(undefined);
    const [statusCode, setStatusCode] = useState(undefined);
    const [isRequestError, setIsRequestError] = useState(false);

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
            setIsRequestError(false);
            return { statusCode: response.status, responseData: json, isRequestError: false }
        } catch {
            setStatusCode(undefined);
            setResponseData(undefined);
            setIsRequestError(true);
            return { statusCode: undefined, responseData: undefined, isRequestError: true }
        }
    }

    return { statusCode, responseData, isRequestError, fetchData }
}
