import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

function useGetData(requestUrl: string, name?: string) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getData = useCallback(async () => {
        try {
            if (name === "")
                return ;
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