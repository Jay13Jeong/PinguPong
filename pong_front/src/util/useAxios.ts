import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

function useAxios(requestUrl: string) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            await axios.get(requestUrl, {withCredentials: true})
            .then(res => {
                setData(res.data);
            })
            .finally(() => {
                setIsLoading(false);
            })
        } catch (err: any) {
            setError(err);
        }
    }, [requestUrl]);

    useEffect(() => {
        fetchData();
    }, [requestUrl]);
    
    if (isLoading || error !== null) {
        fetchData();
    }

    return [ data, error, isLoading ];
}

export default useAxios;