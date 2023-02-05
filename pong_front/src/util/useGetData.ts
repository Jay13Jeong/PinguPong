import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

function useGetData(requestUrl: string) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const getData = useCallback(async () => {
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
        getData();
    }, [requestUrl, getData]);
    
    if (isLoading) {
        getData();
    }

    return [ data, error, isLoading ];
}

export default useGetData;