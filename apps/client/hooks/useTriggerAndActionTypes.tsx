import React , { useState, useEffect } from 'react'
import axios from "axios";
import { BACKEND_URL } from '@/app/config';

const useTriggerAndActionTypes = () => {
  const [triggerTypes, setTriggerTypes] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/trigger`, {
      headers: {
        Authorization:`${localStorage.getItem('accessToken')}`
      }
    }).then((result) => setTriggerTypes(result.data.results));
    axios.get(`${BACKEND_URL}/api/v1/action`, {
      headers: {
        Authorization:`${localStorage.getItem('accessToken')}`
      }
    }).then((result) => setActionTypes(result.data.results))
  }, [])
  
  return {
    triggerTypes,
    actionTypes
  }
}

export default useTriggerAndActionTypes