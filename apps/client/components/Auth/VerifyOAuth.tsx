"use client";
import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import AuthService from "@/services/auth.service";
import { saveToLocalStorage } from "@/utils/storage";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const VerifyOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = useMemo(() => searchParams.get("provider"),[searchParams]);
  const userId = useMemo(() => searchParams.get("id"),[searchParams]);

  useEffect(() => {
    const verifyUser = async () => {
      if(!provider || !userId) {
        return;
      }
      try {
        setIsLoading(true);
        const res = await AuthService.verifyOAuth(`id=${userId}&provider=${provider}`);
        if (res) {
          const accessToken = res.accessToken;
          saveToLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          router.push("/dashboard");
        }
      } catch (error: any) {
        toast.error(error.message);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, [router, provider, userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
};

export default VerifyOAuth;
