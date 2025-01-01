"use client";
import { BACKEND_URL } from '@/app/config';
import { axiosInstance } from '@/lib/axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useAuth = () => {
  const [user, setuser] = useState({});

  useEffect(() => {
    (async () => {
        const result = await axios.get(`${BACKEND_URL}/api/v1/user/verify`, 
            {
                headers: {
                    Authorization: localStorage.getItem("accessToken"),
                  }
            }
        );
        setuser(result.data.user);
    })()
  },[]);

  return {user};
}

export default useAuth