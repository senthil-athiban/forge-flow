import { useEffect, useState } from 'react'
import { BACKEND_URL } from '@/app/config';
import useAxios from './useAxios';
import ZapService from '@/services/zap.service';

const useZaps = () => {
    const [isLoading, setisLoading] = useState(false);
    const [data, setdata] = useState([]);
    const axiosInstance = useAxios();
    useEffect(() => {
        setisLoading(true);
        async function fetchData() {
            try {
              const res = await ZapService.getZapByUserId();
              console.log('zap res : ', res);
              setdata(res.zap);
              setisLoading(false);
            } catch (error) {
                console.log('Error in fetching zap : ', error);
            }
        }
        fetchData();
    }, [axiosInstance]);
  return {
    isLoading, data
  }
}

export default useZaps