"use client";
import React, { useState } from "react";
import ProviderButton from "../Button/ProviderButton";
import PrimaryButton from "../Button/PrimaryButton";
import Google from "../Provider/Google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthService from "@/services/auth.service";

const SignupCard = () => {
  const [name, setname] = useState("");
  const [passowrd, setpassowrd] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
        const res = await AuthService.register({
          email: email,
          password: passowrd,
          name: name
        });
        if(res?.data) {
          toast.success(res.data?.message);
          router.push("/login");
        }
    } catch (error:any) {
      console.error('Failed to signup', error);
      toast.error(error.message);
    }
  }
  return (
    <div className="border grid flex-col gap-y-4 p-10 shadow-md max-w-md rouned-lg">
      <ProviderButton className='bg-blue-500' icon={<Google />}>Sign with Google</ProviderButton>
      <div className="flex justify-center items-center my-4">
        <div className="border-t border-gray-300 flex-grow mr-3"></div>
        <span className="flex-shrink">OR</span>
        <div className="border-t border-gray-300 flex-grow ml-3"></div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm">
          <span className="absolut left-0 top-0 mr-1">*</span>Work Email
          (required)
        </label>
        <input type="text" className="p-2 border bg-orange-50 rounded-lg" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-10">
        <div className="flex flex-col">
          <label htmlFor="fName" className="text-sm">
            <span className="absolut left-0 top-0 mr-1">*</span> First Name
            (required)
          </label>
          <input type="text" className="p-2 border bg-orange-50 rounded-lg" onChange={(e) => setname(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fName" className="text-sm">
            <span className="absolut left-0 top-0 mr-1">*</span> Password
            (required)
          </label>
          <input type="text" className="p-2 border bg-orange-50 rounded-lg" onChange={(e) => setpassowrd(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-center">
        <PrimaryButton onClick={handleSubmit} size="lg">
          Get Started Free
        </PrimaryButton>
      </div>
      <div>
        <p className="font-normal text-xs">
          By signing up, you agree to Zapier{"'"}s{" "}
          <span className="text-blue-500 underline">terms of service</span> and{" "}
          <span className="text-blue-500 underline">privacy policy.</span>
        </p>
      </div>
    </div>
  );
};

export default SignupCard;
