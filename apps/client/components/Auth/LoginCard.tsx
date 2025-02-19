"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ProviderButton from "../Button/ProviderButton";
import Google from "../Provider/Google";
import Facebook from "../Provider/Facebook";
import Github from "../Provider/Github";
import PrimaryButton from "../Button/PrimaryButton";

import { BACKEND_URL } from "@/app/config";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth.service";
import { saveToLocalStorage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import ApiError, { ErrorResponse } from "@/lib/api/error";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleAuth = async () => {
    const response = window.open(`${BACKEND_URL}/api/v1/auth/google`, "_self");
    //@ts-ignore
    if (response) router.push("/dashboard");
  };
  const handleGithubAuth = async () => {
    const res = window.open(`${BACKEND_URL}/api/v1/auth/github`, "_self");
  };

  const onSubmit = async () => {
    try {
      const res = await AuthService.login({
        email: email,
        password: password,
      });
      const accessToken = res.accesstoken;
      saveToLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      router.push("/dashboard");
    } catch (error: any) {
      toast.warning(error.message);
    }
  };

  return (
    <div className="border grid flex-col gap-y-4 p-10 shadow-md rouned-lg">
      <ProviderButton
        className="bg-sky-600"
        icon={<Google />}
        onClick={handleGoogleAuth}
      >
        Continue with google
      </ProviderButton>
      <ProviderButton
        className="bg-slate-900"
        icon={<Github />}
        onClick={handleGithubAuth}
      >
        Continue with github
      </ProviderButton>
      <div className="flex justify-center items-center my-4">
        <div className="border-t border-gray-300 flex-grow mr-3"></div>
        <span className="flex-shrink">OR</span>
        <div className="border-t border-gray-300 flex-grow ml-3"></div>
      </div>
      <form className="flex flex-col gap-y-2">
        <label htmlFor="email" className="text-sm">
          <span className="absolut left-0 top-0 mr-1">*</span>Email (required)
        </label>
        <input
          type="text"
          className="p-2 border bg-orange-50 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="text-sm">
          <span className="absolut left-0 top-0 mr-1">*</span>password
          (required)
        </label>
        <input
          type="text"
          className="p-2 border bg-orange-50 rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <div className="flex justify-center">
        <PrimaryButton
          onClick={onSubmit}
          size="lg"
          // disabled={true}
        >
          Continue
        </PrimaryButton>
      </div>
      <div>
        <p className="font-normal text-xs">
          Don{"'"}t have a Zapier account yet?
          <Link href={"/signup"} className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
