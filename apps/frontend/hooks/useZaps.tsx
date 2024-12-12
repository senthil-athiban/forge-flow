import { BACKEND_URL } from '@/app/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useZaps = () => {
    const [isLoading, setisLoading] = useState(false);
    const [data, setdata] = useState([]);
    console.log("data: ", data);
    useEffect(() => {
        setisLoading(true);
        async function fetchData() {
            const res = await axios.get(`${BACKEND_URL}/api/v1/zap`, {
                headers: {
                    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTRremowcDMwMDAweHZtZ2hwcDN1b3RxIiwiaWF0IjoxNzMzOTg4MDM0fQ.usTSZZTLYPt9WQnEEhefChSu3MicHBY6ewBTnv_LhxE"
                }
            });
            setdata(res.data.zap);
            setisLoading(false);
        }
        fetchData();
    }, []);
  return {
    isLoading, data
  }
}

export default useZaps