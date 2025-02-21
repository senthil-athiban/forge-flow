import { useEffect, useState } from "react";
import ZapService from "@/services/zap.service";

const useZaps = () => {
  const [isLoading, setisLoading] = useState(false);
  const [data, setdata] = useState([]);

  useEffect(() => {
    setisLoading(true);
    async function fetchData() {
      try {
        const res = (await ZapService.getZapByUserId()) as any;
        setdata(res);
        setisLoading(false);
      } catch (error) {
        console.log("Error in fetching zap : ", error);
      }
    }
    fetchData();
  }, []);
  return {
    isLoading,
    data,
  };
};

export default useZaps;
