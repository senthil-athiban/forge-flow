import React , { useState, useEffect } from 'react'
import axios from "axios";
import { BACKEND_URL } from '@/app/config';
import ZapService from '@/services/zap.service';

const useTriggerAndActionTypes = () => {
  const [triggerTypes, setTriggerTypes] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);

  useEffect(() => {
    ZapService.getZapTriggers().then((result) => setTriggerTypes(result.triggers));
    ZapService.getZapActions().then((result) => setActionTypes(result.actions))
  }, [])
  
  return {
    triggerTypes,
    actionTypes
  }
}

export default useTriggerAndActionTypes