import React , { useState, useEffect } from 'react'
import ZapService from '@/services/zap.service';

const useTriggerAndActionTypes = () => {
  const [triggerTypes, setTriggerTypes] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);

  useEffect(() => {
    ZapService.getZapTriggers().then((result) => setTriggerTypes(result.triggers)).catch(err => console.error(err));
    ZapService.getZapActions().then((result) => setActionTypes(result.actions)).catch(err => console.error(err));
  }, [])
  
  return {
    triggerTypes,
    actionTypes
  }
}

export default useTriggerAndActionTypes