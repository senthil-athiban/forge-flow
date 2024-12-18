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
                    Authorization: localStorage.getItem("token")
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