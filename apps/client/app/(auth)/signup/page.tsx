import SignupCard from "@/components/Auth/SignupCard";
import SignupFooter from "@/components/Auth/SignupFooter";
import Google from "@/components/Provider/Google";
import { CircleCheck } from "lucide-react";
import React from "react";

const SignUp = () => {
  const features = [
    {
      content: "Easy setup, no coding required",
    },
    {
      content: "Free forever for core features",
    },
    {
      content: "14-day trial of premium features & apps",
    },
  ];
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl min-h-[80vh] m-auto px-4 py-1 grid grid-cols-1 md:grid-cols-2 ">
        <div className="flex flex-col justify-center gap-y-10">
          <div className="whitespace-pre-line text-4xl font-bold leading-loose">
            {
              "Join millions worldwide \n who automate their \n work using Zapier."
            }
          </div>
          <div className="flex flex-col justify-start gap-y-4">
            {features.length &&
              features.map((feature, index) => {
                return (
                  <div key={index} className="flex gap-x-4">
                    <CircleCheck size={20} color="green" />
                    <span className="font-normal text-slate-500">
                      {feature.content}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <SignupCard />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <SignupFooter />
      </div>
    </div>
  );
};

export default SignUp;
